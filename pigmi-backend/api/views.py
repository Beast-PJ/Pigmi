from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .auth import FirebasePasswordAuthentication
from .serializers import RecordPaymentSerializer, SendTotalSerializer
from firebase_admin import auth as firebase_auth, firestore
from firebase_admin import db as rtdb
import datetime

# Keep Firestore for areas not yet migrated
firestore_db = settings.FIRESTORE_DB

def require_role(user, allowed_roles):
    return user.role in allowed_roles


class CreateUserView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def post(self, request):
        user = request.user
        if not require_role(user, ['admin']):
            return Response({'detail': 'Admin role required'}, status=403)

        data = request.data
        email = data.get('new_email')
        password = data.get('new_password')
        role = data.get('new_role')
        name = data.get('name', '')

        try:
            created = firebase_auth.create_user(email=email, password=password, display_name=name)
            firebase_auth.set_custom_user_claims(created.uid, {'role': role})

            # Store in Firestore (user metadata)
            firestore_db.collection('users').document(created.uid).set({
                'uid': created.uid,
                'email': email,
                'role': role,
                'name': name,
                'created_at': firestore.SERVER_TIMESTAMP
            })

            return Response({'uid': created.uid, 'email': email, 'role': role}, status=201)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)


class RecordPaymentView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def post(self, request):
        serializer = RecordPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = request.user
        data = serializer.validated_data
        month = datetime.datetime.utcnow().strftime('%Y-%m')

        payment_doc = {
            'customer_id': data['customer_id'],
            'agent_id': data['agent_id'],
            'amount': float(data['amount']),
            'note': data.get('note', ''),
            'recorded_by': user.uid,
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'month': month
        }

        # Save to Realtime Database under payments/{agent_id}/
        rtdb.reference(f"payments/{data['agent_id']}").push(payment_doc)

        # Update total
        total_ref = rtdb.reference(f"agent_totals/{data['agent_id']}/total")
        current_total = total_ref.get() or 0
        total_ref.set(current_total + float(data['amount']))

        return Response({'ok': True})


class PaymentsHistoryView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def post(self, request):
        """
        Retrieves payments & totals from Firebase Realtime Database.
        """
        try:
            # Get all payments per agent
            payments_data = rtdb.reference("payments").get() or {}

            # Get totals per agent
            totals_data = rtdb.reference("agent_totals").get() or {}

            return Response({
                "agent_totals": totals_data,
                "payments": payments_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
class AgentSendTotalView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def post(self, request, agent_id):
        serializer = SendTotalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        posted_total = float(serializer.validated_data['total'])

        # Compare with actual total from Realtime Database
        actual_total = 0
        payments = rtdb.reference(f"payments/{agent_id}").get() or {}
        for _, p in payments.items():
            actual_total += float(p.get('amount', 0))

        if abs(actual_total - posted_total) > 0.01:
            alert = {
                'type': 'mismatch',
                'agent_id': agent_id,
                'posted_total': posted_total,
                'actual_total': actual_total,
                'month': datetime.datetime.utcnow().strftime('%Y-%m'),
                'created_at': firestore.SERVER_TIMESTAMP,
                'resolved': False
            }
            firestore_db.collection('alerts').add(alert)
            return Response({'status': 'mismatch', 'actual_total': actual_total})
        else:
            rtdb.reference(f"totals/{agent_id}").push({
                'total': posted_total,
                'month': datetime.datetime.utcnow().strftime('%Y-%m'),
                'sent_by': request.user.uid,
                'sent_at': datetime.datetime.utcnow().isoformat()
            })
            return Response({'status': 'ok'})

class GetAgentPaymentsView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def get(self, request, agent_id):
        """
        Retrieves all payments for a specific agent from Firebase Realtime Database.
        """
        try:
            # Get payments for the agent
            payments_data = rtdb.reference(f"payments/{agent_id}").get() or {}

            transactions = []
            for payment_id, payment in payments_data.items():
                transactions.append({
                    "id": payment_id,
                    "date": payment.get("timestamp"),
                    "customer_id": payment.get("customer_id"),
                    "agent_id": payment.get("agent_id", agent_id),
                    "amount": float(payment.get("amount", 0)),
                    "note": payment.get("note", "")
                })

            return Response(
                {"transactions": transactions},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AlertsListView(APIView):
    authentication_classes = [FirebasePasswordAuthentication]

    def get(self, request):
        alerts = [dict(a.to_dict(), id=a.id) for a in firestore_db.collection('alerts').stream()]
        return Response({'alerts': alerts})

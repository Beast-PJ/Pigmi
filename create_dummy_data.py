# create_dummy_data.py
import firebase_admin
from firebase_admin import credentials, db
import random
from datetime import datetime, timedelta, timezone

# -----------------------------
# 1. Firebase Setup
# -----------------------------
cred = credentials.Certificate("serviceAccountKey.json")  # Path to service account
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://pigmi-5-default-rtdb.firebaseio.com/'
})

# -----------------------------
# 2. Config
# -----------------------------
agents = ['agent1', 'agent2', 'agent3', 'agent4', 'agent5']
customers = [f'customer_{i+1}' for i in range(20)]
month = datetime.now(timezone.utc).strftime('%Y-%m')

# -----------------------------
# 3. Generate & Upload Dummy Data
# -----------------------------
for agent in agents:
    payments = []
    total_amount = 0

    for i in range(10):  # 10 payments per agent
        amount = random.randint(100, 1000)
        payment = {
            'agent_id': agent,
            'amount': amount,
            'customer_id': random.choice(customers),
            'month': month,
            'note': f"Payment {i+1} for {agent}",
            'recorded_by': "admin_user_id",
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        payments.append(payment)
        total_amount += amount

    # Save payments under /payments/{agent}
    
    db.reference(f'payments/{agent}').set(payments)

    # Save totals under /agent_totals/{agent}
    db.reference(f'agent_totals/{agent}').set({'total': total_amount})

    print(f"Added {len(payments)} payments for {agent} | Total: {total_amount}")

print(" Dummy data inserted into Firebase Realtime Database.")

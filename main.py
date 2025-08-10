# Save as create_dummy_data.py
import firebase_admin
from firebase_admin import credentials, db
import random
import datetime

# Path to your service account key
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://pigmi-5-default-rtdb.firebaseio.com/'
})

# Dummy agents and payments
agents = ['agent1', 'agent2', 'agent3']
for agent in agents:
    # Create dummy payments for each agent
    payments = []
    total = 0
    for i in range(10):
        amount = random.randint(100, 1000)
        payment = {
            'amount': amount,
            'date': (datetime.datetime.now() - datetime.timedelta(days=i)).strftime('%Y-%m-%d'),
            'customer': f'customer_{i+1}',
            'agent': agent
        }
        payments.append(payment)
        total += amount

    # Write payments to /payments/{agent}/
    db.reference(f'payments/{agent}').set(payments)
    # Write total to /agent_totals/{agent}
    db.reference(f'agent_totals/{agent}').set({'total': total})

print("Dummy data created.")
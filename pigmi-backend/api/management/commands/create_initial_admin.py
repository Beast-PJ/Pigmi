from django.core.management.base import BaseCommand
from firebase_admin import auth
from django.conf import settings

class Command(BaseCommand):
    help = 'Create initial admin user in Firebase.'

    def add_arguments(self, parser):
        parser.add_argument('--email', required=True)
        parser.add_argument('--password', required=True)
        parser.add_argument('--name', default='Admin')

    def handle(self, *args, **opts):
        email = opts['email']
        password = opts['password']
        name = opts['name']
        u = auth.create_user(email=email, password=password, display_name=name)
        auth.set_custom_user_claims(u.uid, {'role': 'admin'})
        db = settings.FIRESTORE_DB
        db.collection('users').document(u.uid).set({
            'uid': u.uid,
            'email': email,
            'role': 'admin',
            'name': name
        })
        self.stdout.write(self.style.SUCCESS(f"Admin created: {email}"))

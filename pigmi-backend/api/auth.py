import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.conf import settings
from firebase_admin import auth as firebase_auth

class FirebaseUser:
    def __init__(self, uid, email, role):
        self.uid = uid
        self.email = email
        self.role = role

def firebase_login_with_email_password(email, password):
    """Sign in with Firebase email/password via REST API."""
    api_key = settings.FIREBASE_API_KEY
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    if resp.status_code != 200:
        raise exceptions.AuthenticationFailed("Invalid email or password")
    data = resp.json()
    uid = data.get("localId")

    # Fetch role from Firebase custom claims
    try:
        fb_user = firebase_auth.get_user(uid)
        role = fb_user.custom_claims.get("role") if fb_user.custom_claims else None
    except Exception:
        role = None

    return FirebaseUser(uid=uid, email=email, role=role)

class FirebasePasswordAuthentication(BaseAuthentication):
    """
    Authenticate by email/password in JSON body.
    """
    def authenticate(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return None
        user = firebase_login_with_email_password(email, password)
        return (user, None)

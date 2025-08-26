import bcrypt
import jwt
from flask import current_app
from datetime import datetime, timezone, timedelta
from config import Config
from models.user import User

def hash_password(password):
    """Hash a password for storing the db"""
    # Generate salt and hash password
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
    return password_hash.decode('utf-8')

def verify_password(password, password_hash):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def generate_jwt_token(user_id):
    try:
        # Get user from database to include admin status
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")
        
        payload = {
            'user_id': user_id,
            'is_admin': user.is_admin,  # Include admin status from database
            'exp': datetime.now(timezone.utc) + timedelta(hours=24),  # Token expires in 24 hours
            'iat': datetime.now(timezone.utc)  # Issued at
        }
        
        token = jwt.encode(
            payload, 
            current_app.config['JWT_SECRET'], 
            algorithm='HS256'
        )
        
        return token
    
    except Exception as e:
        raise ValueError(f"Token generation failed: {str(e)}")

def verify_jwt_token(token):
    """
    Verify JWT token and return payload with user_id and admin status
    """
    try:
        payload = jwt.decode(
            token, 
            current_app.config['JWT_SECRET'], 
            algorithms=['HS256']
        )
        
        return {
            'user_id': payload.get('user_id'),
            'is_admin': payload.get('is_admin', False),  # Default to False if not present
            'exp': payload.get('exp'),
            'iat': payload.get('iat')
        }
    
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
    
def decode_token_from_header(request):
    """
    Extract and decode token from Authorization header
    Returns user_id and admin status
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        raise ValueError("No authorization header")
    
    if not auth_header.startswith('Bearer '):
        raise ValueError("Invalid authorization header format")
    
    token = auth_header.split(' ')[1]
    payload = verify_jwt_token(token)
    
    return payload['user_id'], payload['is_admin']

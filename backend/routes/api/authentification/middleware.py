from functools import wraps
from flask import request, jsonify, g
from .utils import verify_jwt_token


def jwt_required(f): # 'f' is the incoming function that gets wrapped
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 1. Extract authorization header
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({"error": "Token error"}), 401
        
        # 2. Parse token (Bearer and just token)
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ") [1]
        else:
            token = auth_header

        # 3. Verify JWT
        user_id = verify_jwt_token(token)

        if user_id is None:
            return jsonify({"error": "Token error"}), 401
        
        # 4. Store user_id for the route function to use
        # 'g' is basically a special object (global var behavior)
        # being passed from the decorator after it does its operations
        # to whatever function it's decorating
        # Duration is limited to one request
        g.current_user_id = user_id

        # 5. Call the original route function
        return f(*args, **kwargs)
    
    return decorated_function
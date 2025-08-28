from functools import wraps
from flask import request, jsonify, g
from .utils import decode_token_from_header


def jwt_required(f):
    """
    Decorator to require valid JWT token
    Sets g.current_user_id and g.is_admin for use in routes
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("testing JWT")
        # Skip JWT for OPTIONS requests (preflight)
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        
        try:
            user_id, is_admin = decode_token_from_header(request)
            
            # Make available to the route function
            g.current_user_id = user_id
            g.is_admin = is_admin
            
            return f(*args, **kwargs)
        
        except ValueError as e:
            return jsonify({'error': str(e)}), 401
        except Exception as e:
            return jsonify({'error': 'Token validation failed'}), 401
    
    return decorated_function

def admin_required(f):
    """
    Decorator to require admin privileges
    Must be used AFTER @jwt_required
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is authenticated (should be set by @jwt_required)
        if not hasattr(g, 'current_user_id'):
            return jsonify({'error': 'Authentication required'}), 401
        
        # Check if user is admin
        if not getattr(g, 'is_admin', False):
            return jsonify({'error': 'Admin privileges required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
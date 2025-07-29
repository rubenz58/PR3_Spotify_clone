from flask import (
    Blueprint,
    request,
    jsonify
)

# /api/auth/
auth_bp = Blueprint('auth', __name__)


############################ MAIN ROUTES ############################
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    if not password:
        return jsonify({"error": "Password is required"}), 400
    
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    if '@' not in email:
        return jsonify({"error": "Invalid email format"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400


    # VALIDATION PASSED
    return jsonify({
        "message": "Validation passed",
        "name": name,
        "email": email
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get('email')
    password = data.get('password')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    if not password:
        return jsonify({"error": "Password is required"}), 400
    
    return jsonify({
        "message": "Login validation passed",
        "email": email
    })

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "Logout Endpoint hit"
    })


############################ TESTING ############################
@auth_bp.route("/test")
def test_route():
    return "Authentification Blueprint is working"

from flask import (
    Blueprint,
    request,
    jsonify
)
from .models import User, db
from .utils import (
    hash_password,
    generate_jwt_token,
    verify_password
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
    # 1. Check if email already exists
    try:
        existing_user = User.query.filter_by(email=email).first()
    except Exception:
        return jsonify({"error": "Database error"}), 500

    if existing_user:
        return jsonify ({
            "error": "Email is already in use"
        }), 400
    try:
        # 2. Hash password
        hashed_password = hash_password(password)

        # 3. Save new User to DB
        new_user = User(email=email, name=name, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        # 4. Generate JWT w/ user Id // .id automatically available after commit
        token = generate_jwt_token(new_user.id)

        # 5. Return JWT with user info
        return jsonify ({
            "message": "User created successfully",
            "token": token,
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create user"}), 500


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
    
    # VALIDATION PASSED
    # 1. Verify email
    try:
        existing_user = User.query.filter_by(email=email).first()
    except Exception:
        return jsonify({"error": "Database error"}), 500
    
    if not existing_user:
        return jsonify({"error": "Invalid credentials"}), 401
    # 2. Verify password and generate JWT
    try:
        if verify_password(password, existing_user.password_hash):
            token = generate_jwt_token(existing_user.id)
            return jsonify ({
                "message": "User logged in successfully",
                "token": token,
                "user": existing_user.to_dict()
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "User logged out"
    }), 200


############################ TESTING ############################
@auth_bp.route("/test")
def test_route():
    return "Authentication Blueprint is working"

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

from database import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Can now be null for Google users
    password_hash = db.Column(db.String(128), nullable=True)

    # Google Auth fields (id, authentification)
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    auth_method = db.Column(db.String(20), nullable=False, default="email")

    is_admin = db.Column(db.Boolean, default=False, nullable=True)


    def __repr__(self):
        return f"<User {self.email}>"
    
    def to_dict(self):
        """Convert User to dictionary (no password)"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "auth_method": self.auth_method,
            "created_at": self.created_at
        }

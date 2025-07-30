from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone


# Initialize db
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<User {self.email}>"
    
    def to_dict(self):
        """Convert User to dictionary (no password)"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at
        }

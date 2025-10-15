# backend/utils/r2_storage.py
import os

def get_file_url(object_name):
    """Get public URL for a file in R2"""
    r2_public_url = os.environ.get('R2_PUBLIC_URL')
    return f"{r2_public_url}/{object_name}"
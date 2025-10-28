#!/usr/bin/env python3
"""Generate bcrypt password hashes for users"""

import sys
import bcrypt

def generate_hash(password):
    """Generate bcrypt hash for password"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    return hash_bytes.decode('utf-8')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_user_hash.py <password>")
        print("\nExample:")
        print("  python generate_user_hash.py MySecureP@ss123")
        sys.exit(1)
    
    password = sys.argv[1]
    hash = generate_hash(password)
    
    print(f"\nPassword: {password}")
    print(f"Hash: {hash}")
    print(f"\nAdd this to database.py:")
    print(f'    "username": {{')
    print(f'        "username": "username",')
    print(f'        "hashed_password": "{hash}",  # "{password}"')
    print(f'        "full_name": "User Name",')
    print(f'        "created_at": datetime.now().isoformat()')
    print(f'    }}')


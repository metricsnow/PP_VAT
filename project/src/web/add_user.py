#!/usr/bin/env python3
"""
Helper script to add users to the database
Usage: python add_user.py username password
"""

import sys
from pathlib import Path

# Add parent directories to path
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent.parent))

from auth import get_password_hash
from database import users_db, create_user

def main():
    if len(sys.argv) != 3:
        print("Usage: python add_user.py <username> <password>")
        print("\nExample:")
        print("  python add_user.py john MySecureP@ss123")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    
    # Check if user already exists
    if username in users_db:
        print(f"Error: User '{username}' already exists!")
        sys.exit(1)
    
    # Create user
    create_user(username, password)
    
    print(f"\n✅ User '{username}' created successfully!")
    print(f"\nCurrent users:")
    for user in users_db.keys():
        print(f"  - {user}")
    print(f"\nLogin credentials:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")

if __name__ == "__main__":
    main()


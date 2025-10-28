"""
Simple database module for user management
For MVP: In-memory storage. For production: Replace with PostgreSQL/MySQL.
"""

from datetime import datetime
from typing import Dict, Optional
from .auth import get_password_hash

# In-memory user storage (replace with database in production)
users_db: Dict[str, dict] = {
    "admin": {
        "username": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "secret"
        "full_name": "Administrator",
        "created_at": datetime.now().isoformat()
    },
    "marcus": {
        "username": "marcus",
        "hashed_password": "$2b$12$HfkwQpjp6Y7JLxKwM2sI/uozNaLnxBkfQaN9sTJP/6nEvgR6OHa4G",  # "admin07!"
        "full_name": "Marcus",
        "created_at": datetime.now().isoformat()
    },
    "user": {
        "username": "user",
        "hashed_password": "$2b$12$Am5W8Tpve0c6cyZror0BUO2e5CSWgk/a3xC9RKjiieloR8pVUFkE6",  # "test123"
        "full_name": "User Account",
        "created_at": datetime.now().isoformat()
    },
    "finance": {
        "username": "finance",
        "hashed_password": "$2b$12$9YqZ8Tn7QV6xK7Yq.r.GvHZvM8LQpK8LqY8YrRrGqHZwLZvM8LQpK8LqY8",  # "finance2024"
        "full_name": "Finance Team",
        "created_at": datetime.now().isoformat()
    },
    "kirill": {
        "username": "kirill",
        "hashed_password": "$2b$12$UeveRJhFL3IUNJ9olhQAKus3NnUqWCrzcko88WGobH0n.R8GPSO5K",  # "kirill5820!"
        "full_name": "Kirill",
        "created_at": datetime.now().isoformat()
    }
}


def get_user(username: str) -> Optional[dict]:
    """
    Get user from database.
    
    Args:
        username: The username to lookup
        
    Returns:
        dict: User data or None if not found
    """
    return users_db.get(username)


def create_user(username: str, password: str) -> dict:
    """
    Create a new user.
    
    Args:
        username: The username
        password: The plain text password (will be hashed)
        
    Returns:
        dict: Created user data
    """
    hashed = get_password_hash(password)
    user_data = {
        "username": username,
        "hashed_password": hashed,
        "created_at": datetime.now().isoformat()
    }
    users_db[username] = user_data
    return user_data


def list_users() -> list:
    """
    List all users (excluding passwords).
    
    Returns:
        list: List of users without sensitive data
    """
    return [
        {
            "username": user["username"],
            "full_name": user.get("full_name", ""),
            "created_at": user.get("created_at")
        }
        for user in users_db.values()
    ]


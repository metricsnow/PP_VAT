# User Management Guide

**File:** `project/src/web/database.py`

---

## How to Add/Modify Login Credentials

### Method 1: Edit database.py Directly

Open `project/src/web/database.py` and add users to the `users_db` dictionary:

```python
users_db: Dict[str, dict] = {
    "admin": {
        "username": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "secret"
        "full_name": "Administrator",
        "created_at": datetime.now().isoformat()
    },
    "john": {
        "username": "john",
        "hashed_password": "$2b$12$YourHashedPasswordHere",
        "full_name": "John Doe",
        "created_at": datetime.now().isoformat()
    }
}
```

### Method 2: Use the add_user Script

Run the helper script to add users:

```bash
cd /Users/marcus/PP/VAT
source venv/bin/activate
cd project/src/web

python add_user.py john MySecureP@ss123
```

This will automatically hash the password and add the user.

---

## Generate Password Hash

To generate a password hash manually:

```python
from auth import get_password_hash

password = "my_secret_password"
hash = get_password_hash(password)
print(hash)
```

---

## Current Default Credentials

**Username:** `admin`  
**Password:** `secret`

⚠️ **Warning:** Change these in production!

---

## Add Multiple Users

Edit `database.py` and add them to the `users_db` dictionary:

```python
users_db: Dict[str, dict] = {
    "admin": {
        "username": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Administrator",
        "created_at": datetime.now().isoformat()
    },
    "manager": {
        "username": "manager",
        "hashed_password": "$2b$12$HashedPasswordForManagerHere",
        "full_name": "Manager User",
        "created_at": datetime.now().isoformat()
    },
    "employee": {
        "username": "employee",
        "hashed_password": "$2b$12$HashedPasswordForEmployeeHere",
        "full_name": "Employee User",
        "created_at": datetime.now().isoformat()
    }
}
```

---

## Restart Server

After modifying user credentials, restart the server:

```bash
# Stop server
pkill -f "uvicorn web.app:app"

# Start server
cd /Users/marcus/PP/VAT
source venv/bin/activate
cd project/src
uvicorn web.app:app --host 0.0.0.0 --port 8000 --reload
```

---

## Security Notes

1. **Never commit passwords** - Use environment variables in production
2. **Use strong passwords** - Minimum 8 characters, mix of letters/numbers/symbols
3. **Hash passwords** - Never store plain text passwords
4. **Production** - Use a real database (PostgreSQL/MySQL) instead of in-memory storage

---

## Production Migration

For production, replace in-memory storage with a database:

```python
# Use SQLAlchemy or similar
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker

class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True)
    hashed_password = Column(String)
    created_at = Column(DateTime)
```


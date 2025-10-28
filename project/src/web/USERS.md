# User Accounts

**Updated:** 2025-01-27

---

## Available Users

### 1. Administrator
- **Username:** `admin`
- **Password:** `secret`
- **Role:** Administrator

### 2. Marcus (Tester)
- **Username:** `marcus`
- **Password:** `admin07!`
- **Role:** Tester

---

## How to Login

1. Open: http://localhost:8000
2. Enter username and password
3. Click Login
4. You'll be redirected to the application

---

## Add More Users

Edit `project/src/web/database.py`:

```python
"newuser": {
    "username": "newuser",
    "hashed_password": "$2b$12$...",  # Generated hash
    "full_name": "New User",
    "created_at": datetime.now().isoformat()
}
```

Generate password hash:
```bash
cd /Users/marcus/PP/VAT
source venv/bin/activate
python3 -c "import bcrypt; print(bcrypt.hashpw(b'your_password', bcrypt.gensalt()).decode('utf-8'))"
```


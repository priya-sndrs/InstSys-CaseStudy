import hashlib
import os

def hash_password(password: str) -> str:
    """Hash a password with a random salt using SHA-256."""
    salt = os.urandom(16)
    salted = salt + password.encode('utf-8')
    hash_digest = hashlib.sha256(salted).hexdigest()
    # Store salt and hash together (hex)
    return salt.hex() + ':' + hash_digest

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against the stored hash."""
    salt_hex, hash_digest = hashed.split(':')
    salt = bytes.fromhex(salt_hex)
    salted = salt + password.encode('utf-8')
    return hashlib.sha256(salted).hexdigest() == hash_digest
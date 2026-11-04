import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from security.key_derivation import KeyDerivation

class KeyManager:

    def create_vault_key(self, master_password):

        # Generate random salt
        salt = KeyDerivation.generate_salt()

        # Derive key using Scrypt
        derivation = KeyDerivation(salt)
        derived_key = derivation.derive_key(master_password)

        # Generate random vault encryption key
        vault_key = os.urandom(32)

        # Encrypt vault key using derived key
        nonce = os.urandom(12)

        cipher = AESGCM(derived_key)

        encrypted_key = cipher.encrypt(
            nonce,
            vault_key,
            b"SecureVault:v1"
        )

        return salt, nonce, encrypted_key
    def unlock_vault_key(self, master_password, salt, nonce, encrypted_key):

      derivation = KeyDerivation(salt)
      derived_key = derivation.derive_key(master_password)

      cipher = AESGCM(derived_key)

      vault_key = cipher.decrypt(
        nonce,
        encrypted_key,
        b"SecureVault:v1"
      )

      return vault_key

if __name__ == "__main__":

    manager = KeyManager()

    # Create vault
    salt, nonce, encrypted_key = manager.create_vault_key(
        "dummy_master_password"
    )

    print("Vault created successfully!")

    # Unlock using correct password
    vault_key = manager.unlock_vault_key(
        "dummy_master_password",
        salt,
        nonce,
        encrypted_key
    )

    print("Vault unlocked successfully!")
    print("Vault key length:", len(vault_key), "bytes")

    # Test incorrect password
    try:
        manager.unlock_vault_key(
            "wrong_password",
            salt,
            nonce,
            encrypted_key
        )
    except Exception:
        print("Incorrect password! Vault remains locked.")
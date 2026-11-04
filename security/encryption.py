
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class EncryptionManager:

    def __init__(self, key):
        self.key = key
        self.cipher = AESGCM(self.key)

    @staticmethod
    def generate_key():
        return os.urandom(32)

    def encrypt(self, plaintext, associated_data=None):
        # Generate a unique 12-byte nonce
        nonce = os.urandom(12)

        # Convert plaintext string into bytes
        plaintext = plaintext.encode("utf-8")

        # Encrypt the plaintext
        ciphertext = self.cipher.encrypt(
            nonce,
            plaintext,
            associated_data
        )

        # Return encrypted data and nonce
        return ciphertext, nonce
    def decrypt(self, ciphertext, nonce, associated_data=None):
        # Decrypt the ciphertext
        plaintext = self.cipher.decrypt(
            nonce,
            ciphertext,
            associated_data
        )

        # Convert bytes back to string
        return plaintext.decode("utf-8")

if __name__ == "__main__":

    key = EncryptionManager.generate_key()
    manager = EncryptionManager(key)

    encrypted, nonce = manager.encrypt("dummy_password123")

    print("Key generated successfully!")
    print("Key length:", len(key), "bytes")

    print("Encryption successful!")
    print("Encrypted data length:", len(encrypted), "bytes")
    print("Nonce length:", len(nonce), "bytes")

    decrypted = manager.decrypt(encrypted, nonce)
    print("Decryption successful!")
    print("Original Password:",decrypted)

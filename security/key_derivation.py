
import os
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt


class KeyDerivation:

    def __init__(self, salt=None):
        self.salt = salt if salt is not None else os.urandom(16)

    def derive_key(self, password):
        kdf = Scrypt(
            salt=self.salt,
            length=32,
            n=2**15,
            r=8,
            p=1
        )

        return kdf.derive(password.encode("utf-8"))

    @staticmethod
    def generate_salt():
        return os.urandom(16)

salt = KeyDerivation.generate_salt()

manager1 = KeyDerivation(salt)
key1 = manager1.derive_key("dummy_master_password")

manager2 = KeyDerivation(salt)
key2 = manager2.derive_key("dummy_master_password")

print("Same password + same salt:", key1 == key2)

manager3 = KeyDerivation(KeyDerivation.generate_salt())
key3 = manager3.derive_key("dummy_master_password")

print("Same password + different salt:", key1 == key3)

import secrets
import string


def generate_password(length=12):

    if length < 12:
        raise ValueError("Password length must be at least 12.")

    uppercase = secrets.choice(string.ascii_uppercase)
    lowercase = secrets.choice(string.ascii_lowercase)
    digit = secrets.choice(string.digits)
    special = secrets.choice(string.punctuation)

    characters = (
        string.ascii_letters
        + string.digits
        + string.punctuation
    )

    remaining = [
        secrets.choice(characters)
        for _ in range(length - 4)
    ]

    password_list = [
        uppercase, lowercase, digit, special
    ] + remaining

    secrets.SystemRandom().shuffle(password_list)

    return ''.join(password_list)


def validate_password(password):

    if len(password) < 12:
        return False

    if not any(char.isupper() for char in password):
        return False

    if not any(char.islower() for char in password):
        return False

    if not any(char.isdigit() for char in password):
        return False

    if not any(char in string.punctuation for char in password):
        return False

    return True

password = generate_password(16)

print("Generated Password:", password)
print("Password Length:", len(password))
print("Is Valid:", validate_password(password))
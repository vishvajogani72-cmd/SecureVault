
import string


def check_password_strength(password):

    score = 0

    # Length checks
    if len(password) >= 12:
        score += 1

    if len(password) >= 16:
        score += 1

    # Character checks
    if any(char.isupper() for char in password):
        score += 1

    if any(char.islower() for char in password):
        score += 1

    if any(char.isdigit() for char in password):
        score += 1

    if any(char in string.punctuation for char in password):
        score += 1

    # Strength classification
    if score <= 2:
        return "Weak"

    elif score <= 4:
        return "Medium"

    elif score == 5:
        return "Strong"

    else:
        return "Very Strong"
print(check_password_strength("hello123"))
print(check_password_strength("Hello12345678"))
print(check_password_strength("SecureVault@2026"))
print(check_password_strength("MySecureVault@2026"))
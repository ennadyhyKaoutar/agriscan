// Email validation
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone validation (Maroc)
export function validatePhone(phone) {
  // Format: +212 6XX XXX XXX ou 06XX XXX XXX
  const regex = /^(\+212|0)[6|7]\d{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

// Password validation
export function validatePassword(password) {
  // Au moins 8 caractères, 1 majuscule, 1 chiffre
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

// Required field
export function validateRequired(value) {
  return value && value.trim() !== '';
}

// Min length
export function validateMinLength(value, min) {
  return value && value.length >= min;
}

// Max length
export function validateMaxLength(value, max) {
  return value && value.length <= max;
}

// Form validation helper
export function validateForm(data, rules) {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} est requis`;
    }

    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Email invalide';
    }

    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Numéro de téléphone invalide';
    }

    if (fieldRules.password && !validatePassword(value)) {
      errors[field] = 'Mot de passe trop faible (min 8 caractères, 1 majuscule, 1 chiffre)';
    }

    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum ${fieldRules.minLength} caractères`;
    }

    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum ${fieldRules.maxLength} caractères`;
    }

    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customError || 'Validation échouée';
    }
  });

  return errors;
}

// Format phone number
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

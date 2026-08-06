export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateEmail = (email: string): string | true => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email address';
  return true;
};

export const validatePassword = (password: string): string | true => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return true;
};

export const validateRequired = (value: string, fieldName: string = 'Field'): string | true => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return true;
};

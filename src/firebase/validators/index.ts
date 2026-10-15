export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  return { isValid: true };
};

export const validateJobPosting = (data: {
  title?: string;
  description?: string;
  location?: string;
  type?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!data.title?.trim()) errors.title = 'Job title is required';
  if (!data.description?.trim()) errors.description = 'Job description is required';
  if (!data.location?.trim()) errors.location = 'Location is required';
  if (!data.type?.trim()) errors.type = 'Employment type is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateCompany = (data: {
  name?: string;
  industry?: string;
  description?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = 'Company name is required';
  if (!data.industry?.trim()) errors.industry = 'Industry is required';
  if (!data.description?.trim()) errors.description = 'Description is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateApplication = (data: {
  candidateName?: string;
  candidateEmail?: string;
  resumeUrl?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!data.candidateName?.trim()) errors.candidateName = 'Full name is required';
  if (!data.candidateEmail || !validateEmail(data.candidateEmail)) errors.candidateEmail = 'Valid email is required';
  if (!data.resumeUrl?.trim()) errors.resumeUrl = 'Resume is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateProfile = (data: {
  displayName?: string;
  email?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!data.displayName?.trim()) errors.displayName = 'Display name is required';
  if (!data.email || !validateEmail(data.email)) errors.email = 'Valid email is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateResume = (file: File | null): { isValid: boolean; error?: string } => {
  if (!file) return { isValid: false, error: 'No file provided' };
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF, DOC, and DOCX files are allowed' };
  }
  const maxSizeInMB = 5;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  return { isValid: true };
};

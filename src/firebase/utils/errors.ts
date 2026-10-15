export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public validationErrors?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

<<<<<<< HEAD
export class ApplicationError extends AppError {
  constructor(message: string, code: string, statusCode: number = 400) {
    super(message, code, statusCode);
    this.name = 'ApplicationError';
  }
}

=======
>>>>>>> origin/main
export class FirebaseErrorMapper {
  static map(error: unknown): AppError {
    if (error && typeof error === 'object' && 'code' in error) {
      const fbCode = String((error as { code: unknown }).code);
      const fbMessage = String((error as { message?: unknown }).message || 'Firebase error occurred');

      switch (fbCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return new AppError('Invalid email or password.', 'AUTH_INVALID_CREDENTIALS', 401);
        case 'auth/email-already-in-use':
          return new AppError('An account with this email already exists.', 'AUTH_EMAIL_EXISTS', 409);
        case 'auth/weak-password':
          return new AppError('Password should be at least 6 characters.', 'AUTH_WEAK_PASSWORD', 400);
        case 'permission-denied':
<<<<<<< HEAD
        case 'firestore/permission-denied':
          return new AppError('You do not have permission to perform this action.', 'PERMISSION_DENIED', 403);
        case 'not-found':
        case 'firestore/not-found':
=======
          return new AppError('You do not have permission to perform this action.', 'PERMISSION_DENIED', 403);
        case 'not-found':
>>>>>>> origin/main
          return new AppError('Requested resource was not found.', 'NOT_FOUND', 404);
        default:
          return new AppError(fbMessage, fbCode, 500);
      }
    }

    if (error instanceof AppError) {
      return error;
    }

    return new AppError(
      error instanceof Error ? error.message : 'An unexpected error occurred.',
      'INTERNAL_ERROR',
      500
    );
  }
}

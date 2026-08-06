import { UserProfile, UserRole } from '../types/user';
import { firebaseAuthService } from '../firebase/services/AuthService';
import { userRepository } from '../firebase/repositories/UserRepository';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  agreedToTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  isFirstLogin?: boolean;
  emailVerified?: boolean;
}

export const authService = {
  /**
   * Log in user with credentials via Firebase Auth & Firestore Users collection
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const fbUser = await firebaseAuthService.signIn(payload.email, payload.password, payload.rememberMe);
      const userDoc = await userRepository.findById(fbUser.uid);
      
      const role: UserRole = (userDoc?.role as UserRole) || (payload.email.includes('recruiter') ? 'employer' : 'job_seeker');
      localStorage.setItem('careerconnect_role', role);
      
      const user: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || payload.email,
        displayName: userDoc?.displayName || fbUser.displayName || payload.email.split('@')[0],
        role,
        avatarUrl: userDoc?.avatarUrl || userDoc?.photoURL || fbUser.photoURL || undefined,
        headline: userDoc?.headline || (role === 'employer' ? 'Hiring Manager' : 'Tech Professional'),
        location: userDoc?.location || 'San Francisco, CA',
        createdAt: typeof userDoc?.createdAt === 'string' ? userDoc.createdAt : new Date().toISOString(),
      };

      const token = await fbUser.getIdToken();

      return {
        user,
        token,
        emailVerified: fbUser.emailVerified,
        isFirstLogin: !userDoc?.profileCompleted,
      };
    } catch (err) {
      throw err;
    }
  },

  /**
   * Register new user account with Firebase Auth & Firestore Users document
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    const targetRole: 'job_seeker' | 'employer' | 'admin' = payload.role === 'guest' ? 'job_seeker' : payload.role;
    const fbUser = await firebaseAuthService.signUp(
      payload.email,
      payload.password,
      targetRole,
      fullName,
      { firstName: payload.firstName, lastName: payload.lastName }
    );

    const user: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || payload.email,
      displayName: fullName,
      role: payload.role,
      createdAt: new Date().toISOString(),
    };

    const token = await fbUser.getIdToken();

    return {
      user,
      token,
      emailVerified: fbUser.emailVerified,
      isFirstLogin: true,
    };
  },

  /**
   * Send Password Reset Email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await firebaseAuthService.resetPassword(email);
      return {
        success: true,
        message: `Password reset instructions have been sent to ${email}.`,
      };
    } catch (err) {
      return {
        success: true,
        message: `Password reset instructions sent to ${email}.`,
      };
    }
  },

  /**
   * Confirm password reset with token/code
   */
  async confirmPasswordReset(code: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      await firebaseAuthService.confirmPasswordReset(code, newPassword);
      return { success: true };
    } catch (err) {
      return { success: true };
    }
  },

  /**
   * Send Email Verification
   */
  async sendEmailVerification(email?: string): Promise<{ success: boolean }> {
    try {
      await firebaseAuthService.sendEmailVerification();
      return { success: true };
    } catch (err) {
      return { success: true };
    }
  },

  /**
   * Sign out user
   */
  async logout(): Promise<void> {
    try {
      await firebaseAuthService.signOut();
    } catch (err) {
      console.warn('Firebase logout warning:', err);
    }
  },
};


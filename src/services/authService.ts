import { UserProfile, UserRole } from '../types/user';
import { firebaseAuthService } from '../firebase/services/AuthService';
import { userRepository } from '../firebase/repositories/UserRepository';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  employerPosition?: string;
  agreedToTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  selectedRole?: 'job_seeker' | 'employer';
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
      // Proactively establish role intent in localStorage before signIn triggers onAuthStateChanged
      if (payload.selectedRole) {
        localStorage.setItem('careerconnect_role', payload.selectedRole);
      }

      const fbUser = await firebaseAuthService.signIn(payload.email, payload.password, payload.rememberMe);
      const userDoc = await userRepository.findById(fbUser.uid);

      let role: UserRole;
      if (userDoc?.role) {
        role = userDoc.role === 'employer' ? 'employer' : userDoc.role === 'admin' ? 'admin' : 'job_seeker';
      } else {
        role = 'job_seeker';
      }

      // Only create Firestore user document if missing (first-time login fallback)
      if (!userDoc) {
        try {
          const created = await userRepository.create({
            uid: fbUser.uid,
            email: fbUser.email || payload.email,
            role,
            displayName: fbUser.displayName || '',
            emailVerified: fbUser.emailVerified,
            profileCompleted: false,
            accountStatus: 'active',
            provider: 'password',
            headline: '',
          });
          if (created?.role) {
            role = created.role === 'employer' ? 'employer' : created.role === 'admin' ? 'admin' : 'job_seeker';
          }
        } catch (e) {
          console.warn('authService login profile creation notice:', e);
        }
      }

      localStorage.setItem('careerconnect_role', role);
      
      const employerPosition = userDoc?.employerPosition || undefined;

      const user: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || payload.email,
        displayName: userDoc?.displayName || fbUser.displayName || 'Name unavailable',
        role,
        avatarUrl: userDoc?.avatarUrl || userDoc?.photoURL || fbUser.photoURL || undefined,
        headline: userDoc?.headline || '',
        employerPosition,
        companyName: userDoc?.companyName || undefined,
        companyWebsite: userDoc?.companyWebsite || undefined,
        location: userDoc?.location || '',
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
    const employerPosition = payload.employerPosition || undefined;

    // Explicitly cache target role prior to sign up
    localStorage.setItem('careerconnect_role', targetRole);

    const fbUser = await firebaseAuthService.signUp(
      payload.email,
      payload.password,
      targetRole,
      fullName,
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        employerPosition,
      }
    );

    const user: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || payload.email,
      displayName: fullName,
      role: targetRole,
      employerPosition,
      headline: '',
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
      throw err;
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
      throw err;
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
      throw err;
    }
  },

  /**
   * Sign out user
   */
  async logout(): Promise<void> {
    await firebaseAuthService.signOut();
  },
};


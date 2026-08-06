/**
 * CareerConnect - Firebase Auth Service Placeholder
 * 
 * Future implementation will contain:
 * - signUpWithEmail(email, password, role)
 * - signInWithEmail(email, password)
 * - signInWithGoogle()
 * - signOutUser()
 * - resetPassword(email)
 * - getCurrentUserProfile()
 */

import { UserProfile, UserRole } from '../../../types/user';

export const authService = {
  async registerUser(email: string, _pass: string, role: UserRole): Promise<UserProfile> {
    console.log('[Firebase Auth Placeholder] registerUser called:', email, role);
    return {
      uid: 'placeholder_uid_' + Date.now(),
      email,
      displayName: email.split('@')[0],
      role,
    };
  },

  async loginUser(email: string, _pass: string): Promise<UserProfile> {
    console.log('[Firebase Auth Placeholder] loginUser called:', email);
    return {
      uid: 'placeholder_uid_' + Date.now(),
      email,
      displayName: email.split('@')[0],
      role: 'job_seeker',
    };
  },

  async logout(): Promise<void> {
    console.log('[Firebase Auth Placeholder] logout called');
  }
};

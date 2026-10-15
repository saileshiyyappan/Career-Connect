import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from '../config/auth';
import { userRepository } from '../repositories/UserRepository';
import { FirestoreUserDocument } from '../types';
import { FirebaseErrorMapper } from '../utils/errors';

export interface IAuthService {
  signUp(
    email: string,
    password: string,
    role: FirestoreUserDocument['role'],
    name: string,
    extraData?: { firstName?: string; lastName?: string; employerPosition?: string }
  ): Promise<User>;
  signIn(email: string, password: string, rememberMe?: boolean): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  confirmPasswordReset(code: string, newPassword: string): Promise<void>;
  sendEmailVerification(user?: User | null): Promise<void>;
  getCurrentUser(): User | null;
<<<<<<< HEAD
  onAuthStateChanged(callback: (user: User | null) => void, onError?: (error: Error) => void): () => void;
=======
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
>>>>>>> origin/main
}

export class AuthService implements IAuthService {
  async signUp(
    email: string,
    password: string,
    role: FirestoreUserDocument['role'],
    name: string,
    extraData?: { firstName?: string; lastName?: string; employerPosition?: string }
  ): Promise<User> {
    try {
      // Enforce that user registration strictly accepts only canonical roles (no admin or super_admin escalation)
      const normalizedRole: 'job_seeker' | 'employer' = role === 'employer' ? 'employer' : 'job_seeker';

      // CRITICAL: Cache target role before creating Firebase Auth user,
      // so onAuthStateChanged listener in AuthContext receives the correct role immediately.
      localStorage.setItem('careerconnect_role', normalizedRole);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const firstName = extraData?.firstName || name.split(' ')[0] || '';
      const lastName = extraData?.lastName || name.split(' ').slice(1).join(' ') || '';
      const employerPosition = extraData?.employerPosition || undefined;

      const userCreatePayload: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'> = {
        uid: user.uid,
        email: user.email || email,
        role: normalizedRole,
        displayName: name,
        firstName,
        lastName,
        emailVerified: user.emailVerified,
        profileCompleted: false,
        accountStatus: 'active',
        provider: 'password',
        ...(employerPosition ? { employerPosition } : {}),
        headline: '',
        ...(user.photoURL ? { photoURL: user.photoURL } : {}),
      };

      // CRITICAL: Create user document immediately before slower secondary calls
      await userRepository.create(userCreatePayload);

      if (name) {
        try {
          await updateProfile(user, { displayName: name });
        } catch (e) {
          console.warn('updateProfile warning:', e);
        }
      }

      try {
        await firebaseSendEmailVerification(user);
      } catch (e) {
        console.warn('sendEmailVerification warning:', e);
      }

      return user;
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  async signIn(email: string, password: string, rememberMe: boolean = true): Promise<User> {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await userRepository.update(user.uid, {
          lastLogin: new Date().toISOString(),
          emailVerified: user.emailVerified,
        });
      } catch (e) {
        console.warn('signIn lastLogin update notice:', e);
      }

      return user;
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    try {
      await firebaseConfirmPasswordReset(auth, code, newPassword);
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  async sendEmailVerification(currentUser?: User | null): Promise<void> {
    try {
      const u = currentUser || auth.currentUser;
      if (u) {
        await firebaseSendEmailVerification(u);
      }
    } catch (err) {
      throw FirebaseErrorMapper.map(err);
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

<<<<<<< HEAD
  onAuthStateChanged(callback: (user: User | null) => void, onError?: (error: Error) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback, onError);
=======
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
>>>>>>> origin/main
  }
}

export const firebaseAuthService = new AuthService();


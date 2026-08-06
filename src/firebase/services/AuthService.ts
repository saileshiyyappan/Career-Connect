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
    extraData?: { firstName?: string; lastName?: string }
  ): Promise<User>;
  signIn(email: string, password: string, rememberMe?: boolean): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  confirmPasswordReset(code: string, newPassword: string): Promise<void>;
  sendEmailVerification(user?: User | null): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

export class AuthService implements IAuthService {
  async signUp(
    email: string,
    password: string,
    role: FirestoreUserDocument['role'],
    name: string,
    extraData?: { firstName?: string; lastName?: string }
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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

      const firstName = extraData?.firstName || name.split(' ')[0] || '';
      const lastName = extraData?.lastName || name.split(' ').slice(1).join(' ') || '';

      await userRepository.create({
        uid: user.uid,
        email: user.email || email,
        role: role === 'candidate' ? 'job_seeker' : role,
        displayName: name,
        firstName,
        lastName,
        emailVerified: user.emailVerified,
        profileCompleted: false,
        accountStatus: 'active',
        photoURL: user.photoURL || undefined,
        provider: 'password',
      });

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

      await userRepository.update(user.uid, {
        lastLogin: new Date().toISOString(),
        emailVerified: user.emailVerified,
      });

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

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
  }
}

export const firebaseAuthService = new AuthService();


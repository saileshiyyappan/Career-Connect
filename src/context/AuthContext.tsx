import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config/firestore';
import { AuthContextType, UserProfile, UserRole } from '../types/user';
import { firebaseAuthService } from '../firebase/services/AuthService';
import { userRepository } from '../firebase/repositories/UserRepository';
import { FirestoreUserDocument } from '../firebase/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function calculateCompletion(data: Partial<FirestoreUserDocument>): number {
  let filled = 0;
  const fields = ['displayName', 'email', 'headline', 'location', 'bio', 'avatarUrl', 'skills', 'resumeUrl', 'githubUrl', 'linkedinUrl'];
  fields.forEach((f) => {
    const val = (data as any)[f];
    if (val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')) {
      filled++;
    }
  });
  return Math.round((filled / fields.length) * 100);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribeAuth = firebaseAuthService.onAuthStateChanged(async (fbUser) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (fbUser) {
        // Build initial fallback profile immediately so state is synchronously authenticated
        const savedRole = localStorage.getItem('careerconnect_role') as UserRole | null;
        const initialRole: UserRole = (savedRole && savedRole !== 'guest') ? savedRole : 'job_seeker';

        const initialProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          role: initialRole,
          avatarUrl: fbUser.photoURL || undefined,
          photoURL: fbUser.photoURL || undefined,
          isEmailVerified: fbUser.emailVerified,
          profileCompleted: true,
          completionPercentage: 80,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(initialProfile);
        setRole(initialRole);

        const userDocRef = doc(db, 'users', fbUser.uid);
        unsubDoc = onSnapshot(
          userDocRef,
          async (snap) => {
            if (snap.exists()) {
              const data = snap.data() as FirestoreUserDocument;
              const userRole: UserRole = (data.role as UserRole) || initialRole;
              const name = data.displayName || (data.firstName ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : '') || fbUser.displayName || fbUser.email?.split('@')[0] || 'User';

              const profile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || data.email || '',
                displayName: name,
                role: userRole,
                avatarUrl: data.avatarUrl || data.photoURL || fbUser.photoURL || undefined,
                photoURL: data.photoURL || data.avatarUrl || fbUser.photoURL || undefined,
                headline: data.headline || undefined,
                phone: data.phoneNumber || (data as any).phone || undefined,
                phoneNumber: data.phoneNumber || (data as any).phone || undefined,
                location: data.location || undefined,
                bio: data.bio || undefined,
                skills: data.skills || [],
                resumeUrl: data.resumeUrl || undefined,
                companyName: data.companyName || undefined,
                companyWebsite: data.companyWebsite || undefined,
                website: (data as any).website || data.companyWebsite || (data as any).portfolioUrl || undefined,
                githubUrl: (data as any).githubUrl || (data as any).github || undefined,
                linkedinUrl: (data as any).linkedinUrl || (data as any).linkedin || undefined,
                portfolioUrl: (data as any).portfolioUrl || (data as any).website || undefined,
                resumeName: (data as any).resumeName || undefined,
                resumeUpdatedAt: (data as any).resumeUpdatedAt || undefined,
                experienceYears: (data as any).experienceYears || undefined,
                education: (data as any).education || undefined,
                experience: (data as any).experience || undefined,
                createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt || Date.now()).toISOString(),
                updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date(data.updatedAt || Date.now()).toISOString(),
                firstName: data.firstName || undefined,
                lastName: data.lastName || undefined,
                profileCompleted: data.profileCompleted ?? true,
                completionPercentage: calculateCompletion(data),
                verificationStatus: (data as any).verificationStatus || (fbUser.emailVerified ? 'verified' : 'unverified'),
                isEmailVerified: fbUser.emailVerified,
              };

              setUser(profile);
              setRole(userRole);
              localStorage.setItem('careerconnect_role', userRole);
            } else {
              // Create document for initial user registration
              const name = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
              const parts = name.trim().split(' ');
              const firstName = parts[0] || '';
              const lastName = parts.slice(1).join(' ') || '';
              const defaultRole: UserRole = initialRole;

              const newDoc: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'> = {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: name,
                firstName,
                lastName,
                role: defaultRole,
                emailVerified: fbUser.emailVerified,
                profileCompleted: false,
                accountStatus: 'active',
                photoURL: fbUser.photoURL || undefined,
                avatarUrl: fbUser.photoURL || undefined,
                provider: 'password',
                headline: defaultRole === 'employer' ? 'Hiring Manager' : 'Tech Professional',
                bio: '',
                location: '',
                phone: '',
                phoneNumber: '',
                githubUrl: '',
                linkedinUrl: '',
                portfolioUrl: '',
                website: '',
                skills: [],
                education: '',
                experienceYears: 0,
                resumeName: '',
                resumeUrl: '',
                companyName: '',
                companyWebsite: '',
                industry: '',
                companySize: '',
              };

              const newProfile: UserProfile = {
                ...initialProfile,
                role: defaultRole,
                displayName: name,
              };

              setUser(newProfile);
              setRole(defaultRole);
              localStorage.setItem('careerconnect_role', defaultRole);

              await userRepository.create(newDoc);
            }
            setIsLoading(false);
          },
          (err) => {
            console.warn('Firestore user snapshot listener warning:', err);
            setIsLoading(false);
          }
        );
      } else {
        setUser(null);
        setRole('guest');
        localStorage.setItem('careerconnect_role', 'guest');
        setIsLoading(false);
      }
    });

    return () => {
      if (unsubDoc) unsubDoc();
      unsubscribeAuth();
    };
  }, []);

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.uid) return;
    const normalized: Record<string, any> = { ...updates };
    if (updates.phone !== undefined && updates.phoneNumber === undefined) {
      normalized.phoneNumber = updates.phone;
    }
    if (updates.phoneNumber !== undefined && updates.phone === undefined) {
      normalized.phone = updates.phoneNumber;
    }
    if (updates.website !== undefined && updates.portfolioUrl === undefined) {
      normalized.portfolioUrl = updates.website;
    }
    if (updates.portfolioUrl !== undefined && updates.website === undefined) {
      normalized.website = updates.portfolioUrl;
    }
    if (updates.displayName && !updates.firstName && !updates.lastName) {
      const parts = updates.displayName.trim().split(' ');
      normalized.firstName = parts[0] || '';
      normalized.lastName = parts.slice(1).join(' ') || '';
    }

    setUser((prev) => (prev ? { ...prev, ...normalized } : null));
    try {
      await userRepository.update(user.uid, normalized as any);
    } catch (err) {
      console.warn('Failed to persist user profile updates to Firestore:', err);
    }
  };

  const loginAs = (newRole: UserRole) => {
    if (user?.uid) {
      updateUserProfile({ role: newRole });
    }
    setRole(newRole);
    localStorage.setItem('careerconnect_role', newRole);
  };

  const updateRole = (newRole: UserRole) => {
    loginAs(newRole);
  };

  const logout = async () => {
    try {
      await firebaseAuthService.signOut();
    } catch (e) {
      console.warn('Logout warning:', e);
    }
    setUser(null);
    setRole('guest');
    localStorage.setItem('careerconnect_role', 'guest');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user && role !== 'guest',
        isLoading,
        loginAs,
        logout,
        updateRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

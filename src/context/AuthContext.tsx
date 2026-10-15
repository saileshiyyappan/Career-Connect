import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config/firestore';
import { AuthContextType, UserProfile, UserRole } from '../types/user';
import { firebaseAuthService } from '../firebase/services/AuthService';
import { userRepository } from '../firebase/repositories/UserRepository';
import { FirestoreUserDocument } from '../firebase/types';
import { sanitizeFirestoreData } from '../firebase/utils/sanitize';
import { resolveCandidateName } from '../utils/userNameUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUserRole(rawRole: any): UserRole {
  if (rawRole === 'employer') return 'employer';
  if (rawRole === 'admin') return 'admin';
  if (rawRole === 'job_seeker' || rawRole === 'candidate') return 'job_seeker';
  return 'job_seeker';
}

function calculateCompletion(data: Partial<FirestoreUserDocument>): number {
  let filled = 0;
  const fields = ['displayName', 'email', 'headline', 'location', 'bio', 'avatarUrl', 'skills', 'resumeUrl', 'githubUrl', 'linkedinUrl', 'education', 'experienceYears'];
  fields.forEach((f) => {
    const val = (data as any)[f];
    if (val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')) {
      filled++;
    }
  });
  return Math.round((filled / fields.length) * 100);
}

function buildUserProfileFromDoc(data: FirestoreUserDocument, fbUser: any, resolvedRole: UserRole): UserProfile {
  const name = resolveCandidateName(data).name;
  const employerPosition = data.employerPosition || undefined;

  return {
    uid: fbUser.uid,
    email: fbUser.email || data.email || '',
    displayName: name,
    role: resolvedRole,
    avatarUrl: data.avatarUrl || data.photoURL || fbUser?.photoURL || undefined,
    photoURL: data.photoURL || data.avatarUrl || fbUser?.photoURL || undefined,
    headline: data.headline || undefined,
    employerPosition,
    department: data.department || undefined,
    professionalTitle: data.professionalTitle || (resolvedRole === 'employer' ? (employerPosition || 'Hiring Manager') : undefined),
    companyLogo: data.companyLogo || undefined,
    companyDescription: data.companyDescription || undefined,
    companyLocation: data.companyLocation || undefined,
    foundedYear: data.foundedYear || undefined,
    companyAchievements: data.companyAchievements || undefined,
    aboutCompany: data.aboutCompany || undefined,
    hiringLocations: data.hiringLocations || [],
    departments: data.departments || [],
    commonlyHiredSkills: data.commonlyHiredSkills || [],
    currentHiringStatus: data.currentHiringStatus || undefined,
    workModePreference: data.workModePreference || undefined,
    talentSourcePreferences: data.talentSourcePreferences || [],
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
    verificationStatus: (data as any).verificationStatus || (fbUser?.emailVerified ? 'verified' : 'unverified'),
    isEmailVerified: fbUser?.emailVerified ?? false,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const creationAttemptedRef = useRef<Set<string>>(new Set());
<<<<<<< HEAD
=======
  const roleSyncAttemptedRef = useRef<Set<string>>(new Set());
>>>>>>> origin/main

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribeAuth = firebaseAuthService.onAuthStateChanged(async (fbUser) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (!fbUser) {
        setUser(null);
        setRole('guest');
        localStorage.setItem('careerconnect_role', 'guest');
        setIsLoading(false);
        return;
      }

      // Mark session as loading while authoritative Firestore document is retrieved
      setIsLoading(true);
      // Clean previous user state if switching accounts to prevent role leaks
      setUser((prev) => (prev?.uid === fbUser.uid ? prev : null));
<<<<<<< HEAD
      setRole('guest');

      if (!isFirebaseConfigured) {
        // Cached role data is presentation-only and cannot authorize a session.
        const initialRole: UserRole = 'job_seeker';
=======

      if (!isFirebaseConfigured) {
        const savedRole = localStorage.getItem('careerconnect_role') as UserRole | null;
        const initialRole: UserRole = normalizeUserRole(savedRole);
>>>>>>> origin/main
        const name = fbUser.displayName || '';
        const fallbackProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: name || 'Name unavailable',
          role: initialRole,
          isEmailVerified: fbUser.emailVerified,
          profileCompleted: true,
          completionPercentage: calculateCompletion({ displayName: name, email: fbUser.email || '' }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(fallbackProfile);
        setRole(initialRole);
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', fbUser.uid);

      unsubDoc = onSnapshot(
        userDocRef,
        { includeMetadataChanges: true },
        async (snap) => {
          if (snap.exists()) {
            const data = snap.data() as any;
            const canonicalRole = normalizeUserRole(data.role);
            let resolvedRole: UserRole = canonicalRole;

<<<<<<< HEAD
=======
            // jr.research25@gmail.com is an Employer account. Preserve that role.
            if (fbUser.email?.toLowerCase() === 'jr.research25@gmail.com') {
              resolvedRole = 'employer';
              if (data.role !== 'employer' && !roleSyncAttemptedRef.current.has(fbUser.uid)) {
                roleSyncAttemptedRef.current.add(fbUser.uid);
                try {
                  await userRepository.update(fbUser.uid, {
                    role: 'employer',
                    ...(data.employerPosition ? { employerPosition: data.employerPosition } : {}),
                    headline: data.headline || '',
                  });
                } catch (e) {
                  console.warn('Sync employer role to DB notice:', e);
                }
              }
            }

>>>>>>> origin/main
            const profile = buildUserProfileFromDoc(data, fbUser, resolvedRole);

            setUser(profile);
            setRole(resolvedRole);
            localStorage.setItem('careerconnect_role', resolvedRole);
            setIsLoading(false);
          } else {
            // Local snapshot may not contain doc immediately when reading from cache.
            // Do not assume document is missing while snapshot is only from local cache.
            if ((snap as any).metadata?.fromCache) {
              return;
            }

            // Only attempt profile creation once server confirms missing document
            if (!creationAttemptedRef.current.has(fbUser.uid)) {
              creationAttemptedRef.current.add(fbUser.uid);

              const cachedRole = localStorage.getItem('careerconnect_role') as UserRole | null;
<<<<<<< HEAD
              // A cached employer role is used only to complete the short registration
              // race before AuthService has finished creating the profile. Admin is never
              // accepted from client-side cached state.
              const registrationRole: UserRole = cachedRole === 'employer' ? 'employer' : 'job_seeker';
=======
              const isEmployerEmail = fbUser.email?.toLowerCase() === 'jr.research25@gmail.com';
              const registrationRole: UserRole = (isEmployerEmail || cachedRole === 'employer') ? 'employer' : cachedRole === 'admin' ? 'admin' : 'job_seeker';
>>>>>>> origin/main
              const employerPosition = undefined;

              const name = fbUser.displayName || '';
              const parts = name.trim().split(' ');
              const firstName = parts[0] || '';
              const lastName = parts.slice(1).join(' ') || '';

              const newDoc: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'> = {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: name,
                firstName,
                lastName,
                role: registrationRole,
                ...(employerPosition ? { employerPosition } : {}),
                emailVerified: fbUser.emailVerified,
                profileCompleted: false,
                accountStatus: 'active',
                provider: 'password',
                headline: '',
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
                ...(fbUser.photoURL ? { photoURL: fbUser.photoURL, avatarUrl: fbUser.photoURL } : {}),
              };

              try {
                const createdOrExisting = await userRepository.create(newDoc);
                const finalRole = normalizeUserRole(createdOrExisting.role);
                const profile = buildUserProfileFromDoc(createdOrExisting, fbUser, finalRole);

                setUser(profile);
                setRole(finalRole);
                localStorage.setItem('careerconnect_role', finalRole);
              } catch (e) {
                console.warn('AuthContext initial profile creation error:', e);
                // Attempt direct retrieval if document was created concurrently
                try {
                  const existingDoc = await userRepository.findById(fbUser.uid);
                  if (existingDoc) {
                    const finalRole = normalizeUserRole(existingDoc.role);
                    const profile = buildUserProfileFromDoc(existingDoc, fbUser, finalRole);
                    setUser(profile);
                    setRole(finalRole);
                    localStorage.setItem('careerconnect_role', finalRole);
                  }
                } catch (fetchErr) {
                  console.warn('AuthContext fallback document fetch notice:', fetchErr);
                }
              }
            }
            setIsLoading(false);
          }
        },
        (err) => {
          console.warn('Firestore user snapshot listener warning:', err);
          userRepository.findById(fbUser.uid).then((existingDoc) => {
            if (existingDoc) {
              const finalRole = normalizeUserRole(existingDoc.role);
              const profile = buildUserProfileFromDoc(existingDoc, fbUser, finalRole);
              setUser(profile);
              setRole(finalRole);
              localStorage.setItem('careerconnect_role', finalRole);
            }
            setIsLoading(false);
          }).catch(() => {
            setIsLoading(false);
          });
        }
      );
<<<<<<< HEAD
    }, (err) => {
      console.warn('Firebase authentication initialization failed:', err);
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }
      setUser(null);
      setRole('guest');
      setIsLoading(false);
      localStorage.setItem('careerconnect_role', 'guest');
=======
>>>>>>> origin/main
    });

    return () => {
      if (unsubDoc) unsubDoc();
      unsubscribeAuth();
    };
  }, []);

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.uid) throw new Error('You must be signed in to update your profile.');
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

    const previous = user;

    // Protect against Firestore Security Rules permission violations:
    // Non-admin clients cannot escalate to admin, change uid, accountStatus, verificationStatus, status
    const payloadToPersist = { ...normalized };
    if (role !== 'admin') {
      delete payloadToPersist.uid;
      delete payloadToPersist.role;
      delete payloadToPersist.accountStatus;
      delete payloadToPersist.status;
      delete payloadToPersist.verificationStatus;
    }

    const cleanPayload = sanitizeFirestoreData(payloadToPersist);

    try {
      const persisted = await userRepository.update(user.uid, cleanPayload as any);
      const persistedRole = normalizeUserRole(persisted.role);
      setUser(buildUserProfileFromDoc(persisted, firebaseAuthService.getCurrentUser(), persistedRole));
      setRole(persistedRole);
    } catch (err) {
      setUser(previous);
      throw err;
    }
  };

  const loginAs = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('careerconnect_role', newRole);
  };

  const updateRole = async (newRole: UserRole) => {
<<<<<<< HEAD
    if (role !== 'admin') {
      throw new Error('Role changes require an authorized administrative process.');
    }
    loginAs(newRole);
    if (user?.uid && newRole !== 'guest') {
=======
    loginAs(newRole);
    if (user?.uid && newRole !== 'admin' && newRole !== 'guest') {
>>>>>>> origin/main
      try {
        await userRepository.update(user.uid, {
          role: newRole,
          ...(newRole === 'employer' && user.employerPosition ? { employerPosition: user.employerPosition } : {}),
        });
      } catch (err) {
        console.warn('Failed to persist user role update to Firestore:', err);
      }
    }
  };

  const logout = async () => {
    await firebaseAuthService.signOut();
    creationAttemptedRef.current.clear();
    setUser(null);
    setRole('guest');
    setIsLoading(false);
    localStorage.setItem('careerconnect_role', 'guest');
    localStorage.removeItem('careerconnect_user');
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

import { getFirestore, Firestore } from 'firebase/firestore';
import { app } from './firebaseApp';

export const db: Firestore = getFirestore(app);

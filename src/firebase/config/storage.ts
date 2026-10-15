import { getStorage, FirebaseStorage } from 'firebase/storage';
import { app } from './firebaseApp';

export const storage: FirebaseStorage = getStorage(app);

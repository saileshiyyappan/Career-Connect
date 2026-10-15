import { getAuth, Auth } from 'firebase/auth';
import { app } from './firebaseApp';

export const auth: Auth = getAuth(app);

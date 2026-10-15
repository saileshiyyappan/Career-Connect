import { getFunctions, Functions } from 'firebase/functions';
import { app } from './firebaseApp';

export const functions: Functions = getFunctions(app);

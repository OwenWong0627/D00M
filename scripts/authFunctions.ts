import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, doc, setDoc, collection, getDoc } from '../firebase/firebaseConfig';

export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    const userDocRef = doc(collection(db, 'users'), userCredential.user.uid);
    await setDoc(userDocRef, {
      name: displayName,
      email: email,
      createdAt: new Date(),
      friends: [],
      friendRequests: [],
      encouragements: [],
      gestures: [],
    });

    console.log('User registered:', userCredential.user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

export const createUserSettings = async (userId: string, settings: any) => {
  const settingsDocRef = doc(collection(db, 'settings'), userId);
  await setDoc(settingsDocRef, settings);
};

export const createScreenTimeData = async (userId: string, newDailyData: any) => {
  const screenTimeDataDocRef = doc(collection(db, 'screenTimeData'), userId);
  const docSnap = await getDoc(screenTimeDataDocRef);

  if (docSnap.exists()) {
    const screenTimeData = docSnap.data();
    const updatedDailyData = [...screenTimeData.dailyData, newDailyData].sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)));
    await setDoc(screenTimeDataDocRef, { dailyData: updatedDailyData });
  } else {
    console.log('No screenTimeData document found, creating new one here');
    await setDoc(screenTimeDataDocRef, { dailyData: [newDailyData] });
  }
};

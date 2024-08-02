import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { OnboardingItem, onboardingContent } from '../data/onboardingContent';
import { useRouter } from 'expo-router';
import GoalSettingPage from './GoalSettingPage';
import SliderComponent from './SliderComponent';
import SignUp from './SignUp';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  item: OnboardingItem;
  scrollToNext: () => void;
  scrollForward: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ item, scrollToNext, scrollForward }) => {
  const router = useRouter();
  const sliderRef = useRef<any>(null);
  const [totalScreenTime, setTotalScreenTime] = useState<number>(0);

  const handlePress = async () => {
    if (item.customComponent === 'SliderComponent' && sliderRef.current) {
      await sliderRef.current.handleDone();

      // Fetch appLimits from settings
      if (auth.currentUser) {
        const userDocRef = doc(db, 'settings', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const { appLimits } = docSnap.data();

          const currentDate = new Date();
          const screenTimeData = {
            date: currentDate,
            totalScreenTime: appLimits.reduce((acc: number, app: { limit: number }) => acc + app.limit, 0),
            appUsage: appLimits.map((app: { app: string; limit: number }) => ({
              app: app.app,
              used: 0,
              limit: app.limit,
            })),
          };

          // Store screenTimeData in Firestore
          const screenTimeDocRef = doc(db, 'screenTimeData', auth.currentUser.uid);
          await setDoc(screenTimeDocRef, { dailyData: [screenTimeData] }, { merge: true });

        } else {
          console.log('No settings document found!');
        }
      } else {
        Alert.alert('Error', 'No user is currently logged in.');
      }
    }

    if (parseInt(item.id) === onboardingContent.length) {
      router.replace('/success');
    } else if (item.onPress) {
      item.onPress(scrollToNext);
    }
  };

  if (item.customComponent === 'GoalSettingPage') {
    return <GoalSettingPage scrollToNext={scrollToNext} />;
  }

  if (item.customComponent === 'SliderComponent') {
    return (
      <View style={styles.container}>
        <SliderComponent ref={sliderRef} onSliderChange={() => {}} onTotalScreenTimeChange={setTotalScreenTime} onErrorChange={() => {}} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.hasButton && (
          <TouchableOpacity
            style={[styles.button, totalScreenTime === 0 && styles.disabledButton]}
            onPress={totalScreenTime > 0 ? handlePress : () => {}}
            disabled={totalScreenTime === 0}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (item.customComponent === 'SignUp') {
    return <SignUp scrollToNext={scrollToNext} scrollForward={scrollForward} />;
  }

  return (
    <View style={styles.container}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {item.hasButton && (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    width: '90%',
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;

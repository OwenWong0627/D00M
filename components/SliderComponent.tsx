import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

interface SliderComponentProps {
  onSliderChange: () => void;
  onTotalScreenTimeChange: (totalScreenTime: number) => void;
}

const SliderComponent = forwardRef((props: SliderComponentProps, ref) => {
  const initialSliders = [
    { app: 'Instagram', icon: require('../assets/images/instagram.png'), max: 120, value: 0, color: '#8a3ab9' },
    { app: 'Facebook', icon: require('../assets/images/facebook.png'), max: 120, value: 0, color: '#3b5998' },
    { app: 'YouTube', icon: require('../assets/images/youtube.png'), max: 120, value: 0, color: '#FF0000' },
    { app: 'TikTok', icon: require('../assets/images/tiktok.png'), max: 120, value: 0, color: '#ee1d52' },
    { app: 'Snapchat', icon: require('../assets/images/snapchat.png'), max: 120, value: 0, color: '#FFFC00' },
    { app: 'Reddit', icon: require('../assets/images/reddit.png'), max: 120, value: 0, color: '#FF5700' },
    { app: 'X', icon: require('../assets/images/twitter.png'), max: 120, value: 0, color: '#1da1f2' }
  ];

  const [sliders, setSliders] = useState(initialSliders);
  const [goalLimit, setGoalLimit] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'settings', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const appLimits = data.appLimits || [];
          const newSliders = initialSliders.map(slider => {
            const appLimit = appLimits.find((app: any) => app.app === slider.app);
            return appLimit ? { ...slider, value: appLimit.limit } : slider;
          });
          setSliders(newSliders);

          // Calculate goal limit in minutes
          const goalLimitInMinutes = (data.hours || 0) * 60 + (data.minutes || 0);
          setGoalLimit(goalLimitInMinutes);
        }
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const totalScreenTime = sliders.reduce((acc, slider) => acc + slider.value, 0);
    props.onTotalScreenTimeChange(totalScreenTime);
    if (totalScreenTime > goalLimit) {
      setErrorMessage(`Total screen time (${totalScreenTime} min) exceeds your goal limit (${goalLimit} min)`);
    } else {
      setErrorMessage('');
    }
  }, [sliders, goalLimit]);

  const handleSliderChange = (index: number, value: number) => {
    const newSliders = [...sliders];
    newSliders[index].value = value;
    setSliders(newSliders);
    props.onSliderChange();
  };

  const renderLabels = (max: number) => {
    const interval = max / 6;
    const labels = Array.from({ length: 7 }, (_, i) => i * interval);
    return (
      <View style={styles.labelsContainer}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.labelText}>{label}</Text>
        ))}
      </View>
    );
  };

  const handleDone = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'settings', auth.currentUser.uid);
      const appLimits = sliders.map(slider => ({
        app: slider.app,
        limit: slider.value,
      }));

      try {
        await updateDoc(userDocRef, { appLimits });
      } catch (error) {
        console.error('Error updating app limits:', error);
        Alert.alert('Error', 'Failed to update app limits.');
      }
    } else {
      Alert.alert('Error', 'No user is currently logged in.');
    }
  };

  useImperativeHandle(ref, () => ({
    handleDone
  }));

  return (
    <View style={styles.container}>
      {sliders.map((slider, index) => (
        <View key={index} style={styles.sliderRow}>
          <Image source={slider.icon} style={styles.icon} />
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={slider.max}
              value={slider.value}
              step={5}
              minimumTrackTintColor={slider.color}
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor={slider.color}
              onValueChange={(value) => handleSliderChange(index, value)}
            />
            {renderLabels(slider.max)}
          </View>
          <Text style={styles.timeText}>{slider.value} MIN</Text>
        </View>
      ))}
      {errorMessage && goalLimit > 0 ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  sliderContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginLeft: 15,
    marginTop: -15,
  },
  labelText: {
    fontSize: 10,
    color: '#000',
  },
  timeText: {
    marginLeft: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SliderComponent;

import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { OnboardingItem } from '../data/onboardingContent';
import { useRouter } from 'expo-router';
import GoalSettingPage from './GoalSettingPage';
import SliderComponent from './SliderComponent';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  item: OnboardingItem;
  scrollToNext: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ item, scrollToNext }) => {
  const router = useRouter();

  const handlePress = () => {
    if (item.id === '7') {
      router.push('/signup');
    } else if (item.onPress) {
      item.onPress();
    }
  };

  if (item.customComponent === 'GoalSettingPage') {
    return <GoalSettingPage scrollToNext={scrollToNext} />;
  }

  if (item.customComponent === 'SliderComponent') {
    return (
      <View style={styles.container}>
        <SliderComponent />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.hasButton && (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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
    marginTop: 50,
  },
  button: {
    width: '90%',
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;

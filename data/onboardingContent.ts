import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import { Alert } from 'react-native';

export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
  hasButton?: boolean;
  buttonText?: string;
  customComponent?: string;
  onPress?: () => void;
}

export const onboardingContent: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to D00M',
    description: 'An app that won\'t leave you doom scrolling.',
    image: require('../assets/images/onboarding/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Doom Scrolling?',
    description: 'According to Merriam Webster, it has devolved to... \n\n \"...spend excessive time online scrolling through news or other content...\"',
    image: require('../assets/images/onboarding/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Don\'t swipe up, swipe \'right\'!',
    description: 'We aim to provide you a healthy and challenging environment, where you can compete against like minded individuals to reduce the time spent doomscrolling!',
    image: require('../assets/images/onboarding/onboarding3.png'),
  },
  {
    id: '4',
    title: 'Lets analyse your screen time!',
    description: 'In order to move forward, D00M shall require permission to access your device\'s Screen Time',
    image: require('../assets/images/onboarding/onboarding4.png'),
    hasButton: true,
    buttonText: 'Give Access',
    onPress: () => {
      Alert.alert(
        '"D00M" Would Like to Access the Screen Time?',
        'Providing "D00M" access to Screen Time may allow it to see your activity data, restrict content, and limit the usage of apps and websites.',
        [
          // { text: 'Cancel', onPress: () => console.log('Access denied'), style: 'cancel' },
          { text: 'Continue', onPress: () => console.log('Access granted') }
        ]
      );
    },
  },
  {
    id: '5',
    title: 'Snap out of it.',
    description: 'After analysing the device screen time, the above apps have being found to be the main cause for your doom scrolling.',
    image: require('../assets/images/onboarding/onboarding5.png'),
  },
  {
    id: '6',
    title: 'Add a Goal!',
    description: '',
    image: null,
    customComponent: 'GoalSettingPage',
  },
  {
    id: '7',
    title: 'Your recommended app usage',
    description: 'Our in built AI predicts the above app usage for the upcoming days to help you along your journey in reducing doom scrolling. Feel free to adjust the sliders if needed.',
    image: null,
    customComponent: 'SliderComponent',
    hasButton: true,
    buttonText: 'Got it, let\'s sign up!',
    onPress: () => {},
  },
];

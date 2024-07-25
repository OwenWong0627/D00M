import { Alert } from 'react-native';

export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
  hasButton?: boolean;
  buttonText?: string;
  customComponent?: string;
  onPress?: (scrollToNext?: () => void) => void;
}

export const onboardingContent: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to D00M',
    description: 'An app that won\'t leave you doom scrolling.\n\nAccording to the Marriam Webster, doom scrolling is "spending excessive time online scrolling through news or other content"',
    image: require('../assets/images/onboarding/onboarding1.png'),
    hasButton: true,
    buttonText: 'Sounds Good!',
    onPress: (scrollToNext) => {
      if (scrollToNext) scrollToNext();
    },
  },
  {
    id: '2',
    title: 'How do we reduce doom scrolling?',
    description: 'We will plan daily limits, that increment and are tailored to your goals. Encourage your friends and reduce your screen time together!',
    image: require('../assets/images/onboarding/onboarding2.png'),
    hasButton: true,
    buttonText: 'I understand',
    onPress: (scrollToNext) => {
      if (scrollToNext) scrollToNext();
    },
  },
  {
    id: '3',
    title: 'Lets analyse your screen time!',
    description: 'In order to move forward, D00M requires permission to access your device\'s Screen Time',
    image: require('../assets/images/onboarding/onboarding4.png'),
    hasButton: true,
    buttonText: 'Give Access',
    onPress: (scrollToNext) => {
      Alert.alert(
        '"D00M" Would Like to Access the Screen Time?',
        'Providing "D00M" access to Screen Time may allow it to see your activity data, restrict content, and limit the usage of apps and websites.',
        [
          { text: 'Continue', onPress: () => { console.log('Access granted'); if (scrollToNext) scrollToNext(); } }
        ]
      );
    },
  },
  {
    id: '4',
    title: 'Get Ready to Sign Up',
    description: 'To continue, please sign up to get the most out of D00M.',
    image: require('../assets/images/onboarding/onboarding3.png'),
    hasButton: true,
    buttonText: 'Sign Up',
    onPress: (scrollToNext) => {
      if (scrollToNext) scrollToNext();
    },
  },
  {
    id: '5',
    title: 'Sign Up',
    description: '',
    image: null,
    customComponent: 'SignUp',
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
    buttonText: 'Got It, Let\'s Go!',
    onPress: () => {},
  },
];

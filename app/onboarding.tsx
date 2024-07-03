import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import Pagination from '../components/Pagination';
import InitialScreen from '../components/InitialScreen';
import { onboardingContent, OnboardingItem } from '../data/onboardingContent';

const { width } = Dimensions.get('window');

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInitial, setShowInitial] = useState(true);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const handleStart = () => {
    setShowInitial(false);
  };

  return (
    <View style={styles.container}>
      {showInitial ? (
        <InitialScreen onStart={handleStart} />
      ) : (
        <>
          <FlatList
            data={onboardingContent}
            renderItem={({ item }) => <OnboardingScreen item={item} />}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            ref={flatListRef}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width}
            bounces={false}
          />
          <Pagination index={currentIndex} length={onboardingContent.length} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Onboarding;

import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import Pagination from '../components/Pagination';
import { onboardingContent, OnboardingItem } from '../data/onboardingContent';

const { width } = Dimensions.get('window');

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const scrollToNext = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const scrollForward = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={onboardingContent}
        renderItem={({ item }) => (
          <OnboardingScreen
            item={item}
            scrollToNext={scrollToNext}
            scrollForward={scrollForward}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        ref={flatListRef}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        disableIntervalMomentum={true}
        bounces={true}
        scrollEnabled={false}
      />
      <Pagination index={currentIndex} length={onboardingContent.length} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Onboarding;

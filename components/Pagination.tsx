import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginationProps {
  index: number;
  length: number;
}

const Pagination: React.FC<PaginationProps> = ({ index, length }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { opacity: i === index ? 1 : 0.3 },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
});

export default Pagination;

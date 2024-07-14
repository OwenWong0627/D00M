import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const rankings = [
  { id: '1', name: 'James Doe', streak: '52', rank: 1, image: require('../../../assets/images/person1.png') },
  { id: '2', name: 'Eric Chen', streak: '25', rank: 2, image: require('../../../assets/images/person2.png') },
  { id: '3', name: 'Deric', streak: '12', rank: 3, image: require('../../../assets/images/person3.png') },
  { id: '4', name: 'You', streak: '7', rank: 4, image: require('../../../assets/images/person4.png') },
  { id: '5', name: 'George Fan', streak: '-', rank: 5, image: require('../../../assets/images/person4.png') },
];

const getRankImage = (rank: number) => {
  switch (rank) {
    case 1:
      return require('../../../assets/images/first.png');
    case 2:
      return require('../../../assets/images/second.png');
    case 3:
      return require('../../../assets/images/third.png');
    default:
      return null;
  }
};

const AllRankings: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Weekly Ranking</Text>
      <FlatList
        data={rankings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/tabs/leaderboard/friendStats',
              params: { id: item.id, name: item.name, streak: item.streak, image: item.image },
            })}
          >
            <View style={styles.rankingContainer}>
              {item.rank <= 3 ? (
                <Image source={getRankImage(item.rank)} style={styles.rankBadge} />
              ) : (
                <Text style={styles.rankNumber}>{item.rank}</Text>
              )}
              <View style={styles.rankingInfo}>
                <Text style={styles.rankingName}>{item.name}</Text>
                <Text style={styles.rankingStreak}>
                  {item.streak}
                  <Image source={require('../../../assets/images/fire.png')} style={styles.fireImage} />
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rankingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rankBadge: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  rankNumber: {
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankingInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankingStreak: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireImage: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
});

export default AllRankings;

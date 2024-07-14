import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SectionList, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const friends = [
  { id: '1', name: 'James', image: require('../../../assets/images/person1.png') },
  { id: '2', name: 'Eric', image: require('../../../assets/images/person2.png') },
  { id: '3', name: 'Derek', image: require('../../../assets/images/person3.png') },
];

const rankings = [
  { id: '1', name: 'James', streak: '52 Days', rank: 1 },
  { id: '2', name: 'Eric', streak: '25 Days', rank: 2 },
  { id: '3', name: 'Derek', streak: '12 Days', rank: 3 },
  { id: '4', name: 'You', streak: '7 Days', rank: 4 },
  { id: '5', name: 'George Fan', streak: '-', rank: 5 },
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

const Leaderboard: React.FC = () => {
  const router = useRouter();

  const sections = [
    {
      title: 'HIGHLIGHTS',
      data: ['Recent awards and progress on rings from your friends will appear here'],
      renderItem: ({ item }: { item: any }) => (
        <View style={styles.highlightsContainer}>
          <Image source={require('../../../assets/images/trophy.png')} style={styles.trophyImage} />
          <Text style={styles.highlightsText}>{item}</Text>
        </View>
      ),
    },
    {
      title: 'YOUR FRIENDS',
      data: [friends], // Wrap friends array in another array to match expected data structure
      renderItem: ({ item }: { item: any }) => (
        <FlatList
          data={item}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(friend) => friend.id}
          renderItem={({ item: friend }) => (
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/tabs/leaderboard/friend',
                params: { id: friend.id, name: friend.name, image: friend.image },
              })}
            >
              <View style={styles.friendContainer}>
                <Image source={friend.image} style={styles.friendImage} />
                <Text style={styles.friendName}>{friend.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ),
    },
    {
      title: 'WEEKLY RANKING',
      data: rankings.slice(0, 3),
      renderItem: ({ item }: { item: any }) => (
        <View style={styles.rankingContainer}>
          <Image source={getRankImage(item.rank)} style={styles.rankBadge} />
          <View style={styles.rankingInfo}>
            <Text style={styles.rankingName}>{item.name}</Text>
            <Text style={styles.rankingStreak}>
              antid00m streak : {item.streak}
              <Image source={require('../../../assets/images/fire.png')} style={styles.fireImage} />
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity onPress={() => router.push('/tabs/leaderboard/share')}>
          <Image source={require('../../../assets/images/friends.png')} style={styles.friendsImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#000" />
        <TextInput style={styles.searchInput} placeholder="Search a Friend in your list" />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {title === 'WEEKLY RANKING' && (
              <TouchableOpacity onPress={() => router.push('/tabs/leaderboard/allRankings')}>
                <Text style={styles.seeAllText}>SEE ALL</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  highlightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  trophyImage: {
    width: 50,
    height: 80,
  },
  friendsImage: {
    width: 30,
    height: 30,
  },
  highlightsText: {
    flex: 1,
    marginLeft: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  friendContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  friendImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 14,
    color: '#333',
  },
  rankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  seeAllText: {
    color: '#000',
  },
  rankingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rankingInfo: {
    flex: 1,
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

export default Leaderboard;

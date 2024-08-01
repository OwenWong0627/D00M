import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const Leaderboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<{ id: string; name: string; streak: number; }[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<{ id: string; name: string; streak: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFriends = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const friendsArray = userData.friends || [];

          if (friendsArray.length === 0) {
            setFriends([{ id: auth.currentUser.uid, name: 'You', streak: 0 }]);
            setFilteredFriends([{ id: auth.currentUser.uid, name: 'You', streak: 0 }]);
          } else {
            const friendsDocs = await Promise.all(
              friendsArray.map(
                (friendId: any) => getDoc(doc(db, 'users', friendId)))
            );

            let friendsData = friendsDocs.map(friendDoc => ({
              id: friendDoc.id,
              ...friendDoc.data()
            }));

            friendsData.push({ id: auth.currentUser.uid, name: auth.currentUser.displayName });

            // Fetch and calculate streaks
            const friendsWithStreaks = await Promise.all(
              friendsData.map(async (friend) => {
                const screenTimeRef = doc(db, 'screenTimeData', friend.id);
                const screenTimeDoc = await getDoc(screenTimeRef);

                let streak = 0;
                if (screenTimeDoc.exists()) {
                  const dailyData = screenTimeDoc.data().dailyData;
                  streak = calculateCurrentStreak(dailyData);
                }

                return { ...friend, streak };
              })
            );

            // Sort friends by streak (desc) and name (asc)
            friendsWithStreaks.sort((a, b) => {
              if (b.streak === a.streak) {
                return a.name.localeCompare(b.name);
              }
              return b.streak - a.streak;
            });

            setFriends(friendsWithStreaks);
            setFilteredFriends(friendsWithStreaks);
          }
        }

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching friends: ", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredData = friends.filter((friend) =>
      friend.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filteredData);
  };

  const calculateCurrentStreak = (dailyData: any) => {
    let streak = 0;
    const today = new Date().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});

    for (let i = dailyData.length - 1; i >= 0; i--) {
      const day = dailyData[i];
      const date = day.date.toDate().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});

      if (date > today) continue;

      const isStreakDay = day.appUsage.every((app: any) => app.used <= app.limit);
      if (isStreakDay) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/tabs/leaderboard/share' })}>
          <Image source={require('../../../assets/images/friends.png')} style={styles.friendsImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#000" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search a Friend in your list"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>YOUR FRIENDS</Text>
      </View>
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isCurrentUser = item.id === auth.currentUser?.uid;
          return (
            <TouchableOpacity
              onPress={() => !isCurrentUser && router.push({
                pathname: '/tabs/leaderboard/friendStats',
                params: { id: item.id, name: item.name, streak: item.streak.toString() },
              })}
              disabled={isCurrentUser}
              style={isCurrentUser ? styles.disabledTouchable : {}}
            >
              <View style={[styles.rankingContainer, styles.friendItem]}>
                <Image source={getRankImage(friends.indexOf((friends.find(friend => friend.name === item.name)) ?? {id: '', name: 'John Doe', streak: 0}) + 1)} style={styles.rankBadge} />
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingName}>{isCurrentUser ? 'You' : item.name}</Text>
                  <Text style={styles.streakText}>Streak: {item.streak} days 🔥</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          );
        }}
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
    marginTop: 20,
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
  friendsImage: {
    width: 30,
    height: 30,
  },
  rankingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
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
  streakText: {
    fontSize: 14,
    color: '#777',
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  disabledTouchable: {
    opacity: 0.5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default Leaderboard;

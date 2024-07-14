import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Share } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const sharingFriends = [
  { id: '1', name: 'James', image: require('../../../assets/images/person1.png') },
  { id: '2', name: 'Eric', image: require('../../../assets/images/person2.png') },
  { id: '3', name: 'Deric', image: require('../../../assets/images/person3.png') },
];

const invitedFriends = [
  { id: '1', name: 'Brian', daysAgo: '1 day ago' },
  { id: '2', name: 'Owen', daysAgo: '3 days ago' },
  { id: '3', name: 'Anshu', daysAgo: '12 days ago' },
  { id: '4', name: 'Kenny', daysAgo: '12 days ago' },
];

const ShareScreen: React.FC = () => {
  const router = useRouter();

  const onInvitePress = async () => {
    try {
      const result = await Share.share({
        message: 'Join me on this awesome app! Here is the link: https://example.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Sharing</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>SHARING WITH</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.inviteContainer} onPress={onInvitePress}>
          <Ionicons name="add-circle-outline" size={24} color="#000" />
          <Text style={styles.inviteText}>Invite a Friend</Text>
        </TouchableOpacity>
        {sharingFriends.map((friend) => (
          <View key={friend.id} style={styles.friendRow}>
            <Image source={friend.image} style={styles.friendImage} />
            <Text style={styles.friendName}>{friend.name}</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#000" />
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>INVITED</Text>
      <View style={styles.card}>
        {invitedFriends.map((friend) => (
          <View key={friend.id} style={styles.friendRow}>
            <Ionicons name="person-outline" size={24} color="#000" />
            <Text style={styles.invitedName}>{friend.name}</Text>
            <Text style={styles.invitedDays}>{friend.daysAgo}</Text>
          </View>
        ))}
      </View>
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
  doneText: {
    fontSize: 16,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  inviteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inviteText: {
    marginLeft: 10,
    fontSize: 16,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
  },
  invitedName: {
    flex: 1,
    fontSize: 16,
  },
  invitedDays: {
    fontSize: 14,
    color: '#666',
  },
});

export default ShareScreen;

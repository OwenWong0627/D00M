import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

const ShareScreen: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const friendRequestsArray = userData.friendRequests || [];
            const friendsArray = userData.friends || [];
            const outgoingRequestsArray = userData.outgoingRequests || [];

            setFriendRequests(friendRequestsArray);
            setFriends(friendsArray);
            setOutgoingRequests(outgoingRequestsArray);

            const allUsersSnapshot = await getDocs(collection(db, 'users'));
            const allUsers = allUsersSnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(user => user.id !== auth.currentUser.uid && !friendsArray.includes(user.id));

            setUsers(allUsers);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const updatedRequests = userData.friendRequests.filter(request => request.id !== requestId);
          const updatedFriends = [...userData.friends, requestId];

          await updateDoc(userDocRef, {
            friendRequests: updatedRequests,
            friends: updatedFriends,
          });

          // Also update the friend's document to include the current user in their friends list
          const requestorDocRef = doc(db, 'users', requestId);
          await updateDoc(requestorDocRef, {
            friends: arrayUnion(auth.currentUser.uid)
          });

          // Remove the accepted request from users list
          const updatedUsers = users.filter(user => user.id !== requestId);

          setFriendRequests(updatedRequests);
          setFriends(updatedFriends);
          setUsers(updatedUsers);
        }
      }
    } catch (error) {
      console.error("Error accepting friend request: ", error);
      Alert.alert("Error", "Failed to accept friend request.");
    }
  };

  const handleSendRequest = async (userId, name, email) => {
    try {
      if (auth.currentUser) {
        const recipientDocRef = doc(db, 'users', userId);
        await updateDoc(recipientDocRef, {
          friendRequests: arrayUnion({
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
            name: auth.currentUser.displayName || 'Anonymous',
          })
        });

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          outgoingRequests: arrayUnion(userId)
        });

        setOutgoingRequests(prev => [...prev, userId]);
        Alert.alert('Invite Sent', `Friend request sent to ${name}`);
      }
    } catch (error) {
      console.error("Error sending friend request: ", error);
      Alert.alert("Error", "Failed to send friend request.");
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>INCOMING FRIEND REQUESTS</Text>
      <View style={styles.card}>
        {friendRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>You have not received any friend requests yet.</Text>
        ) : (
          friendRequests.map((request) => (
            <View key={request.id} style={styles.friendRequestRow}>
              <Text style={styles.friendRequestText}>{request.name} ({request.email})</Text>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptRequest(request.id)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <Text style={styles.sectionTitle}>INVITE FRIENDS</Text>
      <View style={styles.card}>
        {users.length === 0 ? (
          <Text style={styles.noRequestsText}>There are no more friends to invite.</Text>
        ) : (
          users.map((user) => {
            const isRequestSent = outgoingRequests.includes(user.id);
            const isIncomingRequest = friendRequests.some(request => request.id === user.id);

            return (
              <View key={user.id} style={styles.userRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.inviteButton,
                    (isRequestSent || isIncomingRequest) && styles.inviteButtonDisabled
                  ]}
                  onPress={() => !isRequestSent && !isIncomingRequest && handleSendRequest(user.id, user.name, user.email)}
                  disabled={isRequestSent || isIncomingRequest}
                >
                  <Text style={styles.inviteButtonText}>
                    {isRequestSent ? 'Request Sent' : isIncomingRequest ? 'Incoming Request' : 'Invite'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
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
    alignItems: 'center',
    marginBottom: 20,
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
  friendRequestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendRequestText: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#00cc00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
  },
  inviteButton: {
    backgroundColor: '#0000ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inviteButtonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShareScreen;

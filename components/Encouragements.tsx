import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Encouragements = () => {
  const [encouragements, setEncouragements] = useState<{ message: string, sender: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchEncouragements = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEncouragements(data.encouragements.reverse() || []);
        }
        setLoading(false);
      }
    };

    fetchEncouragements();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.encouragementsContainer}>
      <Text style={styles.sectionTitle}>Encouragements</Text>
      {encouragements.length === 0 ? (
        <Text style={styles.noEncouragementsText}>You have not received any encouragements yet</Text>
      ) : (
        <View style={[styles.encouragementsBox, { maxHeight: screenHeight * 0.3 }]}>
          <ScrollView>
            {encouragements.map((encouragement, index) => (
              <View key={index} style={styles.encouragement}>
                <Text style={styles.message}>
                  <Text style={styles.senderName}>{encouragement.sender}: </Text>
                  {encouragement.message}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  awardsImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2.25,
    marginTop: 10,
    borderRadius: 10,
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  encouragementsContainer: {
    marginTop: 10,
  },
  encouragementsBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  noEncouragementsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  encouragement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});

export default Encouragements;

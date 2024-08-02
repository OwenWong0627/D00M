import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, PanResponder, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const MotivationBottomDrawer: React.FC<{ visible: boolean; onClose: () => void; recipientId: string }> = ({ visible, onClose, recipientId }) => {
  const [inputText, setInputText] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setInputText('');
      setGeneratedMessage(null);
    }
  }, [visible]);

  const generateMotivationalMessage = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a motivational assistant.',
          },
          {
            role: 'user',
            content: `Generate a short motivational message with a maximum of 20 words based on the following prompt: ${inputText}`,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const message = response.data.choices[0].message.content.trim();
      setGeneratedMessage(message);
    } catch (error) {
      console.error('Error generating message: ', error.response ? error.response.data : error.message);
      const errorMessage = error.response ? error.response.data.error.message : error.message;
      Alert.alert('Error', `Failed to generate motivational message: ${errorMessage}`);
    }
    setLoading(false);
  };

  const handleSendEncouragement = async () => {
    if (!generatedMessage) return;

    try {
      const userDocRef = doc(db, 'users', recipientId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const encouragement = {
          message: generatedMessage,
          sender: auth.currentUser?.displayName || 'Anonymous',
          timestamp: new Date(),
        };

        await updateDoc(userDocRef, {
          encouragements: arrayUnion(encouragement)
        });

        Alert.alert('Success', 'Encouragement sent successfully!');
        onClose();
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } catch (error) {
      console.error('Error sending encouragement: ', error);
      Alert.alert('Error', 'Failed to send encouragement.');
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        onClose();
      }
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
              <Text style={styles.sectionTitle}>Generate a Custom Encouragement</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a prompt for a motivational message"
                value={inputText}
                onChangeText={setInputText}
              />
              {loading && <ActivityIndicator size="large" color="#000" />}
              {generatedMessage && !loading && <Text style={styles.generatedMessageText}>{generatedMessage}</Text> }
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateMotivationalMessage}
                disabled={!inputText || loading}
              >
                <Text style={styles.generateButtonText}>{generatedMessage ? "Re-Generate Message" : "Generate Message"}</Text>
              </TouchableOpacity>
              {generatedMessage && (
                <View>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleSendEncouragement}
                  >
                    <Text style={styles.doneButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  generatedMessageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  doneButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MotivationBottomDrawer;

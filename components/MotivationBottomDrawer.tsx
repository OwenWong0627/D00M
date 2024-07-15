import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, PanResponder, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const motivationalMessages = [
  'Way to prioritize your well-being!',
  "You're creating healthy habits. Well done!",
  "You've got this! Stay mindful.",
  'Great to see you taking control.',
];

const MotivationBottomDrawer: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(motivationalMessages);

  useEffect(() => {
    if (!visible) {
      setSelectedMessage(null);
      setSearchQuery('');
    }
  }, [visible]);

  useEffect(() => {
    setFilteredMessages(
      motivationalMessages.filter((message) =>
        message.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

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
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#000" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for an encouragement"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <Text style={styles.sectionTitle}>Encouragements</Text>
              {filteredMessages.map((message, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.messageButton,
                    selectedMessage === message && styles.selectedMessageButton,
                  ]}
                  onPress={() => setSelectedMessage(message)}
                >
                  <Text style={styles.messageText}>{message}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.doneButton, !selectedMessage && styles.disabledDoneButton]}
                onPress={onClose}
                disabled={!selectedMessage}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  selectedMessageButton: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledDoneButton: {
    backgroundColor: '#ccc',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MotivationBottomDrawer;

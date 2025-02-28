import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Text, Alert } from 'react-native';
import { Button, Input, Select, SelectItem, Datepicker, IndexPath } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';

interface State {
  id: number;
  name: string;
}

interface AddRaceModalProps {
  visible: boolean;
  onClose: () => void;
  states: State[];
  onRaceAdded: () => void;
}



const AddRaceModal: React.FC<AddRaceModalProps> = ({ visible, onClose, states, onRaceAdded }) => {
  const [selectedStateIndex, setSelectedStateIndex] = useState<IndexPath | undefined>(undefined);
  const [raceName, setRaceName] = useState('');
  const [city, setCity] = useState('');
  //const [selectedState, setSelectedState] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [raceTime, setRaceTime] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useUser();

  const handleSaveRace = async () => {
    if (!raceName.trim()) {
      Alert.alert('Race Name is required.');
      return;
    }
    if (!selectedStateIndex) {
      Alert.alert('State is required.');
      return;
    }

    const raceData = {
      name: raceName,
      city,
      state: states[selectedStateIndex.row]?.id,
      date: date?.toISOString().split('T')[0],
      time: raceTime || "00:00:00",
      notes,
    };
    console.log('race data:', raceData);
    console.log('user token:', user?.token);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-races/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(raceData),
      });

      if (response.ok) {
        Alert.alert('Race added successfully');
        onClose();
        onRaceAdded();
      } else {
        Alert.alert('Error saving race.');
      }
    } catch (error) {
      Alert.alert('Network error');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Add a Race</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* 🏃‍♂️ Race Name Input */}
            <Input
              placeholder="Race Name *"
              value={raceName}
              onChangeText={setRaceName}
              style={styles.input}
            />

            {/* 🏙️ City Input */}
            <Input
              placeholder="City"
              value={city}
              onChangeText={setCity}
              style={styles.input}
            />

            {/* 🏛️ State Picker */}
            <Select
                selectedIndex={selectedStateIndex}
                onSelect={(index) => {
                  setTimeout(() => {
                    setSelectedStateIndex(index as IndexPath);
                  }, 0);
                }}
                placeholder="Select a state"
                value={selectedStateIndex ? states[selectedStateIndex.row]?.name : ''}
                style={[styles.input, styles.stateSelect]}
              >
                {states.map((state, index) => (
                  <SelectItem key={state.id} title={state.name} />
                ))}
              </Select>

            {/* 📅 Date Picker */}
            <Datepicker
              date={date}
              onSelect={(nextDate) => setDate(nextDate)}
              placeholder="Race Date"
              style={styles.input}
              min={new Date(1900, 0, 1)}  // ✅ Allows selecting dates from 1900 onward
              max={new Date()} 
            />

            {/* ⏱️ Race Time Input */}
            <Input
              placeholder="Race Time (e.g., 02:15:32)"
              value={raceTime}
              onChangeText={setRaceTime}
              style={styles.input}
            />

            {/* 📝 Notes Input */}
            <Input
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { height: 100 }]}
              multiline
            />

            {/* ✅ Save Button */}
            <Button onPress={handleSaveRace} style={styles.saveButton}>
              Save
            </Button>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#111111',
    padding: 20,
    marginTop: 'auto',
    marginHorizontal: 15,
    borderRadius: 10,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Permanent Marker'
  },
  formContainer: {
    paddingBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  stateSelect: {
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#01C7FE',
    borderColor: '#01C7FE',
    borderRadius: 8,
    fontSize: 16,
  },
});

export default AddRaceModal;

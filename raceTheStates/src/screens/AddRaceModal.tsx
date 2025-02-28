import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Text, Alert, Image } from 'react-native';
import { Button, Input, Select, SelectItem, Datepicker, IndexPath } from '@ui-kitten/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../context/UserContext';

interface State {
  id: number;
  name: string;
}

const DISTANCE_OPTIONS = [
  { label: "5k", value: "5k" },
  { label: "10k", value: "10k" },
  { label: "Half Marathon", value: "half marathon" },
  { label: "Marathon", value: "marathon" },
];

interface AddRaceModalProps {
  visible: boolean;
  onClose: () => void;
  states: State[];
  onRaceAdded: () => void;
}

const AddRaceModal: React.FC<AddRaceModalProps> = ({ visible, onClose, states, onRaceAdded }) => {
  const [selectedStateIndex, setSelectedStateIndex] = useState<IndexPath | undefined>(undefined);
  const [raceName, setRaceName] = useState('');
  const [selectedDistanceIndex, setSelectedDistanceIndex] = useState<IndexPath | undefined>(undefined);
  const [city, setCity] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [raceTime, setRaceTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ uri: string; name: string; type: string }[]>([]);
  const { user } = useUser();

  // 📷 Function to Open Image Picker
  const handlePickImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 3 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.error("Image Picker Error: ", response.errorMessage);
      } else if (response.assets) {
        const images = response.assets.map((asset) => ({
          uri: asset.uri!,
          name: asset.fileName || `image_${Date.now()}.jpg`, // ✅ Fallback for iOS
          type: asset.type || "image/jpeg",
        }));
        setSelectedImages((prevImages) => [...prevImages, ...images]); // ✅ Prevent UI flicker
      }
    });
  };

  // 🏃‍♂️ Function to Handle Form Submission
  const handleSaveRace = async () => {
    if (!raceName.trim()) {
      Alert.alert('Race Name is required.');
      return;
    }
    if (!selectedStateIndex) {
      Alert.alert('State is required.');
      return;
    }
    if (!date)
    {
      Alert.alert('Date is required.');
      return;
    }

    // 📌 Prepare Form Data for Image Upload
    const formData = new FormData();
    formData.append('name', raceName);
    formData.append('city', city);
    formData.append('state', states[selectedStateIndex.row]?.id);
    formData.append('date', date ? date.toISOString().split('T')[0] : "");
    formData.append('time', raceTime || "00:00:00");
    formData.append('notes', notes);
    formData.append('distance', selectedDistanceIndex ? DISTANCE_OPTIONS[selectedDistanceIndex.row]?.value : null);

    selectedImages.forEach((image, index) => {
      formData.append(`image_uploads`, {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    });

    console.log('📌 Sending race data:', formData);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-races/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
        body: formData, // ✅ Use FormData for file uploads
      });

      if (response.ok) {
        Alert.alert('Race added successfully');
        onClose();
        onRaceAdded();
      } else {
        const errorData = await response.json();
        console.log("❌ API Error:", errorData);
        Alert.alert('Error saving race.');
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
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
            <Input placeholder="Race Name *" value={raceName} onChangeText={setRaceName} style={styles.input} />

            { /* Distance Selection */ }
            <Select
              selectedIndex={selectedDistanceIndex}
              onSelect={(index) => setSelectedDistanceIndex(index as IndexPath)}
              placeholder="Select Distance"
              value={
                selectedDistanceIndex ? (
                  <Text style={{ fontWeight: "normal", fontSize: 16, color: "black" }}>
                    {DISTANCE_OPTIONS[selectedDistanceIndex.row]?.label}
                  </Text>
                ) : "Select Distance"
              }
              style={styles.input}
            >
              {DISTANCE_OPTIONS.map((distance) => (
                <SelectItem key={distance.value} title={() => (
                  <Text style={{ fontWeight: "normal", fontSize: 16, color: "black" }}>
                    {distance.label}
                  </Text>
                )} />
              ))}
            </Select>

            { /* City Input */ }
            <Input 
              placeholder="City" 
              value={city} 
              onChangeText={setCity} 
              style={styles.input} 
            />


            { /* State Selection */ }
            <Select
              selectedIndex={selectedStateIndex}
              onSelect={(index) => setTimeout(() => setSelectedStateIndex(index as IndexPath), 0)}
              placeholder="Select a state"
              value={selectedStateIndex ? states[selectedStateIndex.row]?.name : ''}
              style={styles.input}
            >
              {states.map((state) => (
                <SelectItem key={state.id} title={state.name} />
              ))}
            </Select>


            { /* Date Selection */ }
            <Datepicker 
              date={date} 
              onSelect={(nextDate) => setDate(nextDate)} 
              placeholder="Race Date" 
              style={styles.input} 
              min={new Date(1900, 0, 1)} 
            />
            
            { /* Race Time Input */ }
            <Input 
              placeholder="Race Time (e.g., 02:15:32)" 
              value={raceTime} 
              onChangeText={setRaceTime} 
              style={styles.input} 
            />
            
            { /* Notes Input */ }
            <Input placeholder="Notes" 
              value={notes} 
              onChangeText={setNotes} 
              style={[styles.input, { height: 100 }]} 
              multiline />

            {/* Image Picker */}
            <View>
              <Button onPress={handlePickImages} style={styles.imageButton}>
                Select Images
              </Button>

              <View style={styles.imagePreviewContainer}>
                {selectedImages.map((image, index) => (
                  <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
                ))}
              </View>
            </View>

            <Button onPress={handleSaveRace} style={styles.saveButton}>Save</Button>
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
    justifyContent: 'flex-end' 
  },
  modalContainer: { 
    backgroundColor: '#111', 
    padding: 20, 
    marginTop: 'auto', 
    marginHorizontal: 15, 
    borderRadius: 10, 
    height: '100%' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerText: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: 'white', 
    fontFamily: 'Permanent Marker' 
  },
  formContainer: { 
    paddingBottom: 20 
  },
  input: { 
    marginBottom: 15, 

  },
  saveButton: { 
    marginTop: 20, 
    backgroundColor: '#01C7FE', 
    borderRadius: 8, 
    fontSize: 16 
  },
  imageButton: { 
    marginTop: 10, 
    backgroundColor: '#01C7FE', 
  },
  imagePreviewContainer: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  imagePreview: { 
    width: 60, 
    height: 60, 
    marginRight: 5, 
    borderRadius: 5 
  },
});

export default AddRaceModal;

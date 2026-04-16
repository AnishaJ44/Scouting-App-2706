import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  PIT_SCOUTING_FIELD_ORDER,
  buildPitSheetAppendPayload,
  escapeCsvCell,
  submitPitScoutingToSheet,
} from '@/lib/googleSheets';

const extra =
  Constants.expoConfig?.extra ??
  Constants.manifest2?.extra ??
  (Constants.manifest && typeof Constants.manifest === 'object' ? Constants.manifest.extra : null) ??
  {};
const GOOGLE_SCRIPT_URL =
  extra.googleScriptUrl ?? process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL ?? '';
const SPREADSHEET_ID =
  extra.googleSpreadsheetId ?? process.env.EXPO_PUBLIC_GOOGLE_SPREADSHEET_ID ?? '';
const PIT_SHEET_NAME =
  extra.googlePitSheetName ?? process.env.EXPO_PUBLIC_GOOGLE_PIT_SHEET_NAME ?? 'Pit Scouting Data';

const showAlert = (title, message) => {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const CheckboxGroup = ({ options, selectedValues, onToggle }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 8 }}>
    {options.map((option) => {
      const isSelected = selectedValues.includes(option);
      return (
        <TouchableOpacity
          key={option}
          onPress={() => onToggle(option)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 2,
            borderColor: 'purple',
            borderRadius: 8,
            backgroundColor: isSelected ? 'purple' : 'white',
          }}
        >
          <Text style={{ color: isSelected ? 'white' : 'black' }}>{option}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default function PitScreen() {
  const [scoutingData, setScoutingData] = useState({
    teamNumber: 0,
    sizeOfHopper: 0,
    typeOfShooter: 0,
    driveTrain: '',
    possibleClimbs: [],
    possibleShootingLocations: [],
    travel: [],
    intake: [],
    pitNotes: '',
  });

  const [submittedTextCSV, setSubmittedTextCSV] = useState('');
  const [showQRCSV, setShowQRCSV] = useState(false);

  const possibleClimbOptions = ['No Climb', 'Level 1', 'Level 2', 'Level 3'];
  const travelOptions = ['Bump', 'Trench'];
  const intakeOptions = ['Ground', 'Outpost'];
  const shootingOptions = [
    'Against Hub',
    'From Trench',
    'From Corners',
    'Against Tower',
    'Anywhere in alliance zone',
  ];

  const handleMultiSelect = (field, value) => {
    const current = scoutingData[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setScoutingData({ ...scoutingData, [field]: updated });
  };

  const handleSubmit = async () => {
    const timestamp = new Date().toLocaleTimeString('en-CA', {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const dataWithTimestamp = { ...scoutingData, timestamp };

    // Submit to Google Sheet
    const payload = buildPitSheetAppendPayload(
      dataWithTimestamp,
      SPREADSHEET_ID,
      PIT_SHEET_NAME
    );

    const sheetResult = await submitPitScoutingToSheet(GOOGLE_SCRIPT_URL, payload);
    if (sheetResult.ok) {
      showAlert('Sheet', 'Row sent to Google Sheet.');
    } else {
      showAlert('Use QR Code', sheetResult.error);
    }

    // Build CSV for QR code
    const values = PIT_SCOUTING_FIELD_ORDER.map((key) => {
      const value = dataWithTimestamp[key]; // 👈 IMPORTANT
      return escapeCsvCell(Array.isArray(value) ? value.join('|') : value);
    });

    setSubmittedTextCSV(values.join(','));
    setShowQRCSV(true);
};

    const handleClear = () => {
  if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    // Web (Cloudflare)
    const confirmed = window.confirm('Are you sure you want to clear all fields?');
    if (!confirmed) return;
    clearForm();
  } else {
    // Native (Android/iOS)
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearForm },
      ]
    );
  }
};

const clearForm = () => {
  setScoutingData({
    teamNumber: 0,
    sizeOfHopper: 0,
    typeOfShooter: 0,
    driveTrain: '',
    possibleClimbs: [],
    possibleShootingLocations: [],
    travel: [],
    intake: [],
    pitNotes: '',
  });
  setSubmittedText('');
  setSubmittedTextCSV('');
  setShowQRCSV(false);
};

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: '#663399' }}
      headerHeight={300}
      headerImage={
        <Image
          source={require('../images/mergelogo.jpg')}
          style={{ width: '100%', aspectRatio: 1.5, resizeMode: 'contain' }}
        />
      }
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.title}>Pit-scouting</ThemedText>

          <ThemedText style={styles.label}>Team Number:</ThemedText>
          <TextInput
            keyboardType="numeric"
            value={scoutingData.teamNumber.toString()}
            onChangeText={(input) =>
              setScoutingData({ ...scoutingData, teamNumber: parseInt(input) || 0 })
            }
            style={styles.input}
          />

          <ThemedText style={styles.label}>Size of Hopper (# of fuel it can hold):</ThemedText>
          <TextInput
            keyboardType="numeric"
            value={scoutingData.sizeOfHopper.toString()}
            onChangeText={(input) =>
              setScoutingData({ ...scoutingData, sizeOfHopper: parseInt(input) || 0 })
            }
            style={styles.input}
          />

          <ThemedText style={styles.label}>Type of Shooter (1 for single, 2 for dual, etc.):</ThemedText>
          <TextInput
            keyboardType="numeric"
            value={scoutingData.typeOfShooter.toString()}
            onChangeText={(input) =>
              setScoutingData({ ...scoutingData, typeOfShooter: parseInt(input) || 0 })
            }
            style={styles.input}
          />

          <ThemedText style={styles.label}>Drivetrain:</ThemedText>
          <TextInput
            placeholder="e.g. Swerve, Tank"
            value={scoutingData.driveTrain}
            onChangeText={(input) => setScoutingData({ ...scoutingData, driveTrain: input })}
            style={styles.input}
          />

          <ThemedText style={styles.label}>Climb:</ThemedText>
          <CheckboxGroup
            options={possibleClimbOptions}
            selectedValues={scoutingData.possibleClimbs}
            onToggle={(option) => handleMultiSelect('possibleClimbs', option)}
          />

          <ThemedText style={styles.label}>Shooting Locations:</ThemedText>
          <CheckboxGroup
            options={shootingOptions}
            selectedValues={scoutingData.possibleShootingLocations}
            onToggle={(option) => handleMultiSelect('possibleShootingLocations', option)}
          />

          <ThemedText style={styles.label}>Travel:</ThemedText>
          <CheckboxGroup
            options={travelOptions}
            selectedValues={scoutingData.travel}
            onToggle={(option) => handleMultiSelect('travel', option)}
          />

          <ThemedText style={styles.label}>Intake:</ThemedText>
          <CheckboxGroup
            options={intakeOptions}
            selectedValues={scoutingData.intake}
            onToggle={(option) => handleMultiSelect('intake', option)}
          />

          <ThemedText style={styles.label}>Notes:</ThemedText>
          <TextInput
            value={scoutingData.pitNotes}
            onChangeText={(input) => setScoutingData({ ...scoutingData, pitNotes: input })}
            style={styles.input}
          />

          <Button title="Submit" color="purple" onPress={handleSubmit} />

          {showQRCSV && submittedTextCSV !== '' && (
            <View style={styles.qrContainer}>
              <ThemedText style={{ color: '#000', marginBottom: 10 }}>Scan to Export CSV</ThemedText>
              <QRCode value={submittedTextCSV} size={300} />
            </View>
          )}

          <Text style={{ marginTop: 20, color: '#000' }}>{submittedTextCSV}</Text>

          <Button title="Clear" color="purple" onPress={handleClear} />

        </ThemedView>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: { padding: 20, gap: 12, backgroundColor: '#fff' },
  input: {
    height: 50,
    borderColor: 'purple',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  label: { fontWeight: 'bold', color: '#000', marginTop: 10 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 20,
    color: '#000',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
  },
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Switch, Text, TextInput } from 'react-native';

export default function ScoutScreen() {
  const [team, setTeam] = useState('');
  const [match, setMatch] = useState('');
  const [autoPoints, setAutoPoints] = useState('');
  const [teleopPoints, setTeleopPoints] = useState('');
  const [notes, setNotes] = useState('');

  const router = useRouter();

  async function saveMatch() {
    if (!team || !match) {
      Alert.alert('Missing info', 'Please enter Team # and Match #');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      team: team.trim(),
      match: match.trim(),
      autoPoints: Number(autoPoints) || 0,
      teleopPoints: Number(teleopPoints) || 0,
      notes: notes.trim(),
      time: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem('scoutData');
      const data = existing ? JSON.parse(existing) : [];
      data.push(newEntry);
      await AsyncStorage.setItem('scoutData', JSON.stringify(data));

      Alert.alert('Saved!', 'Match data saved locally.');

      // clear form
      setTeam('');
      setMatch('');
      setAutoPoints('');
      setTeleopPoints('');
      setNotes('');

      // optional: go back to home
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save data.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scout a Match</Text>

      <TextInput
        style={styles.input}
        placeholder="Team #"
        value={team}
        onChangeText={setTeam}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Match #"
        value={match}
        onChangeText={setMatch}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Auto Points"
        value={autoPoints}
        onChangeText={setAutoPoints}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Teleop Points"
        value={teleopPoints}
        onChangeText={setTeleopPoints}
        keyboardType="number-pad"
      />

      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Notes (defense, fouls, reliability, etc.)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button title="Save Match" onPress={saveMatch} />
      <Switch title="yes/no"/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  notes: {
    height: 80,
    textAlignVertical: 'top',
  },
});

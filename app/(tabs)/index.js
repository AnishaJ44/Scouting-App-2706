import { Image } from 'expo-image';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';



export default function HomeScreen() { //function runs everytime something changes
  //stores all the data from the intro screen
  const [introData, setIntroData] = useState({
    nameOfScout: '',
    matchNumber: 0,
    teamNumber: 0,
    startLocation: '',
    intakeLocations: []
  });

  const yesNo = ['yes', 'no']
  const climbOptions = ['Level 1', 'Level 2', 'Level 3', 'Did not attempt climb', 'Attempted climb but failed']
  const intakeLocations = ['Outpost', 'Depot', 'Neutral']
  const startLocationOptions = ['At Hub', 'Depot Side Trench', 'Outpost Side Trench', 'Depot Side Bump', 'Outpost Side Bump'];
  const [submittedText, setSubmittedText] = useState(''); // final data set
  const [submittedTextCSV, setSubmittedTextCSV] = useState('');
  const [showQRCSV, setShowQRCSV] = useState(false);

  // Add this above your HomeScreen function
const RadioGroup = ({ options, selected, onSelect }) => (
  <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8, flexWrap: 'wrap' }}>
    {options.map((option) => (
      <TouchableOpacity
        key={option}
        onPress={() => onSelect(option)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <View style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: 'purple',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {selected === option && (
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: 'purple',
            }} />
          )}
        </View>
        <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
      </TouchableOpacity>
    ))}
  </View>
);

const toggleIntakeLocation = (option) => {
  const current = introData.intakeLocations;
  const updated = current.includes(option)
    ? current.filter(item => item !== option)  // remove if already selected
    : [...current, option];                     // add if not selected
  setIntroData({ ...introData, intakeLocations: updated });
};

  const handleSubmit = () => {

    setSubmittedText(JSON.stringify(introData));

    // takes out all the values from introData and joins them with commas to create a csv string
    const values = Object.values(introData);
    const csv = values.join(","); // converts introData to csv format, for example: "John Doe,1,1234,Left"

    setSubmittedTextCSV(csv); // sets the csv string to submittedTextCSV, which is used to generate the QR code

    setShowQRCSV(true); // shows the QR code, which is hidden by default, after the submit button is pressed
  };
  


  return (
    <ParallaxScrollView
      title={<ThemedText type="title">Merge Scouting</ThemedText>}

      headerImage={<Image
        source={require('../images/mergelogo.jpg')}
        style={{ width: 500, height: 500 }}
      />}
      headerBackgroundColor={{
          dark: '#c700f4',
    }}>
    
      <ThemedView style={styles.stepContainer}>
        
        <ThemedText style={{ color: '#000' }}>Welcome to Merge Scouting!</ThemedText>
        <ThemedText style={{ color: '#000' }}>Name of Scout:</ThemedText>
        <TextInput value={introData.nameOfScout} 
                  onChangeText={(input) =>
                  setIntroData({ ...introData, nameOfScout: input })
  }
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        <ThemedText style={{ color: '#000' }}>Match Number:</ThemedText>
        <TextInput value={introData.matchNumber} 
                  // changes string input to int, if input is empty or not a number, sets matchNumber to 0
                  onChangeText={(input) =>
                  setIntroData({ ...introData, matchNumber: parseInt(input) || 0 }) 
  }
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        <ThemedText style={{ color: '#000' }}>Team Number:</ThemedText>
        <TextInput value={introData.teamNumber} 
                  onChangeText={(input) =>
                  setIntroData({ ...introData, teamNumber: parseInt(input) || 0 })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />

        <Image source={require('../images/frc2026rebuiltmap.png')} style={{ width: 1000, height: 500 }}></Image>
        
      </ThemedView>

        {showQRCSV && (
          <View style={styles.qrContainer}>
            <ThemedText style={{color: '#000', marginBottom: 10}}>Scan for Drive Coach:</ThemedText>
            <QRCode 
              value={submittedTextCSV}
              size={400}
              color="black"
              backgroundColor="white"
            />
          </View>)}

      {/* Auto Inputs */}

      <ThemedView style={styles.stepContainer}>
        <ThemedText style={{ color: '#000' }}>Auto !</ThemedText>
        <ThemedText style={{ color: '#000' }}>Start Location:</ThemedText>
        <RadioGroup
          options={startLocationOptions}
          selected={introData.startLocation}
          onSelect={(option) => setIntroData({ ...introData, startLocation: option })}
        />

        <ThemedText style={{ color: '#000' }}>Did they move during Auto?</ThemedText>
        <RadioGroup
          options={yesNo}
          selected={introData.autoMortality}
          onSelect={(option) => setIntroData({ ...introData, autoMortality: option })}
        />

        <ThemedText style={{ color: '#000' }}>Shooting Location:</ThemedText>
        <TextInput value={introData.shootingLocation} 
                  placeholder = "example: Against Hub, From Trench, Outpost, Depot, etc."
                  onChangeText={(input) =>
                  setIntroData({ ...introData, shootingLocation: input || "" })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />

        <ThemedText style={{ color: '#000' }}>Did they go under the trench</ThemedText>
        <RadioGroup
          options={yesNo}
          selected={introData.underTrench}
          onSelect={(option) => setIntroData({ ...introData, underTrench: option })}
        />

        <ThemedText style={{ color: '#000' }}>Did they go over the bump</ThemedText>
        <RadioGroup
          options={yesNo}
          selected={introData.overBump}
          onSelect={(option) => setIntroData({ ...introData, overBump: option })}
        />

        <ThemedText style={{ color: '#000' }}>What level of climb did they complete</ThemedText>
        <RadioGroup
          options={climbOptions}
          selected={introData.climbOptions}
          onSelect={(option) => setIntroData({ ...introData, climbOptions: option })}
        />

        <ThemedText style={{ color: '#000' }}>Intake Locations:</ThemedText>
        <View style={{ marginVertical: 8 }}>
          {intakeLocations.map((option) => {
            const isChecked = introData.intakeLocations.includes(option);
            return (
              <TouchableOpacity
                key={option}
                onPress={() => toggleIntakeLocation(option)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}
              >
                {/* Checkbox box */}
                <View style={{
                  width: 22,
                  height: 22,
                  borderWidth: 2,
                  borderColor: 'purple',
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isChecked ? 'purple' : 'white',
                }}>
                  {/* Checkmark - only shows when selected */}
                  {isChecked && (
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                  )}
                </View>
                <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText style={{ color: '#000' }}>Auto Path:</ThemedText>
        <TextInput value={introData.autoPath} 
                  placeholder = "Describe the general auto path"
                  onChangeText={(input) =>
                  setIntroData({ ...introData, autoPath: input || "" })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />

        <ThemedText style={{ color: '#000' }}>Auto Notes:</ThemedText>
        <TextInput value={introData.autoNotes} 
                  placeholder = "Any auto notes. Did they actually score anything, or fuel feeder, etc."
                  onChangeText={(input) =>
                  setIntroData({ ...introData, autoNotes: input || "" })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />

      </ThemedView>

          <Button title="Submit" onPress={handleSubmit} />
        {/* prints submittedText */}
        <Text style={{ marginTop: 20, color: '#000' }}>You submitted: {submittedText} </Text>

      <Link href="/scout">
  <ThemedText type="subtitle">Scout Screen</ThemedText>
</Link>


    </ParallaxScrollView>
  );
}



const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 100,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});






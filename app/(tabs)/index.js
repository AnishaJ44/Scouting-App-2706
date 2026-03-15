import { Image } from 'expo-image';
import { StyleSheet, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Buffer } from 'buffer';



export default function HomeScreen() { //function runs everytime something changes
  //stores all the data from the intro screen
  const [introData, setIntroData] = useState({
    nameOfScout: '',
    matchNumber: 0,
    teamNumber: 0,
    startLocation: '',
  });


  const [submittedText, setSubmittedText] = useState(''); // final data set
  const [submittedTextCSV, setSubmittedTextCSV] = useState('');
  const [showQRCSV, setShowQRCSV] = useState(false);

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
         <ThemedText style={{ color: '#000' }}>Start Location:</ThemedText>
        <TextInput value={introData.startLocation} 
                  onChangeText={(input) =>
                  setIntroData({ ...introData, startLocation: input })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        
        <Button title="Submit" onPress={handleSubmit} />
        {/* prints submittedText */}
        <Text style={{ marginTop: 20, color: '#000' }}>You submitted: {submittedText} </Text>
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

      <ThemedView style={styles.stepContainer}>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
      </ThemedView>
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






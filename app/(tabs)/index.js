import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput } from 'react-native';


import { useState } from 'react';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Link } from 'expo-router';
import { Text } from 'react-native';



export default function HomeScreen() { //function runs everytime something changes
  //stores all the data from the intro screen
  const [introData, setIntroData] = useState({
    nameOfScout: '',
    matchNumber: 0,
    teamNumber: 0,
    startLocation: '',
  });


  const [submittedText, setSubmittedText] = useState(''); // final data set


  const handleSubmit = () => {
    // sets submittedText to all the strings entered by the scout, for now just the name of the scout
    setSubmittedText(JSON.stringify(introData));
  }

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
});




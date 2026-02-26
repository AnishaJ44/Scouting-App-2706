import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

//import MergeLogo from './TestingApp/app/images/mergelogo.jpg'; 


export default function HomeScreen() {
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
        <TextInput style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        <ThemedText style={{ color: '#000' }}>Match Number:</ThemedText>
        <TextInput style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        <ThemedText style={{ color: '#000' }}>Team Number:</ThemedText>
        <TextInput style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />
        <Image source={require('../images/frc2026rebuiltmap.png')} style={{ width: 1000, height: 500 }}></Image>
         <ThemedText style={{ color: '#000' }}>Start Location:</ThemedText>
        <TextInput style={{ height: 50, borderColor: 'purple', borderWidth: 5,}} />

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




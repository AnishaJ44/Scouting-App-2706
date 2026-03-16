import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';




export default function HomeScreen() { //function runs everytime something changes
  //stores all the data from the intro screen
  const [scoutingData, setScoutingData] = useState({
    nameOfScout: '',
    matchNumber: 0,
    teamNumber: 0,
    sizeOfHoppper: 0,
    typeOfShooter: 0,
    possibleClimbs: [],
    travel: [],
    intake: [],
    pitNotes: '',
    actualClimb: '',
    typeOfRobot: [],
    endNotes: '',
    startLocation: '',
    intakeLocations: []
  });

  const possibleClimbOptions = ['No Climb', 'Level 1', 'Level 2', 'Level 3'];
  const travelOptions = ['Bump', 'Trench'];
  const intakeOptions = ['Ground', 'Outpost'];
  const finalClimbOptions = ['No Climb', 'Level 1', 'Level 2', 'Level 3'];
  const typeOfRobotOptions = ['Defense', 'Shooter', 'Feeder'];
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

    setSubmittedText(JSON.stringify(scoutingData));

    // takes out all the values from scoutingData and joins them with commas to create a csv string
    const values = Object.values(scoutingData);
    const csv = values.join(","); // converts scoutingData to csv format, for example: "John Doe,1,1234,Left"

    setSubmittedTextCSV(csv); // sets the csv string to submittedTextCSV, which is used to generate the QR code

    setShowQRCSV(true); // shows the QR code, which is hidden by default, after the submit button is pressed
  };
  


  return (
    
   <ParallaxScrollView
   
  headerBackgroundColor={{ dark: '#663399' }}
  headerHeight={300} // controls the scrollable header height
  headerImage={
    <Image
      source={require('../images/mergelogo.jpg')}
      style={{
        width: '100%',           // full width of the screen
        aspectRatio: 1.5,        // adjust to your image's width/height ratio
        resizeMode: 'contain',   // keeps entire image visible
      }}
    />
  }
>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>

      <ThemedView style={styles.stepContainer}>
        
        <ThemedText style={{ color: '#000' }}>Name of Scout:</ThemedText>
        <TextInput value={scoutingData.nameOfScout} 
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, nameOfScout: input })
  }
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />
        
        <ThemedText style={{ color: '#000' }}>Match Number:</ThemedText>
        <TextInput value={scoutingData.matchNumber} 
                  // changes string input to int, if input is empty or not a number, sets matchNumber to 0
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, matchNumber: parseInt(input) || 0 }) 
  }
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />
        <ThemedText style={{ color: '#000' }}>Team Number:</ThemedText>
        <TextInput value={scoutingData.teamNumber} 
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, teamNumber: parseInt(input) || 0 })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />

        <Image source={require('../images/frc2026rebuiltmap.png')} style={{ width: '100%', height: 200, resizeMode: 'contain' }}></Image>
         
        
        
        <ThemedText style={styles.titleContainer}>Pit Scouting</ThemedText>
        
        <ThemedText style={{ color: '#000' }}>Size of Hopper (# of fuel):</ThemedText>
        <TextInput value={scoutingData.sizeOfHopper} 
                  // changes string input to int, if input is empty or not a number, sets matchNumber to 0
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, sizeOfHopper: parseInt(input) || 0 })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />
        
        <ThemedText style={{ color: '#000' }}>Type of Shooter (1 for single, 2 for dual, 3 for triple):</ThemedText>
        <TextInput value={scoutingData.typeOfShooter} 
                  // changes string input to int, if input is empty or not a number, sets matchNumber to 0
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, typeOfShooter: parseInt(input) || 0 })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />

          <ThemedText style={{ color: '#000' }}>Climb (Multi-select):</ThemedText>

              <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
                  {possibleClimbOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        const selected = scoutingData.possibleClimbs;

                        if (selected.includes(option)) {
                          setScoutingData({
                            ...scoutingData,
                            possibleClimbs: selected.filter((item) => item !== option),
                          });
                        } else {
                          setScoutingData({
                            ...scoutingData,
                            possibleClimbs: [...selected, option],
                          });
                        }
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {/* Outer circle */}
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderWidth: 2,
                          borderColor: 'purple',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Filled circle if selected */}
                        {scoutingData.possibleClimbs.includes(option) && (
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              backgroundColor: 'purple',
                            }}
                          />
                        )}
                      </View>

                      <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>


          <ThemedText style={{ color: '#000' }}>Travel (Multi-Select):</ThemedText>

          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
                  {travelOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        const selected = scoutingData.travel;

                        if (selected.includes(option)) {
                          setScoutingData({
                            ...scoutingData,
                            travel: selected.filter((item) => item !== option),
                          });
                        } else {
                          setScoutingData({
                            ...scoutingData,
                            travel: [...selected, option],
                          });
                        }
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {/* Outer circle */}
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderWidth: 2,
                          borderColor: 'purple',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Filled circle if selected */}
                        {scoutingData.travel.includes(option) && (
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              backgroundColor: 'purple',
                            }}
                          />
                        )}
                      </View>

                      <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>


              <ThemedText style={{ color: '#000' }}>Intake (Multi-Select):</ThemedText>

                <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
                  {intakeOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        const selected = scoutingData.intake;

                        if (selected.includes(option)) {
                          setScoutingData({
                            ...scoutingData,
                            intake: selected.filter((item) => item !== option),
                          });
                        } else {
                          setScoutingData({
                            ...scoutingData,
                            intake: [...selected, option],
                          });
                        }
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {/* Outer circle */}
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderWidth: 2,
                          borderColor: 'purple',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Filled circle if selected */}
                        {scoutingData.intake.includes(option) && (
                          <View
                            style={{
                              width: 14,
                              height: 14,
                              backgroundColor: 'purple',
                            }}
                          />
                        )}
                      </View>

                      <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>


        <ThemedText style={{ color: '#000' }}>Notes:</ThemedText>
                <TextInput value={scoutingData.pitNotes} 
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, pitNotes: input })
                  } 
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />

        
        <ThemedText style={styles.titleContainer}>End Game</ThemedText>
        
        <ThemedText style={{ color: '#000' }}>Final Climb:</ThemedText>

       <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
        {finalClimbOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => {
              // toggle selection: select if different, deselect if same
              setScoutingData({
                ...scoutingData,
                actualClimb: scoutingData.actualClimb === option ? '' : option,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* Outer circle */}
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: 'purple',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Filled circle if selected */}
              {scoutingData.actualClimb === option && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'purple',
                  }}
                />
              )}
            </View>

            <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

       <ThemedText style={{ color: '#000' }}>Type of Robot (Multi-Select):</ThemedText>

               <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
  {typeOfRobotOptions.map((option) => (
    <TouchableOpacity
      key={option}
      onPress={() => {
        const selected = scoutingData.typeOfRobot;

        if (selected.includes(option)) {
          setScoutingData({
            ...scoutingData,
            typeOfRobot: selected.filter((item) => item !== option),
          });
        } else {
          setScoutingData({
            ...scoutingData,
            typeOfRobot: [...selected, option],
          });
        }
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {/* Outer square */}
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 2,
          borderColor: 'purple',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Filled square if selected */}
        {scoutingData.typeOfRobot.includes(option) && (
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: 'purple',
            }}
          />
        )}
      </View>

      <ThemedText style={{ color: '#000' }}>{option}</ThemedText>
    </TouchableOpacity>
  ))}
</View>

      <ThemedText style={{ color: '#000' }}>Notes:</ThemedText>
                <TextInput value={scoutingData.endNotes} 
                  onChangeText={(input) =>
                  setScoutingData({ ...scoutingData, endNotes: input })
                  } 
                  style={{ height: 50, borderColor: 'purple', borderWidth: 2}} />



        <Button title="Submit" onPress={handleSubmit} />
        {/* prints submittedText */}
        <Text style={{ marginTop: 20, color: '#000' }}>You submitted: {submittedText} </Text>
                  setIntroData({ ...introData, teamNumber: parseInt(input) || 0 })}
                  style={{ height: 50, borderColor: 'purple', borderWidth: 5}} />

        <Image source={require('../images/frc2026rebuiltmap.png')} style={{ width: 1000, height: 500 }}></Image>
        
      </ThemedView>

        {showQRCSV && (
          <View style={styles.qrContainer}>
            <QRCode 
              value={submittedTextCSV}
              size={200}
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

    </SafeAreaView>
    </ParallaxScrollView>
  );
}



const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
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
    backgroundColor: '#ffffff',
  }
});






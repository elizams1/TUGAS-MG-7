import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();    
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/AW.mp3')
    );
    setSound(sound);

    console.log('Play Sound');  
    await sound.playAsync();
  };

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    alert(`${data}`);
    playSound();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.theText}>
        <Text style={styles.text}>Scan QR Code</Text>
        <Text style={styles.text2}>Letakkan QR Code dengan jelas</Text>
      </View>
      
      <View style={styles.theCamera}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: 500, height: 300 }}  
          />
      </View>
      <View>
        {scanned && 
        <Pressable 
        onPress={() => setScanned(false)} 
        style={styles.button}
        >
          <Text style={styles.text}>Scan Kembali</Text>
        </Pressable>
        }
      </View>
        

        
  
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    
    alignItems: "center",
  },
  theText:{
    paddingHorizontal: 85,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#74BDCB",
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  text:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  text2:{
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  theCamera:{
    marginBottom: 20,
  },
  button: {
    alignSelf: "center",
    paddingHorizontal: 85,
    paddingVertical: 10,
    backgroundColor: "#74BDCB",
    borderRadius: 20,
  }

});

import { useState } from "react";
import { Text, View, Button, StyleSheet, ScrollView, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [csvContent, setCsvContent] = useState("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is required to scan QR codes.</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const path = Platform.OS !== 'web' ? FileSystem.documentDirectory + 'scanned_data.csv' : null;

  async function writeCSV(data) {
    const row = data + '\n';
    // This is the most important line for your Windows export
    setCsvContent(prev => prev + row); 
    
    if (Platform.OS !== 'web') {
      // Mobile-only local file saving...
      await FileSystem.writeAsStringAsync(path, csvContent + row, { encoding: 'utf8' });
    }
  }

  async function readCSV() {
    if (Platform.OS === 'web') return;
    const content = await FileSystem.readAsStringAsync(path, { encoding: 'utf8' });
    setCsvContent(content);
  }

  async function exportCSV() {
    // Force Web logic if we're in a browser (Windows/Mac)
    if (Platform.OS === 'web' || typeof document !== 'undefined') {
      if (!csvContent) {
        alert("No data to export yet.");
        return;
      }

      try {
        // UTF-8 BOM helps Windows Excel open the file correctly
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create a temporary "download link"
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // This 'download' attribute is what stops that "Share Link" popup
        link.setAttribute('download', 'scanned_data.csv');
        
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to start download
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
      } catch (e) {
        console.error("Export failed:", e);
        alert("Download failed. Check browser permissions.");
        return;
      }
    }

    // This part only runs on native iOS/Android apps
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (!fileInfo.exists) {
      alert("No data to export yet.");
      return;
    }
    await Sharing.shareAsync(path);
  }


  async function clearCSV() {
    if (Platform.OS === 'web') {
      setCsvContent("");
      setScannedData("");
      return;
    }
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (fileInfo.exists) {
      await FileSystem.writeAsStringAsync(path, "", { encoding: "utf8" });
    }
    setCsvContent("");
    setScannedData("");
  }

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    console.log("SCANNED:", data);
    setScannedData(data);
    writeCSV(data);
    readCSV();
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.text}>Scanned Data:</Text>
        <Text style={styles.data}>{scannedData}</Text>
        <Text style={styles.data}>{csvContent}</Text>

        {scanned && (
          <Button
            title="Scan Again"
            onPress={() => {
              setScanned(false);
              setScannedData("");
            }}
          />
        )}

        <Button title="Export CSV" onPress={exportCSV} />
        <Button title="Clear CSV" onPress={clearCSV} color="red" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 3 },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: { fontSize: 20, marginBottom: 10, color: '#ffffff' },
  data: { fontSize: 16, marginBottom: 20, color: '#ffffff' },
});
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';

// TODO: replace with your API Gateway invoke URL
const API_URL = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/analyze-food';

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [step, setStep] = useState('camera'); // camera | uploading | result
  const [result, setResult] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Personal Food Log needs camera access.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    setPreviewUri(resized.uri);
    setStep('uploading');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: resized.base64 }),
      });
      const json = await response.json();
      setResult(json);
    } catch (error) {
      setResult({ error: error.message || 'Upload failed' });
    } finally {
      setStep('result');
    }
  };

  const reset = () => {
    setResult(null);
    setPreviewUri(null);
    setStep('camera');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {step === 'camera' && (
        <>
          <Camera ref={cameraRef} style={styles.camera} type={CameraType.back} />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>Snap & Analyze</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'uploading' && (
        <View style={styles.center}>
          {previewUri && <Image source={{ uri: previewUri }} style={styles.preview} />}
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.infoText}>Uploading to AWS and analyzing...</Text>
        </View>
      )}

      {step === 'result' && (
        <View style={styles.center}>
          {previewUri && <Image source={{ uri: previewUri }} style={styles.preview} />}
          {result?.error ? (
            <Text style={styles.errorText}>{result.error}</Text>
          ) : (
            <>
              <Text style={styles.resultTitle}>{result?.food || 'Unknown food'}</Text>
              <Text>Ingredients: {result?.ingredients?.join(', ') || 'n/a'}</Text>
              <Text>Calories: {result?.calories ?? 'n/a'}</Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Analyze Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  captureButton: { padding: 18, alignItems: 'center', backgroundColor: '#007AFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  button: { marginTop: 16, backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  permissionText: { fontSize: 16, textAlign: 'center' },
  preview: { width: 220, height: 220, marginBottom: 16, borderRadius: 12 },
  infoText: { marginTop: 12, textAlign: 'center' },
  errorText: { color: 'red', fontWeight: '600', marginBottom: 12 },
  resultTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});

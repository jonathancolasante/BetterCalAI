import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type CameraViewRef,
} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';

type Step = 'camera' | 'uploading' | 'result';

type FoodResponse = {
  food?: string;
  ingredients?: string[];
  calories?: number;
  error?: string;
};

// TODO: replace with your API Gateway invoke URL
const API_URL =
  'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/analyze-food';

const App: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('camera');
  const [result, setResult] = useState<FoodResponse | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraViewRef | null>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Personal Food Log needs camera access.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }

    try {
      const photo = await camera.takePicture({
        base64: true,
        quality: 0.7,
      });
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!resized.base64) {
        throw new Error('Failed to encode image');
      }

      setPreviewUri(resized.uri);
      setStep('uploading');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: resized.base64 }),
      });

      const data = (await response.json()) as FoodResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setResult({ error: message });
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
          <CameraView
            ref={(ref) => {
              cameraRef.current = ref as CameraViewRef | null;
            }}
            style={styles.camera}
            facing="back"
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>Snap & Analyze</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'uploading' && (
        <View style={styles.center}>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          )}
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.infoText}>Uploading to AWS and analyzing...</Text>
        </View>
      )}

      {step === 'result' && (
        <View style={styles.center}>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          )}
          {result?.error ? (
            <Text style={styles.errorText}>{result.error}</Text>
          ) : (
            <>
              <Text style={styles.resultTitle}>
                {result?.food || 'Unknown food'}
              </Text>
              <Text>
                Ingredients: {result?.ingredients?.join(', ') || 'n/a'}
              </Text>
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  captureButton: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  permissionText: { fontSize: 16, textAlign: 'center' },
  preview: { width: 220, height: 220, marginBottom: 16, borderRadius: 12 },
  infoText: { marginTop: 12, textAlign: 'center' },
  errorText: { color: 'red', fontWeight: '600', marginBottom: 12 },
  resultTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});

export default App;

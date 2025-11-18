import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImageManipulator from 'expo-image-manipulator';

interface CameraScreenProps {
  onCapture: (image: string) => void;
  onBack: () => void;
}

export function CameraScreen({ onCapture, onBack }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#10b981" />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need access to your camera to take photos of your meals
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <LinearGradient
            colors={['#10b981', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo?.uri) {
        // Resize image and get base64 for AWS upload
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        // Pass both uri (for display) and base64 (for AWS) - we'll encode as JSON
        onCapture(JSON.stringify({ 
          uri: manipResult.uri, 
          base64: manipResult.base64 
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.topButton}>
            <View style={styles.topButtonCircle}>
              <Ionicons name="close" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanFrame}>
          {/* Corner Guides */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        {/* Tip */}
        <View style={styles.tipContainer}>
          <View style={styles.tipBadge}>
            <Ionicons name="flash" size={16} color="#fbbf24" />
            <Text style={styles.tipText}>Center your food in the frame</Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={toggleCameraFacing}
              style={styles.controlButton}
            >
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner}>
                <LinearGradient
                  colors={['#10b981', '#3b82f6']}
                  style={styles.captureButtonGradient}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePicture}
              style={styles.controlButton}
            >
              <Ionicons name="images" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.captureHint}>
            Tap to capture or select from gallery
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  
  // Permission Screen
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: { marginTop: 16 },
  backButtonText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 48,
  },
  topButton: { padding: 4 },
  topButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // Scan Frame
  scanFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: 300,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    borderRadius: 24,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#10b981',
    borderTopLeftRadius: 24,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#10b981',
    borderTopRightRadius: 24,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#10b981',
    borderBottomLeftRadius: 24,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#10b981',
    borderBottomRightRadius: 24,
  },

  // Tip
  tipContainer: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tipText: {
    color: 'white',
    fontSize: 14,
  },

  // Controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    flex: 1,
  },
  captureHint: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
});


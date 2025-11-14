import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProcessingScreenProps {
  image: string;
  onComplete: () => void;
}

export function ProcessingScreen({ image, onComplete }: ProcessingScreenProps) {
  const [step, setStep] = useState(0);
  const pulseAnim = new Animated.Value(1);

  const steps = [
    { label: 'Analyzing image...', icon: 'sparkles', color: '#9333ea' },
    { label: 'Identifying ingredients...', icon: 'flash', color: '#fbbf24' },
    { label: 'Calculating nutrition...', icon: 'checkmark-circle', color: '#10b981' }
  ];

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Step progression
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          setTimeout(() => onComplete(), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <LinearGradient
      colors={['#faf5ff', '#ffffff', '#eff6ff']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Image Preview */}
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Image source={{ uri: image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(147, 51, 234, 0.2)', 'rgba(59, 130, 246, 0.2)']}
            style={styles.imageOverlay}
          />
        </Animated.View>

        {/* Processing Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((stepItem, index) => {
            const isActive = index === step;
            const isComplete = index < step;

            return (
              <View key={stepItem.label} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIcon,
                    isComplete && styles.stepIconComplete,
                    isActive && { backgroundColor: stepItem.color },
                  ]}
                >
                  <Ionicons
                    name={isComplete ? 'checkmark-circle' : stepItem.icon as any}
                    size={24}
                    color={isComplete || isActive ? 'white' : '#9ca3af'}
                  />
                </View>
                <View style={styles.stepTextContainer}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                    ]}
                  >
                    {stepItem.label}
                  </Text>
                  {isActive && (
                    <View style={styles.progressBar}>
                      <Animated.View style={[styles.progressFill, { width: '100%' }]} />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by AI • Usually takes 3-5 seconds
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 64,
  },
  
  // Image
  imageContainer: {
    width: 256,
    height: 256,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Steps
  stepsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconComplete: {
    backgroundColor: '#10b981',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  stepLabelActive: {
    color: '#111827',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },

  // Footer
  footer: {
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});


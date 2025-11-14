import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const features = [
    {
      icon: 'camera' as const,
      title: 'Snap & Track',
      description: 'Simply take a photo of your meal and let AI do the rest',
      color: '#059669'
    },
    {
      icon: 'sparkles' as const,
      title: 'Smart Recognition',
      description: 'Advanced AI identifies ingredients and calculates nutrition',
      color: '#9333ea'
    },
    {
      icon: 'trending-up' as const,
      title: 'Track Progress',
      description: 'Monitor your calorie intake and reach your health goals',
      color: '#2563eb'
    }
  ];

  return (
    <LinearGradient
      colors={['#f0fdf4', '#eff6ff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>
          <View style={styles.logoSection}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
              style={styles.logoContainer}
            >
              <Ionicons name="camera" size={48} color="white" />
            </LinearGradient>
            <Text style={styles.appName}>FoodLens</Text>
            <Text style={styles.tagline}>Your AI-Powered Nutrition Companion</Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onComplete} activeOpacity={0.8}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 32, paddingTop: 64 },
  mainContent: { flex: 1, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 48 },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#4b5563',
  },
  featuresContainer: { gap: 32, marginBottom: 48 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  buttonContainer: { paddingBottom: 32 },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


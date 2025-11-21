import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileSetupScreenProps {
  onComplete: (profileData: ProfileData) => void;
}

export interface ProfileData {
  height: number;
  weight: number;
  sex: 'male' | 'female' | 'other';
  goal: 'lose' | 'maintain' | 'gain';
}

type Sex = 'male' | 'female' | 'other' | null;
type Goal = 'lose' | 'maintain' | 'gain' | null;

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [height, setHeight] = useState('175'); // Default value
  const [weight, setWeight] = useState('70'); // Default value
  const [sex, setSex] = useState<Sex>(null);
  const [goal, setGoal] = useState<Goal>(null);
  const [step, setStep] = useState(2); // Skip step 1

  const sexOptions = [
    { value: 'male' as const, label: 'Male', icon: 'male', color: '#3b82f6' },
    { value: 'female' as const, label: 'Female', icon: 'female', color: '#ec4899' },
    { value: 'other' as const, label: 'Other', icon: 'person', color: '#8b5cf6' },
  ];

  const goalOptions = [
    { value: 'lose' as const, label: 'Lose Weight', icon: 'trending-down', color: '#ef4444', description: 'Create a calorie deficit' },
    { value: 'maintain' as const, label: 'Maintain', icon: 'remove', color: '#10b981', description: 'Stay at current weight' },
    { value: 'gain' as const, label: 'Gain Weight', icon: 'trending-up', color: '#3b82f6', description: 'Build muscle mass' },
  ];

  const handleContinue = () => {
    if (step === 1) {
      if (!height || !weight) {
        Alert.alert('Error', 'Please enter your height and weight');
        return;
      }
      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);
      if (heightNum <= 0 || heightNum > 300 || weightNum <= 0 || weightNum > 500) {
        Alert.alert('Error', 'Please enter valid measurements');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!sex) {
        Alert.alert('Error', 'Please select your sex');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!goal || !sex) {
        Alert.alert('Error', 'Please complete all steps');
        return;
      }
      onComplete({
        height: parseFloat(height),
        weight: parseFloat(weight),
        sex,
        goal,
      });
    }
  };

  const handleBack = () => {
    if (step > 2) setStep(step - 1); // Can't go back to step 1
  };

  return (
    <LinearGradient colors={['#f0fdf4', '#eff6ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]}>
              {i < step ? (
                <Ionicons name="checkmark" size={12} color="white" />
              ) : (
                <Text style={[styles.progressDotText, i <= step && styles.progressDotTextActive]}>{i}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.title}>
          {step === 1 && 'Your Measurements'}
          {step === 2 && 'About You'}
          {step === 3 && 'Your Goal'}
        </Text>

        <Text style={styles.subtitle}>
          {step === 1 && 'Help us personalize your experience'}
          {step === 2 && 'This helps calculate your daily needs'}
          {step === 3 && 'What would you like to achieve?'}
        </Text>

        {/* Step 1: Height & Weight */}
        {step === 1 && (
          <View style={styles.card}>
            <Ionicons name="resize" size={32} color="#10b981" style={styles.cardIcon} />
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 175"
                placeholderTextColor="#9ca3af"
                value={height}
                onChangeText={(text) => setHeight(text.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 70"
                placeholderTextColor="#9ca3af"
                value={weight}
                onChangeText={(text) => setWeight(text.replace(/[^0-9]/g, ''))}
              />
            </View>
          </View>
        )}

        {/* Step 2: Sex */}
        {step === 2 && (
          <View style={styles.optionsGrid}>
            {sexOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSex(option.value)}
                style={[styles.optionCard, sex === option.value && styles.optionCardSelected]}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconContainer, sex === option.value && { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon as any} size={32} color={sex === option.value ? 'white' : option.color} />
                </View>
                <Text style={[styles.optionLabel, sex === option.value && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <View style={styles.goalsList}>
            {goalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setGoal(option.value)}
                style={[styles.goalCard, goal === option.value && styles.goalCardSelected]}
                activeOpacity={0.7}
              >
                <View style={[styles.goalIconContainer, goal === option.value && { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon as any} size={28} color={goal === option.value ? 'white' : option.color} />
                </View>
                <View style={styles.goalTextContainer}>
                  <Text style={[styles.goalLabel, goal === option.value && styles.goalLabelSelected]}>
                    {option.label}
                  </Text>
                  <Text style={styles.goalDescription}>{option.description}</Text>
                </View>
                {goal === option.value && <Ionicons name="checkmark-circle" size={24} color={option.color} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          {step > 2 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleContinue} activeOpacity={0.8} style={styles.continueWrapper}>
            <LinearGradient colors={['#10b981', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueButton}>
              <Text style={styles.continueButtonText}>{step === 3 ? 'Complete Setup' : 'Continue'}</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={styles.continueIcon} />
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
  
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  progressDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  progressDotActive: { backgroundColor: '#10b981' },
  progressDotText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  progressDotTextActive: { color: 'white' },
  
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 32 },
  
  card: { backgroundColor: 'white', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardIcon: { alignSelf: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { height: 56, backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16, fontSize: 18, fontWeight: '600', color: '#111827', borderWidth: 2, borderColor: '#10b981' },
  
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  optionCard: { width: '31%', backgroundColor: 'white', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#e5e7eb', margin: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  optionCardSelected: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  optionIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  optionLabel: { fontSize: 16, fontWeight: '500', color: '#6b7280' },
  optionLabelSelected: { color: '#111827', fontWeight: '600' },
  
  goalsList: { width: '100%' },
  goalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#e5e7eb', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  goalCardSelected: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  goalIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  goalTextContainer: { flex: 1 },
  goalLabel: { fontSize: 18, fontWeight: '500', color: '#6b7280', marginBottom: 4 },
  goalLabelSelected: { color: '#111827', fontWeight: '600' },
  goalDescription: { fontSize: 14, color: '#9ca3af' },
  
  navigation: { flexDirection: 'row', marginTop: 32, alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 16, marginRight: 8 },
  backButtonText: { fontSize: 16, color: '#6b7280', fontWeight: '500', marginLeft: 8 },
  continueWrapper: { flex: 1 },
  continueButton: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  continueButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  continueIcon: { marginLeft: 8 },
});

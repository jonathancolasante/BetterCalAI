import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);

  const bmi = (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1);

  const menuItems = [
    { icon: 'trophy-outline', label: 'Daily Goal', value: '2,000 kcal', color: '#10b981', bg: '#d1fae5' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#3b82f6', bg: '#dbeafe', hasSwitch: true },
    { icon: 'lock-closed-outline', label: 'Privacy', color: '#9333ea', bg: '#f3e8ff', hasChevron: true },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#f97316', bg: '#fed7aa', hasChevron: true }
  ];

  return (
    <LinearGradient colors={['#f0fdf4', '#eff6ff']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={['#10b981', '#3b82f6']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>JD</Text>
          </LinearGradient>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@email.com</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Streak', value: '12', unit: 'days' },
            { label: 'Total Meals', value: '156', unit: '' },
            { label: 'Avg Score', value: '94', unit: '%' }
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>
                {stat.value}
                <Text style={styles.statUnit}>{stat.unit}</Text>
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            {/* Height and Weight */}
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    placeholder="175"
                  />
                  <Ionicons name="resize-outline" size={16} color="#9ca3af" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="70"
                  />
                  <Ionicons name="barbell-outline" size={16} color="#9ca3af" style={styles.inputIcon} />
                </View>
              </View>
            </View>

            {/* BMI */}
            <View style={styles.bmiSection}>
              <Text style={styles.bmiLabel}>Body Mass Index (BMI)</Text>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <View style={styles.card}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Daily Calorie Target</Text>
              <Text style={styles.goalValue}>2,000 kcal</Text>
            </View>
            <View style={styles.macrosRow}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>150g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValue}>200g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValue}>67g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, index > 0 && styles.menuItemBorder]}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.value && (
                    <Text style={styles.menuValue}>{item.value}</Text>
                  )}
                </View>
                {item.hasSwitch && (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor="white"
                  />
                )}
                {item.hasChevron && (
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cloud Sync */}
        <View style={styles.syncCard}>
          <View style={styles.syncHeader}>
            <Text style={styles.syncTitle}>Cloud Sync</Text>
            <Switch
              value={cloudSyncEnabled}
              onValueChange={setCloudSyncEnabled}
              trackColor={{ false: '#e5e7eb', true: '#9333ea' }}
              thumbColor="white"
            />
          </View>
          <Text style={styles.syncText}>Last synced: Just now</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },

  // User Section
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Content
  scrollView: { flex: 1 },
  content: { padding: 24 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Inputs
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: { flex: 1 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 48,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },

  // BMI
  bmiSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  bmiLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  bmiValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  // Goals
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  macroItem: { alignItems: 'center' },
  macroLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  // Menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuValue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },

  // Sync Card
  syncCard: {
    padding: 16,
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    marginBottom: 16,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  syncText: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
});


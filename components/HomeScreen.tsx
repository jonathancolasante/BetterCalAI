import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

interface HomeScreenProps {
  onAddMeal: () => void;
  onNavigate: (screen: string) => void;
  meals: any[];
}

export function HomeScreen({ onAddMeal, onNavigate, meals }: HomeScreenProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const goalCalories = 2000;
  const progress = Math.min((totalCalories / goalCalories) * 100, 100);
  
  const macros = {
    protein: meals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
    carbs: meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
    fat: meals.reduce((sum, meal) => sum + (meal.fat || 0), 0)
  };

  // Circle calculations
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = (progress / 100) * circumference;

  return (
    <LinearGradient colors={['#f0fdf4', '#eff6ff']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.headerTitle}>Ready to track?</Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate('profile')} activeOpacity={0.8}>
              <LinearGradient colors={['#10b981', '#3b82f6']} style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Calorie Circle */}
          <View style={styles.circleContainer}>
            <Svg width={192} height={192} style={styles.circleSvg}>
              <Defs>
                <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#10b981" />
                  <Stop offset="100%" stopColor="#3b82f6" />
                </SvgLinearGradient>
              </Defs>
              <Circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <Circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="url(#grad)"
                strokeWidth="12"
                strokeDasharray={`${progressStroke} ${circumference}`}
                strokeLinecap="round"
                rotation="-90"
                origin="96, 96"
              />
            </Svg>
            <View style={styles.circleTextContainer}>
              <Text style={styles.circleNumber}>{totalCalories}</Text>
              <Text style={styles.circleLabel}>of {goalCalories} kcal</Text>
            </View>
          </View>

          {/* Macros */}
          <View style={styles.macrosContainer}>
            <View style={styles.macro}>
              <Text style={[styles.macroValue, { color: '#2563eb' }]}>{macros.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macro}>
              <Text style={[styles.macroValue, { color: '#10b981' }]}>{macros.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macro}>
              <Text style={[styles.macroValue, { color: '#f97316' }]}>{macros.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={() => onNavigate('history')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {meals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="camera-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first meal</Text>
            </View>
          ) : (
            <View style={styles.mealsList}>
              {meals.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <Image
                    source={{ uri: meal.image }}
                    style={styles.mealImage}
                  />
                  <View style={styles.mealContent}>
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleRow}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        {meal.mealType && (
                          <View style={styles.mealTypeBadge}>
                            <Text style={styles.mealTypeEmoji}>
                              {meal.mealType === 'breakfast' && '🌅'}
                              {meal.mealType === 'lunch' && '🌞'}
                              {meal.mealType === 'dinner' && '🌙'}
                              {meal.mealType === 'snack' && '🍪'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    <View style={styles.mealFooter}>
                      <Text style={styles.mealItems} numberOfLines={1}>
                        {meal.items?.join(', ') || ''}
                      </Text>
                      <View style={styles.caloriesRow}>
                        <Ionicons name="flame" size={16} color="#f97316" />
                        <Text style={styles.caloriesText}>{meal.calories}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Meal Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={onAddMeal} activeOpacity={0.8}>
          <LinearGradient
            colors={['#10b981', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add Meal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  
  // Header
  header: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#111827' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: 'white', fontSize: 16, fontWeight: '600' },

  // Circle
  circleContainer: {
    width: 192,
    height: 192,
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  circleSvg: { position: 'absolute' },
  circleTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleNumber: { fontSize: 48, fontWeight: '700', color: '#111827' },
  circleLabel: { fontSize: 14, color: '#6b7280' },

  // Macros
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macro: { alignItems: 'center' },
  macroValue: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  macroLabel: { fontSize: 12, color: '#6b7280' },

  // Meals Section
  mealsSection: { padding: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#111827' },
  viewAll: { fontSize: 14, color: '#10b981', fontWeight: '500' },
  
  // Empty State
  emptyCard: {
    padding: 32,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: { fontSize: 14, color: '#9ca3af' },

  // Meals List
  mealsList: { gap: 12 },
  mealCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  mealContent: { flex: 1, justifyContent: 'space-between' },
  mealHeader: { marginBottom: 8 },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mealName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  mealTypeBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  mealTypeEmoji: { fontSize: 12 },
  mealTime: { fontSize: 14, color: '#6b7280' },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealItems: { fontSize: 14, color: '#9ca3af', flex: 1, marginRight: 8 },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caloriesText: { fontSize: 14, color: '#f97316', fontWeight: '600' },

  // Add Button
  addButtonContainer: {
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  addButton: {
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addIcon: { marginRight: 8 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});


import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HistoryScreenProps {
  onBack: () => void;
  meals: any[];
  onMealClick: (meal: any) => void;
}

export function HistoryScreen({ onBack, meals, onMealClick }: HistoryScreenProps) {
  const avgCalories = 1950;
  const todayCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const trend = todayCalories > avgCalories ? 'up' : 'down';

  const yesterdayMeal = {
    id: 'yesterday-1',
    name: 'Margherita Pizza',
    time: '7:30 PM',
    calories: 680,
    protein: 28,
    carbs: 82,
    fat: 24,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'
  };

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
          <Text style={styles.headerTitle}>History & Trends</Text>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Weekly Stats */}
        <LinearGradient
          colors={['#10b981', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statsCard}
        >
          <View>
            <Text style={styles.statsLabel}>Weekly Average</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValue}>{avgCalories}</Text>
              <Text style={styles.statsUnit}>kcal/day</Text>
            </View>
          </View>
          <View style={styles.trendBadge}>
            <Ionicons
              name={trend === 'up' ? 'trending-up' : 'trending-down'}
              size={16}
              color="white"
            />
            <Text style={styles.trendText}>5%</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Today */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {meals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No meals logged today</Text>
            </View>
          ) : (
            <View style={styles.mealsList}>
              {meals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => onMealClick(meal)}
                  style={styles.mealCard}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: meal.image }} style={styles.mealImage} />
                  <View style={styles.mealContent}>
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleRow}>
                        <Text style={styles.mealName} numberOfLines={1}>
                          {meal.name}
                        </Text>
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
                      <View style={styles.macros}>
                        <Text style={styles.macro}>P: {meal.protein}g</Text>
                        <Text style={styles.macro}>C: {meal.carbs}g</Text>
                        <Text style={styles.macro}>F: {meal.fat}g</Text>
                      </View>
                      <View style={styles.caloriesRow}>
                        <Ionicons name="flame" size={16} color="#f97316" />
                        <Text style={styles.caloriesText}>{meal.calories}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Yesterday */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          <TouchableOpacity
            style={styles.mealCard}
            activeOpacity={0.7}
          >
            <Image source={{ uri: yesterdayMeal.image }} style={styles.mealImage} />
            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{yesterdayMeal.name}</Text>
                <Text style={styles.mealTime}>{yesterdayMeal.time}</Text>
              </View>
              <View style={styles.mealFooter}>
                <View style={styles.macros}>
                  <Text style={styles.macro}>P: {yesterdayMeal.protein}g</Text>
                  <Text style={styles.macro}>C: {yesterdayMeal.carbs}g</Text>
                  <Text style={styles.macro}>F: {yesterdayMeal.fat}g</Text>
                </View>
                <View style={styles.caloriesRow}>
                  <Ionicons name="flame" size={16} color="#f97316" />
                  <Text style={styles.caloriesText}>{yesterdayMeal.calories}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Highest Day</Text>
              <Text style={styles.summaryValue}>2,200</Text>
              <Text style={styles.summarySubtext}>Saturday</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Lowest Day</Text>
              <Text style={styles.summaryValue}>1,780</Text>
              <Text style={styles.summarySubtext}>Friday</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 24,
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

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  statsValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  statsValue: { fontSize: 28, fontWeight: '700', color: 'white' },
  statsUnit: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  trendText: { fontSize: 14, fontWeight: '600', color: 'white' },

  // Content
  scrollView: { flex: 1 },
  content: { padding: 24 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },

  // Empty State
  emptyCard: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#6b7280' },

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
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
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
  macros: { flexDirection: 'row', gap: 12 },
  macro: { fontSize: 14, color: '#6b7280' },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caloriesText: { fontSize: 14, color: '#f97316', fontWeight: '600' },

  // Summary
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});


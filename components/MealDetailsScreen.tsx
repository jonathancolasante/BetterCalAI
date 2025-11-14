import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MealDetailsScreenProps {
  image: string;
  onBack: () => void;
  onSave?: (meal: any) => void;
  meal?: any;
  isViewMode?: boolean;
  onUpdate?: (meal: any) => void;
}

interface Ingredient {
  name: string;
  portion: string;
  calories: number;
}

export function MealDetailsScreen({ image, onBack, onSave, meal, isViewMode = false }: MealDetailsScreenProps) {
  // Use provided meal data if in view mode, otherwise use default analysis data
  const defaultMealData = isViewMode && meal ? {
    name: meal.name,
    time: meal.time,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    mealType: meal.mealType || 'lunch',
    ingredients: meal.items?.map((item: string, idx: number) => ({
      name: item,
      portion: '~100g',
      calories: Math.round(meal.calories / (meal.items?.length || 1))
    })) || []
  } : {
    name: 'Grilled Chicken Salad',
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    calories: 425,
    protein: 38,
    carbs: 24,
    fat: 18,
    mealType: 'lunch',
    ingredients: [
      { name: 'Grilled Chicken Breast', portion: '150g', calories: 248 },
      { name: 'Mixed Greens', portion: '100g', calories: 25 },
      { name: 'Cherry Tomatoes', portion: '50g', calories: 18 },
      { name: 'Cucumber', portion: '40g', calories: 8 },
      { name: 'Olive Oil Dressing', portion: '30ml', calories: 126 }
    ]
  };

  const [mealName, setMealName] = useState(defaultMealData.name);
  const [mealType, setMealType] = useState(defaultMealData.mealType);
  const [calories] = useState(defaultMealData.calories);
  const [protein] = useState(defaultMealData.protein);
  const [carbs] = useState(defaultMealData.carbs);
  const [fat] = useState(defaultMealData.fat);
  const [ingredients] = useState<Ingredient[]>(defaultMealData.ingredients);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '🌞' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍪' },
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: Date.now(),
        image,
        name: mealName,
        time: defaultMealData.time,
        calories,
        protein,
        carbs,
        fat,
        mealType,
        items: ingredients.map((i) => i.name)
      });
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.imageGradient}
        />
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Meal Name */}
          <View style={styles.headerSection}>
            <View style={styles.headerLeft}>
              <TextInput
                style={styles.mealNameInput}
                value={mealName}
                onChangeText={setMealName}
                placeholder="Meal name"
              />
              <Text style={styles.mealTime}>{defaultMealData.time}</Text>
            </View>
            <LinearGradient
              colors={['#f97316', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.caloriesBadge}
            >
              <Ionicons name="flame" size={20} color="white" />
              <Text style={styles.caloriesText}>{calories} kcal</Text>
            </LinearGradient>
          </View>

          {/* Meal Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setMealType(type.value)}
                  style={[
                    styles.mealTypeButton,
                    mealType === type.value && styles.mealTypeButtonActive
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mealTypeEmoji}>{type.emoji}</Text>
                  <Text style={[
                    styles.mealTypeLabel,
                    mealType === type.value && styles.mealTypeLabelActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Macros */}
          <View style={styles.section}>
            <View style={styles.macrosCard}>
              <Text style={styles.sectionTitle}>Nutrition Summary</Text>
              <View style={styles.macrosGrid}>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: '#3b82f6' }]}>
                    <View style={[styles.macroFill, { width: `${(protein / 50) * 100}%` }]} />
                  </View>
                  <Text style={styles.macroValue}>{protein}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: '#10b981' }]}>
                    <View style={[styles.macroFill, { width: `${(carbs / 60) * 100}%` }]} />
                  </View>
                  <Text style={styles.macroValue}>{carbs}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: '#f97316' }]}>
                    <View style={[styles.macroFill, { width: `${(fat / 30) * 100}%` }]} />
                  </View>
                  <Text style={styles.macroValue}>{fat}g</Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detected Ingredients</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientCard}>
                  <View style={styles.ingredientLeft}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientPortion}>{ingredient.portion}</Text>
                  </View>
                  <Text style={styles.ingredientCalories}>{ingredient.calories} kcal</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Confidence */}
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIcon}>
                <Ionicons name="pulse" size={20} color="white" />
              </View>
              <View style={styles.aiText}>
                <Text style={styles.aiTitle}>AI Confidence</Text>
                <Text style={styles.aiSubtitle}>95% accuracy on detection</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button - Only show if not in view mode */}
      {!isViewMode && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.saveButtonText}>Save to Log</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },

  // Image Header
  imageContainer: { height: 320, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: { position: 'absolute', top: 48, left: 16 },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  // Content
  scrollView: { flex: 1, marginTop: -32 },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  // Header Section
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: { flex: 1, marginRight: 16 },
  mealNameInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    padding: 0,
  },
  mealTime: { fontSize: 14, color: '#6b7280' },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  caloriesText: { fontSize: 16, fontWeight: '600', color: 'white' },

  // Section
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  // Meal Type
  mealTypeGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  mealTypeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  mealTypeButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  mealTypeEmoji: { fontSize: 20 },
  mealTypeLabel: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  mealTypeLabelActive: { color: '#10b981' },

  // Macros
  macrosCard: {
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  macroItem: { alignItems: 'center' },
  macroBar: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 8,
  },
  macroFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  macroLabel: { fontSize: 12, color: '#6b7280' },

  // Ingredients
  ingredientsList: { gap: 12 },
  ingredientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  ingredientLeft: { flex: 1 },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  ingredientPortion: { fontSize: 14, color: '#6b7280' },
  ingredientCalories: { fontSize: 14, fontWeight: '600', color: '#6b7280' },

  // AI Card
  aiCard: {
    padding: 16,
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    marginBottom: 24,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: { flex: 1 },
  aiTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 },
  aiSubtitle: { fontSize: 14, color: '#6b7280' },

  // Footer
  footer: {
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MobileContainer } from './components/MobileContainer';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { CameraScreen } from './components/CameraScreen';
import { ProcessingScreen, type FoodResponse } from './components/ProcessingScreen';
import { MealDetailsScreen } from './components/MealDetailsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';

type Screen = 'onboarding' | 'home' | 'camera' | 'processing' | 'mealDetails' | 'history' | 'profile' | 'viewMeal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FoodResponse | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
  };

  const handleAddMeal = () => {
    setCurrentScreen('camera');
  };

  const handleCapture = (image: string) => {
    setCapturedImage(image);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = (result: FoodResponse | null, imageUri: string) => {
    setAnalysisResult(result);
    setCapturedImage(imageUri); // Update to the actual URI for display
    setCurrentScreen('mealDetails');
  };

  const handleSaveMeal = (meal: any) => {
    setMeals([meal, ...meals]);
    setCurrentScreen('home');
  };

  const handleUpdateMeal = (updatedMeal: any) => {
    setMeals(meals.map(m => m.id === updatedMeal.id ? updatedMeal : m));
    setSelectedMeal(updatedMeal);
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleMealClick = (meal: any) => {
    setSelectedMeal(meal);
    setCurrentScreen('viewMeal');
  };

  const handleBackToHistory = () => {
    setCurrentScreen('history');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <MobileContainer>
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen
            onAddMeal={handleAddMeal}
            onNavigate={handleNavigate}
            meals={meals}
          />
        )}
        {currentScreen === 'camera' && (
          <CameraScreen onCapture={handleCapture} onBack={handleBack} />
        )}
        {currentScreen === 'processing' && (
          <ProcessingScreen
            image={capturedImage}
            onComplete={handleProcessingComplete}
          />
        )}
        {currentScreen === 'mealDetails' && (
          <MealDetailsScreen
            image={capturedImage}
            onBack={handleBack}
            onSave={handleSaveMeal}
            analysisResult={analysisResult}
          />
        )}
        {currentScreen === 'history' && (
          <HistoryScreen onBack={handleBack} meals={meals} onMealClick={handleMealClick} />
        )}
        {currentScreen === 'viewMeal' && selectedMeal && (
          <MealDetailsScreen
            image={selectedMeal.image}
            onBack={handleBackToHistory}
            meal={selectedMeal}
            isViewMode={true}
            onUpdate={handleUpdateMeal}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen onBack={handleBack} />
        )}
      </MobileContainer>
    </SafeAreaView>
  );
}

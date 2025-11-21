# BetterCalAI - AI-Powered Food Tracking App

A beautiful React Native mobile application that tracks calories from photos using AI-powered food recognition.

## 🎯 Features

### Core Functionality
- **📸 Camera Integration** - Real camera capture with expo-camera
- **🤖 AI Processing** - Simulated AI analysis with loading states
- **📊 Meal Tracking** - Log and track all your meals
- **🔢 Calorie Counter** - Track daily calorie intake with visual progress
- **📈 Macros Tracking** - Monitor protein, carbs, and fat intake
- **📅 History View** - Review past meals and weekly trends
- **👤 Profile Management** - Customize goals and preferences

### Screens
1. **Onboarding** - Beautiful intro with feature highlights
2. **Home** - Daily summary with calorie circle and meal cards
3. **Camera** - Full-featured camera with guides and tips
4. **Processing** - AI analysis with animated progress steps
5. **Meal Details** - Detailed nutrition breakdown with editing
6. **History** - Meal log with weekly statistics
7. **Profile** - Personal info, goals, and settings

## 🛠️ Tech Stack

### Core
- **React Native** 0.74.5
- **Expo** SDK 51
- **TypeScript** 5.1.3

### UI & Styling
- **expo-linear-gradient** - Gradient backgrounds
- **react-native-svg** - SVG graphics for circular progress
- **@expo/vector-icons** (Ionicons) - Icon library

### Camera & Media
- **expo-camera** - Native camera access
- **expo-image-manipulator** - Image processing
- **expo-status-bar** - Status bar styling

### Navigation
- Custom state-based navigation (no external nav library)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start Expo
npm start

# Or run on specific platforms
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BetterCalAI.git
cd BetterCalAI
```

2. **Create a .env file**
EXPO_PUBLIC_AWS_API_KEY = INSERT_KEY
EXPO_PUBLIC_AWS_API_URL = INSERT_URL

3. **Install dependencies**
```bash
npm install
```

4. **Start the app**
```bash
npx expo start
```

5. **Scan QR code** with Expo Go app (iOS/Android)

## 📱 Usage

1. **Onboarding** - Tap "Get Started" to begin
2. **Add Meal** - Tap "+ Add Meal" button
3. **Take Photo** - Capture your food with the camera
4. **AI Analysis** - Wait for automatic processing
5. **Review Details** - Check calories and macros
6. **Save** - Tap "Save to Log"
7. **View History** - Check past meals anytime
8. **Customize Profile** - Set your goals and preferences

## 🎨 Design

The app features a modern, gradient-based design with:
- **Green & Blue Gradients** - Fresh, healthy aesthetic
- **Clean White Cards** - Easy-to-read content
- **Smooth Animations** - Native-feeling transitions
- **Iconography** - Ionicons for consistency

## 📂 Project Structure

```
BetterCalAI/
├── App.tsx                          # Main app with navigation
├── components/
│   ├── MobileContainer.tsx          # Root container
│   ├── OnboardingScreen.tsx         # Intro screen
│   ├── HomeScreen.tsx               # Main dashboard
│   ├── CameraScreen.tsx             # Camera capture
│   ├── ProcessingScreen.tsx         # AI processing
│   ├── MealDetailsScreen.tsx        # Meal nutrition
│   ├── HistoryScreen.tsx            # Meal history
│   └── ProfileScreen.tsx            # User profile
├── package.json
└── README.md
```

## 🔧 Configuration

### Expo Configuration (`app.json`)
- SDK 51
- iOS, Android, Web platforms
- Safe area context enabled
- Camera permissions configured

### Dependencies
- **No web-only packages** - Pure React Native
- **No legacy peer deps** - Clean installation
- **Minimal bundle** - Only 10 core dependencies

## 🎯 Current Features

✅ Beautiful onboarding flow  
✅ Real camera integration  
✅ AI processing simulation  
✅ Calorie tracking with circular progress  
✅ Macro nutrients breakdown  
✅ Meal history with trends  
✅ User profile with BMI calculator  
✅ Daily goal tracking  
✅ Meal type categorization  

## 🚧 Future Enhancements

- [ ] Real AI integration (AWS Lambda/API)
- [ ] Food database search
- [ ] Barcode scanning
- [ ] Water intake tracking
- [ ] Exercise logging
- [ ] Social features
- [ ] Meal planning
- [ ] Recipe suggestions
- [ ] Dark mode
- [ ] Offline support

## 📄 License

MIT License - feel free to use this project for learning or building your own app!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using React Native & Expo**

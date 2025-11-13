# Personal Food Log (BetterCalAI)

Minimal proof-of-concept: snap a food photo in the Expo app, upload to AWS, and receive a food name plus calorie estimate from a Lambda endpoint.

## Repository Layout
- Source code lives at the repo root (Expo/React Native client for Android + iOS via Expo Go).
- *(Backend managed externally; this repo focuses solely on the client.)*

## Frontend (Expo) Setup
1. Install the Expo CLI prerequisites (Node.js 18+, Expo Go on your phone, Android/iOS emulator as needed).
2. Bootstrap dependencies (installs Expo, TypeScript, and type definitions):
   ```sh
   npm install
   npx expo install expo-camera expo-image-manipulator
   ```
3. Update `API_URL` / `API_KEY` inside `App.tsx` with your backend’s values (defaults currently point at the shared `https://w0swuxypu7.execute-api.us-east-2.amazonaws.com/Dev/analyze` endpoint and expect header `x-api-key: DuVVUxNjFb9mH0pMCMMJW2iagBYuAY3J3cBltb2A` with body `{ "image": "<base64>" }`).
4. Start the development server (Metro compiles the TypeScript entrypoint automatically):
   ```sh
   npx expo start
   ```
5. Scan the QR code with Expo Go or run `npm run ios` / `npm run android`. Grant camera permissions when prompted.

## Backend
The mobile client currently targets a shared API (`/Dev/analyze`) that stores images in S3 and returns mocked nutrition data. If you need to point at a different backend:
- Update `API_URL`/`API_KEY` in `App.tsx`.
- Ensure the backend accepts `{ "image": "<base64>" }` (or tweak the payload accordingly).
- Keep the JSON response shape `{ food, ingredients, calories }` so the UI displays correctly.

## How It Works
1. **Expo client** captures a photo (Expo Camera), compresses/resizes, and POSTs `{ image: '...' }` to the API.
2. **Backend** (managed separately) stores the image in S3, applies any mock or ML analysis, and returns:
   ```json
   {
     "food": "Salad",
     "ingredients": ["Lettuce", "Tomato", "Carrot"],
     "calories": 180
   }
   ```
   When Rekognition is disabled, mocked data is returned to keep the demo simple.
3. **App UI** shows a loading indicator during upload and then displays the food name, ingredients, and calorie estimate.

## Next Ideas
- Replace the mock response with a real ML inference endpoint (Hugging Face, SageMaker, etc.).
- Enrich the API with nutrition/calorie services.
- Persist submissions for history or add auth once backend ownership is decided.

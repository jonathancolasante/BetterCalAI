# Personal Food Log (BetterCalAI)

Minimal proof-of-concept: snap a food photo in the Expo app, upload to AWS, and receive a food name plus calorie estimate from a Lambda endpoint.

## Repository Layout
- `mobile-app/` – Expo/React Native client (Android + iOS via Expo Go)
- `backend-lambda/` – Node.js AWS Lambda function source
- `infra/template.yaml` – Optional AWS SAM template to deploy S3 bucket + Lambda + API Gateway

## Frontend (Expo) Setup
1. Install the Expo CLI prerequisites (Node.js 18+, Expo Go on your phone, Android/iOS emulator as needed).
2. Bootstrap dependencies:
   ```sh
   cd mobile-app
   npm install
   npx expo install expo-camera expo-image-manipulator
   ```
3. Update `API_URL` inside `mobile-app/App.js` with your API Gateway invoke URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod/analyze-food`).
4. Start the development server:
   ```sh
   npx expo start
   ```
5. Scan the QR code with Expo Go or run `npm run ios` / `npm run android`. Grant camera permissions when prompted.

## Backend (Lambda) Deployment
### Manual (Console or AWS CLI)
1. **S3 bucket**: create (or re-use) a bucket such as `foodlog-uploads` in the same AWS region as the Lambda.
2. **Lambda function**:
   - Runtime: Node.js 18.x
   - Handler: `index.handler`
   - Upload the zipped contents of `backend-lambda/`:
     ```sh
     cd backend-lambda
     npm install
     zip -r function.zip index.mjs package.json package-lock.json node_modules
     ```
   - Environment variables:
     - `UPLOAD_BUCKET = foodlog-uploads`
     - `USE_REKOGNITION = false` (set to `true` only if you attach Rekognition permissions)
3. **IAM role** attached to the Lambda needs:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": "s3:PutObject", "Resource": "arn:aws:s3:::foodlog-uploads/*" },
       { "Effect": "Allow", "Action": "rekognition:DetectLabels", "Resource": "*" }
     ]
   }
   ```
4. **API Gateway** (HTTP API or REST API):
   - Create a `POST /analyze-food` route that integrates with the Lambda (proxy mode on).
   - Enable CORS for `*` origin/headers so the Expo app can call it.
   - Deploy and copy the invoke URL; plug it into the Expo app.
5. Test the endpoint before using the mobile app:
   ```sh
   curl -X POST https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/analyze-food \
     -H 'Content-Type: application/json' \
     -d '{"imageBase64":"dGVzdA=="}'
   ```

### SAM (Infrastructure as Code)
1. Install the AWS SAM CLI.
2. From the repo root:
   ```sh
   sam build --template-file infra/template.yaml
   sam deploy --guided
   ```
3. Provide a unique bucket name when prompted (or accept `foodlog-uploads`). After deployment, SAM prints the API endpoint URL for use in the Expo app.

## How It Works
1. **Expo client** captures a photo (Expo Camera), compresses/resizes, and POSTs `{ imageBase64: '...' }` to the API.
2. **Lambda** stores the image in S3, optionally runs Rekognition `DetectLabels`, and returns:
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
- Swap the mocked response for real Rekognition label analysis by flipping `USE_REKOGNITION=true`.
- Extend the Lambda to call a nutrition API for more accurate calorie counts.
- Persist user submissions with DynamoDB or AppSync if you need history or authentication later.

import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const BUCKET = process.env.UPLOAD_BUCKET;
const USE_REKOGNITION = process.env.USE_REKOGNITION === 'true';

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.imageBase64) {
      return respond(400, { error: 'imageBase64 missing' });
    }

    if (!BUCKET) {
      return respond(500, { error: 'UPLOAD_BUCKET env var not set' });
    }

    const buffer = Buffer.from(body.imageBase64, 'base64');
    const key = `uploads/${Date.now()}.jpg`;

    await s3
      .putObject({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      })
      .promise();

    let result = mockResult();

    if (USE_REKOGNITION) {
      const labels = await rekognition
        .detectLabels({
          Image: { Bytes: buffer },
          MaxLabels: 5,
          MinConfidence: 70,
        })
        .promise();

      const foodLabel = labels?.Labels?.find((label) =>
        label.Categories?.some((category) => category.Name === 'Food and Beverage')
      );

      if (foodLabel) {
        result = {
          food: foodLabel.Name,
          ingredients: foodLabel.Parents?.map((parent) => parent.Name) || ['Ingredient data not available'],
          calories: estimateCalories(foodLabel.Name),
        };
      }
    }

    return respond(200, result);
  } catch (error) {
    console.error('Food log error', error);
    return respond(500, { error: 'Processing failed' });
  }
};

const respond = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  body: JSON.stringify(body),
});

const mockResult = () => ({
  food: 'Salad',
  ingredients: ['Lettuce', 'Tomato', 'Carrot'],
  calories: 180,
});

const estimateCalories = (label) => {
  const lookup = {
    Pizza: 285,
    Burger: 354,
    Salad: 180,
    Sandwich: 250,
  };
  return lookup[label] ?? 200;
};

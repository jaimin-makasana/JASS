const CONSTANTS = Object.freeze({
  
    LOCAL_BACKEND_URL: `http://localhost:6000/api/`,
    AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_REGION:process.env.AWS_REGION,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME,
    AWS_USER_POOL_ID:process.env.AWS_USER_POOL_ID,
    AWS_APP_CLIENT_ID:process.env.AWS_APP_CLIENT_ID,
    AWS_SM_NAME: process.env.AWS_SM_NAME,
    AWS_SNS_TOPIC_ARN:process.env.AWS_SNS_TOPIC_ARN,
});

export default CONSTANTS;
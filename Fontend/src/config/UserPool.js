import { CognitoUserPool } from "amazon-cognito-identity-js";
import AWS  from'aws-sdk';
import Constants from '../utils/Constants'

let AWS_secrets = JSON.parse(localStorage.getItem("AWS_secrets"));
AWS.config.update({
    region: Constants.AWS_REGION,
    accessKeyId: Constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY,
    sessionToken: Constants.AWS_SESSION_TOKEN
});
let poolData = {    
    UserPoolId: AWS_secrets.AWS_USER_POOL_ID,
    ClientId: AWS_secrets.AWS_APP_CLIENT_ID
}
export default new CognitoUserPool(poolData);
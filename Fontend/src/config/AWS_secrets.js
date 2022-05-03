import Constants from '../utils/Constants'
var AWS = require('aws-sdk')
let region = Constants.AWS_REGION,
    secretName = Constants.AWS_SM_NAME,
    secret,
    decodedBinarySecret;

AWS.config.update({
    region: Constants.AWS_REGION,
    accessKeyId: Constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY,
    sessionToken: Constants.AWS_SESSION_TOKEN
});
var client = new AWS.SecretsManager({
    region: region
});

let AWS_secrets=null,AWS_decodedBinarySecret=null;
client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
            AWS_secrets= JSON.parse(secret);
            localStorage.setItem("AWS_secrets", JSON.stringify(AWS_secrets));
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
            AWS_decodedBinarySecret = decodedBinarySecret.toString();
        }
    }
    
    // Your code goes here. 
});


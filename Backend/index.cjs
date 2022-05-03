const express = require('express');
require('dotenv').config()
var cors = require('cors');

const userRoutes = require('./api/routes/Users.cjs');
const fileUploadRoutes = require('./api/routes/FileUpload.cjs');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const sns = require("./api/config/AWS_SNS.cjs")
const s3 = require("./api/config/AWS_S3.cjs")
const app = express();
const allowedOrigins = ['http://52.87.251.19:3000', 'http://localhost:3003', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('build'))

app.use('/api/users', userRoutes);
app.use('/api/files', fileUploadRoutes);

app.get('/', (req, res) => {
    return res.send("<div><p>Welcome to JASS Server : </p><br/><p>Port No :- " + port + "</p></div>");
});
app.get("/aws-sns", (req, res) => {
    res.status(200).json({
        status: "ok",
        data: sns,
    });
});
app.get("/aws-s3", (req, res) => {
    res.status(200).json({
        status: "ok",
        data: s3,
    });
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
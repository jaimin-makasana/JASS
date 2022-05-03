const UsersModel = require('../models/Users.cjs');
const sns = require("../config/AWS_SNS.cjs");
require('dotenv').config()
const getUsersList = async (req, res) => {
    try {
        const userId = req.params.id;
        UsersModel.getUsersList((err, users) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching Users !!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
					res.status(200).json({
                    Message: 'User fetched Successfully !!',
                    Status: true,
                    DetailMessage: '',
                    Data: users
                });
            }
        })
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};

const addUser = async (req, res) => {
    try {
        const newUser = req.body;
        const reqData = new UsersModel(req.body);

        UsersModel.addUser(reqData, (err, user) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while inserting User !!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                let params = {
                    Protocol: 'EMAIL',
                    TopicArn: process.env.AWS_SNS_TOPIC_ARN,
                    Endpoint: reqData.EmailId,
                };

                sns.subscribe(params, (err, data) => {
                    if (err) {
                        res.status(400).json({
                            Message: 'Error while sending Mail to User !!',
                            Status: false,
                            DetailMessage: err,
                            Data: ''
                        });
                    } else {
                        let result = {
                            InsertId: user.insertId,
                            SNS_Data: data
                        }
                        res.status(200).json({
                            Message: 'Registered Successfully !!',
                            Status: true,
                            DetailMessage: '',
                            Data: result
                        });
                    }
                });
            }
        })
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};
const login = async (req, res) => {
    try {
        const EmailId = req.params.EmailId;
        let params = {
            TopicArn: process.env.AWS_SNS_TOPIC_ARN,
        };

        sns.listSubscriptionsByTopic(params, (err, data) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching Users from SNS !!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                let subscriptions = [];
                data.Subscriptions.forEach((ele) => {
                    let item = {
                        protocol: ele.Protocol,
                        endpoint: ele.Endpoint.toString(),
                        confirmed: ele.SubscriptionArn,
                    };

                    subscriptions.push(item);
                });
                subscriptions.forEach(element => {
                    if (element.endpoint === EmailId) {
                        let params = {
                            Subject: "Amazon SNS",
                            Message: "You are Logged In.",
                            TopicArn: process.env.AWS_SNS_TOPIC_ARN,
                        };

                        sns.publish(params, function (err, data) {
                            if (err) {
                                res.status(400).json({
                                    Message: 'Error while sending Mail to User !!',
                                    Status: false,
                                    DetailMessage: err,
                                    Data: ''
                                });
                            }
                        });
                    }
                });

            }
        });
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};

module.exports = {
    getUsersList,
    addUser,
    login
};
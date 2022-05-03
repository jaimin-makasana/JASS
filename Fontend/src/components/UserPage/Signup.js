import React, { useState } from "react";
import UserPool from "../../config/UserPool";
import * as EmailIdValidator from "email-validator";
import {useNavigate, Link} from "react-router-dom";
import { registerUser } from '../../api/axiosCall';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {TextField, Button,
    InputAdornment, IconButton} from '@mui/material';
import {Visibility, VisibilityOff } from '@mui/icons-material';  
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import "./Signup.css"
import { toast } from 'react-toastify';

const schema = Yup.object().shape({
    Name:Yup.string()
        .required('Full Name is required')
        .matches(/^[a-zA-Z]+$/, "Invalid Full Name! Only alphabets allowed !!"),
    EmailId: Yup.string()
        .email('Email Id is invalid')
        .required('Email Id is required'),
    Password: Yup.string()
        .min(6, 'Password must be at least 8 characters')
        .max(32, 'Password must be less than 32 characters.')
        .required('Password is required')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/, 
        "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*], 8 characters long, but no more than 32."),
    ConfirmPassword: Yup.string()
        .oneOf([Yup.ref('Password'), null], 'Passwords must match')
        .required('Confirm Password is required')
});

const Signup = () => {
    const navigate =useNavigate();
    const[eyePassword,setEyePassword]=useState(false);
    const[typePassword,setTypePassword]=useState("password");
    const[eyeConfirmPassword,setEyeConfirmPassword]=useState(false);
    const[typeConfirmPassword,setTypeConfirmPassword]=useState("password");
    const eyeConfirmPasswordClick = () => {
        if(typeConfirmPassword==="password"){
            setTypeConfirmPassword("text");
            setEyeConfirmPassword(true);
        }
        else{
            setTypeConfirmPassword("password");
            setEyeConfirmPassword(false);
        }
    };
    const eyePasswordClick = () => {
        if(typePassword==="password"){
            setTypePassword("text");
            setEyePassword(true);
        }
        else{
            setTypePassword("password");
            setEyePassword(false);
        }
    };


  return (
    <>
        <div className="r-container">
            <div className="r-inner">
                <div className="r-form">
                    <div style={{height: "20%"}}>
                        <div className="r-hello mb-5">
                            <h2>Registration Form</h2>
                        </div>
                    </div>
                    <div style={{height: "80%"}}>
                        <Formik
                            initialValues={{
                                Name: '',
                                EmailId: '',
                                Password: '',
                                ConfirmPassword: '',
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    const userData={
                                        Name: values.Name,
                                        EmailId: values.EmailId,
                                        Password: values.Password
                                    };
                                    const attributes = [
                                          new CognitoUserAttribute({ Name: "name", Value: values.Name }),
                                        ];
                                    UserPool.signUp(values.EmailId, values.Password, attributes, null, (err, data) => {
                                      if (err) {
                                        toast.error(err.message);
                                      }
                                      const userData={
                                        Name: values.Name,
                                        UserId: data.userSub,
                                        EmailId: values.EmailId
                                    };
                                    return new Promise((resolve, reject) => {
                                        registerUser(userData).then((res) => {
                                            if (res.status === 200) {
                                                if (res.data["Status"]) {
                                                    toast.success("Registered Successfully.");
                                                    navigate("/login");
                                                    resolve(res);
                                                }
                                            }
                                        }).catch((err) => {
                                            if (!err?.response) {
                                                toast.error('No Server Response');
                                            } else if (err.response?.status !== 200) {
                                                toast.error(err.response?.data["Message"]);
                                            } else {
                                                toast.error('Registration Failed');
                                            }
                                            reject(err);
                                        });
                                    })
                                    });
                                    setSubmitting(false);
                                }, 500);
                            }}
                            validate={(values) => {
                                let errors = {};
                                const NameRegex = /^[a-zA-Z]+$/;
                                if (!values.Name) {
                                errors.Name = "Full Name is Required";
                                } else if (!NameRegex.test(values.Name)) {
                                errors.Name = "Invalid Full Name! Only alphabets allowed!";
                                } 

                                if (!values.EmailId) {
                                errors.EmailId = "Email Id is Required";
                                } else if (!EmailIdValidator.validate(values.EmailId)) {
                                errors.EmailId = "Invalid Email Id.";
                                }
                                
                                const PasswordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/;
                                if (!values.Password) {
                                errors.Password = "Password is Required";
                                } else if (values.Password.length < 8) {
                                errors.Password = "Password must be 8 characters long.";
                                } else if (values.Password.length > 32) {
                                    errors.Password = "Password must be less than 32 characters.";
                                } else if (!PasswordRegex.test(values.Password)) {
                                errors.Password = "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*].";
                                }
                    
                                return errors;
                            }}
                            validationSchema={schema}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                values,
                                touched,
                                errors,
                            }) => (
                                <>
                                <form onSubmit={handleSubmit} className="r-input_text">
                                    <TextField className={(errors.Name && touched.Name && "error mb-3") || " mb-3"}
                                        required
                                        autoFocus
                                        id="Name"
                                        name="Name"
                                        label="Full Name"
                                        autoComplete="off"
                                        placeholder="Enter Full Name"
                                        value={values.Name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.Name && Boolean(errors.Name)}
                                        helperText={touched.Name && errors.Name}
                                    />
                                    <TextField className={(errors.EmailId && touched.EmailId && "error mb-3") || " mb-3"}
                                        required
                                        autoFocus
                                        id="EmailId"
                                        name="EmailId"
                                        label="Email Id"
                                        autoComplete="off"
                                        placeholder="Enter Email Id"
                                        value={values.EmailId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.EmailId && Boolean(errors.EmailId)}
                                        helperText={touched.EmailId && errors.EmailId}
                                    />
                                    <TextField className={(errors.Password && touched.Password && "error mb-3") || " mb-3" }
                                        required                                   
                                        id="Password"
                                        name="Password"
                                        label="Password"
                                        autoComplete="off"
                                        type={typePassword}
                                        placeholder="Enter Password"
                                        value={values.Password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle Password visibility"
                                                onClick={eyePasswordClick}
                                                edge="end"
                                                >
                                                {eyePassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>,
                                        }}
                                        error={touched.Password && Boolean(errors.Password)}
                                        helperText={touched.Password && errors.Password}
                                        
                                    />
                                    <TextField className={(errors.ConfirmPassword && touched.ConfirmPassword && "error mb-3") || " mb-3" }
                                        required                                   
                                        id="ConfirmPassword"
                                        name="ConfirmPassword"
                                        label="Confirm Password"
                                        type={typeConfirmPassword}
                                        autoComplete="off"
                                        placeholder="Enter Confirm Password"
                                        value={values.ConfirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle Password visibility"
                                                onClick={eyeConfirmPasswordClick}
                                                edge="end"
                                                >
                                                {eyeConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>,
                                        }}
                                        error={touched.ConfirmPassword && Boolean(errors.ConfirmPassword)}
                                        helperText={touched.ConfirmPassword && errors.ConfirmPassword}
                                        
                                    />
                                    <div className="r-btn">
                                        <Button  type="submit"  variant="contained"
                                        disabled={(!Boolean(errors.Name)  && !Boolean(errors.EmailId) && !Boolean(errors.Password) && !Boolean(errors.ConfirmPassword)) ?  false: true}>
                                            Submit
                                        </Button>
                                    </div> 
                                    <br/>
                                    <span className="r-line">
                                        <Link to="/login">Sign In</Link>
                                    </span>
                                </form>
                                </>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Signup;

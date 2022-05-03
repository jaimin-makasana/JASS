import React, { useState, useContext } from "react";
import { AccountContext } from "../Route/Account";
import * as EmailIdValidator from "email-validator";
import {useNavigate} from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import {TextField, Button,
    InputAdornment, IconButton} from '@mui/material';
import {Visibility, VisibilityOff } from '@mui/icons-material';   
import "./Login.css"
import { toast } from 'react-toastify';
import { login } from '../../api/axiosCall';
import logo from './login.jpg';

const schema = Yup.object().shape({
    EmailId: Yup.string()
        .email('Email Id is invalid')
        .required('Email Id is required'),
    Password: Yup.string()
        .min(6, 'Password must be at least 8 characters')
        .max(32, 'Password must be less than 32 characters.')
        .required('Password is required')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/, 
        "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*], 8 characters long, but no more than 32.")
});

const Login = (props) => {
  
  const { authenticate } = useContext(AccountContext);

  const navigate =useNavigate();
    const abcClick = () => {
        if(pass==="password"){
            setpass("text");
            seteye(true);
        }
        else{
            setpass("password");
            seteye(false);
        }
    };
    const [loginRes, setLoginRes] = useState({ message: '', status: true });
    const[eye,seteye]=useState(false);
    const[pass,setpass]=useState("password");
      const btnRegister= (e) =>
      {
          navigate(`/register`);
      }

      //--------------------------
  

  return (
    <>
            <div className="f-container">
                <div className="f-card">
                    <div className="f-form">
                        <div className="f-left-side">
                            <img src={logo} alt=""/>
                        </div>

                        <div className="f-right-side">
                            <div style={{height: "30%"}}>
                                <div className="f-register">
                                    <p>Not a member? <span onClick={btnRegister}>Register Now</span></p>
                                </div>
                                <div className="f-hello">
                                    <h2>Sign In</h2>
                                    <h4>Welcome Back. Let's sign you in. </h4>
                                </div>
                            </div>
                            <div style={{height: "70%",paddingTop: '10%'}}>
                                <Formik
                                    initialValues={{
                                        EmailId: '',
                                        Password: '',
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setTimeout(() => {
                                          authenticate(values.EmailId, values.Password)
                                          .then((data) => {
                                            toast.success("Logged In Successfully");
                                            setLoginRes({ message: "Logged in!", status: 200 });
                                            navigate("/home");
                                            return new Promise((resolve, reject) => {
                                                login(values.EmailId).then((res) => {
                                                    resolve(res);
                                                }).catch((err) => {
                                                    if (!err?.response) {
                                                        toast.error('No Server Response');
                                                    } else if (err.response?.status !== 200) {
                                                        toast.error("Invalid Email Id to send Mail.");
                                                    } else {
                                                        toast.error('Invalid Email Id to send Mail.');
                                                    }
                                                    reject(err);
                                                });
                                            });
                                          })
                                          .catch((err) => {
                                            toast.error(err.message);
                                          });                                            
                                            setSubmitting(false);
                                        }, 500);
                                    }}
                                    validate={(values) => {
                                        let errors = {};
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
                                        <form onSubmit={handleSubmit} className="f-input_text">
                                            <TextField className={(errors.EmailId && touched.EmailId && "error mb-3") || " mb-3"}
                                                required
                                                autoFocus
                                                id="EmailId"
                                                name="EmailId"
                                                label="Email Id"
                                                autoComplete="off"
                                                placeholder="Enter EmailId"
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
                                                type={pass}
                                                autoComplete="off"
                                                placeholder="Enter Password"
                                                value={values.Password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">
                                                        <IconButton
                                                        aria-label="toggle Password visibility"
                                                        onClick={abcClick}
                                                        edge="end"
                                                        >
                                                        {eye ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>,
                                                }}
                                                error={touched.Password && Boolean(errors.Password)}
                                                helperText={touched.Password && errors.Password}
                                                
                                            />
                                            <div className="f-btn">
                                                <Button  type="submit"  variant="contained" disabled={isSubmitting}>
                                                    Sign In
                                                </Button>
                                            </div>                              
                                            <div className='mt-3'>
                                                {(!loginRes.status) ? <center><p style={{color:"red"}}><i className="fa fa-warning"></i>{loginRes.message}</p></center> : null}
                                            </div>
                                        </form>
                                        </>
                                    )}
                                </Formik>
                            </div>                      
                        </div>
                    </div>
                </div>
            </div>
    </>
  );
};

export default Login;

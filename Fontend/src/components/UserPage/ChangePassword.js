import React, { useState, useContext } from "react";
import {useNavigate} from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import logo from './NoUser.jpg'
import {TextField, Button, InputAdornment, IconButton} from '@mui/material';
import {Visibility, VisibilityOff } from '@mui/icons-material';  
import ButtonBase from '@mui/material/ButtonBase';
import { experimentalStyled as styled } from '@mui/material/styles';
import {Row,Container} from "react-bootstrap";
import { AccountContext } from "../Route/Account";
import "./ChangePassword.css"
import Header from '../Navigation/Header';
import Footer from '../Navigation/Footer';
import { toast } from 'react-toastify';


const schema = Yup.object().shape({
    CurrentPassword: Yup.string()
        .min(6, 'Password must be at least 8 characters')
        .max(32, 'Password must be less than 32 characters.')
        .required('Password is required')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/, 
        "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*], 8 characters long, but no more than 32."),
    NewPassword: Yup.string()
        .min(6, 'Password must be at least 8 characters')
        .max(32, 'Password must be less than 32 characters.')
        .required('Password is required')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/, 
        "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*], 8 characters long, but no more than 32."),
});

const Main = () => {
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '200px',
        height: '200px',
      });
    const navigate =useNavigate();
    const[eyeCurrentPassword,setEyeCurrentPassword]=useState(false);
    const[typeCurrentPassword,setTypeCurrentPassword]=useState("password");
    const[eyeNewPassword,setEyeNewPassword]=useState(false);
    const[typeNewPassword,setTypeNewPassword]=useState("password");
    const eyeNewPasswordClick = () => {
        if(typeNewPassword==="password"){
            setTypeNewPassword("text");
            setEyeNewPassword(true);
        }
        else{
            setTypeNewPassword("password");
            setEyeNewPassword(false);
        }
    };
    const eyeCurrentPasswordClick = () => {
        if(typeCurrentPassword==="password"){
            setTypeCurrentPassword("text");
            setEyeCurrentPassword(true);
        }
        else{
            setTypeCurrentPassword("password");
            setEyeCurrentPassword(false);
        }
    };
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let user = localStorage.getItem("token");  
  user=JSON.parse(user);
  const { getSession } = useContext(AccountContext);
  console.log("cp",user.email);
  return (
    <main>
        <Container className="up--main-bg-container up-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="upf-container">
                    <div className="upf-card">
                        <div className="upf-form">
                            <div className="upf-left-side">
                                <ButtonBase sx={{ width: 200, height: 200 }}>
                                    <Img alt="Name" src={logo} />
                                </ButtonBase>
                            </div>

                            <div className="upf-right-side">
                                    
                                <div style={{height: "20%"}}>
                                    <div className="up-hello mb-5">
                                        <h2>User Profile</h2>
                                    </div>
                                </div>
                                <div style={{height: "80%"}}>
                                    <Formik
                                        initialValues={{
                                            Name: user.name,
                                            EmailId: user.email,
                                            CurrentPassword: '',
                                            NewPassword: '',
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            setTimeout(() => {
                                                getSession().then(({ user }) => {
                                                user.changePassword(values.CurrentPassword,  values.NewPassword, (err, result) => {
                                                    if (err) {
                                                    toast.error(err.message);
                                                    } else {
                                                    toast.success("Password Updated Succesfully.");
                                                    }
                                                });
                                                });
                                                setSubmitting(false);
                                            }, 500);
                                        }}
                                        validate={(values) => {
                                            let errors = {};
                                            const PasswordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#!@$%^*]).{8,32}$/;
                                            if (!values.CurrentPassword) {
                                            errors.CurrentPassword = "Password is Required";
                                            } else if (values.CurrentPassword.length < 8) {
                                            errors.CurrentPassword = "Password must be 8 characters long.";
                                            } else if (values.CurrentPassword.length > 32) {
                                                errors.CurrentPassword = "Password must be less than 32 characters.";
                                            } else if (!PasswordRegex.test(values.CurrentPassword)) {
                                            errors.CurrentPassword = "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*].";
                                            }
                                            if (!values.NewPassword) {
                                            errors.NewPassword = "Password is Required";
                                            } else if (values.NewPassword.length < 8) {
                                            errors.NewPassword = "Password must be 8 characters long.";
                                            } else if (values.NewPassword.length > 32) {
                                                errors.NewPassword = "Password must be less than 32 characters.";
                                            } else if (!PasswordRegex.test(values.NewPassword)) {
                                            errors.NewPassword = "Password must contain At least one digit, one lowercase character, one uppercase character, one special character [#!@$%^*].";
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
                                                <TextField className={" mb-3"}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    value={values.Name}
                                                    id="Name"
                                                    name="Name"
                                                    label="Full Name"
                                                />
                                                <TextField className={" mb-3"}
                                                    id="EmailId"
                                                    name="EmailId"
                                                    label="Email Id"
                                                    value={values.EmailId}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                                <TextField className={(errors.CurrentPassword && touched.CurrentPassword && "error mb-3") || " mb-3" }
                                                    required                                   
                                                    id="CurrentPassword"
                                                    name="CurrentPassword"
                                                    label="Current Password"
                                                    autoComplete="off"
                                                    type={typeCurrentPassword}
                                                    placeholder="Enter Current Password"
                                                    value={values.CurrentPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">
                                                            <IconButton
                                                            aria-label="toggle Password visibility"
                                                            onClick={eyeCurrentPasswordClick}
                                                            edge="end"
                                                            >
                                                            {eyeCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>,
                                                    }}
                                                    error={touched.CurrentPassword && Boolean(errors.CurrentPassword)}
                                                    helperText={touched.CurrentPassword && errors.CurrentPassword}
                                                    
                                                />
                                                <TextField className={(errors.NewPassword && touched.NewPassword && "error mb-3") || " mb-3" }
                                                    required                                   
                                                    id="NewPassword"
                                                    name="NewPassword"
                                                    label="New Password"
                                                    type={typeNewPassword}
                                                    autoComplete="off"
                                                    placeholder="Enter New Password"
                                                    value={values.NewPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">
                                                            <IconButton
                                                            aria-label="toggle Password visibility"
                                                            onClick={eyeNewPasswordClick}
                                                            edge="end"
                                                            >
                                                            {eyeNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>,
                                                    }}
                                                    error={touched.NewPassword && Boolean(errors.NewPassword)}
                                                    helperText={touched.NewPassword && errors.NewPassword}
                                                    
                                                />
                                                <div className="r-btn">
                                                    <Button  type="submit"  variant="contained"
                                                    disabled={(!Boolean(errors.CurrentPassword) && !Boolean(errors.NewPassword)) ?  false: true}>
                                                        Submit
                                                    </Button>
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
            </Row>
        </Container>
    </main>
    
  );
};
function ChangePassword(props) {
  
    return ( 
        <div id="app">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default ChangePassword;
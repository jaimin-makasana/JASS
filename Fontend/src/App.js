import React from "react";
import "./App.css";
import Signup from "./components/UserPage/Signup";
import Login from "./components/UserPage/Login";
import { Account } from "./components/Route/Account";
import Settings from "./components/Route/Settings";
import { Routes, Route} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  
  return (
    <>
    <Account>
      <Routes>
       <Route exact path='/' element={ <Login />}  />
       <Route exact path='/login' element={ <Login />}  />
       <Route exact path='/register' element={ <Signup />}  />
       <Route exact path='/*' element={ <Settings />}/>
     </Routes>
    </Account>
    <ToastContainer position="bottom-right" autoClose={1000} />
    </>
  );
};

export default App;

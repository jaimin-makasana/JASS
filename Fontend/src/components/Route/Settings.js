import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "./Account";
import ChangePassword from "../UserPage/ChangePassword";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../Home/Home";
import UserNotAuthenticate from "../ErrorPage/UserNotAuthenticate";
import PageNotFound from "../ErrorPage/PageNotFound";
import { Routes, Route} from 'react-router-dom';

export default () => {
  const { getSession } = useContext(AccountContext);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getSession().then(() => {
      const user = localStorage.getItem("token");
      console.log("user",JSON.parse(user));
      setLoggedIn(true);
    });
  }, []);

  return (
    <div className="settings">
      <Routes>
      {loggedIn && (
        <>
          
            <Route exact path='/profile' element={ <ChangePassword/>}  />
            <Route exact path='/home' element={ <Home/>}/>
            <Route exact path='/dashboard' element={ <Dashboard/>}/>
            <Route exact path='/*' element={ <PageNotFound />}/>
         
        </>
      )}
      {!loggedIn && <Route exact path='/*' element={ <UserNotAuthenticate />}/>}
      </Routes>
    </div>
  );
};

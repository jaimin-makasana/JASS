/*Author : Parthkumar Patel (B00899800)*/
import React from 'react'
import "./UserNotAuthenticate.css";
import {useNavigate} from "react-router-dom";

function UserNotAuthenticate() {

  const navigate =useNavigate();
  const goBack = () => {
    navigate(`/login`);
  }

  return (
    <div className="errad-container">
            <div className="errad-inner">
                < >
                    <h2 className="header" data-text="404">
                      404
                    </h2>
                    <h4 data-text="Opps! Not Autherized to Access !!">
                      Opps! Not Autherized to Access !!
                    </h4>
                    <p>
                      Sorry, the page you're looking for needs Login for Access. 
                      <br/>
                      We can't forward to the page you're looking for.
                    </p>
                    <div className="btns">
                      <button onClick={goBack}>Go Back</button>               
                    </div>
                </>
            </div>
        </div>
  )
}

export default UserNotAuthenticate

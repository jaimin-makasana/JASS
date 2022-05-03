import React from 'react';
import "./Footer.css"


export default function Footer(props) {
  return (
    <footer>
        <div className="container">
            <hr className="mt-2 mb-2"/>
            <div className="row">
                <p style={{justifyContent:'center',display: 'flex'}}>
                    &copy;{new Date().getFullYear()} JASS | All rights reserved |
                </p>
            </div>
        </div>
    </footer>
  );
}
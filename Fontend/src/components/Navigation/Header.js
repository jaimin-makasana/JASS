import React, { useContext } from "react";
import {Navbar, Nav, Container, NavDropdown,} from 'react-bootstrap'
import logo from './logo.png'
import "./Header.css"
import { Routes, Route,useNavigate} from 'react-router-dom';
import ChangePassword from "../UserPage/ChangePassword";
import { AccountContext } from "../Route/Account";
export default function Header(props) {
    const { logout } = useContext(AccountContext);
    const navigate =useNavigate();
    
  return (
    <><header>
        <Navbar id="nnavbar" collapseOnSelect className=' App-header' expand="lg" bg="dark" variant="dark">
            <Container style={{marginLeft:'unset',minWidth: '100%'}}>              
            <Navbar.Brand  href="/home" className='n-logo-font'> <img src={logo} className="n-App-logo rounded-circle" alt="logo"  />JASS</Navbar.Brand>    
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav"> 
            <Nav className="mx-auto">
                <Nav.Link className="d-inline p-2 text-white" href="/home">Home</Nav.Link>
            </Nav>                 
                <Nav>
                <NavDropdown align="end" title={<i className="fas fa-user-alt rounded-circle c-white" alt="profile" width="30"></i>}>
                    <NavDropdown.Item href="/profile"  /* onClick={profileClick} */>Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="" onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>                   
                </Nav>
            </Navbar.Collapse>            
            </Container>
        </Navbar>
    </header>
    <Routes>
        <Route exact path='/profile' element={ <ChangePassword/>}  />
    </Routes>
    </>
  );
}

import React from "react";
import "./Dashboard.css";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MyDrive from "../File/MyDrive";
import SharedWith from "../File/SharedWith";

import Header from '../Navigation/Header';
import Footer from '../Navigation/Footer';

const Main = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
    return (
        <main>
          <div className="d-main-bg-container d-main-container">
            <div className="d-container">
                <div className="d-card">
                  <div className="d-form">
                    <TabContext value={value}>
                      <Box
                        sx={{
                          flexGrow: 2,
                          bgcolor: "background.paper",
                          display: "flex",
                          borderRadius: "10px",
                          width: '100%',
                        }}
                      >
                        <TabList className="tlist"
                          orientation="vertical"
                          variant="scrollable"
                          sx={{ borderRight: 1, borderColor: "divider", backgroundImage: 'linear-gradient(125deg, #5b6467, #485461)',backgroundColor: 'white',color:'white' }}
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab label="My Drive" value="1" />
                          <Tab label="Shared With Me" value="2" />
                        </TabList>

                        <TabPanel value="1" style={{width:'100%'}}>
                          <MyDrive />
                        </TabPanel>
                        <TabPanel value="2" style={{width:'100%'}}>
                          <SharedWith />
                        </TabPanel>
                      </Box>
                    </TabContext>
                  </div>
                </div>
              </div>
          </div>
        </main>
    );
}

function Dashboard(props) {
  
    return ( 
        <div id="app">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default Dashboard;

import React ,{Component,useState,useEffect} from 'react';
import { getFilesByUserId,addFiles,getAllUsers,updateFile,deleteFileById} from '../../api/axiosCall';
import { styled } from '@mui/material/styles';
import {Paper, Table, TableBody, TableCell,  TableContainer, TableHead, TablePagination, TableRow , 
     Dialog,DialogActions, DialogContent, DialogContentText, DialogTitle,Tooltip, tooltipClasses , Typography} from "@mui/material";
import { Button, Row, FloatingLabel, ListGroup, Form, Col } from "react-bootstrap";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import convertSize from "convert-size";
import FileViewer from "react-file-viewer";
import "./MyDrive.css";
import { toast } from 'react-toastify';

const columns = [
  { id: "Name", label: "File Name", minWidth: 350 },
  { id: "Size", label: "Size", minWidth: 70,align: "center"},
  { id: "UpdatedAt", label: "Updated At", minWidth: 100,align: "center" },
  { id: "SharedWith", label: "Shared With", minWidth: 50,align: "center" },
  { id: "CurrentVersion", label: "Current Version", minWidth: 30,align: "center" },
];
let FileData= [], FileDataFalse=[],selectedFiles=null,UserEmail=[],UserDetails=null;
let File={
        FileId: '',
        Name: '',
        Size : '',
        IsShared : '',
        SharedWith : '',
        IsLatestVersion : '',
        VersionNo : '',
        UserId: '',
        Location : '',
        UpdatedAt : '',
    },
    VersionFile={
        FileId: '',
        Name: '',
        Size : '',
        IsShared : '',
        SharedWith : '',
        IsLatestVersion : '',
        VersionNo : '',
        UserId: '',
        Location : '',
        UpdatedAt : '',
    };
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function Main() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openFile, setOpenFile] = React.useState(false);
  const [openVersionFile, setOpenVersionFile] = React.useState(false);
  const [openFileUpload, setOpenFileUpload] = React.useState(false);
  const [searchKeyword,setSearchKeyword]=useState(null);
  useEffect(() => {
        UserDetails = localStorage.getItem("token");  
        UserDetails=JSON.parse(UserDetails);      
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  let ffd=[];
  const handleFileOpen = (row) =>  {
    setOpenFile(true);
    File=row;
  };
  const handleFileClose = () => {
    setOpenFile(false);
  };
  const handleFileVersionOpen = (row) =>  {
    setOpenVersionFile(true);
    VersionFile=row;
  };
  const handleFileVersionClose = () => {
    setOpenVersionFile(false);
  };
  const descriptionElementRef = React.useRef(null);
   React.useEffect(() => {
    if (openFile) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openFile]); 
  const onError = (e) => {
    toast.error( "error in file-viewer");
};
const btnVersionFileDelete=(FileId) =>{
        deleteFileById(FileId).then((res) => {
            if (res.status === 200) {
                if (res.data !== null) {
                    toast.success(res.data["Message"]);
                    FileData= [];
                    FileDataFalse=[];
                    files();
                } 
            }
        }).catch((err) => {
            if (!err?.response) {
                toast.error('No Server Response');
            } else if (err.response?.status !== 200) {
                toast.error(err.response?.data["Message"]);
            } else {
                toast.error('File Deleting Failed.');
            }
        }); 
}

const minusVersionFileClicked =(props)=> {
        if(VersionFile.SharedWith.includes(props+"/"))
        {
            VersionFile.SharedWith=VersionFile.SharedWith.replace(props+"/","");
        }
        if(VersionFile.SharedWith.includes(props))
        {
            VersionFile.SharedWith=VersionFile.SharedWith.replace(props,"");
        }
        if(VersionFile.SharedWith === "" || VersionFile.SharedWith === null)
        {
            VersionFile.IsShared= "false";
            VersionFile.SharedWith=null;
        }
        updateFile(VersionFile.FileId,VersionFile).then((res) => {
            if (res.status === 200) {
                if (res.data["Status"]) {
                    toast.success("File Shared Removed Successfully.");
                } 
            }
        }).catch((err) => {
            if (!err?.response) {
                toast.error('No Server Response');
            } else if (err.response?.status !== 200) {
                toast.error(err.response?.data["Message"]);
            } else {
                toast.error('Update Failed');
            }
        });
    }
    const btnVersionFileSearch =(FileId)=>{
        if(searchKeyword==null)
        {
            toast.error("Please enter Email for Search");
        }
        else
        {
            if(UserEmail.includes(searchKeyword))
            {
                (VersionFile.SharedWith === "" || VersionFile.SharedWith === null) ? VersionFile.SharedWith= searchKeyword : VersionFile.SharedWith+= "/"+searchKeyword;
                VersionFile.IsShared= "true";
                updateFile(FileId,VersionFile).then((res) => {
                    if (res.status === 200) {
                        if (res.data["Status"]) {
                            toast.success("File Shared Successfully.");
                            FileData= [];
                            FileDataFalse=[];
                            files();
                        } 
                    }
                }).catch((err) => {
                    if (!err?.response) {
                        toast.error('No Server Response');
                    } else if (err.response?.status !== 200) {
                        toast.error(err.response?.data["Message"]);
                    } else {
                        toast.error('Update Failed');
                    }
                });
            }
            else
            {
                toast.error("Entered Email Id is not Found in Database");
            }
        }
    };
    const btnFileDelete=(FileId) =>{
        deleteFileById(FileId).then((res) => {
            if (res.status === 200) {
                if (res.data !== null) {
                    toast.success(res.data["Message"]);
                    FileData= [];
                    FileDataFalse=[];
                    files();
                    
                } 
            }
        }).catch((err) => {
            if (!err?.response) {
                toast.error('No Server Response');
            } else if (err.response?.status !== 200) {
                toast.error(err.response?.data["Message"]);
            } else {
                toast.error('File Deleting Failed.');
            }
        }); 
}
    const minusClicked =(props)=> {
        if(File.SharedWith.includes(props+"/"))
        {
            File.SharedWith=File.SharedWith.replace(props+"/","");
        }
        if(File.SharedWith.includes(props))
        {
            File.SharedWith=File.SharedWith.replace(props,"");
        }
        if(File.SharedWith === "" || File.SharedWith === null)
        {
            File.IsShared= "false";
            File.SharedWith=null;
        }
        updateFile(File.FileId,File).then((res) => {
            if (res.status === 200) {
                if (res.data["Status"]) {
                    toast.success("File Shared Removed Successfully.");
                } 
            }
        }).catch((err) => {
            if (!err?.response) {
                toast.error('No Server Response');
            } else if (err.response?.status !== 200) {
                toast.error(err.response?.data["Message"]);
            } else {
                toast.error('Update Failed');
            }
        });
    }
    const btnSearch =(FileId)=>{
        if(searchKeyword==null)
        {
            toast.error("Please enter Email for Search");
        }
        else
        {
            if(UserEmail.includes(searchKeyword))
            {
                (File.SharedWith === "" || File.SharedWith === null) ? File.SharedWith= searchKeyword : File.SharedWith+= "/"+searchKeyword;
                File.IsShared= "true";
                updateFile(FileId,File).then((res) => {
                    if (res.status === 200) {
                        if (res.data["Status"]) {
                            toast.success("File Shared Successfully.");
                            FileData= [];
                            FileDataFalse=[];
                            files();
                        } 
                    }
                }).catch((err) => {
                    if (!err?.response) {
                        toast.error('No Server Response');
                    } else if (err.response?.status !== 200) {
                        toast.error(err.response?.data["Message"]);
                    } else {
                        toast.error('Update Failed');
                    }
                });
            }
            else
            {
                toast.error("Entered Email Id is not Found in Database");
            }
        }
    };
    const [value, setValue] = React.useState('1');
    const [valueVersion, setVersionValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleVersionChange = (event, newValue) => {
    setVersionValue(newValue);
  };
  const handleFileUploadOpen = () =>  {
    setOpenFileUpload(true);
  };
  const handleFileUploadClose = () => {
    setOpenFileUpload(false);
  };
  const multipleFileChangedHandler = (event) => {
    selectedFiles= event.target.files;
  };
  const multipleFileUploadHandler = () => {
        let data = new FormData();
        // If file selected
		if ( selectedFiles ) {
            data.append("UserId", UserDetails.sub);
            
            for ( let i = 0; i < selectedFiles.length; i++ ) {
                data.append( 'MultipleFileUpload', selectedFiles[ i ], selectedFiles[ i ].name ); 
                
			}
            addFiles(data).then((res) => {
                if (res.status === 200) {
                    if (res.data["Status"]) {
                        toast.success(res.data["Message"]);
                        FileData= [];
                        FileDataFalse=[];
                        files();                      
                    }
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 200) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Inserting Failed');
                }
            });
		} else {
			// if file not selected throw error
			toast.error( 'Please upload file' );
		}
  };
  const files = () => {
      return new Promise((resolve, reject) => {
        getFilesByUserId(UserDetails.sub).then((res) => {
                if (res.status === 200) {
                    if (res.data["Status"]) {
                        for(var i= 0; i<res.data["Data"].length;i++)
                            {
                                let file={
                                    FileId: res.data["Data"][i].FileId,
                                    Name: res.data["Data"][i].Name,
                                    Size : convertSize(res.data["Data"][i].Size),
                                    IsShared : res.data["Data"][i].IsShared,
                                    SharedWith : res.data["Data"][i].SharedWith,
                                    IsLatestVersion : res.data["Data"][i].IsLatestVersion,
                                    VersionNo : res.data["Data"][i].VersionNo,
                                    UserId: res.data["Data"][i].UserId,
                                    Location : res.data["Data"][i].Location,
                                    UpdatedAt : res.data["Data"][i].timestamp.split('T')[0],
                                }
                                if(res.data["Data"][i].IsLatestVersion === "true")
                                    FileData.push(file);
                                else
                                    FileDataFalse.push(file);
                            }
                        resolve(res);              
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 200) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Retriving Failed');
                }
                reject(err);
            });
            getAllUsers().then((res) => {
                if (res.status === 200) {
                    if (res.data["Status"]) {
                        if(res.data["Data"].length > 0)
                        {
                            for(var i= 0; i<res.data["Data"].length;i++)
                            {
                                UserEmail.push(res.data["Data"][i].EmailId);
                            }
                            resolve(res); 
                        }                 
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 200) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Retriving Failed');
                }
                reject(err);
            });
    });
        
  };
  return (
      <>
        <Button style={{fontSize:18}} variant="outline-primary" onClick={handleFileUploadOpen}><i className="fas fa-plus-circle" ></i>  Upload File</Button>
        <Paper sx={{ width: "100%", overflow: "hidden",marginTop:'10px' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {(FileData.length === 0) ? <> <TableRow><TableCell colSpan="4"><span>No Record Found.</span></TableCell></TableRow></> : <>
                    {FileData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.FileId}>
                        <TableCell>
                            <a href="#" onClick={() => handleFileOpen(row)}>{row.Name}</a>
                        </TableCell>
                        <TableCell align="center">{row.Size}</TableCell>
                        <TableCell align="center">{row.UpdatedAt}</TableCell>
                        <TableCell align="center">
                            <>
                                {(row.IsShared === "true") ? 
                                <HtmlTooltip
                                    title={
                                    <React.Fragment>
                                        <Typography color="inherit">{row.SharedWith.replace('/', "\n")}</Typography>
                                    </React.Fragment>
                                    }
                                >
                                    <i className="fas fa-share-alt" ></i>
                                </HtmlTooltip>
                                : <></>}
                            </>
                        </TableCell>
                        <TableCell align="center">{row.VersionNo}</TableCell>
                    </TableRow>
                    ))}</>
                    }
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 15]} component="div" count={FileData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
        </Paper>
    <div>
      <Dialog
        open={openVersionFile}
        fullWidth={true}
        /* maxWidth={"xl"} */
        onClose={handleFileVersionClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
            <Row className="p-3">
                <Col>
                    {VersionFile.Name}
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button style={{fontSize:18}} variant="outline-primary" onClick={(e) => {btnVersionFileDelete(VersionFile.FileId)}}><i className="fas fa-trash-alt" ></i>  Delete</Button>
                </Col>
            </Row>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef} 
            tabIndex={-1}
          >
              <TabContext value={valueVersion}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleVersionChange} aria-label="lab API tabs example">
                    <Tab label="Preview" value="1" />
                    <Tab label="Sharing" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <span style={{ height: '100%' }}>
                        <FileViewer 
                            fileType={VersionFile.Name.split('.')[1]}
                            filePath={VersionFile.Location}
                            onError={onError}
                        />
                    </span>
                </TabPanel>
                <TabPanel value="2">
                    <div style={{display:'block'}}>
                        <Form style={{flexDirection: 'row'}}>
                            <Col  style={{marginRight:'1%'}} sm={7}>                                                        
                                <Row className="g-2">
                                    <FloatingLabel controlId="txtKeyword"  label="Enter Email Id">
                                        <Form.Control type="text"  placeholder="abc@gmail.com" onChange={e => {setSearchKeyword(e.target.value);}} />                                 
                                    </FloatingLabel>
                                </Row>
                            </Col>
                            <Col  sm={5} style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                                <Button style={{fontSize:18}} variant="outline-primary" onClick={() => {btnVersionFileSearch(VersionFile.FileId)}}><i className="fas fa-search" ></i>  Search & Add</Button>
                            </Col>
                        </Form>
                    </div>
                        <ListGroup style={{overflow: "auto",maxHeight: "500px"}}>
                            {(VersionFile.IsShared === "true") ? VersionFile.SharedWith.split('/').map(item => (
                                <>
                                <ListGroup.Item action key={item.Symbol} onClick={() => minusVersionFileClicked(item)}>
                                    <i className="fas fa-minus-circle"></i>                            
                                    <span>  {item}</span>
                                </ListGroup.Item>
                                </>
                            )) : <></>}
                        </ListGroup>
                </TabPanel>
            </TabContext>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileVersionClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
    <div>
      <Dialog
        open={openFile}
        fullWidth={true}
        /* maxWidth={"xl"} */
        onClose={handleFileClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
            <Row className="p-3">
                <Col>
                    {File.Name}
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button style={{fontSize:18}} variant="outline-primary" onClick={(e) => {btnFileDelete(File.FileId)}}><i className="fas fa-trash-alt" ></i>  Delete</Button>
                </Col>
            </Row>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef} 
            tabIndex={-1}
          >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Preview" value="1" />
                    <Tab label="Versions" value="2" />
                    <Tab label="Sharing" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <span style={{ height: '100%' }}>
                        <FileViewer 
                            fileType={File.Name.split('.')[1]}
                            filePath={File.Location}
                            onError={onError}
                        />
                    </span>
                </TabPanel>
                <TabPanel value="2">
                    <table className='versionTable' style={{width: '100%'}}>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Version No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{File.Name}</td>
                                <td>{File.VersionNo}</td>
                            </tr>
                            {FileDataFalse.map((item) =>(
                                <>
                                {(item.Name===File.Name) ?
                                    <tr>
                                        <td><a href="#" onClick={() => handleFileVersionOpen(item)}>{item.Name}</a></td>
                                        <td>{item.VersionNo}</td>
                                    </tr>
                                :<></>}
                                </>
                                
                            ))}
                        </tbody>
                    </table>
                </TabPanel>
                <TabPanel value="3">
                    <div style={{display:'block'}}>
                        <Form style={{flexDirection: 'row'}}>
                            <Col  style={{marginRight:'1%'}} sm={7}>                                                        
                                <Row className="g-2">
                                    <FloatingLabel controlId="txtKeyword"  label="Enter Email Id">
                                        <Form.Control type="text"  placeholder="abc@gmail.com" onChange={e => {setSearchKeyword(e.target.value);}} />                                 
                                    </FloatingLabel>
                                </Row>
                            </Col>
                            <Col  sm={5} style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                                <Button style={{fontSize:18}} variant="outline-primary" onClick={() => {btnSearch(File.FileId)}}><i className="fas fa-search" ></i>  Search & Add</Button>
                            </Col>
                        </Form>
                    </div>
                        <ListGroup style={{overflow: "auto",maxHeight: "500px"}}>
                            {(File.IsShared === "true") ? File.SharedWith.split('/').map(item => (
                                <>
                                <ListGroup.Item action key={item.Symbol} onClick={() => minusClicked(item)}>
                                    <i className="fas fa-minus-circle"></i>                            
                                    <span>  {item}</span>
                                </ListGroup.Item>
                                </>
                            )) : <></>}
                        </ListGroup>
                </TabPanel>
            </TabContext>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
    <div>
      <Dialog
        open={openFileUpload}
        fullWidth={true}
        maxWidth={"md"} 
        onClose={handleFileUploadClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
            <h3 style={{ color: '#555', marginLeft: '12px' }}>Upload Muliple Files</h3>
            <p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: ( Max 10MB )<br/> Supported File Formats : png,jpeg,gif,pdf,jpg,csv,xlsv,docx,mp4,mp3,webm</p>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef} 
            tabIndex={-1}
          >
            <p className="card-text">Please Upload the Files</p>
            <input type="file"  onChange={multipleFileChangedHandler} multiple />
            <div className="mt-5">
                <button onClick={multipleFileUploadHandler} className="btn btn-info" >Upload</button>
            </div>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileUploadClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
    
    </>
  );
}


class MyDrive extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			selectedFiles: null,
            FileData: [],
            FileDataFalse:[],
            UserEmail:[],
            UserDetails:null,
		}
	}
    componentDidMount() {
        FileData= [];
        FileDataFalse=[];
        UserEmail=[];
        UserDetails=null;
        this.files();
 }

 componentWillUnmount() { 
     FileData= [];
     UserEmail=[];
     FileDataFalse=[];
     UserDetails=null;
    this.files();
   
 }
    files() {
        return new Promise((resolve, reject) => {
            UserDetails = localStorage.getItem("token");  
            UserDetails=JSON.parse(UserDetails); 
            this.setState({UserDetails: UserDetails});  
            getFilesByUserId(UserDetails.sub).then((res) => {
                if (res.status === 200) {
                    if (res.data["Status"]) {
                        for(var i= 0; i<res.data["Data"].length;i++)
                            {
                                let file={
                                    FileId: res.data["Data"][i].FileId,
                                    Name: res.data["Data"][i].Name,
                                    Size : convertSize(res.data["Data"][i].Size),
                                    IsShared : res.data["Data"][i].IsShared,
                                    SharedWith : res.data["Data"][i].SharedWith,
                                    IsLatestVersion : res.data["Data"][i].IsLatestVersion,
                                    VersionNo : res.data["Data"][i].VersionNo,
                                    UserId: res.data["Data"][i].UserId,
                                    Location : res.data["Data"][i].Location,
                                    UpdatedAt : res.data["Data"][i].timestamp.split('T')[0],
                                }
                                if(res.data["Data"][i].IsLatestVersion === "true")
                                    FileData.push(file);
                                else
                                    FileDataFalse.push(file);
                            }
                            this.setState({
                FileData: FileData,FileDataFalse: FileDataFalse
            });
                            resolve(res);              
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 200) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Retriving Failed');
                }
                reject(err);
            });
            getAllUsers().then((res) => {
                if (res.status === 200) {
                    if (res.data["Status"]) {
                        if(res.data["Data"].length > 0)
                        {
                            for(var i= 0; i<res.data["Data"].length;i++)
                            {
                                UserEmail.push(res.data["Data"][i].EmailId);
                                this.setState({
                UserEmail: UserEmail
            });
                            }
                            resolve(res);
                        }                 
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 200) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Retriving Failed');
                }
                 reject(err);
            });
    });
        
    }
	render() {
		
		return(
            <div className="container">
				<Main/>
			</div>
		);
	}
}

export default MyDrive;
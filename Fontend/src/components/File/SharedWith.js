import React ,{Component,useEffect} from 'react';
import { getFilesSharedByEmailId} from '../../api/axiosCall';
import {Paper, Table, TableBody, TableCell,  TableContainer, TableHead, TablePagination, TableRow , 
     Dialog,DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { Button} from "react-bootstrap";
import convertSize from "convert-size";
import FileViewer from "react-file-viewer";
import "./SharedWith.css";
import { toast } from 'react-toastify';
const columns = [
  { id: "Name", label: "File Name", minWidth: 350 },
  { id: "Size", label: "Size", minWidth: 100,align: "center"  },
  { id: "UpdatedAt", label: "Updated At", minWidth: 100,align: "center"  },
];
let FileData= [],UserDetails=null;
let File={
        FileId: '',
        Name: '',
        Size : '',
        IsShared : '',
        SharedWith : '',
        UserId: '',
        Location : '',
        UpdatedAt : '',
    }
function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openFile, setOpenFile] = React.useState(false);
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
  const handleFileOpen = (row) =>  {
    setOpenFile(true);
    File=row;
  };
  const handleFileClose = () => {
    setOpenFile(false);
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
    

  return (
      <>
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
               
              {(FileData.length === 0) ? <> <TableRow><TableCell colSpan="4">No Record Found.</TableCell></TableRow></> : <>
                {FileData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.FileId}>
                    <TableCell >
                      <a href="#" onClick={() => handleFileOpen(row)}>{row.Name}</a>
                    </TableCell>
                    <TableCell align="center">{row.Size}</TableCell>
                    <TableCell align="center" >{row.UpdatedAt}</TableCell>
                  </TableRow>
                ))}</>
                }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={FileData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
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
        <DialogTitle id="scroll-dialog-title">{File.Name}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef} 
            tabIndex={-1}
          >
            <span style={{ height: '100%' }}>
                <FileViewer 
                    fileType={File.Name.split('.')[1]}
                    filePath={File.Location}
                    onError={onError}
                />
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>    
    </>
  );
}


class SharedWith extends Component {
	constructor( props ) {
		super( props );
		this.state = {
            FileData: [],
            UserDetails:null,
		}
	}
    componentDidMount() {
        FileData= [];
         UserDetails=null;
        this.files();
 }

 componentWillUnmount() { 
     FileData= [];
      UserDetails=null;
    this.files();
   
 }
    files() {
      return new Promise((resolve, reject) => {
        UserDetails = localStorage.getItem("token");  
            UserDetails=JSON.parse(UserDetails); 
            this.setState({UserDetails: UserDetails});
        getFilesSharedByEmailId(UserDetails.email).then((res) => {
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
                                UserId: res.data["Data"][i].UserId,
                                Location : res.data["Data"][i].Location,
                                UpdatedAt : res.data["Data"][i].timestamp.split('T')[0],
                            }
                            FileData.push(file);
                        }
                        this.setState({FileData: FileData});
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
      });
        
        
    }
	render() {
		 
		return(
            <div className="container">
                <StickyHeadTable/>
			</div>
		);
	}
}


export default SharedWith;
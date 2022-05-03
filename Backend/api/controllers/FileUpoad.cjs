const s3 = require("../config/AWS_S3.cjs")
const FileUploadModel = require('../models/FileUpload.cjs');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf|csv|xlsx|docx|mp4|mp3|webm/;
    const mimetypes = /image.*|audio.*|application.*|video.*/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Invalid file type');
    }
}

const uploadsFiles = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, req.body.UserId + "/" + path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 10000000
    }, // In bytes: 10000000 bytes = 10 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('MultipleFileUpload', 4);

const addFiles = async (req, res) => {
    try {
        uploadsFiles(req, res, (error) => {
            if (error) {
                res.status(400).json({
                    Message: 'Error !!',
                    Status: false,
                    DetailMessage: error,
                    Data: ''
                });
            } else {
                // If File not found
                if (req.files === undefined) {
                    res.status(400).json({
                        Message: 'No File Selected !!',
                        Status: false,
                        DetailMessage: '',
                        Data: ''
                    });
                } else {
                    // If Success
                    let fileArray = req.files,
                        fileLocation, VersionNo = 0;
                    const FileLocationArray = [];
                    let result = [],
                        flag = true;
                    for (let i = 0; i < fileArray.length; i++) {
                        fileLocation = fileArray[i].location;
                        FileLocationArray.push(fileLocation)
                        FileUploadModel.getFilesByUserId(req.body.UserId, (err, files) => {
                            if (err) {
                                res.status(400).json({
                                    Message: 'Error while fetching Files!!',
                                    Status: false,
                                    DetailMessage: err,
                                    Data: ''
                                });
                            } else {
                                if (files.length === 0) {
                                    FileUploadModel.addFile(req.body.UserId, fileArray[i].originalname, fileArray[i].location, fileArray[i].originalname.split('.')[1], fileArray[i].size, fileArray[i].mimetype, ++VersionNo, (err, file) => {
                                        if (err) {
                                            flag = false;
                                        } else {
                                            const demo = {
                                                id: file.insertId,
                                                filesArray: fileArray,
                                                locationArray: FileLocationArray,
                                            }
                                            result.push(demo);
                                        }
                                    })
                                } else {
                                    for (let j = 0; j < files.length; j++) {
                                        if (fileArray[i].originalname === files[j].Name) {
                                            if (files[j].VersionNo > VersionNo)
                                                VersionNo = files[j].VersionNo;
                                            files[j].IsLatestVersion = "false"
                                            FileUploadModel.updateFile(files[j].FileId, files[j], (err, file) => {
                                                if (err) {
                                                    res.status(400).json({
                                                        Message: 'Error while adding File !!',
                                                        Status: false,
                                                        DetailMessage: err,
                                                        Data: ''
                                                    });
                                                }
                                            })
                                        }
                                    }
                                    VersionNo++;

                                    FileUploadModel.addFile(req.body.UserId, fileArray[i].originalname, fileArray[i].location, fileArray[i].mimetype.split('/')[1], fileArray[i].size, fileArray[i].mimetype, VersionNo, (err, file) => {
                                        if (err) {
                                            flag = false;
                                        } else {
                                            const demo = {
                                                id: file.insertId,
                                                filesArray: fileArray,
                                                locationArray: FileLocationArray,
                                            }
                                            result.push(demo);
                                        }
                                    })
                                }
                            }
                        })

                    }
                    if (flag === true) {
                        res.status(200).json({
                            Message: 'Inserted Successfully !!',
                            Status: true,
                            DetailMessage: '',
                            Data: result
                        });
                    } else {
                        res.status(400).json({
                            Message: 'Error while inserting data !!',
                            Status: false,
                            DetailMessage: '',
                            Data: ''
                        });
                    }
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};

const getFilesSharedByEmailId = async (req, res) => {
    try {
        const EmailId = req.params.EmailId;
        FileUploadModel.getFilesSharedByEmailId(EmailId, (err, files) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching Files!!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                if (files.length === 0) {
                    res.status(400).json({
                        Message: 'No Files Found !!',
                        Status: false,
                        DetailMessage: '',
                        Data: ''
                    });
                } else {
                    res.status(200).json({
                        Message: 'Files fetched Successfully !!',
                        Status: true,
                        DetailMessage: '',
                        Data: files
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};
const getFilesByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        FileUploadModel.getFilesByUserId(userId, (err, file) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching Files!!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                if (file.length === 0) {
                    res.status(400).json({
                        Message: 'No Files Found !!',
                        Status: false,
                        DetailMessage: '',
                        Data: ''
                    });
                } else {
                    res.status(200).json({
                        Message: 'Files fetched Successfully !!',
                        Status: true,
                        DetailMessage: '',
                        Data: file
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};
const deleteFileById = async (req, res) => {
    try {
        const FileId = req.params.id;
        let flag = false;
        FileUploadModel.getFileById(FileId, (err, file) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching File!!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                if (file.length === 0) {
                    res.status(400).json({
                        Message: 'No File Found !!',
                        Status: false,
                        DetailMessage: '',
                        Data: ''
                    });
                } else {
                    s3.deleteObject({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: file[0].Location.split(".net/")[1]
                    }).promise();
                    FileUploadModel.deleteFileById(FileId, (err, file) => {
                        if (err) {
                            res.status(400).json({
                                Message: 'Error while deleting File !!',
                                Status: false,
                                DetailMessage: err,
                                Data: ''
                            });
                        } else {
                            if (file.length === 0) {
                                res.status(400).json({
                                    Message: 'No File Found !!',
                                    Status: false,
                                    DetailMessage: '',
                                    Data: ''
                                });
                            } else {
                                res.status(200).json({
                                    Message: 'File deleted Successfully !!',
                                    Status: true,
                                    DetailMessage: '',
                                    Data: ''
                                });
                            }
                        }
                    })
                }
            }
        });



    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};

const updateFileById = async (req, res) => {
    try {
        const FileId = req.params.id;
        const reqData = new FileUploadModel(req.body);
        FileUploadModel.getFileById(FileId, (err, file) => {
            if (err) {
                res.status(400).json({
                    Message: 'Error while fetching File!!',
                    Status: false,
                    DetailMessage: err,
                    Data: ''
                });
            } else {
                if (file.length === 0) {
                    res.status(400).json({
                        Message: 'No File Found !!',
                        Status: false,
                        DetailMessage: '',
                        Data: ''
                    });
                } else {
                    FileUploadModel.updateFile(FileId, reqData, (err, file) => {
                        if (err) {
                            res.status(400).json({
                                Message: 'Error while updating File !!',
                                Status: false,
                                DetailMessage: err,
                                Data: ''
                            });
                        } else {
                            res.status(200).json({
                                Message: 'File updated Successfully !!',
                                Status: true,
                                DetailMessage: '',
                                Data: file.insertId
                            });
                        }
                    })
                }
            }
        })
    } catch (err) {
        res.status(500).json({
            Message: 'Internal Server Error !!',
            Status: false,
            DetailMessage: err,
            Data: ''
        });
    }
};
getFilesSharedByEmailId
module.exports = {
    addFiles,
    getFilesByUserId,
    updateFileById,
    getFilesSharedByEmailId,
    deleteFileById
};
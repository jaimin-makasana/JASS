const express = require('express');
const fileUploadRouter = express.Router();
const fileUploadController = require('../controllers/FileUpoad.cjs');

fileUploadRouter.post('/multiple-file-upload', fileUploadController.addFiles);
fileUploadRouter.get('/:id', fileUploadController.getFilesByUserId);
fileUploadRouter.get('/shared/:EmailId', fileUploadController.getFilesSharedByEmailId);
fileUploadRouter.put('/:id', fileUploadController.updateFileById);
fileUploadRouter.delete('/:id', fileUploadController.deleteFileById);

module.exports = fileUploadRouter;
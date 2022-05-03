const dbConn = require("../config/dbMySQL.cjs")

const FileUpload = function (file) {
    this.FileId = file.FileId;
    this.UserId = file.UserId;
    this.Name = file.Name;
    this.Location = file.Location;
    this.Type = file.Type;
    this.Size = file.Size;
    this.MimeType = file.MimeType;
    this.IsShared = file.IsShared ? file.IsShared : "false";
    this.SharedWith = file.SharedWith ? file.SharedWith : '';
    this.IsLatestVersion = file.IsLatestVersion ? file.IsLatestVersion : "true";
    this.VersionNo = file.VersionNo ? file.VersionNo : 1;
}

FileUpload.addFile = (UserId, Name, Location, Type, Size, MimeType, VersionNo, result) => {
    try {
        const params = [UserId, Name, Location.replace('https://jass-file-bucket.s3.amazonaws.com', 'https://d1juzdcqm5r1u8.cloudfront.net'), Type, Size, MimeType, VersionNo];
        dbConn.query('INSERT INTO FileUpload (UserId, Name, Location, Type, Size, MimeType ,IsShared,IsLatestVersion,VersionNo) VALUES( ? , ?, ?, ?, ?, ? , "false","true",?)', params, (err, res) => {
            if (err) {
                console.log("Error while inserting File ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("File inserted Successfully.");
                result(null, res.insertId);
            }
        })
    } catch (err) {
        result(null, err);
    }
}
FileUpload.getFilesByUserId = (reqId, result) => {
    try {
        dbConn.query('SELECT * FROM FileUpload WHERE UserId=?', reqId, (err, res) => {
            if (err) {
                console.log("Error while Fetching Files By UserID ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("Files fetch Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}
FileUpload.getFileById = (reqId, result) => {
    try {
        dbConn.query('SELECT * FROM FileUpload WHERE FileId=? ', reqId, (err, res) => {
            if (err) {
                console.log("Error while Fetching File By FileId ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("File fetch Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}

FileUpload.getFilesSharedByEmailId = (reqId, result) => {
    try {
        dbConn.query('SELECT * FROM FileUpload WHERE IsShared ="true" and IsLatestVersion="true" and SharedWith like "%' + reqId + '%"', (err, res) => {
            if (err) {
                console.log("Error while Fetching Files By EmailId ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("Files----", res);
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}
FileUpload.updateFile = (reqId, reqData, result) => {
    try {
        dbConn.query('UPDATE FileUpload SET IsShared=?,SharedWith=?, IsLatestVersion=? WHERE FileId=?', [reqData.IsShared, reqData.SharedWith, reqData.IsLatestVersion, reqId], (err, res) => {
            if (err) {
                console.log("Error while updating File ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("File updated Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}
FileUpload.deleteFileById = (reqId, result) => {
    try {
        dbConn.query('DELETE FROM FileUpload WHERE FileId=?', [reqId], (err, res) => {
            if (err) {
                console.log("Error while deleting File By ID ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("File deleted Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}
module.exports = FileUpload;
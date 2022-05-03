const dbConn = require("../config/dbMySQL.cjs")

const Users = function (user) {
    this.UserId = user.UserId;
    this.Name = user.Name;
    this.EmailId = user.EmailId;
}

Users.getUsersList = (result) => {
    try {
        dbConn.query('SELECT * FROM Users', (err, res) => {
            if (err) {
                console.log("Error while Fetching Users! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("Users fetch Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}

Users.addUser = (reqData, result) => {
    try {
        dbConn.query('INSERT INTO Users SET ? ', reqData, (err, res) => {
            if (err) {
                console.log("Error while inserting User ! Error:" + JSON.stringify(err, undefined, 2));
                result(null, err);
            } else {
                console.log("User inserted Successfully.");
                result(null, res);
            }
        })
    } catch (err) {
        result(null, err);
    }
}

module.exports = Users;
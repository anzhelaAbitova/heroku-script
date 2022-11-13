
let express = require('express');
let router = express.Router();

let docClient = new AWS.DynamoDB.DocumentClient();
let table = "sports";

router.get('/fetch', (req, res) => {

    let spid = '101';
    let params = {
        TableName: table,
        Key: {
            spid: spid
        }
    };


});

const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors())
// let AWS = require('aws-sdk');
// let docClient = new AWS.DynamoDB.DocumentClient();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash')

const { v4: uuidv4 } = require('uuid');
const CyclicDB = require('cyclic-dynamodb')
const db = CyclicDB("long-cyan-antelope-hoseCyclicDB") 
const tableName = 'frantic-puce-earmuffsCyclicDB';
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())
// app.use(cors())
app.use(methodOverride('_method'))

var corsOptions = {
  origin: 'https://anastashasuvorova.ru/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(async (req, res, next) => {
  console.log(req)
  // if (req.xhr) {
    res.setHeader('Access-Control-Allow-Origin', 'https://anastashasuvorova.ru/')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    )
    next()
  // } else {
  //   res.status(400).end('400 Bad Request')
  // }
})

app.post('/receipts', cors(corsOptions), async (req, res) => {
  try {
    const loginQ = req.body.login || req.query.login
    const receiptsQ = req.body.receipts || req.query.receipts
    console.log(req.query)
//     let search = ''
//     // Receipts.findOne({userLogin: loginQ}, (err, obj) => {
//     //     if(err){
//     //         return console.log(err);
//     //     } 
//     //     if (!obj) {
//     //         const receipt = new Receipts ({
//     //             userLogin: loginQ,
//     //             receipts: [receiptsQ]
//     //           })
//     //          receipt.save(function(err){
//     //             if(err) return console.log(err);
//     //             console.log("Сохранен объект", receipt);
//     //         });
//     //     } else {
//     //         const index = obj.receipts.indexOf(receiptsQ)

//     //         if (index === -1) {
//     //           console.log('index ' + index)
//     //           obj.receipts.push(receiptsQ)
//     //         } else {
//     //           obj.receipts.splice(index, 1);
//     //         }
//     //         console.log(obj.receipts)
//     //         return obj.save()
//     //     }
//     // })
//     var params = {
//       TableName: tableName,
//       Item: {
//         "Id": uuidv4(),
//         "Name": body["name"]
//       }
//     };

//     client.put(params, (err, data) => {
//       if (err) {
//         console.error("Unable to add item.");
//         console.error("Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//       }
//     });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
})

app.get('/receipts', async (req, res) => {
  const loginQ = req.body.login || req.query.login;
  let item = await animals.get(loginQ)
    console.log(item)
//   Receipts.findOne({ userLogin: loginQ }, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.sendStatus(500);
//     }
//     console.log(docs.receipts)
//     return res.send(docs.receipts);
//   })
})

app.get('/receipt-for-one', cors(corsOptions), async (req, res) => {
  const loginQ = req.body.login || req.query.login
  const receiptsQ = req.body.receipts || req.query.receipts
  let item = await animals.get(loginQ)
  console.log(item)
//   // Receipts.findOne({userLogin: loginQ}, (err, obj) => {
//   //   if (err) {
//   //     console.log(err);
//   //     return res.sendStatus(500);
//   //   }
//   //   let result = false
//   //   const index = obj.receipts.indexOf(receiptsQ)
//   //   if (index !== -1) {
//   //     result = true
//   //   } 
//   //   console.log('result' + result)
//   //   return res.send(result);
//   // })

//   docClient.get(params, function (err, data) {
//     if (err) {
//       console.log(err);
//       handleError(err, res);
//     } else {
//       handleSuccess(data.Item, res);
//     }
//   });
})

// //   mongoose.set('useCreateIndex', true);

// //   const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// //   mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// //   const db = mongoose.connection;
// //   db.on('error', console.error.bind(console, 'connection error:'));
// //   db.once('open', function() {
// //     console.log(`we're connected!`);
// //   });

app.listen(port, (err)=> {
  if(err) console.log(err)
  console.log('Server running on port 3000');
});
function handleError(err, res) {
  res.json({
    'message': 'server side error', statusCode: 500, error:
      err
  });
}

function handleSuccess(data, res) {
  res.json({ message: 'success', statusCode: 200, data: data })
}

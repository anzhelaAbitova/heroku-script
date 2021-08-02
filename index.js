if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash')
const session = require('express-session')
//const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const Receipts = require('./models/receipts').Receipts;

const host = '127.0.0.1'
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())
app.use(cors())
app.use(methodOverride('_method'))

app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://anastashasuvorova.ru');
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.post('/receipts', async (req, res) => {
    try {
        const loginQ = req.body.login || req.query.login
        const receiptsQ = req.body.receipts || req.query.receipts
        console.log(req.query)
        let search = ''
        Receipts.findOne({userLogin: loginQ}, (err, obj) => {
            if(err){
                return console.log(err);
            } 
            if (!obj) {
                const receipt = new Receipts ({
                    userLogin: loginQ,
                    receipts: [receiptsQ]
                  })
                 receipt.save(function(err){
                    if(err) return console.log(err);
                    console.log("Сохранен объект", receipt);
                });
            } else {
                const index = obj.receipts.indexOf(receiptsQ)
                
                if (index === -1) {
                  console.log('index ' + index)
                  obj.receipts.push(receiptsQ)
                } else {
                  obj.receipts.splice(index, 1);
                }
                console.log(obj.receipts)
                return obj.save()
            }
        })

    } catch (err) {
      console.log(err);
      return res.sendStatus(500);  
    }})

  app.get('/receipts', (req, res) => {
    const loginQ = req.body.login || req.query.login
    Receipts.findOne({userLogin: loginQ}, (err, docs) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      console.log(docs.receipts)
      return res.send(docs.receipts);
    })
  })

  app.get('/receipt-for-one', (req, res) => {
    const loginQ = req.body.login || req.query.login
    const receiptsQ = req.body.receipts || req.query.receipts
    Receipts.findOne({userLogin: loginQ}, (err, obj) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      let result = false
      const index = obj.receipts.indexOf(receiptsQ)
      if (index !== -1) {
        result = true
      } 
      console.log('result' + result)
      return res.send(result);
    })
  })

  mongoose.set('useCreateIndex', true);

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
  });
  app.listen(port);
  console.log('Server running on port 3000');

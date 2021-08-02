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
        console.log(req.body)
        let search = ''
        Receipts.findOne({login: req.body.login}, (err, docs) => {
            if(err){
                return console.log(err);
            } 
            if (!docs) {
                const receipt = new Receipts ({
                    login: req.body.login,
                    receipts: [req.body.receipts]
                  })
                 receipt.save(function(err){
                    if(err) return console.log(err);
                    console.log("Сохранен объект", receipt);
                });
            } else {
                return Receipts.receipts.push(req.body.receipts)
            }
        })

    } catch (err) {
      console.log(err);
      return res.sendStatus(500);  
    }})

  app.get('/receipts', (req, res) => {
    console.log(req.query);
    Receipts.findOne({login: req.query.login}, (err, docs) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.send(docs);
    })
  })

  mongoose.set('useCreateIndex', true);

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  //const uri = "mongodb+srv://user_34:b5rPniU429Qd8d3n@cluster0.xpo9w.mongodb.net/<dbname>?retryWrites=true&w=majority";

  //const uri = 'mongodb://localhost/test';
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
  });
  app.listen(port);
  console.log('Server running on port 3000');

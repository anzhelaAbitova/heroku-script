const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors({
  origin: 'https://anastashasuvorova.ru',
  optionsSuccessStatus: 200,
  methods: 'GET, PUT, POST, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash')

const CyclicDB = require('cyclic-dynamodb')
const db = CyclicDB("long-cyan-antelope-hoseCyclicDB")
let receipts = db.collection('receipts')
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())
app.use(methodOverride('_method'))

app.post('/receipts', async (req, res) => {
  try {
    const deleteReceipt = (array, receipt) => {
      const index = array.indexOf(receipt);
      if (index > -1) { 
        array.splice(index, 1); 
      }

      return array;
    }
    const loginQ = req.body.login || req.query.login
    const receiptsQ = req.body.receipts || req.query.receipts
    let isDelete = req.body.isDelete || req.query.isDelete
    let oldReceipts = await receipts.get(loginQ)

    console.log(receiptsQ, oldReceipts)
    let item = await receipts.set(loginQ, {
      receipts: [
        isDelete ? deleteReceipt(oldReceipts) : [].concat(oldReceipts?.props?.receipts || [], [receiptsQ])
      ]
    })
    console.log(item)
    if (!item) {
      console.error("Unable to add item.");
      console.error("Error JSON:", JSON.stringify(err, null, 2));
    } else {
      return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
})

app.get('/receipts', async (req, res) => {
  const loginQ = req.body.login || req.query.login;
  let item = await receipts.get(loginQ)
  console.log(item)
  return res.send(item || {});
})

app.get('/receipt-for-one', async (req, res) => {
  const loginQ = req.body.login || req.query.login
  const receiptsQ = req.body.receipts || req.query.receipts
  let item = await receipts.get(loginQ)
  console.log(item)
  return res.send(item || {});
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log('Server running on port 3000');
});

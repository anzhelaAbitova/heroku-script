let app=require('express')();
let dynamoRoute= require('./dynamo');

app.use('/',dynamoRoute);

app.listen('4000',(err)=>{
    if(err) console.log(err)
    else console.log('server running');
})

module.exports=app;
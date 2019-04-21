const express = require("express"),
    app = express();
    var session = require('express-session');
    const bodyParser = require('body-parser');
    // const path = require('path')
    const fs = require('fs')
  //   let csvToJson = require('convert-csv-to-json');


   
  //   let fileInputName = 'postalcodes.csv'; 
  //   let fileOutputName = 'postalcodes.json';
     
  //   // csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

  //  let json =  csvToJson.formatValueByType().getJsonFromCsv(fileInputName);
  //  console.log(json)
 

//     let json = csvToJson.getJsonFromCsv("postalcodes.csv");
// for(let i=0; i<json.length;i++){
//     console.log(json[i]);

// }



    

    

const port = 3000 || process.env.PORT;



if (port === 3000) {
    const dotenv = require('dotenv').config();
}

const portExport = { //Not sure if I need this
  port: port
}
module.exports = portExport;


app.set("view engine", "ejs");

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } //1 hour
  }))

const   screenRoutes  =  require('./public/routes/screenRoutes'),
        storeRoutes    =  require('./public/routes/store');
        checkOutRoutes    =  require('./public/routes/paymentRoute');
        
app.get('/', (req, res)=>{
  res.render('../views/index', {
    title: 'Boredom Busters'
  })
})

app.use(screenRoutes);
app.use(storeRoutes);
app.use(checkOutRoutes);

app.listen(port, () => {
    console.log(`App is running on Port: ${port}`);
})




// <a href="https://icons8.com/icon/108634/menu">Menu icon by Icons8</a>
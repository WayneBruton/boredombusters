const express = require("express");
const router = express.Router();
const pool = require("../routes/connection");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);
const axios = require("axios");

router.get("/getExistingClients/:exists", (req, res) => {
  let exists = req.params.exists;
  let mysql = `select * from clients where email = '${exists}'`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function(error, result) {
      if (error) throw error;
      res.send(result);
    });
    connection.release();
  });
});

router.post("/createClient", (req, res) => {
  let data = req.body;
  // console.log(data)
  let mysql = `insert into clients set ?`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, data, function(error, result) {
      if (error) throw error;
      res.send(result);
    });
    connection.release();
  });
});

router.post("/postOrders", (req, res) => {
  let data = req.body;
  // console.log(data);
  let mySQL2 = "";
  data.forEach((el, index) => {
    if (index == data.length - 1) {
      mySQL2 =
        mySQL2 +
        `(${el.product_id},${el.client_id},${el.item_price},${el.item_weight},${
          el.item_quantity
        },
    '${el.item_name}',${el.sales_weight},${el.sales_value},'${
          el.order_number
        }','${el.product_image}','${el.salesPriceString}')`;
    } else {
      mySQL2 =
        mySQL2 +
        `(${el.product_id},${el.client_id},${el.item_price},${el.item_weight},${
          el.item_quantity
        },
    '${el.item_name}',${el.sales_weight},${el.sales_value},'${
          el.order_number
        }','${el.product_image}','${el.salesPriceString}'),`;
    }
  });
  let mysql = `Insert into orders (product_id,client_id,item_price,item_weight,item_quantity,item_name,sales_weight,sales_value,order_number,product_image,salesPriceString) values`;
  mysql = mysql + mySQL2;

  // console.log(mysql)

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, data, function(error, result) {
      if (error) throw error;
      res.send(result);
    });
    connection.release();
  });
});

router.post("/updateClient/:clientID", (req, res) => {
  let id = req.params.clientID;
  let data = req.body;
  // console.log(data)
  let mysql = `update clients set ? where id = ${id}`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, data, function(error, result) {
      if (error) throw error;
      res.send(result);
    });
    connection.release();
  });
});

router.get("/getThisCart/:order_number", (req, res) => {
  let order = req.params.order_number;
  // let data = (req.body)
  // console.log(data)
  let mysql = `select * from cart where order_number = '${order}'`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function(error, result) {
      if (error) throw error;
      res.send(result);
    });
    connection.release();
  });
});

router.get("/succesURL/:success", (req, res) => {
  let succesURL = cryptr.encrypt(req.params.success);
  let decrypted = cryptr.decrypt(succesURL);
  console.log(succesURL);
  console.log(decrypted);
  res.send(succesURL);
});

router.get("/successFullPayment/:successURL", function(req, res) {
  let successURL = cryptr.decrypt(req.params.successURL);
  successURL = JSON.parse(successURL)
  console.log("Success:", successURL);
  let order_number = successURL.order_number;
  let client_id = successURL.clientID;
  let total_Value = successURL.totalValue;
  console.log(order_number)
  console.log(client_id)

  let mysql1 = `Insert into invoices (order_number, client_id, total_Value) values ('${order_number}', ${client_id}, ${total_Value})`
  let mysql2 = `Update orders set invoiced = true, paid = true where order_number = '${order_number}'`
  let mysql3 = `delete from cart where order_number = '${order_number}'`
  console.log(mysql1)
  console.log(mysql2)
  console.log(mysql3)
  let mysql = `${mysql1};${mysql2};${mysql3}`
  console.log(mysql)
  // pool.getConnection(function(err, connection) {
  //   if (err) {
  //     connection.release();
  //     resizeBy.send("Error with connection");
  //   }
  //   connection.query(mysql, function(error, result) {
  //     if (error) throw error;
  //     res.send(result);
  //   });
  //   connection.release();
  // });

  res.render("../views/menuViews/paymentSuccessful", {
    title: "Success"
  });
});

module.exports = router;

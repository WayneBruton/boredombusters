const express = require("express");
const router = express.Router();
const pool = require("../routes/connection");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);
const axios = require("axios");

router.get("/products", (req, res) => {
  let mysql = "select * from products where available = true";
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

router.get("/getProduct/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let mysql = `select * from products where id = ${id}`;

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

router.get("/getCart/:id", (req, res) => {
  // router.get('/getCart', (req, res) => {
  let id = parseInt(req.params.id);
  // let id = ['1','3']
  let mysql = `select * from products where id = ${id}`;
  // let mysql = `select * from products where id = ?`

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, id, function(error, result) {
      if (error) throw error;
      // console.log(result)
      res.send(result);
    });
    connection.release();
  });
});

router.post("/getCart", (req, res) => {
  let id = req.body;
  // console.log("ID:", id);
  var arr = id.map(function(el) {
    return el.id;
  });
  let mysql =
    "select id, product_name, price, product_weight, product_image from products where id IN (?)";
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, [arr], function(error, result) {
      if (error) throw error;
      // console.log(result)
      res.send(result);
    });
    connection.release();
  });
});

router.post("/createCart", (req, res) => {
  let cartDetails = req.body;
  let finalCart = [];
  let cartDetail = {};
  cartDetails.forEach(el => {
    cartDetail = {
      product_id: el.id,
      item_name: el.product_name,
      item_price: el.price,
      item_weight: el.product_weight,
      product_image: el.product_image,
      item_quantity: el.purchaseQty,
      sales_value: el.salesPrice,
      sales_weight: el.purchaseWeight,
      salesPriceString: el.salesPriceString,
      order_number: el.order_number
    };
    finalCart.push(cartDetail);
  });
  // console.log("Final Cart", finalCart);
  let mysql2 = "";
  let ind = finalCart.length - 1;
  finalCart.forEach((el, index) => {
    if (index === ind) {
      // console.log("This is the last one", el.product_id);
      mysql2 =
        mysql2 +
        `(${el.product_id},'${el.item_name}',${el.item_price},${
          el.item_weight
        },'${el.product_image}',${el.item_quantity},${el.sales_value},${
          el.sales_weight
        },'${el.salesPriceString}','${el.order_number}')`;
    } else {
      // console.log("this is not the last one", el.product_id);
      mysql2 =
        mysql2 +
        `(${el.product_id},'${el.item_name}',${el.item_price},${
          el.item_weight
        },'${el.product_image}',${el.item_quantity},${el.sales_value},${
          el.sales_weight
        },'${el.salesPriceString}','${el.order_number}'),`;
    }
  });

  let mysql = `Insert into cart (product_id, item_name, item_price, item_weight, product_image, item_quantity, sales_value, sales_weight, salesPriceString, order_number) values  `;
  mysql = mysql + mysql2;
  // console.log(mysql);
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function(error, result) {
      if (error) throw error;
      // console.log(result)
      res.send(result);
    });
    connection.release();
  });
});

router.get("/clearCart/:order_number", (req, res) => {
  let order_number = req.params.order_number;
  // console.log(order_number);
  let sql = `delete from cart where order_number = '${order_number}'`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) throw error;
      // console.log(result)
      res.send(result);
    });
    connection.release();
  });
});

router.get("/getCurrentCart/:order_number", (req, res) => {
  let order_number = req.params.order_number;
  // console.log(order_number);
  let sql = `select *  from cart where order_number = '${order_number}'`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) throw error;
      // console.log(result)
      res.send(result);
    });
    connection.release();
  });
});


router.get('/checkoutReference/:order', (req, res)=>{
  let order = cryptr.encrypt(req.params.order)
  console.log(order)
  res.send(order)
})



router.get('/checkout/:order', function (req, res) {
  let returnURL = req.params.order
  let order_number = cryptr.decrypt(req.params.order);
  
  res.render('../views/menuViews/checkout', {
      title: 'Checkout',
      order_number: order_number,
      returnURL: returnURL

  });
});

module.exports = router;

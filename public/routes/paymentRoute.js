const express = require("express");
const router = express.Router();
const pool = require("../routes/connection");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);
const axios = require("axios");
const Report = require("fluentreports").Report;
const moment = require("moment");
// var displayReport = require('./reportDisplayer');

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
  console.log('success',succesURL);
  res.send(succesURL);
});

router.get("/successFullPayment/:successURL", function(req, res) {
  let successURL = cryptr.decrypt(req.params.successURL);
  successURL = JSON.parse(successURL);
  let order_number = successURL.order_number;
  let client_id = successURL.clientID;
  let total_Value = successURL.totalValue;
  let testData = []
  primary_data = []
  let invoiceNumber;


  let mysql1 = `Insert into invoices (order_number, client_id, total_Value) values ('${order_number}', ${client_id}, ${total_Value})`;
  let mysql2 = `Update orders set invoiced = true, paid = true where order_number = '${order_number}'`;
  let mysql3 = `Update orders set invoice_number = (select id from invoices where order_number = '${order_number}') where order_number = '${order_number}'`;
  let mysql4 = `select i.id as invoiceNumber, i.order_number, i.client_id, i.invoice_date, i.total_value, o.product_id, o.item_price, o.item_name, o.item_quantity, 
                o.sales_value, o.invoice_number, c.email, c.first_name, c.delivery_address1, c.delivery_address2, c.delivery_address3, c.postal_code,
                c.suburb, c.city, c.province
                from 
                invoices i, orders o, clients c
                where i.order_number = '${order_number}' and 
                i.order_number = o.order_number and 
                i.client_id = o.client_id and 
                c.id = i.client_id and o.paid = true and o.invoiced = true`;
  let mysql5 = `delete from cart where order_number = '${order_number}'`;

  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5}`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function(error, result) {
      if (error) throw error;
      let primary_data2 = result[3];
      console.log('OUR DATA',primary_data2 )
      invoiceNumber = result[3][0].invoiceNumber
      primary_data2.forEach(el => {
        invoiceDate = moment(el.invoice_date).format("DD-MM-YYYY");
        let data = {
          no: 1,
          date: invoiceDate,
          invoiceNumber: el.invoiceNumber,
          type: "Purchase",
          address_1: el.delivery_address1,
          address_2: el.delivery_address2,
          address_3: el.delivery_address3,
          suburb: el.suburb,
          city: el.city,
          state: el.province,
          zip: el.postal_code,
          qty: el.item_quantity,
          price: el.item_price,
          amount: el.sales_value,
          description: el.item_name,
          "product.product_type": 1,
        };
        testData.push(data)

      });
      invoiceNumber = primary_data2[0].invoiceNumber
      let salesItemAfterDelivery = primary_data2[0].total_value;
      let salesBeforeDelivery = primary_data2.reduce((previous, current)=>{
          previous = previous+=current.sales_value
          return previous 
      },0)
      let delivery = salesItemAfterDelivery - salesBeforeDelivery;
      let data2 = {
        no: 1,
        date: invoiceDate,
        invoiceNumber: '',
        type: "Delivery",
        address_1: '',
        address_2: '',
        address_3: '',
        suburb: '',
        city: '',
        state: '',
        zip: '',
        qty: '',
        price: delivery,
        amount: delivery,
        description: '',
        "product.product_type": 2,
      };
      testData.push(data2)
      let data3 = {
        no: 1,
        date: invoiceDate,
        invoiceNumber: '',
        type: "",
        address_1: '',
        address_2: '',
        address_3: '',
        suburb: '',
        city: '',
        state: '',
        zip: '',
        qty: '',
        price: '',
        amount: salesItemAfterDelivery,
        description: '',
        "product.product_type": 3,
      };
      testData.push(data3)
      console.log('estData',testData);
      primary_data = testData
      printreport(invoiceNumber);



 
    });
    connection.release();
  });

  

  // filelocation = "../files/";
  // // SEND DATA TO REPORT


  res.render("../views/menuViews/paymentSuccessful", {
    title: "Success"
  });
});

let primary_data;

function printreport(invoiceNumber) {
  "use strict";

  var detail = function(x, r, s) {
    x.band(
      [
        { data: r.description, width: 240 },
        { data: r.qty, width: 50, align: 3 },
        { data: r.price.toFixed(2), width: 60, align: 3 },
        { data: r.amount.toFixed(2), width: 90, align: 3 }
        // {data: r.annual, width: 70, align: 3}
      ],
      { x: 30 }
    );
  };

  var productTypeHeader = function(x, r) {
    x.fontBold();
    x.band([{ data: r.type, width: 240, fontBold: true }], { x: 20 });
    x.fontNormal();
  };

  var productTypeFooter = function(x, r) {
    x.fontBold();
    x.band(
      [
        { data: r.type + " Total:", width: 110, align: 3 },
        { data: x.totals.amount.toFixed(2), width: 90, align: 3 }
      ],
      { x: 270 }
    );
    x.fontNormal();

    x.fontNormal();
  };

  var proposalHeader = function(x, r) {
    var fSize = 9;
    x.print("Some arbitrary addressAA in the Eastern Cape, OK 73533", {
      x: 20,
      fontsize: fSize
    });
    x.print("INVOICE", { x: 40, y: 70, fontSize: fSize + 19, fontBold: true });
    // x.print('THIS IS NOT AN INVOICE', {x: 40, y: 100, fontsize: fSize + 4, fontBold: true});
    // x.print('Questions? Please call us.', {x: 40, y: 150, fontsize: fSize});
    x.band(
      [
        { data: "Invoice #:", width: 70, fontSize: 9 },
        { data: r.invoiceNumber, width: 70, align: "left", fontSize: 9 }
      ],
      { x: 400, y: 60 }
    );
    invoiceNumber = r.invoiceNumber
    x.band(
      [
        { data: "Date:", width: 70, fontSize: 9 },
        { data: r.date, width: 70, fontSize: 9 }
      ],
      { x: 400 }
    );
    // x.band([{data: 'Prepared By:', width: 100}, {data: "Boredom Busters", width: 100, fontSize: 9}], {x: 400});
    x.band(
      [{ data: "Prepared For:", width: 100, fontSize: 9, fontBold: true }],
      { x: 400 }
    );
    x.fontSize(9);

    if (r.name) {
      x.band([{ data: r.name, width: 150 }], { x: 410 });
    }
    if (r.address_1) {
      x.band([{ data: r.address_1, width: 150 }], { x: 410 });
    }
    if (r.address_2) {
      x.band([{ data: r.address_2, width: 150 }], { x: 410 });
    }
    if (r.address_3) {
      x.band([{ data: r.address_3, width: 150 }], { x: 410 });
    }
    if (r.suburb) {
      x.band([{ data: r.suburb, width: 150 }], { x: 410 });
    }
    if (r.city) {
      x.band([{ data: r.city + ", " + r.state + " " + r.zip, width: 150 }], {
        x: 410
      }
      );
    }

    x.fontSize(8);
    // x.print('This quote is good for 60 days from the date prepared. Product availability is subject to change without notice. Due to rapid changes in technology, ' +
    // 'and to help us keep our prices competitive, we request that you appropriate an additional 5-10% of the hardware shown on the proposal to compensate ' +
    // 'for possible price fluctuations between the date this proposal was prepared and the date you place your order.  Once a proposal has been approved and  ' +
    // 'hardware ordered, returned goods are subject to a 15% restocking fee.', {x: 40, y: 175, width: 540});
    x.newline();
    // x.print('Any travel fees quoted on this proposal may be reduced to reflect actual travel expenses.', {x: 40});
    x.newline();
    x.fontSize(11);
    x.band(
      [
        { data: "Description", width: 250 },
        { data: "Qty", width: 60, align: 3 },
        { data: "Price", width: 70, align: 3 },
        { data: "Total", width: 90, align: 3 }
        // {data: 'Annual', width: 70, align: 3}
      ],
      { x: 0 }
    );
    x.bandLine(1);
  };

  var proposalFooter = function(x, r) {
    x.newline();
    x.newline();
    x.newline();
    x.newline();
    x.newline();
    x.fontSize(7.5);
    x.print(
      "To place an order for the goods and services provided by us, please either contact us to place your order or fax a copy " +
        "of your PO to 999-555-1212",
      { x: 40, width: 570 }
    );
    x.print(
      "Please call us if you have any other questions about your order. Thank you for your business!",
      { x: 40, width: 570 }
    );
  };

  var report = new Report(`public/files/Invoice-${invoiceNumber}.pdf`).data(primary_data);

  var r = report
    .margins(20)
    .pageheader(function(x) {
      x.print("Boredom Buster's Invoicing System");
    })
    .detail(detail);

  report
    .groupBy("no")
    .header(proposalHeader)
    .footer(proposalFooter)

    .groupBy("product.product_type")
    .sum("amount")

    .header(productTypeHeader)
    .footer(productTypeFooter);

  r.printStructure();
  report.render(function(err, name) {
    // console.timeEnd("Rendered");
  });
}

module.exports = router;

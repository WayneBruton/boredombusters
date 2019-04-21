$(function() {
  let productsArray = [];
  let finalorder = [];
  let totalCart = 0;
  let totalCartItem = 0;
  let deliveryCost = 99.0; //HARD CODED FOR NOW!!
  let nett = 0;
  // window.localStorage.removeItem("myIPAddress");
  // window.localStorage.removeItem("cart");
  let myIPAddress = "";

  // ===================================== CHECK IF LOCAL STORAGE
  if (window.localStorage.getItem("cart") !== null) {
    let newLocal = window.localStorage.getItem("cart");
    newLocal = JSON.parse(newLocal);
    productsArray = newLocal;
    finalorder = newLocal;
    recalcTotals();
  }

  // console.log(finalorder);
  // ============== Test Dates =============
  // let a = Math.floor(Date.now() / 1000);
  // console.log(a);
  // a = a + 360000;
  // console.log(a);
  // console.log(a - 360000);

  // =====================================

  getCart();
  viewCartBtn();

  $.get("/products").then(response => {
    $("#stockItems").empty();
    response.forEach(el => {
      let description = el.product_description;
      if (description.length > 160) {
        description = description.substring(0, 160) + "...";
      }
      let newPrice = convertToString(el.price);
      let card = `<div class="card text-center" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${el.product_name}</h5>
                                <img class="storeImage" src="${
                                  el.product_image
                                }" alt="product Name" style="width: 100%;">
                                <br><br>
                                <p class="card-text">${description}</p>
                                <hr>
                                <p class="card-text"><em>${newPrice}</em></p>
                                <p class="card-text"><em>Stock ID:${
                                  el.id
                                }</em></p>
                                <a id="${
                                  el.id
                                }" href="#" class="btn btn-primary boredomBtn viewDetailProduct">See More!</a>
                            </div>
                        </div>`;
      $(card).appendTo("#stockItems");
    });
  });

  $("#stockItems").on("click", ".viewDetailProduct", function() {
    let id = $(this).attr("id");
    let url = `/getProduct/${id}`;
    $.get(url).then(response => {
      $("#stockItems")
        .fadeOut(800)
        .css("display", "none");
      $("#individualstockItem").empty();
      $("#stockDetail")
        .fadeIn(800)
        .css("display", "flex; flex-direction: column;");
      let newPrice = convertToString(response[0].price);
      let stockItem = `<div id="thisStockItem" style="display:flex; justify-content: center; margin: 10px 0;">
                                <button class="btn btn-primary boredomBtn return">Return to store</button></div><hr>
                        <div id="stockItemMobile" style="display:flex;">
                            <div id="individualstockImg">
                                <img id="stockImg" src="${
                                  response[0].product_image
                                }" alt="">
                            </div>
                            <div id="stockDetail">
                                <div id="orderDetail">
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Product</label>
                                        <input id="${
                                          response[0].id
                                        }" type="text" value="${
        response[0].product_name
      }" disabled style="background-color: lightgray; border: none;">
                                    </div>
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Price</label>
                                        <input id="productPrice" type="text" value="${newPrice}" disabled style="background-color: lightgray; border: none;">
                                    </div>
                                    <hr>
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Quantity</label>
                                        <input id="orderQty" type="number" value="1">
                                    </div>
                                    <hr>
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Total</label>
                                        <input id="newTotal" type="text" value="${newPrice}" disabled style="background-color: lightgray; border: none;">
                                    </div>
                                    <div class="orderDetailItems">
                                        <button id="${
                                          response[0].id
                                        }" type="text"  class="btn btn-primary boredomBtn addToCart">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                            </div><hr>
                            <div>
                                <label for=""><strong>Description</strong></label>
                                <p>${response[0].product_description}</p>
                            </div>`;
      $(stockItem).appendTo("#individualstockItem");
      $("#individualstockItem").css("display", "flex");
    });
  });

  $("#individualstockItem").on("click", ".return", function() {
    $("#individualstockItem")
      .fadeOut(800)
      .css("display", "none");
    $("#stockItems")
      .fadeIn(800)
      .css("display", "flex");
    // $('#checkoutdiv').css('display', 'none')
  });

  //   ====================CREATE NEW TOTAL ON INDIVIDUAL STOCK PAGE ================

  $("#individualstockItem").on("change", "#orderQty", function() {
    let num = $(this).val();
    let price = $("#productPrice").val();
    let convertPrice = price.length;
    price = parseFloat(price.substring(1, convertPrice));
    let total = (num * price).toString();
    total = total.split(".");
    if (total.length == 1) {
      total = `R${total}.00`;
    } else if (total.length == 2) {
      if (total[1].length == 1) {
        total = `R${total[0]}.${total[1]}0`;
      } else if (total[1].length == 2) {
        total = `R${total[0]}.${total[1]}`;
      } else if (total[1].length > 2) {
        total = `R${total[0]}.${Math.round(total[1].substring(0, 2) * 100) /
          100}`;
      }
    }
    $("#newTotal").val(total);
  });

  //   ====================CREATE NEW TOTAL ON INDIVIDUAL STOCK PAGE ================

  $("#individualstockItem").on("blur", "#orderQty", function() {
    let num = $(this).val();
    let price = $("#productPrice").val();
    // let total = convertToString(num * price)
    let convertPrice = price.length;
    price = parseFloat(price.substring(1, convertPrice));
    let total = (num * price).toString();
    total = total.split(".");
    if (total.length == 1) {
      total = `R${total}.00`;
    } else if (total.length == 2) {
      if (total[1].length == 1) {
        total = `R${total[0]}.${total[1]}0`;
      } else if (total[1].length == 2) {
        total = `R${total[0]}.${total[1]}`;
      } else if (total[1].length > 2) {
        total = `R${total[0]}.${Math.round(total[1].substring(0, 2) * 100) /
          100}`;
      }
    }
    $("#newTotal").val(total);
  });

  function recalcTotals() {
    let total = 0;
    if (finalorder != null) {
      total = finalorder.reduce((previous, item) => {
        previous = previous + item.qty;
        return previous;
      }, 0);
    }
    $("#orderTotalQty").text(total);
    viewCartBtn();
  }

  // =================== Create Final Order======================

  $("#individualstockItem").on("click", ".addToCart", function() {
    let newNum = parseInt($("#orderQty").val());
    let oldNum = parseInt($("#orderTotalQty").text());
    let result = newNum + oldNum;
    $("#orderTotalQty").text(result);
    let id = parseInt($(this).attr("id"));
    let items = {
      id: id,
      qty: newNum
    };
    productsArray.push(items);
    $("#individualstockItem").css("display", "none");
    $("#stockItems").css("display", "flex");
    let idArray = [];
    finalorder = [];
    for (i = 0; i < productsArray.length; i++) {
      idArray.push(productsArray[i].id);
    }
    let finalProducts = idArray.filter(onlyUnique);
    finalProducts.forEach(id => {
      let filteredArray = productsArray.filter(el => {
        return id === el.id;
      });
      let total = filteredArray.reduce((previous, quantity) => {
        previous = previous + quantity.qty;
        return previous;
      }, 0);
      let orders = {
        id: id,
        qty: total
      };
      finalorder.push(orders);
      createLocalStorage();
    });
    viewCartBtn();
  });

  // CREATE LOCAL STORAGE==========================================

  function createLocalStorage() {
    if (finalorder.length) {
      let local = JSON.stringify(finalorder);
      window.localStorage.setItem("cart", local);
    } else {
      window.localStorage.removeItem("cart");
      $("#orderTotalQty").text("0");
    }
    viewCartBtn();
  }

  // ======================= View Cart ===========================

  $(".return").click(e => {
    $("#individualstockItem").css("display", "none");
    $("#shoppingCart").css("display", "none");
    $("#stockItems").css("display", "flex");
    $("#checkoutdiv").css("display", "none");
    totalCart = 0;
    totalCartItem = 0;
  });

  $(".viewCart").click(e => {
    e.preventDefault();
    $("#stockItems")
      .fadeOut(800)
      .css("display", "none");
    $("#individualstockItem")
      .fadeOut(800)
      .css("display", "none");
    $("#shoppingCart")
      .fadeIn(800)
      .css("display", "block");
    $("#checkoutdiv").css("display", "block");
    getCart();
  });

  $("#cartItems").on("click", ".removeItem", function() {
    let cartItemId = $(this).attr("id");
    cartItemId = cartItemId.split("item");
    cartItemId = parseInt(cartItemId[1]);
    for (i = 0; i < finalorder.length; i++) {
      if (finalorder[i].id == cartItemId) {
        finalorder.splice(i, 1);
      }
    }
    let total = finalorder.reduce((previous, amount) => {
      previous = previous + amount.qty;
      return previous;
    }, 0);
    $("#orderTotalQty").text(total);
    productsArray = finalorder;
    totalCart = 0;
    totalCartItem = 0;
    createLocalStorage();
    getCart();
    viewCartBtn();
    if (!finalorder.length) {
      $("#individualstockItem").css("display", "none");
      $("#shoppingCart").css("display", "none");
      $("#stockItems").css("display", "flex");
    }
  });

  $("#checkoutBtn").click(e => {
    // window.localStorage.removeItem("cart");

    let url = `/checkoutReference/${myIPAddress}`
    $.get(url).done((response)=>{
      console.log(response)
      let url = `/checkout/${response}`
      window.location.href = url
    })
    
    // $("#alert").css("display", "block");
    // setTimeout(() => {
    //   $("#alert").css("display", "none");
    // }, 4000);
  });

  // ================ Functions ===================

  let finalCart = [];
  function getCart() {
    //BUSY ON THIS I AM HERE
    if (finalorder.length) {
      createUniqueOrderNumber();
      $("#cartItems").empty();
      $("#cartValues").empty();
      // $("#cartItems").focus();
      let data = JSON.stringify(finalorder);
      let url = "/getCart";
      $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: data => {},
        contentType: "application/json",
        dataType: "json"
      }).done(response => {
        console.log(finalorder);
        finalCart = response;
        console.log(finalCart);
        finalCart.forEach(el => {
          finalorder.forEach(fo => {
            if (fo.id === el.id) {
              el.purchaseQty = fo.qty;
              el.salesPrice = el.purchaseQty * el.price;
              el.purchaseWeight = el.purchaseQty * el.product_weight;
              el.salesPriceString = convertToString(el.salesPrice);
              el.order_number = myIPAddress;
            }
          });
        });
        let url = `/clearCart/${myIPAddress}`;
        $.get(url).done(response => {
          let data = JSON.stringify(finalCart);
          let url = `/createCart`;
          $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: data => {},
            contentType: "application/json",
            dataType: "json"
          }).done(response => {
            let url = `/getCurrentCart/${myIPAddress}`;
            $.get(url).done(response => {
              console.log(response);
              response.forEach(el => {
                let item = `<li class="cartItems" style="width: 100%; display: flex; justify-content: space-between; margin: 5px 0;">
                            <img style="width: 50px; height: 50px; border: 1px solid grey; border-radius:7px;"src="${
                              el.product_image
                            }" alt="">
                            <p style="padding-top: 10px; width: 50%; margin-left:10px;"><strong>${
                              el.item_name
                            }</strong></p> 
                            <p style="padding-top: 10px;">Quantity:</p>
                            <input id="cartItemQty" style="background-color: lightgrey; border: none; align: center; text-align:center" type="text" value="${
                              el.item_quantity
                            }"> 
                            <button id="item${
                              el.product_id
                            }" class="btn btn-primary boredomBtn removeItem" style="margin: 0 2px;">X</button>
                        </li>
                        `;
                $(item).appendTo("#cartItems");
                let cartAmounts = `<div style="display: flex; justify-content: space-between; width:100%;">
                                <label for="">${el.item_name}:</label>
                                <input style="border: none; background-color: lightgrey; text-align: right; margin-right: 7px;" type="text" value="${
                                  el.salesPriceString
                                }">
                                  </div>`;
                $(cartAmounts).appendTo("#cartValues");
              });
              let subtotal = response.reduce((prev, curr) => {
                prev += curr.sales_value;
                return prev;
              }, 0);
              let delivery = response.reduce((prev, curr) => {
                prev += curr.sales_weight;
                return prev;
              }, 0);
              if (delivery < 5) {
                delivery = 99;
              } else {
                let round = delivery - 5
                if (Math.trunc(round) !== round) {
                  round++
                }
                delivery = 99 + (round * 20)
              }
              let nett = subtotal + delivery;
              subtotal = convertToString(subtotal);
              delivery = convertToString(delivery);
              nett = convertToString(nett);
              $("#subtotal").val(subtotal);
              $("#delivery").val(delivery);
              $("#nett").val(nett);
            });
          });
        });
      });
    } else {
      // window.localStorage.removeItem("myIPAddress");
    }
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function viewCartBtn() {
    if ($("#orderTotalQty").text() == "0") {
      let opacity = 0;
      $("#cartSummary")
        .fadeIn(800)
        .css("opacity", opacity);
      $("#cartSummary").css("height", 36);
    } else {
      let opacity = 1;
      $("#cartSummary")
        .fadeIn(800)
        .css("opacity", opacity);
      if (screen.width < 400) {
        $("#cartSummary").css("height", 86);
      } else {
        $("#cartSummary").css("height", 36);
      }
    }
  }

  // CONVERT TO STRING FOR lookupS
  // ===================================

  function convertToString(num) {
    num = Math.trunc(Math.floor(num * 100));
    let numArray = num.toString().split("");
    numArray.unshift("R");
    numArray.splice(numArray.length - 2, 0, ".");
    let convertedToString = numArray.join("");
    return convertedToString;
  }

  // create unique Order Number
  // ==============================

  function createUniqueOrderNumber() {
    if (window.localStorage.getItem("myIPAddress") == null) {
      let nowTimeStamp = Math.floor(Date.now() / 1000);
      $.getJSON("https://ipapi.co/json/", function(data) {})
        .done(response => {
          myIPAddress = `${response.ip}-${nowTimeStamp}`;
          window.localStorage.setItem("myIPAddress", myIPAddress);
          console.log(
            "myIpAddress created and inserted into Local Storage",
            window.localStorage.getItem("myIPAddress")
          );
        })
        .catch(() => {
          $.getJSON("http://ip-api.com/json?callback=?", function(data) {
            myIPAddress = JSON.stringify(data, null, 2);
          })
            .done(response => {
              myIPAddress = `${response.query}-${nowTimeStamp}`;
              window.localStorage.setItem("myIPAddress", myIPAddress);
            })
            .catch(() => {
              myIPAddress = `123.456.7-${nowTimeStamp}`;
              window.localStorage.setItem("myIPAddress", myIPAddress);
            });
        });
    } else {
      myIPAddress = window.localStorage.getItem("myIPAddress");
      console.log(
        "myIpAddress from Local Storage",
        window.localStorage.getItem("myIPAddress")
      );
    }
  }

  // auto clear local storage

  // var idleTime = 0
  // $(document).ready(function () {
  //     var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
  //     idleInterval

  //     $(this).mousemove(function (e) {
  //         idleTime = 0
  //     })
  //     $(this).keypress(function (e) {
  //         idleTime = 0
  //     })
  // })

  // function timerIncrement() {
  //     idleTime = idleTime + 1
  //     if (idleTime > 19) { // 20 minutes
  //         var url = '/logout'
  //         $.get(url, function(e){
  //             console.log("relocating")
  //             window.location.href = '/logout'
  //         })
  //     }
  // }
});

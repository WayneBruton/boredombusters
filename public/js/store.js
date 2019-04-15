$(function() {
  let productsArray = [];
  let finalorder = [];
  viewCartBtn();
  $.get("/products").then(response => {
    $("#stockItems").empty();
    response.forEach(el => {
      let description = el.product_description;
      if (description.length > 160) {
        description = description.substring(0, 160) + "...";
      }
      let newPrice = el.price.toString();
      newPrice = newPrice.split(".");
      if (newPrice.length == 1) {
        newPrice = newPrice[0] + ".00";
      } else if (newPrice.length == 2) {
        if (newPrice[1].length == 1) {
          newPrice = `${newPrice[0]}.${newPrice[1]}0`;
        } else {
          newPrice = `${newPrice[0]}.${newPrice[1]}`;
        }
      }
      let card = `<div class="card text-center" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${el.product_name}</h5>
                                <img class="storeImage" src="${
                                  el.product_image
                                }" alt="product Name" style="width: 100%;">
                                <br><br>
                                <p class="card-text">${description}</p>
                                <hr>
                                <p class="card-text"><em>R${newPrice}</em></p>
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
      $("#stockItems").css("display", "none");
      $("#individualstockItem").empty();
      $("#stockDetail").css("display", "flex; flex-direction: column;");
      let newPrice = response[0].price.toString();
      newPrice = newPrice.split(".");
      if (newPrice.length == 1) {
        newPrice = newPrice[0] + ".00";
      } else if (newPrice.length == 2) {
        if (newPrice[1].length == 1) {
          newPrice = `${newPrice[0]}.${newPrice[1]}0`;
        } else if (newPrice[1].length == 2) {
          newPrice = `${newPrice[0]}.${newPrice[1]}`;
        }
      }
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
                                        <input id="productPrice" type="text" value="R${newPrice}" disabled style="background-color: lightgray; border: none;">
                                    </div>
                                    <hr>
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Quantity</label>
                                        <input id="orderQty" type="number" value="1">
                                    </div>
                                    <hr>
                                    <div class="orderDetailItems">
                                        <label class="orderDetailItemsLabel" for="">Total</label>
                                        <input id="newTotal" type="text" value="R${newPrice}" disabled style="background-color: lightgray; border: none;">
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
    $("#individualstockItem").css("display", "none");
    $("#stockItems").css("display", "flex");
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
    });
    viewCartBtn();
  });
  // ======================= View Cart ===========================

  $(".return").click(e => {
    $("#individualstockItem").css("display", "none");
    $("#shoppingCart").css("display", "none");
    $("#stockItems").css("display", "flex");
    totalCart = 0;
    totalCartItem = 0;
  });

  $(".viewCart").click(e => {
    e.preventDefault();
    $("#stockItems").css("display", "none");
    $("#individualstockItem").css("display", "none");
    $("#shoppingCart").css("display", "block");
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
    getCart();
    viewCartBtn();
    if (!finalorder.length) {
      $("#individualstockItem").css("display", "none");
      $("#shoppingCart").css("display", "none");
      $("#stockItems").css("display", "flex");
    }
  });

  $("#checkoutBtn").click(e => {
    $("#alert").css("display", "block");
    setTimeout(() => {
      $("#alert").css("display", "none");
    }, 4000);
  });
  // ================ Functions ===================
  let totalCart = 0;
  let totalCartItem = 0;
  let deliveryCost = 99.0; //HARD CODED FOR NOW!!
  let nett = 0;
  function getCart() {
    $("#cartItems").empty();
    $("#cartValues").empty();
    $("#cartItems").focus();
    finalorder.forEach(el => {
      let url = `/getCart/${el.id}`;
      $.get(url).done(response => {
        let item = `<li class="cartItems" style="width: 100%; display: flex; justify-content: space-between; margin: 5px 0;">
                            <img style="width: 50px; height: 50px; border: 1px solid grey; border-radius:7px;"src="${
                              response[0].product_image
                            }" alt="">
                            <p style="padding-top: 10px; width: 50%; margin-left:10px;"><strong>${
                              response[0].product_name
                            }</strong></p> 
                            <p style="padding-top: 10px;">Quantity:</p>
                            <input id="cartItemQty" style="background-color: lightgrey; border: none; align: center;" type="text" value="${
                              el.qty
                            }"> 
                            <button id="item${
                              response[0].id
                            }" class="btn btn-primary boredomBtn removeItem" style="margin: 0 2px;">X</button>
                        </li>`;
        $(item).appendTo("#cartItems");
        let price = response[0].price;
        let quantitiy = el.qty;
        totalCartItem = price * quantitiy;
        totalCart = totalCart + totalCartItem;
        let totalCartItemArray = totalCartItem.toString();
        totalCartItemArray = totalCartItemArray.split(".");
        nett = deliveryCost + totalCart;
        if (totalCartItemArray.length == 1) {
          totalCartItem = `${totalCartItemArray[0]}.00`;
        } else if (totalCartItemArray.length == 2) {
          if (totalCartItemArray[1].length == 1) {
            totalCartItem = `${totalCartItemArray[0]}.${
              totalCartItemArray[1]
            }0`;
          } else if (totalCartItemArray[1].length >= 2) {
            totalCartItem = `${
              totalCartItemArray[0]
            }.${totalCartItemArray[1].substring(0, 2)}`;
          }
        }
        let cartAmounts = `<div style="display: flex; justify-content: space-between; width:100%;">
                                <label for="">${
                                  response[0].product_name
                                }:</label>
                                <input style="border: none; background-color: lightgrey;" type="text" value="R${totalCartItem}">
                            </div>
                            `;
        $(cartAmounts).appendTo("#cartValues");
      });
    });
    setTimeout(() => {
      let other = `<hr>
                     <div style="display: flex; justify-content: space-between; width:100%;">
                        <label for="">Subtotal:</label>
                        <input style="border: none; background-color: lightgrey;" type="text" value="R${totalCart}">
                    </div>
                     <div style="display: flex; justify-content: space-between; width:100%;">
                        <label for="">Delivery:</label>
                        <input style="border: none; background-color: lightgrey;" type="text" value="R${deliveryCost}">
                    </div>
                    <hr>
                     <div style="display: flex; justify-content: space-between; width:100%;">
                        <label for="">Nett:</label>
                        <input style="border: none; background-color: lightgrey; " type="text" value="R${nett}">
                    </div>
                    `;

      $(other).appendTo("#cartValues");
    }, 50);
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
      $("#cartSummary").css("height", 0);
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
});

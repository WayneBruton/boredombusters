$(function() {

  
  let cities = [];
  let province = [];
  let insert = true;
  // let suburbsSA = []
  let order_number = $("#order_number").val();

  $("#city").css("height", $("#delivery_address3").css("height"));
  $("#province").css("height", $("#delivery_address3").css("height"));
  areas.forEach(el => {
    cities.push(el.city);
    province.push(el.admin);
  });
  // pCodes.forEach((el)=>{
  //   suburbsSA.push(el.SUBURB)
  // })
  // console.log(suburbsSA)
  cities.sort();
  province = province.filter(onlyUnique).sort();

  $("#city").empty();
  $("#province").empty();
  $("#city").append(`<option value="none">Choose your city</option>`);
  $("#province").append(`<option value="none">Choose your province</option>`);
  cities.forEach(el => {
    let cityname = `<option value="${el}">${el}</option>`;
    $(cityname).appendTo("#city");
  });
  province.forEach(el => {
    let provincename = `<option value="${el}">${el}</option>`;
    $(provincename).appendTo("#province");
  });
  //   ==================================
  //   city & province details
  $("#city").change(e => {
    e.preventDefault();
    let city = $("#city").val();
    let cityArray = areas.find(el => {
      return el.city == city;
    });
    // console.log(cityArray);
    $("#cityInput").val(city);
    $("#province").val(cityArray.admin);
    $("#provinceInput").val(cityArray.admin);
  });
  $("#province").change(e => {
    e.preventDefault();
    let province = $("#province").val();
    $("#provinceInput").val(province);
  });

  //   ===========================================================
  //   modal form if email used already
  let existingClient;
  $("#email").blur(e => {
    if ($("#email").val() !== "") {
      let url = `/getExistingClients/${$("#email").val()}`;
      $.get(url).done(response => {
        // console.log(response);
        if (response.length) {
          existingClient = response;
          let position = $("#heading").position();

          let top = position.top;
          let left = position.left + $("#heading").width() / 3;
          $("#checkedEmail").css("top", top);
          $("#checkedEmail").css("left", left);
          $("#checkedEmail").css("display", "flex");
          emailExists();
          clientID = response[0].id;
        }
      });
    }
  });

  //   ============================================
  //   MODAL BUTONS

  $("#noBtn").click(e => {
    e.preventDefault();
    insert = true;
    resetEmailExists();
    $("#checkedEmail").css("display", "none");
  });

  $("#yesBtn").click(e => {
    e.preventDefault();
    resetEmailExists();
    // console.log(existingClient);
    $("#city").attr("hidden", true);
    $("#province").attr("hidden", true);
    $("#cityInput").attr("hidden", false);
    $("#provinceInput").attr("hidden", false);
    insert = false;
    $("#email").val(existingClient[0].email),
      $("#first_name").val(existingClient[0].first_name);
    $("#last_name").val(existingClient[0].last_name);
    $("#contact_number").val(existingClient[0].contact_number);
    $("#delivery_address1").val(existingClient[0].delivery_address1);
    $("#delivery_address2").val(existingClient[0].delivery_address2);
    $("#delivery_address3").val(existingClient[0].delivery_address3);
    $("#suburb").val(existingClient[0].suburb);
    $("#cityInput").val(existingClient[0].city);
    $("#provinceInput").val(existingClient[0].province);
    $("#postal_code").val(existingClient[0].postal_code);
    $("#checkedEmail").css("display", "none");
  });

  // ================================
  //PAY NOW BUTTON
  let clientID;
  let salesValue;
  let deliveryValue;
  let totalValue;
  let successURL;
  let failURL = $('#returnURL').val()
  $("#payNow").click(e => {
    if (
      $("#email").val() !== "" &&
      $("#first_name").val() !== "" &&
      $("#last_name").val() !== "" &&
      $("#delivery_address1").val() !== "" &&
      $("#suburb").val() !== "" &&
      $("#postal_code").val() !== "" &&
      $("#contact_number").val() !== ""
    ) {
      e.preventDefault();
      let data = {
        email: $("#email").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        contact_number: $("#contact_number").val(),
        delivery_address1: $("#delivery_address1").val(),
        delivery_address2: $("#delivery_address2").val(),
        delivery_address3: $("#delivery_address3").val(),
        suburb: $("#suburb").val(),
        city: $("#cityInput").val(),
        province: $("#provinceInput").val(),
        postal_code: $("#postal_code").val()
      };
      data = JSON.stringify(data);
    //   console.log(data);
      let url;
      if (insert) {
        url = `/createClient`;
      } else {
        url = `/updateClient/${clientID}`;
      }
      $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: data => {},
        contentType: "application/json",
        dataType: "json"
      }).done(response => {
        let url = `/getExistingClients/${$("#email").val()}`;
        $.get(url).done(response => {
        //   console.log(response);
          clientID = response[0].id;
        //   console.log(clientID);
          let url2 = `/getThisCart/${order_number}`;
          $.get(url2).done(response => {
            // console.log('URL2',response);
            let finalOrder = response;
            let ordersData = [];
            finalOrder.forEach((el)=>{
                let order = {
                    product_id: el.product_id,
                    client_id: clientID,
                    item_price: el.item_price,
                    item_weight: el.item_weight,
                    item_quantity: el.item_quantity,
                    item_name: el.item_name,
                    sales_weight: el.sales_weight,
                    sales_value: el.sales_value,
                    order_number: el.order_number,
                    product_image: el.product_image,
                    salesPriceString: el.salesPriceString
                  };
                  ordersData.push(order)
            })
            salesValue = ordersData.reduce((previous, el)=>{
                return previous+= el.sales_value
            },0)
            deliveryValue = ordersData.reduce((previous, el)=>{
                return previous+= el.item_weight * el.item_quantity
            },0)
            if (deliveryValue < 5) {
                deliveryValue = 99
            } else {
                let round = deliveryValue - 5;
                if (Math.trunc(round) !== round ) {
                    round = Math.trunc(round) + 1;
                }
                deliveryValue = 99 + (round * 20)
            }
            totalValue = salesValue + deliveryValue
            // console.log(salesValue)
            // console.log(deliveryValue)
            console.log(totalValue)
            let ordersURL = '/postOrders'
            let thisData = JSON.stringify(ordersData)
            $.ajax({
                url: ordersURL,
                type: "POST",
                data: thisData,
                success: data => {},
                contentType: "application/json",
                dataType: "json"
              }).done((response)=>{
                  console.log('GO TO PAYFAST AND PAY')
                  console.log(clientID)
                  console.log(totalValue)
                  console.log(order_number)
                  let data = {
                    clientID: clientID,
                    totalValue: totalValue,
                    order_number: order_number
                  }
                  let success = JSON.stringify(data)
                  console.log(success)
                  $.get(`/succesURL/${success}`)
                  .done((response)=>{
                    successURL = response;
                    console.log('success',successURL)
                    let relocationToPay = `https://www.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10469596&amp;item_name=BoredomBusters&amp;item_description=Boredom+Busters&amp;amount=${totalValue}&amp;return_url=https%3A%2F%2Fwww.boredombusters.co.za/successFullPayment/${successURL}.com&amp;cancel_url=https%3A%2F%2Fwww.boredombusters.co.za/checkout/${failURL}`
                    $('#makePayment').attr('href', relocationToPay)
                    // console.log($('#makePayment').prop('href'))
                    // console.log($('#makePayment').attr('href'))
                    $('#makePayment')[0].click()
                    // window.location.href=relocationToPay

                  })
              })
              
          });
        });
      });
    }
  });

  // //FUNCTIONS
  // ====================
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
});

function emailExists() {
  $(".ifExisting").attr("disabled", true);
}
function resetEmailExists() {
  $("#email").focus();
  $(".ifExisting").attr("disabled", false);
  $(".ifExisting").val("");
  $("#city").val("none");
  $("#province").val("none");
}

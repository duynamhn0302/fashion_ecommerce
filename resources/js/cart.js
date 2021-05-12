$(document).ready(function () {
  getProductsNumber();
  $(
    '<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>'
  ).insertAfter(".quantity input");
  $(".quantity").each(function () {
    var spinner = $(this),
      input = spinner.find('input[type="number"]'),
      btnUp = spinner.find(".quantity-up"),
      btnDown = spinner.find(".quantity-down"),
      min = input.attr("min"),
      max = input.attr("max");

    btnUp.click(function () {
      var oldValue = parseFloat(input.val());
      if (oldValue >= max) {
        var newVal = oldValue;
        swal.fire({
          position: "center",
          icon: "error",
          // iconColor: "#F51167",
          title: "Số lượng còn lại không đủ",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        var newVal = oldValue + 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
      calculateSingleProductTotalPriceOnButtonClicked($(this), newVal);
      getProductsNumber();
      $(this)
        .parent()
        .parent()
        .siblings(".hidden_amount_changed_form")
        .submit();
    });

    btnDown.click(function () {
      var oldValue = parseFloat(input.val());
      if (oldValue <= min) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue - 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
      calculateSingleProductTotalPriceOnButtonClicked($(this), newVal);
      getProductsNumber();
      $(this)
        .parent()
        .parent()
        .siblings(".hidden_amount_changed_form")
        .submit();
    });
  });

  $(".hidden_amount_changed_form").submit(function (event) {
    event.preventDefault(); // prevent actual form submit
    let form = $(this);
    let url = form.attr("action");
    let method = form.attr("method");
    let total = 0;
    $(".product_price_total").each(function () {
      total += +this.innerText.replace(/\đ/g, "");
    });
    let data = form.serialize();
    data += `&tongsanpham=${+$(".flaticon-bag").siblings("span")[0]
      .innerText}&tongiatien=${total}`;
    $.ajax({
      type: method,
      url,
      dataType: "json",
      data, // serializes form input
      success: function (response) {
        if (response.empty) {
          $(".cart_container").append(`<div class="empty_cart_container">
          <img src="/resources/img/cart/empty-cart.svg" alt="empty-cart-photo">
          <h3>Không có sản phẩm nào trong giỏ hàng</h3>
          <button class="site-btn sb-line sb-dark pay_btn continue_shopping_btn">Tiếp tục mua sắm</button>
        </div>`);
          $(".temp_bill").remove();
        }

        console.log(response);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  $(".hidden_pay_form").submit(function (event) {
    event.preventDefault(); // prevent actual form submit
    let form = $(this);
    let url = form.attr("action");
    let method = form.attr("method");
    let data = form.serialize();
    $.ajax({
      type: method,
      url,
      dataType: "json",
      data, // serializes form input
      success: function (response) {
        if (response.empty) {
          $(".cart_container").html("");
          $(".cart_container").append(`<div class="empty_cart_container">
  <img src="/resources/img/cart/empty-cart.svg" alt="empty-cart-photo">
  <h3>Không có sản phẩm nào trong giỏ hàng</h3>
  <button class="site-btn sb-line sb-dark pay_btn continue_shopping_btn">Tiếp tục mua sắm</button>
</div>`);
          $(".temp_bill").remove();
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  $(".delete_button").each(function () {
    $(this).click(function () {
      swal
        .fire({
          title: "Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "green",
          cancelButtonColor: "red",
          confirmButtonText: "Vâng",
          cancelButtonText: "Huỷ",
        })
        .then((result) => {
          if (result.isConfirmed) {
            swal.fire(
              "Đã xoá",
              "Sản phẩm vừa được xoá khỏi giỏ hàng",
              "success"
            );
            let form = $(this)
              .parent()
              .siblings(".product_quantity")
              .children(".hidden_amount_changed_form");
            form.attr("action", "/users/remove-from-cart");
            form.submit();
            form.attr("action", "/users/change-amount-cart");
            $(this).parent().parent().remove();
            calculateAllProductTotalPrice();
            getProductsNumber();
          }
        });
    });
  });

  $(".continue_shopping_btn").click(function () {
    location.href = "/";
  });

  $(".pay_btn").click(function () {
    swal
      .fire({
        title: "Bạn muốn thanh toán giỏ hàng giỏ hàng?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Vâng",
        cancelButtonText: "Huỷ",
      })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire(
            "Thanh toán thành công",
            "Giỏ hàng của bạn vừa được thanh toán",
            "success"
          );
          $(".hidden_pay_form")
            .children("input")
            .val(
              $(".hidden_amount_changed_form")
                .children('input[name="magiohang"]')
                .val()
            );
          $(".hidden_pay_form").submit();
          calculateAllProductTotalPrice();
          getProductsNumber();
        }
      });
  });

  calculateSingleProductTotalPrice();
  calculateAllProductTotalPrice();

  //functions

  function calculateSingleProductTotalPrice() {
    $(".product_price_total").each(function () {
      $(this).html(
        +$(this)
          .parent()
          .siblings(".product_details")
          .find("#product_price")[0]
          .innerText.replace(/\đ/g, "") *
          +$(this)
            .parent()
            .siblings(".product_quantity")
            .children(".quantity")
            .children("input")
            .val()
      );
    });
  }

  function calculateSingleProductTotalPriceOnButtonClicked(param, newVal) {
    param
      .parent()
      .parent()
      .parent()
      .siblings(".product_total_price")
      .find(".product_price_total")
      .html(
        +param
          .parent()
          .parent()
          .parent()
          .siblings(".product_details")
          .find("#product_price")[0]
          .innerText.replace(/\đ/g, "") *
          +param.parent().siblings("input").val()
      );
    param
      .parent()
      .parent()
      .siblings(".hidden_amount_changed_form")
      .children('input[name="soluong"]')
      .val(newVal);
    calculateAllProductTotalPrice();
  }

  function calculateAllProductTotalPrice() {
    let total = 0;
    $(".product_price_total").each(function () {
      total += +this.innerText;
    });
    $(".total_price_container")
      .children("#total_cart_price")
      .html(total + "đ");
  }

  function getProductsNumber() {
    let total = 0;
    $(".quantity").each(function () {
      total += +$(this).children("input").val();
    });
    $(".flaticon-bag").siblings("span").html(total);
  }
});

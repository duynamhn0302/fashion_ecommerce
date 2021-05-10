$(document).ready(function () {
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
      } else {
        var newVal = oldValue + 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
      calculateSingleProductTotalPriceOnButtonClicked($(this));
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
      calculateSingleProductTotalPriceOnButtonClicked($(this));
    });
  });

  calculateSingleProductTotalPrice();
  calculateAllProductTotalPrice();

  //functions

  function calculateSingleProductTotalPrice() {
    $(".product_price_total").each(function () {
      $(this).html(
        +$(this).parent().siblings(".product_details").find("#product_price")[0]
          .innerText.replace(/\đ/g, '') *
          +$(this)
            .parent()
            .siblings(".product_quantity")
            .children(".quantity")
            .children("input")
            .val()
      );
    });
  }

  function calculateSingleProductTotalPriceOnButtonClicked(param) {
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
          .find("#product_price")[0].innerText.replace(/\đ/g, '') *
          +param.parent().siblings("input").val()
      );
    calculateAllProductTotalPrice();
  }

  function calculateAllProductTotalPrice() {
    let total = 0;
    $(".product_price_total").each(function () {
      total += +this.innerText;
    });
    $(".total_price_container").children("#total_cart_price").html(total + 'đ');
  }
});

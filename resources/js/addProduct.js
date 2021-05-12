var category = null;
$.post('/shops/cat-1',function(data,status){
    category = data;
    if(category !== null){
        const len = category.length;
        for(var i=0;i<len;i++){
            $('#cat-1-select').append(`<div class="item-select-cbx first-item">
            ${category[i].ten}
        </div>`)
        }
    }
    $('#cat-1-select').append()
})

$(document).ready(function(){
    const cat_1 = $('.add-shop-category-1');
    const cat_2 = $('.add-shop-category-2');
    var choose_cat_1;

    const hideComboBox = ()=>{
        $('.drop-down-cbx').addClass("disable");
        $('.drop-down-cbx').removeClass("show");
    }

    $(this).on('click',hideComboBox);

    $('.combo_box').on('click',function(e){
        const dropdown = $(this).next();
        dropdown.removeClass("disable");
        dropdown.toggleClass("show");
        $(this).children('div').children('i').toggleClass("rotate");
        e.stopPropagation();
    })

    $('#cat-1-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        choose_cat_1 = $(this).index();
        if(category[choose_cat_1].existsCate2===false)  return;
        $('.add-shop-category-2').css('display','block');
        $('#cat-2-select').empty();
        $('#span-2').text(`${category[choose_cat_1].cate2[0].ten}`);
        const len = category[choose_cat_1].cate2.length;
        for(var i=0;i<len;i++){
            $('#cat-2-select').append(`<div class="item-select-cbx first-item">
            ${category[choose_cat_1].cate2[i].ten}
        </div>`)
        }
    })

    $('#cat-2-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    $('#sex').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })
})
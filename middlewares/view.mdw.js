const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function (app) {
  app.engine('hbs', exphbs({
    // defaultLayout: 'main.hbs',
    defaultLayout: 'main.hbs',
    helpers: {
      section: hbs_sections(),
      format_number(val) {
        return numeral(val).format('0,0');
      }
    }
  }));
  app.set('view engine', 'hbs');

  //thực hiện so sánh ngoài view
  const hbs = exphbs.create({});

  hbs.handlebars.registerHelper("inc", function(value, options)
  {
    return parseInt(value) + 1;
  })

  hbs.handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {
    var operators = {
     'eq': function(l,r) { return l == r; },
     'noteq': function(l,r) { return l != r; },
     'gt': function(l,r) { return Number(l) > Number(r); },
     'or': function(l,r) { return l || r; },
     'and': function(l,r) { return l && r; },
     '%': function(l,r) { return (l % r) === 0; }
    }
    , result = operators[operator](operand_1,operand_2);
  
    if (result) return options.fn(this);
    else  return options.inverse(this);
  });
}

var request = require('request');
var cheerio = require('cheerio');

module.exports = function(decklistURL){

  console.log("Searching TappedOut for:", decklistURL);

  return new Promise((resolve, reject) => {

    request(decklistURL, function(error, response, html){

      //Handle better **FIX**
      if(error){
        console.log(error);
        reject();
      }

      var title, commander0, commander1;
      var decklist = [];

      var $ = cheerio.load(html);

      try {
        $('.board-container .member .qty').each(function(index){

          var qty, cardName;

          qty = $(this).attr('data-qty');
          cardName = $(this).attr('data-name');
          // console.log(qty + "x ", cardName);

          decklist.push({quantity: qty, cardName: cardName});

        });
      } catch (e) {
        //Handle better **FIX**
        reject();
      }

      resolve(decklist);

    });

  });

}

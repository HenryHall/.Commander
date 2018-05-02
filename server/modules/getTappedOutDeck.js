
//https://scotch.io/tutorials/scraping-the-web-with-node-js

var request = require('request');
var cheerio = require('cheerio');

module.exports = function(decklistURL){

  console.log("Searching TappedOut for:", decklistURL);

  return new Promise((resolve, reject) => {

    var options = {
      url: decklistURL,
      headers: {
        'User-Agent': 'MY IPHINE 7s'
      }
    };

    request(options, function(error, response, html){

      //Handle better **FIX**
      if(error){
        console.log(error);
        reject();
      }

      if(response.statusCode !== 200) {
          reject('Invalid status code: '+response.statusCode);
      }

      console.log('statusCode:', response);

      var title, commander0, commander1;
      var decklist = [];

      try {
        let $ = cheerio.load(html);

        let cardElements = $('.board-container .member .qty')

        cardElements.each(function(index){

          var qty, cardName;

          qty = $(this).attr('data-qty');
          cardName = $(this).attr('data-name');
          console.log(qty + "x ", cardName);

          decklist.push({quantity: qty, cardName: cardName});

        });
      } catch (e) {
        //Handle better **FIX**
        console.log(e);
        reject();
      }

      console.log("Found deck size:", decklist.length);
      resolve(decklist);

    });

  });

}

// Dependencies
var request = require('request');
var fs = require('fs');

// Secret data
var tokens = require('./_tokens')

// Files to write
var files = [
  {
    name: 'dribbble',
    url: 'https://api.dribbble.com/v1/users/jimniels/shots',
    token: tokens.dribbble
  },
  {
    name: 'blog',
    url: 'http://jim-nielsen.com/blog/feed.json'
  }
];

files.forEach(function(file){

  // Request options
  // If it needs auth, add it to the request options
  var options = {
    url: file.url
  };
  if(file.token) {
    options.auth = {'bearer': file.token}
  }

  // Make the request
  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {

      // Parse the new data as JSON
      // We will use this to check if it already exists
      var newData = JSON.parse(body);

      // If it's the blog, get the `items` key where the posts are stored
      if (file.name === 'blog') {
        // Remove the `content_html` key
        newData = newData.items;
        newData.forEach(item => {
          delete item.content_html;
        });
      }

      try {
        oldData = require('./' + file.name);
      } catch(e) {
        console.log('Old data files do not exist. Making new ones...');
      }

      if(typeof oldData !== 'undefined' && oldData[0].title === newData[0].title){
        console.log(file.name + ' data is already up to date');
      } else {
        fs.writeFile('_data/' + file.name + '.json', JSON.stringify(newData), function(err) {
           if (err) {
             return console.error(err);
           }
           console.log('New data: ' + file.name + '.json');
        });
      }
    } else {
      console.log('There was an error making the Dribbble request', error, response);
    }
  });
});

/*
// Dribbble
var token = 'c69d2f51c71caba7bfcadcd7587b73604daa387e0c5d04700670cf5fcf5b3552';
var url = 'https://api.dribbble.com/v1/users/jimniels/shots';
var oldData = require('../dribbble');
//var oldData = '';

// Make request for new data
request.get(url, function(error, response, body){
  if (!error && response.statusCode == 200) {
    // Parse the new data
    var newData = JSON.parse(body);

    // Check it against the old
    if(oldData && oldData[0].id === newData[0].id){
      console.log('Dribbble data is up to date')
    } else {
      fs.writeFile('dribbble.json', body, function(err) {
         if (err) {
           return console.error(err);
         }
         console.log('Write successful: dribbble.json');
      });
    }
  } else {
    console.log('There was an error making the Dribbble request', error);
  }
}).auth(null, null, true, token);
*/

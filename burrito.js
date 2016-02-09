var bwId = 'u-';
var bwT = 't-';
var bwS = 'sdl';
var burritoNumber = '+1888222';
var burrtioText = 'RAINCHECK';
var waitTimeInMinutes = 5;


var bw = require('node-bandwidth');
var client = new bw.Client(bwId,bwT, bwS);
var Promise = require('bluebird');
var PhoneNumber = Promise.promisifyAll(bw.PhoneNumber);
var Message = Promise.promisifyAll(bw.Message);



var sendMessage = function (message) {
  console.log("Ordering Burrito");
  Message.createAsync(client, message)
  .then(function (messageResponse) {
    var output = {
      messageId: messageResponse.id,
      from: messageResponse.from,
      to: messageResponse.to,
      text: messageResponse.text,
      time: messageResponse.time
    };
    console.log(output);
  });
};

var createMessages = function (numbers) {
  function getBurrito () {
    var message = {
      from: numbers.pop().number,
      to: burritoNumber,
      text: burritoText
    };
    sendMessage(message);
    if ( numbers.length > 0) {
      setTimeout(getBurrito, 1000);
    }
  }
  getBurrito();
};

var printMessage = function (messages) {
  var coupons = {};
  for (var i = 0; i < messages.length; i ++) {
      if (messages[i].from === burritoNumber) {
        if(coupons[messages[i].to] === undefined){
          coupons[messages[i].to] = messages[i].text;
        }
      }
    }
  console.log(coupons);
};

var getMessages = function (numbers) {
  for (var i = 0; i < numbers.length; i++) {
    Message.listAsync(client, {
      to: numbers[i].number,
      direction: 'in'
    })
    .then(printMessage);
  }
};

PhoneNumber.listAsync(client, {size: 1000, numberState: 'enabled'})
  .then(createMessages)
  .delay(waitTimeInMinutes * 60 * 1000) // Wait 5 minutes for burriot to respond then fetch responses.
  .then(getMessages);

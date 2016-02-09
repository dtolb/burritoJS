## BurritoJS


Leverages [Bandwidth's API](http://ap.bandwidth.com/?utm_medium=social&utm_source=github&utm_campaign=dtolb&utm_content=_) to send a message per number in your account.

Chipotle ran a promotion to text `888222` with text `RAINCHECK` to receive a voucher to get a free burrito.

![Burrito Promo](/readme_images/burrito.png?raw=true)

## To Run
Fill in the top variables:

* `var bwId = 'u-';` : Bandwidth User ID
* `var bwT = 't-';` : Bandwidth Token
* `var bwS = 'sdl';` : Bandwith Secret
* `var burritoNumber = '+1888222';` : Number to text for burrito
* `var burrtioText = 'RAINCHECK';` : Text to send burrito
* `var waitTimeInMinutes = 5;` : How long to wait after ordering burrito to fetch the responses

Then
`npm install && node burrito.js`

## Novelty
Bandwidth rate limits the number of SMS you can send per second per number (~5/s per number) and how many SMS you can send per account (~50/s per account)

In order to not hit the rate limit, you need to delay

#### Send message function. Sends a message and logs the result. Ignores errors :0
```Javascript
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
```

### Only sends one SMS per second
```Javascript
var createMessages = function (numbers) {
  function getBurrito () {
    var message = {
      from: numbers.pop().number, //Pop the number off the array reducing size
      to: burritoNumber,
      text: burritoText
    };
    sendMessage(message);
    if ( numbers.length > 0) {
      setTimeout(getBurrito, 1000); // So long as there is a number left, set a timeout to call the function again
    }
    else {
      return true;
    }
  }
  getBurrito();
};
```

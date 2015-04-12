(function () {
  var Big = require('./lib/big.js');

  function ElGamal() {}

  ElGamal.genKeys = function () {
    var p = randEasyNum();
    var g = primRoot(p);
    var x = randomIntFromInterval(2, p - 1);
    var y = Big(g).pow(x).mod(p);

    return {open: {p: p, g: g, y: y}, secret: {x: x}};
  };

  ElGamal.encrypt = function (message, keys) {
    var abs = [];
    message.split('').forEach(function (char) {
      var code = char.charCodeAt(0);
      var ab = encryptChar(code, keys.p, keys.g, keys.y);
      abs.push(ab);
    });

    return abs;
  };

  ElGamal.decrypt = function (abs, keys) {
    var message = '';
    abs.forEach(function (char) {
      message += String.fromCharCode(decryptChar(char.a, char.b, keys.p, keys.x));
    });

    return message;
  };

  function encryptChar(M, p, g, y) {
    var k = randomIntFromInterval(2, p - 2);
    var a = Big(g).pow(k).mod(p);
    var b = Big(y).pow(k).mul(M).mod(p);

    return {a: a, b: b};
  }

  function decryptChar(a, b, p, x) {
    return Big(b).mul(Big(a).pow(p - 1 - x)).mod(p);
  }

  function primRoot(val) {
    for (var i = 2; i < val - 1; i++) {
      var start = Big('1');
      var flag = true;

      for (var j = 0; j < val / 2; j++) {
        start = start.mul(i).mod(val);
        if (start.mod(val).toString() == '1') {
          flag = false;
          break;
        }
      }

      if (flag) {
        return i;
      }
    }

    return false;
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function sieve(n) {
    var s = [];
    s[1] = 0;

    for (var k = 2; k <= n; k++) {
      s[k] = 1;
    }

    for (var k = 2; k * k <= n; k++) {
      if (s[k] == 1) {
        for (l = k * k; l <= n; l += k) {
          s[l] = 0;
        }
      }
    }

    return s;
  }

  function randEasyNum() {
    var minNum = 1106;
    var maxNum = 2000;
    var binaryArray = sieve(maxNum);
    var easyNums = [];

    for (var i = minNum; i < binaryArray.length; ++i) {
      if (binaryArray[i]) {
        easyNums.push(i);
      }
    }

    var easyNumPos = randomIntFromInterval(0, easyNums.length - 1);

    return easyNums[easyNumPos];
  }

  module.exports = ElGamal;
})();
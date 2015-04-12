var ElGamal = require('./elgamal.js');
var fs = require('fs');
var path = require('path');
var $ = require('jquery');

const STUFF_ROOT = 'stuff';
const MESSAGE = 'message.txt';
const OPEN_KEYS = 'open.keys';
const SECRET_KEY = 'secret.keys';
const ENCRYPTED_MESSAGE = 'encrypted_message.txt';
const DECRYPTED_MESSAGE = 'decrypted_message.txt';


initHandlers();


function initHandlers() {
  $('.js-gen-keys').click(genKeys);
  $('.js-encrypt').click(encrypt);
  $('.js-decrypt').click(decrypt);
}

function genKeys() {
  var keys = ElGamal.genKeys();
  saveKeys(keys);
  alert('Ключи сгенерированы');
}

function encrypt() {
  try {
    var message = loadMessage();
    var openKeys = loadOpenKeys();
    var encryptedMessage = ElGamal.encrypt(message, {p: openKeys.p, g: openKeys.g, y: openKeys.y});
    saveEncryptedMessage(encryptedMessage);
    alert('Зашифровано');
  } catch (e) {
    if (e.message) {
      alert('Ошибка шифрования: ' + e.message);
    }
  }
}

function decrypt() {
  try {
    var encryptedMessage = loadEncryptedMessage();
    var openKeys = loadOpenKeys();
    var secretKeys = loadSecretKey();
    var decryptedMessage = ElGamal.decrypt(encryptedMessage, {p: openKeys.p, x: secretKeys.x});
    saveDecryptedMessage(decryptedMessage);
    alert('Расшифровано');
  } catch (e) {
    if (e.message) {
      alert('Ошибка дешифрования: ' + e.message);
    }
  }
}


function loadMessage() {
  var messagePath = path.join(STUFF_ROOT, MESSAGE);
  if (!fs.existsSync(messagePath)) {
    throw {message: 'Файла сообщения не существует!'};
  }
  return fs.readFileSync(messagePath, {encoding: 'UTF-8'});
}

function saveKeys(keys) {
  fs.writeFileSync(path.join(STUFF_ROOT, OPEN_KEYS), JSON.stringify({p: keys.open.p, g: keys.open.g, y: keys.open.y}));
  fs.writeFileSync(path.join(STUFF_ROOT, SECRET_KEY), JSON.stringify({x: keys.secret.x}));
}

function loadOpenKeys() {
  var openKeysPath = path.join(STUFF_ROOT, OPEN_KEYS);
  if (!fs.existsSync(openKeysPath)) {
    throw {message: 'Файла открытых ключей не существует!'};
  }
  return JSON.parse(fs.readFileSync(openKeysPath, {encoding: 'UTF-8'}));
}

function loadSecretKey() {
  var secretKeyPath = path.join(STUFF_ROOT, SECRET_KEY);
  if (!fs.existsSync(secretKeyPath)) {
    throw {message: 'Файла секретного ключа не существует!'};
  }
  return JSON.parse(fs.readFileSync(secretKeyPath, {encoding: 'UTF-8'}));
}

function saveEncryptedMessage(encryptedMessage) {
  fs.writeFileSync(path.join(STUFF_ROOT, ENCRYPTED_MESSAGE), JSON.stringify(encryptedMessage));
}

function loadEncryptedMessage() {
  var encryptedMessagePath = path.join(STUFF_ROOT, ENCRYPTED_MESSAGE);
  if (!fs.existsSync(encryptedMessagePath)) {
    throw {message: 'Файла шифротекста не существует!'};
  }
  return JSON.parse(fs.readFileSync(encryptedMessagePath, {encoding: 'UTF-8'}));
}

function saveDecryptedMessage(decryptedMessage) {
  fs.writeFileSync(path.join(STUFF_ROOT, DECRYPTED_MESSAGE), decryptedMessage);
}
const { v4 } = require("uuid");

const makeId = () => {
  const id = v4();
  return id.substring(3, 6) + id.substring(14, 16);
};

const alphabet = " abcdefghijklmnopqrstuvwxyz";

const letterToIndex = (letter) => alphabet.indexOf(letter);
const indexToLetter = (index) => alphabet[index];

module.exports = { makeId, letterToIndex, indexToLetter };

var DiceGame = artifacts.require("./DiceGame.sol");

module.exports = function(deployer) {

  deployer.deploy(DiceGame);

};

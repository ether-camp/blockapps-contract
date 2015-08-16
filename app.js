var web3 = require('web3');
web3.eth.defaultAccount = '0x550b182149bbfc15054d9f4ac3babac14feab9fe';
var provider = new BlockAppsWeb3Provider({
  keyprovider: function(address, cb) {
    if (address === '550b182149bbfc15054d9f4ac3babac14feab9fe') cb(null, web3.sha3('222'));
    else cb('I do not know a private key for ' + address);
  }
});
web3.setProvider(window.provider);

var source = "" +
      "contract test {\n" +
      "   function multiply(uint a) constant returns(uint d) {\n" +
      "       return a * 2;\n" +
      "   }\n" +
      "}\n";

web3.eth.compile.solidity(source, function(err, compiled) {
  if (err) return console.error(err);
  var code = compiled.test.code;
  var abi = compiled.test.info.abiDefinition;

  web3.eth.contract(abi).new({ data: code }, function(err, contract) {
    if (err) return console.error(err);
    // callback fires twice, we only want the second call when the contract is deployed
    if (contract.address) {
      contract.multiply(new BigNumber(2), function(err, result) {
        if (err) console.error(err);
        else console.log(result.toString(16));
      });
    }
  });
});


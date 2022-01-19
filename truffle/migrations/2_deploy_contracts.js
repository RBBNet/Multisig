var SimulateTxAccessor = artifacts.require("SimulateTxAccessor");
var GnosisSafeProxyFactory = artifacts.require("GnosisSafeProxyFactory");
var DefaultCallbackHandler = artifacts.require("DefaultCallbackHandler");
var CompatibilityFallbackHandler = artifacts.require("CompatibilityFallbackHandler");
var CreateCall = artifacts.require("CreateCall");
var MultiSend = artifacts.require("MultiSend");
var MultiSendCallOnly = artifacts.require("MultiSendCallOnly");
var SignMessageLib = artifacts.require("SignMessageLib");
var GnosisSafeL2 = artifacts.require("GnosisSafeL2");
var GnosisSafe = artifacts.require("GnosisSafe");
var SimpleStorage = artifacts.require("SimpleStorage");


module.exports = function(deployer) {
    deployer.deploy(SimulateTxAccessor);
    deployer.deploy(GnosisSafeProxyFactory);
    deployer.deploy(DefaultCallbackHandler);
    deployer.deploy(CompatibilityFallbackHandler);
    deployer.deploy(CreateCall);
    deployer.deploy(MultiSend);
    deployer.deploy(MultiSendCallOnly);
    deployer.deploy(SignMessageLib);
    deployer.deploy(GnosisSafeL2);
    deployer.deploy(GnosisSafe);
    deployer.deploy(SimpleStorage);
    // Additional contracts can be deployed here
};
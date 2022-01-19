// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.8.0;
import "../MockContract.sol";

interface Token {
    function transfer(address _to, uint256 value) external returns (bool);
}

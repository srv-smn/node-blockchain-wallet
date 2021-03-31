// SPDX-License-Identifier: MIT
import "./MyToken.sol";
pragma solidity >=0.6.0 <0.8.0;

contract Staking {
    address public owner;
    MyToken public mtk;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public timeStamp;

    constructor(MyToken _mtk) public {
        mtk = _mtk;
        owner = msg.sender;
    }
}

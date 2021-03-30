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

    function stakeTokens(uint256 _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer MTK tokens to this contract for staking
        mtk.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Update staking status
        timeStamp[msg.sender] = block.timestamp;
    }

    function unstakeTokens() public {
        // Fetch staking balance
        uint256 balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        mtk.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        timeStamp[msg.sender] = 0;
    }

    function issueReward() public {
        uint256 t = interval(msg.sender);
        uint256 reward =
            (stakingBalance[msg.sender] * rewardHelper(msg.sender) * t) / 36525;
        timeStamp[msg.sender] = block.timestamp;
        mtk.transfer(msg.sender, reward);
    }

    function rewardHelper(address user) internal view returns (uint256) {
        uint256 temp;
        uint256 t = interval(user);

        if (block.timestamp <= timeStamp[user] + 604800) {
            temp = 1 + ((25 * t) / 700);
            return 15 * temp;
        }

        if (block.timestamp <= timeStamp[user] + 1209600) {
            temp = (35 + (2 * (t - 7))) / 28;
            return 15 * temp;
        }

        if (block.timestamp <= timeStamp[user] + 1814400) {
            temp = (49 + (5 * (t - 14))) / 28;
            return 15 * temp;
        }

        return 45;
    }

    function interval(address user) internal view returns (uint256) {
        return (block.timestamp - timeStamp[user]) / 86400;
    }
}

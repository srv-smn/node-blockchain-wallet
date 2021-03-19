// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";


contract MyToken is ERC20, Ownable{
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) public ERC20(name_, symbol_) {
        totalSupply_ = totalSupply_ * (10**uint256(18));

        if (totalSupply_ > 0) {
            _mint(owner(), totalSupply_);
        }
    }

}
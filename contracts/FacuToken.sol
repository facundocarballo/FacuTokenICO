// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract FacuToken is ERC20 {
    constructor() ERC20("FacuToken", "FT") {
        _mint(msg.sender, 1000000000 * 10**18);
    }
}
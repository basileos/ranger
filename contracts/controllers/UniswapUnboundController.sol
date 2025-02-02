// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./ICronaSwapRouter02.sol";

contract UniswapUnboundController {

    using SafeERC20 for IERC20;
    using Address for address;
    using Address for address payable;
    using SafeMath for uint256;
    ICronaSwapRouter02 public immutable router;

    constructor(ICronaSwapRouter02 _router) {
        require(address(_router) != address(0), "INVALID_ROUTER");
        router = _router;
    }

    function _approve(IERC20 token, uint amount, address spender) internal {
        uint currentAllowance = token.allowance(address(this), address(spender));
        if (currentAllowance > 0) {
            token.safeDecreaseAllowance(address(spender), currentAllowance);
        }
        token.safeIncreaseAllowance(address(spender), amount);
    }

    /// @notice Performs swap on Uniswap v2 router
    /// @dev Calls to external contract
    /// @param data Bytes containing token amounts, path, deadline to interact with Uni router
    function deploy(bytes calldata data) external {
        (
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        uint256 deadline
        ) = abi.decode(
            data,
            (uint256, uint256, address[], uint256)
        );
        _approve(IERC20(path[0]), amountIn, address(router));

        router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }

    function deployAll(bytes calldata data) external {
        (
        uint256 amountOutMin,
        address[] memory path,
        uint256 deadline
        ) = abi.decode(
            data,
            (uint256, address[], uint256)
        );

        uint amountIn = IERC20(path[0]).balanceOf(address(this));
        _approve(IERC20(path[0]), amountIn, address(router));

        router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }
}

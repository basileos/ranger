// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../interfaces/ILiquidityEthPool.sol";
import "../interfaces/IManager.sol";
import "../interfaces/IWETH.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {AccessControlUpgradeable as AccessControl} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {AddressUpgradeable as Address} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import {ERC20Upgradeable as ERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20Upgradeable as ERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {EnumerableSetUpgradeable as EnumerableSet} from "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {MathUpgradeable as Math} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import {OwnableUpgradeable as Ownable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {OwnableUpgradeable as Ownable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable as Pausable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {PausableUpgradeable as Pausable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {SafeERC20Upgradeable as SafeERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {SafeMathUpgradeable as SafeMath} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
//import "../interfaces/events/BalanceUpdateEvent.sol";
//import "../interfaces/events/Destinations.sol";
//import "../interfaces/events/IEventSender.sol";

//contract EthPool is ILiquidityEthPool, Initializable, ERC20, Ownable, Pausable, IEventSender {
contract EthPool is ILiquidityEthPool, Initializable, ERC20, Ownable, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;
    using Address for address payable;

    /// @dev TODO: Hardcode addresses, make immuatable, remove from initializer
    IWETH public override weth;
    IManager public manager;

    // implied: deployableLiquidity = underlyer.balanceOf(this) - withheldLiquidity
    uint256 public override withheldLiquidity;

    // fAsset holder -> WithdrawalInfo
    mapping(address => WithdrawalInfo) public override requestedWithdrawals;

    // NonReentrant
    bool private _entered;

    bool public _eventSend;
//    Destinations public destinations;

    modifier nonReentrant() {
        require(!_entered, "ReentrancyGuard: reentrant call");
        _entered = true;
        _;
        _entered = false;
    }

    modifier onEventSend() {
        if (_eventSend) {
            _;
        }
    }

    /// @dev necessary to receive ETH
    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function initialize(
        IWETH _weth,
        IManager _manager,
        string memory _name,
        string memory _symbol
    ) public initializer {
        require(address(_weth) != address(0), "ZERO_ADDRESS");
        require(address(_manager) != address(0), "ZERO_ADDRESS");

        __Context_init_unchained();
        __Ownable_init_unchained();
        __Pausable_init_unchained();
        __ERC20_init_unchained(_name, _symbol);
        weth = _weth;
        manager = _manager;
        withheldLiquidity = 0;
    }

    function deposit(uint256 amount) external payable override whenNotPaused {
        _deposit(msg.sender, msg.sender, amount, msg.value);
    }

    function depositFor(address account, uint256 amount) external payable override whenNotPaused {
        _deposit(msg.sender, account, amount, msg.value);
    }

    function underlyer() external view override returns (address) {
        return address(weth);
    }

    /// @dev References the WithdrawalInfo for how much the user is permitted to withdraw
    /// @dev No withdrawal permitted unless currentCycle >= minCycle
    /// @dev Decrements withheldLiquidity by the withdrawn amount
    function withdraw(uint256 requestedAmount, bool asEth) external override whenNotPaused nonReentrant {
        require(
            requestedAmount <= requestedWithdrawals[msg.sender].amount,
            "WITHDRAW_INSUFFICIENT_BALANCE"
        );
        require(requestedAmount > 0, "NO_WITHDRAWAL");
        require(weth.balanceOf(address(this)) >= requestedAmount, "INSUFFICIENT_POOL_BALANCE");

        require(
            requestedWithdrawals[msg.sender].minCycle <= manager.getCurrentCycleIndex(),
            "INVALID_CYCLE"
        );

        requestedWithdrawals[msg.sender].amount = requestedWithdrawals[msg.sender].amount.sub(
            requestedAmount
        );

        // Delete if all assets withdrawn
        if (requestedWithdrawals[msg.sender].amount == 0) {
            delete requestedWithdrawals[msg.sender];
        }

        withheldLiquidity = withheldLiquidity.sub(requestedAmount);
        _burn(msg.sender, requestedAmount);

        bytes32 eventSig = "Withdraw";
//        encodeAndSendData(eventSig, msg.sender);

        if (asEth) { // Convert to eth
            weth.withdraw(requestedAmount);
//            msg.sender.sendValue(requestedAmount);
            payable(msg.sender).sendValue(requestedAmount);
        } else { // Send as WETH
            IERC20(weth).safeTransfer(msg.sender, requestedAmount);
        }
    }

    /// @dev Adjusts the withheldLiquidity as necessary
    /// @dev Updates the WithdrawalInfo for when a user can withdraw and for what requested amount
    function requestWithdrawal(uint256 amount) external override {
        require(amount > 0, "INVALID_AMOUNT");
        require(amount <= balanceOf(msg.sender), "INSUFFICIENT_BALANCE");

        //adjust withheld liquidity by removing the original withheld amount and adding the new amount
        withheldLiquidity = withheldLiquidity.sub(requestedWithdrawals[msg.sender].amount).add(
            amount
        );
        requestedWithdrawals[msg.sender].amount = amount;
        if (manager.getRolloverStatus()) {  // If manager is in the middle of a cycle rollover, add two cycles
            requestedWithdrawals[msg.sender].minCycle = manager.getCurrentCycleIndex().add(2);
        } else {  // If the manager is not in the middle of a rollover, add one cycle
            requestedWithdrawals[msg.sender].minCycle = manager.getCurrentCycleIndex().add(1);
        }

        emit WithdrawalRequested(msg.sender, amount);
    }

    function preTransferAdjustWithheldLiquidity(address sender, uint256 amount) internal {
        if (requestedWithdrawals[sender].amount > 0) {
            //reduce requested withdraw amount by transferred amount;
            uint256 newRequestedWithdrawl = requestedWithdrawals[sender].amount.sub(
                Math.min(amount, requestedWithdrawals[sender].amount)
            );

            //subtract from global withheld liquidity (reduce) by removing the delta of (requestedAmount - newRequestedAmount)
            withheldLiquidity = withheldLiquidity.sub(
                requestedWithdrawals[sender].amount.sub(newRequestedWithdrawl)
            );

            //update the requested withdraw for user
            requestedWithdrawals[sender].amount = newRequestedWithdrawl;

            //if the withdraw request is 0, empty it out
            if (requestedWithdrawals[sender].amount == 0) {
                delete requestedWithdrawals[sender];
            }
        }
    }

    function approveManager(uint256 amount) public override onlyOwner {
        uint256 currentAllowance = IERC20(weth).allowance(address(this), address(manager));
        if (currentAllowance < amount) {
            uint256 delta = amount.sub(currentAllowance);
            IERC20(weth).safeIncreaseAllowance(address(manager), delta);
        } else {
            uint256 delta = currentAllowance.sub(amount);
            IERC20(weth).safeDecreaseAllowance(address(manager), delta);
        }
    }

    /// @dev Adjust withheldLiquidity and requestedWithdrawal if sender does not have sufficient unlocked balance for the transfer
    function transfer(address recipient, uint256 amount) public override whenNotPaused nonReentrant returns (bool) {
        preTransferAdjustWithheldLiquidity(msg.sender, amount);
        (bool success) = super.transfer(recipient, amount);

        bytes32 eventSig = "Transfer";
//        encodeAndSendData(eventSig, msg.sender);
//        encodeAndSendData(eventSig, recipient);

        return success;
    }

    /// @dev Adjust withheldLiquidity and requestedWithdrawal if sender does not have sufficient unlocked balance for the transfer
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override whenNotPaused nonReentrant returns (bool) {
        preTransferAdjustWithheldLiquidity(sender, amount);
        (bool success) = super.transferFrom(sender, recipient, amount);

        bytes32 eventSig = "Transfer";
//        encodeAndSendData(eventSig, sender);
//        encodeAndSendData(eventSig, recipient);

        return success;
    }

    function pause() external override onlyOwner {
        _pause();
    }

    function unpause() external override onlyOwner {
        _unpause();
    }

//    function setDestinations(address _fxStateSender, address _destinationOnL2) external override onlyOwner {
//        require(_fxStateSender != address(0), "INVALID_ADDRESS");
//        require(_destinationOnL2 != address(0), "INVALID_ADDRESS");
//
//        destinations.fxStateSender = IFxStateSender(_fxStateSender);
//        destinations.destinationOnL2 = _destinationOnL2;
//
//        emit DestinationsSet(_fxStateSender, _destinationOnL2);
//    }

//    function setEventSend(bool _eventSendSet) external override onlyOwner {
//        require(destinations.destinationOnL2 != address(0), "DESTINATIONS_NOT_SET");
//
//        _eventSend = _eventSendSet;
//
//        emit EventSendSet(_eventSendSet);
//    }

    function _deposit(
        address fromAccount,
        address toAccount,
        uint256 amount,
        uint256 msgValue
    ) internal {
        require(amount > 0, "INVALID_AMOUNT");
        require(toAccount != address(0), "INVALID_ADDRESS");

        _mint(toAccount, amount);
        if (msgValue > 0) { // If ether get weth
            require(msgValue == amount, "AMT_VALUE_MISMATCH");
            weth.deposit{value: amount}();
        } else { // Else go ahead and transfer weth from account to pool
            IERC20(weth).safeTransferFrom(fromAccount, address(this), amount);
        }

        bytes32 eventSig = "Deposit";
//        encodeAndSendData(eventSig, toAccount);
    }

//    function encodeAndSendData(bytes32 _eventSig, address _user) private onEventSend {
//        require(address(destinations.fxStateSender) != address(0), "ADDRESS_NOT_SET");
//        require(destinations.destinationOnL2 != address(0), "ADDRESS_NOT_SET");
//
//        uint256 userBalance = balanceOf(_user);
//        bytes memory data = abi.encode(BalanceUpdateEvent({
//            eventSig: _eventSig,
//            account: _user,
//            token: address(this),
//            amount: userBalance
//        }));
//
//        destinations.fxStateSender.sendMessageToChild(destinations.destinationOnL2, data);
//    }
}

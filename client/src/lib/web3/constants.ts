export const CONTRACTS = {
  USDC: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    abi: [
      'function balanceOf(address account) external view returns (uint256)',
      'function approve(address spender, uint256 amount) external returns (bool)',
      'function decimals() external view returns (uint8)'
    ]
  },
  STRATEGY: {
    address: '0xf065a7095C9b1AF2DEbFE07e6Bdd46EACC2c6670',
    abi:  [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [],
          "name": "DepositsPaused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [],
          "name": "DepositsUnpaused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint8",
              "name": "version",
              "type": "uint8"
            }
          ],
          "name": "Initialized",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "Paused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "Unpaused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "requestor",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "WithdrawalRequested",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "_eventSend",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approveManager",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "depositFor",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "depositsPaused",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "contract ERC20Upgradeable",
              "name": "_underlyer",
              "type": "address"
            },
            {
              "internalType": "contract IManager",
              "name": "_manager",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_symbol",
              "type": "string"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "manager",
          "outputs": [
            {
              "internalType": "contract IManager",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "pause",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "pauseDeposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "paused",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "requestWithdrawal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "requestedWithdrawals",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "minCycle",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "underlyer",
          "outputs": [
            {
              "internalType": "contract ERC20Upgradeable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "unpause",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "unpauseDeposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "requestedAmount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withheldLiquidity",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
  }
};

export const CONTRACT_METADATA = {
  'RWBNB-USDC': {
    name: 'RWBNB-USDC',
    pair: 'WBNB-USDC',
    poolService: 'PancakeSwap',
    address: CONTRACTS.STRATEGY.address,
    poolAddress: "0xf2688Fb5B81049DFB7703aDa5e770543770612C4"
  }
};

export const BSC_CHAIN_ID = 56; // BSC Mainnet

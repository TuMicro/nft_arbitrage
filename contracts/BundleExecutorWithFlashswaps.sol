//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;
// About 879376 gas with max optimizations (4294967295)
// With transferrable ownership it takes about 967321 gas
// With transferrable executorship it takes about 1043356 gas
// Adding public owner/executor it takes about 1075536 gas
// Adding the fallback function it takes about 1099220 gas

// TODO: comment out the following line when on prod
// import "hardhat/console.sol";

pragma experimental ABIEncoderV2;

interface IERC20 {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

interface IWETH is IERC20 {
    function deposit() external payable;

    // function deposit(address user, bytes calldata depositData) external;
    function withdraw(uint256) external;
}

contract BundleExecutorWithFlashswaps {

    address public owner;
    address public executor;
    bool private mutex; // mutex (didn't use boolean as it is the same gas usage)
    bytes4 private constant V3_SELECTOR = bytes4(keccak256(bytes("uniswapV3FlashCallback(uint256,uint256,bytes)")));
    IWETH private constant WETH =
        IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2); // ethereum (wrapped ether)
    // IWETH private constant WETH = IWETH(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619); // polygon (wrapped ether)
    // IWETH private constant WETH = IWETH(0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270); // polygon (wrapped matic)
    // IWETH private constant WETH = IWETH(0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c); // BSC (wrapped BNB)
    // IWETH private constant WETH = IWETH(0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83); // FTM (wrapped FTM)

    modifier onlyExecutor() {
        require(msg.sender == executor, "BEWF: only executor can call this function");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "BEWF: only owner can call this function");
        _;
    }

    constructor(address _executor, address _owner) payable {
        executor = _executor;
        owner = _owner;
    }

    receive() external payable {}

    fallback (bytes calldata _input) external payable returns (bytes memory _output) {

        bytes memory _data;
        if (bytes4(_input) == V3_SELECTOR) {
            (,,_data) = abi.decode(_input[4:], (uint256, uint256, bytes));
        } else {
            (,,,_data) = abi.decode(_input[4:], (address, uint256, uint256, bytes));
        } // TODO: https://eips.ethereum.org/EIPS/eip-3156 (and dont forget the return part)

        // console.log("we are in the callback: %s!!!", lastWethBalance);
        require(mutex, "mutex err");

        (
            address[] memory _targets,
            bytes[] memory _payloads
        ) = abi.decode(_data, (address[], bytes[]));


        // aahhh, I am arbing... (arbitrageour meme)
        for (uint256 i = 0; i < _targets.length; i++) {
            (bool _success, ) = _targets[i].call(_payloads[i]);
            // console.log("Callback operation %s was %s", i, _success);
            require(_success, "callX unsucessful");
        }

    }

    // function croDefiSwapCall(
    //     address _sender,
    //     uint256 _amount0,
    //     uint256 _amount1,
    //     bytes calldata _data
    // ) external {
    //     _uniswapV2Call(_data);
    // }

    // function uniswapV2Call(
    //     address _sender,
    //     uint256 _amount0,
    //     uint256 _amount1,
    //     bytes calldata _data
    // ) external {
    //     _uniswapV2Call(_data);
    // }
    
    // be able to receive NFTs
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
        pure
        external 
        returns (bytes4)  {
        return this.onERC721Received.selector;
    }

    
    function makeWeth(
        address[] calldata _targets, bytes[] calldata _payloads
        // address _firstTarget
        // , bytes calldata _firstPayload // using calldata here instead of memory reduces ~3k of gas usage
        , uint256 _ethAmountToCoinbase
        )
        external
        payable
        onlyExecutor
    {
        mutex = true;
        uint lastWethBalance = WETH.balanceOf(address(this));
        for (uint256 i = 0; i < _targets.length; i++) {
            (bool _success,) = _targets[i].call(_payloads[i]);
            // console.log("Callback operation %d", i);
            require(_success, "callV unsucessful");
        }
        // (bool _success, /*bytes memory res*/) = _firstTarget.call(_firstPayload);
        // // // Get the revert message of the call and revert with it if the call failed
        // // if (!_success) {
        // //     string memory _revertMsg = _getRevertMsg(res);
        // //     console.log("revert msg: %s", _revertMsg);
        // // }
        // require(_success, "callV unsucessful");

        uint256 _wethBalanceAfter = WETH.balanceOf(address(this));
        require(
            _wethBalanceAfter >=
                lastWethBalance + _ethAmountToCoinbase,
            "no profit"
        );

        if (_ethAmountToCoinbase != 0) {
            uint256 _ethBalance = address(this).balance;
            if (_ethBalance < _ethAmountToCoinbase) {
                WETH.withdraw(_ethAmountToCoinbase - _ethBalance);
            }

            // from https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
            // and https://docs.flashbots.net/flashbots-auction/searchers/advanced/coinbase-payment
            // and https://solidity-by-example.org/sending-ether/
            // block.coinbase.transfer(_ethAmountToCoinbase);
            (bool _sent, ) = block.coinbase.call{value: _ethAmountToCoinbase}(
                new bytes(0)
            );
            require(_sent, "coinbase txn failed");
        }

        mutex = false;
    }

    function call(
        address payable _to,
        uint256 _value,
        bytes calldata _data
    ) external payable onlyOwner returns (bytes memory) {
        require(_to != address(0), "must not be address zero");
        (bool _success, bytes memory _result) = _to.call{value: _value}(_data);
        require(_success, "callY unsucessful");
        return _result;
    } 

    // // TODO: comment out the next part, it is only for debugging:
    // /// @dev Get the revert message from a call
    // /// @notice This is needed in order to get the human-readable revert message from a call
    // /// @param _returnData Response of the call
    // /// @return Revert message string
    // function _getRevertMsg(bytes memory _returnData)
    //     internal
    //     pure
    //     returns (string memory)
    // {
    //     // If the _res length is less than 68, then the transaction failed silently (without a revert message)
    //     if (_returnData.length < 68) return "Transaction reverted silently";

    //     assembly {
    //         // Slice the sighash.
    //         _returnData := add(_returnData, 0x04)
    //     }
    //     return abi.decode(_returnData, (string)); // All that remains is the revert string
    // }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function transferExecutorship(address newExecutor) external onlyOwner {
        executor = newExecutor;
    }
}

pragma solidity 0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TimeLockedWallet.sol";


contract TimeLockedWalletFactory is Ownable {
    mapping(address => address[]) wallets;

    function getWallets(address _user) public view returns (address [] memory wallet) {
        return wallets[_user];
    }

    function newTimeLockedWallet(
        address payable _owner,
        uint256 _unlockDate,
        uint256 _lockedTokens,
        address tokenAddress
    ) public payable returns (address payable wallet) {
        // Create new wallet.
        require(
            msg.value > 0 || _lockedTokens > 0,
            "TimeLockedWalletFactory: Neither tokens nor eth have been sent to lock"
        );
        wallet = address(new TimeLockedWallet(
            _msgSender(),
            _owner,
            _unlockDate,
            tokenAddress
        )
);
        // Add wallet to sender's wallets.
        wallets[_msgSender()].push(wallet);

        // If owner is the same as sender then add wallet to sender's wallets too.
        if (_msgSender() != _owner) {
            wallets[_owner].push(wallet);
        }

        // Send ether from this transaction to the created contract.
        if (msg.value > 0) {
            wallet.transfer(msg.value);
        }
        if (_lockedTokens > 0) {
            require(
                IERC20(tokenAddress).allowance(_msgSender(), address(this)) >=
                    _lockedTokens,
                "token allowance must be >= amount"
            );
            IERC20(tokenAddress).transferFrom(
                _msgSender(),
               wallet,
                _lockedTokens
            );
        }

        // Emit event.
        Created(
            wallet,
            _msgSender(),
            _owner,
            now,
            _unlockDate,
            msg.value,
            _lockedTokens
        );
    }

    //TODO: add to blog
    // Prevents accidental sending of ether to the factory
    receive() external payable {
        revert();
    }

    event Created(
        address wallet,
        address from,
        address to,
        uint256 createdAt,
        uint256 unlockDate,
        uint256 ethAmount,
        uint256 tokenAmount
    );
}

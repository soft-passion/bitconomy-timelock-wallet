pragma solidity 0.6.2;

// import "./BiToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BasicMetaTransaction.sol";


contract TimeLockedWallet is BasicMetaTransaction {
    address tokenAddress;
    address public architect;
    address payable public  owner;
    uint256 public unlockDate;
    uint256 public createdAt;
     modifier onlyOwner {
        require( _msgSender() == owner,"Unauthorized");
        _;
    }
 

    constructor(
        address _architect,
        address payable  _owner,
        uint256 _unlockDate,
        address _tokenAddress
    ) public  {
        require(
            _unlockDate > now,
            "TimeLockedWallet: release time is before current time"
        );

        architect = _architect;
        owner = _owner;
        unlockDate = _unlockDate;
        createdAt = now;
        tokenAddress = _tokenAddress;
    }

    // keep all the Ether sent to this address
 
    receive () external payable {
        emit  Received(msg.sender, msg.value);
    }

    // callable by owner only, after specified time
    function withdraw() public onlyOwner {
        require(now >= unlockDate,"TimeLock:Can't withdraw before releasing time");
        //now send all the balance
        owner.transfer(address(this).balance);
        Withdrew(owner, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens() public onlyOwner {
        require(now >= unlockDate,"TimeLock:Can't withdraw before releasing time");
        //now send all the token balance
        uint256 tokenBalance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(owner, tokenBalance);
        WithdrewTokens(tokenAddress,  _msgSender(), tokenBalance);
    }

    function info()
        public
        view
        returns (address, address, uint256, uint256, uint256, uint256)
    {
        // since there is no way to prevent user from sending erc20 token to any contract, we are calculating the locked token form the balance rather than depending on varialbles  

        return (architect, owner, unlockDate, createdAt, address(this).balance,IERC20(tokenAddress).balanceOf(address(this)));
    }

    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);
}

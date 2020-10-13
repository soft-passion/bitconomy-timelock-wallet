pragma solidity 0.6.2;

// import "./BiToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 

contract TimeLockedWallet  {
    address relayer;
    address tokenAddress;
    address public architect;
    address payable public  owner;
    uint256 public unlockDate;
    uint256 public createdAt;
     modifier onlyOwner {
        require( _msgSender() == owner,"Unauthorized");
        _;
    }
    function _msgSender() internal view returns(address  sender) {
        if(msg.sender == relayer) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(mload(add(array, index)), 0xffffffffffffffffffffffffffffffffffffffff)
            }
        } else {
            return msg.sender;
        }
    }

    constructor(
        address _architect,
        address payable  _owner,
        uint256 _unlockDate,
     
        address _tokenAddress,
           address _relayer
    ) public  {
        require(
            _unlockDate > now,
            "TimeLockedWallet: release time is before current time"
        );

        relayer = _relayer;
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
    function withdraw() external onlyOwner {
       require(now >= unlockDate,"TimeLock:Can't withdraw before releasing time");
        //now send all the balance
        owner.transfer(address(this).balance);
        Withdrew(owner, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens() external onlyOwner {
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

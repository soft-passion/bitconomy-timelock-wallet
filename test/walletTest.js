const {
  time,
  ether,
  BN,
  advanceBlock,
  ZERO_ADDRESS,
  expectRevert,
  expectEvent,
} = require('@openzeppelin/test-helpers');
const {
  not
} = require('@openzeppelin/test-helpers/src/expectEvent');

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();
const tokenContract = artifacts.require('BiToken');
const TimeLockedWalletFactory = artifacts.require('TimeLockedWalletFactory');
const TimeLockedWallet = artifacts.require('TimeLockedWallet');
contract('TimeLockedWalletFactory', (accounts) => {
  let openingTime;
  let releaseTime;
  let timeLockedWallet;
  let token;
  let ownerWalletContract;
  let owner2WalletContract;
  let owner3WalletContract;
  let walletFactory;
  let owner = accounts[0]
  let owner2 = accounts[1]
  let owner3 = accounts[2]

  //let afterClosingTime;

  before(async () => {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock()
  });
  beforeEach(async () => {
    openingTime = (await time.latest());
    token = await tokenContract.deployed();

    walletFactory = await TimeLockedWalletFactory.deployed();

  });
  it('should create token with correct parameters', async () => {
    should.exist(token);
    should.exist(walletFactory);

  });
  describe('testing TimeLockedWalletFactory functions', () => {
    it('user can creat his wallet by sending eth', async () => {
      // using buytoken function as it does all the required functionalitiy
      openingTime = (await time.latest());
      console.log(openingTime, 'openingTime');

      releaseTime = openingTime .add( time.duration.seconds(2));

      const recipient = await walletFactory.newTimeLockedWallet(owner,
        releaseTime,
        0,
        token.address, {
          from: owner,
          value: ether("1")
        });
      //console.log(recipient, 'init');
      ownerWalletContract = await walletFactory.getWallets(owner);
      ownerWalletContract[0].should.not.be.equal(ZERO_ADDRESS)
      const balance = new ether(await web3.eth.getBalance(ownerWalletContract[0]));
      balance.should.not.be.equal(ether("1"))
    });
    it('user can creat his wallet by stacking token only ', async () => {
      // using buytoken function as it does all the required functionalitiy
      openingTime = (await time.latest()) 

      console.log(openingTime, 'openingTime');

      releaseTime = openingTime .add( time.duration.seconds(2));
      await token.transfer(owner2, 50, {
        from: owner
      })
      // approve factory contract to spend token 
      await token.approve(walletFactory.address, 50, {
        from: owner2
      })

      const allowance = await token.allowance(
        owner2,
        walletFactory.address
      );
      console.log(allowance, 'allowance');
      //  allowance.should.be.equal(new BN(50));
      const recipient = await walletFactory.newTimeLockedWallet(owner2,
        releaseTime,
        50,
        token.address, {
          from: owner2,
          //  value:ether("1")
        });
      console.log(recipient, 'init');
      owner2WalletContract = await walletFactory.getWallets(owner2);
      owner2WalletContract[0].should.not.be.equal(ZERO_ADDRESS)
      console.log(owner2WalletContract, 'owner2WalletContract');
      // check wallet balance
      const balance = await token.balanceOf(
        owner2WalletContract[0]);
      console.log(balance, 'balance');
      // balance.should.be.equal(new BN(50));
    });
    it('user can creat his wallet by stacking token and eth ', async () => {
      // using buytoken function as it does all the required functionalitiy
      openingTime = (await time.latest())  

      console.log(openingTime, 'openingTime');

      releaseTime = openingTime .add( time.duration.seconds(2));
      await token.transfer(owner3, 50, {
        from: owner
      })
      // approve factory contract to spend token 
      await token.approve(walletFactory.address, 50, {
        from: owner3
      })
      const allowance = await token.allowance(
        owner3,
        walletFactory.address
      );
      console.log(allowance, 'allowance');
      //  allowance.should.be.equal(new BN(50));
      const recipient = await walletFactory.newTimeLockedWallet(owner3,
        releaseTime,
        50,
        token.address, {
          from: owner3,
          value: ether("1")
        });
      console.log(recipient, 'init');
      owner3WalletContract = await walletFactory.getWallets(owner3);
      owner3WalletContract[0].should.not.be.equal(ZERO_ADDRESS)
      console.log(owner3WalletContract, 'owner3WalletContract');
      // check wallet balance
      const tokenBalance = await token.balanceOf(
        owner3WalletContract[0]);
      console.log(tokenBalance, 'balance');
      // balance.should.be.equal(new BN(50));
      const ethBalance = new ether(await web3.eth.getBalance(owner3WalletContract[0]));
      ethBalance.should.not.be.equal(ether("1"))
    });

    console.log(owner3WalletContract, 'owner3WalletContract');
  });
  describe('testing TimeLockedWallet functions', () => {

    it('user wallet should exist', async () => {
      timeLockedWallet = await TimeLockedWallet.at(owner3WalletContract[0])
      should.exist(timeLockedWallet);


    });
    it('user can not claim his ethers  before release time ', async () => {

      await expectRevert(
        timeLockedWallet.withdraw({
          from: owner3
        }),
        "TimeLock:Can't withdraw before releasing time"
      );
    });
    it('user can not claim his token  before release time ', async () => {

      await expectRevert(
        timeLockedWallet.withdrawTokens({
          from: owner3
        }),
        "TimeLock:Can't withdraw before releasing time"
      );
    });
    it('only owner can claim tokens', async () => {

      await expectRevert(
        timeLockedWallet.withdrawTokens({
          from: owner2
        }),
        "Unauthorized"
      );
    });
    it('user can claim his ethers  after release time ', async () => {
     console.log(openingTime,'openingTime');
      await time.increaseTo(releaseTime.add( time.duration.minutes(20)))
      const tx = await timeLockedWallet.withdraw({
        from: owner3
      })
      console.log(tx,'tx');
    });
    it('user can  claim his token  after release time ', async () => {
//       const info = await timeLockedWallet.info()
// console.log(info,'info');
      await time.increaseTo(releaseTime.add( time.duration.minutes(20)));
            const tx = await timeLockedWallet.withdrawTokens({
        from: owner3
      })
      console.log(tx,'tx');
      const tokenBalance = await token.balanceOf(
        owner3)
      console.log(tokenBalance, 'balance');
      // balance.should.be.equal(new BN(50));

    });

  });
});

/**    */
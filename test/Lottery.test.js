const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });
});
describe('Lottery Contract', () => {
    it('should successfully deploy the Lottery contract', () => {
        assert.ok(lottery.options.address);
    });

    it('multiple buyers should be able to buy', async () => {
        for (let i=1;i<4;i++) {
            await lottery.methods.buy().send({
                from: accounts[i],
                value: web3.utils.toWei('1', 'ether'),
            });
        }

        const buyers = await lottery.methods.getBuyers().call({
            from: accounts[0],
        });

        assert.strictEqual(buyers[0], accounts[1]);
        assert.strictEqual(buyers[1], accounts[2]);
        assert.strictEqual(buyers[2], accounts[3]);

        assert.strictEqual(buyers.length, 3);
    });

    it('buyer should spend 1 ETH to buy', async () => {
        try {
            await lottery.methods.buy().send({
                from: accounts[1],
                value: 0,
            });
            assert.fail('Expected revert not received');
        } catch (error) {
            assert.strictEqual(error.message.includes('Transaction has been reverted by the EVM'), true)
        }
    });

    it('should set the ticket price to 2 ETH', async () => {
        let newPrice = BigInt(web3.utils.toWei('2', 'ether'));
        await lottery.methods.setTicketPrice(newPrice).send({
            from: accounts[0],
        });
        const updatedPrice = parseInt(await lottery.methods.getTicketPrice().call());
        assert.strictEqual(updatedPrice, 2);
    });

    it('should not be able to change the ticket price in the middle of a lottery', async () => {
        await lottery.methods.buy().send({
            from: accounts[2],
            value: web3.utils.toWei('1', 'ether'),
        });

        try {
            let newPrice = BigInt(web3.utils.toWei('2', 'ether'));
            await lottery.methods.setTicketPrice(newPrice).send({
                from: accounts[0],
            });

            assert.fail('Expected revert not received');
        } catch (error) {
            assert.strictEqual(error.message.includes('Transaction has been reverted by the EVM'), true);
        }
    });

    it('only the manager should change the ticket price', async () => {
        try {
            let newPrice = BigInt(web3.utils.toWei('2', 'ether'));
            await lottery.methods.setTicketPrice(newPrice).send({
                from: accounts[2],
            });
            assert.fail('Expected revert not received');
        } catch (error) {
            assert.strictEqual(error.message.includes('Transaction has been reverted by the EVM'), true);
        }
    });

    it('only the manager should draw lottery', async () => {
        try {
            await lottery.methods.draw().send({
                from: accounts[1],
            });
            assert.fail('Expected revert not received');
        } catch (error) {
            assert.strictEqual(error.message.includes('Transaction has been reverted by the EVM'), true);
        }
    });

    it('should send money to the winner and resets the buyers array', async () => {
        await lottery.methods.buy().send({
            from: accounts[4],
            value: web3.utils.toWei('1', 'ether'),
        });

        let buyers = await lottery.methods.getBuyers().call({
            from: accounts[0],
        });

        assert.strictEqual(buyers.length, 1);

        const initialBalance = await web3.eth.getBalance(accounts[4]);
        await lottery.methods.draw().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[4]);

        const difference = (web3.utils.fromWei(finalBalance) - web3.utils.fromWei(initialBalance));

        assert(difference === 1);

        buyers = await lottery.methods.getBuyers().call({
            from: accounts[0],
        });

        assert.strictEqual(buyers.length, 0);
    });
});
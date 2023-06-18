import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import lottery from "./lottery";

function App(this: any) {
    const [manager, setManager] = useState("");
    const [buyers, setBuyers] = useState([]);
    const [balance, setBalance] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const manager = await lottery.methods.manager().call();
            const buyers = await lottery.methods.getBuyers().call();
            const balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(lottery.options.address), 'ether'));
            setManager(manager);
            setBuyers(buyers);
            setBalance(balance);
        }
         fetchData();
    }, []);

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        setMessage('You are about to enter the Lottery.Waiting for the transaction to process...');
        await lottery.methods.buy().send({from: accounts[0], value: web3.utils.toWei('10000000', 'gwei')});
        setMessage('You are successfully bought the Lottery');
    }

    async function handleClick() {
        const accounts = await web3.eth.getAccounts();
        setMessage('We are about to pick the winner. Waiting for the transaction to process...');
        await lottery.methods.draw().send({from: accounts[0]});
        const winner = await lottery.methods.winner().call();
        setMessage(`${winner} Won the Lottery. Congratulations!`);
    }

    return (
        <div className="App">
            <header >
                <img src={logo} className="App-logo" alt="logo"/>
                <p> Welcome to EtherJackpot run by Mr.{manager} </p>
                <p> Buy some lottery and win exciting prizes </p>
                <p> There are currently {buyers.length} buyers bidding for the prize of {balance}ETH </p>
                <hr style={{ width: '100%', height: '1px' }}/>
                <h6>{message}</h6>
                <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center' }} >
                    <table>
                        <thead>
                            <tr><th colSpan={2}>Want to try your luck?</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ticket Price</td>
                                <td><input type={"text"} readOnly={true} value={0.01}/> ETH</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{alignItems: 'center'}}><input type={"submit"} value={"Buy"} /></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <hr style={{ width: '100%', height: '1px' }}/>
                <h4>Time to draw</h4>
                <button onClick={handleClick}>Pick A Winner</button>
            </header>
        </div>
    );
}

export default App;

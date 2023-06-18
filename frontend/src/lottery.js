import web3 from "./web3";

const address = '0xF011cf3313a0c01acfAf79dC23e6De069A7eD8F9';

const abi =  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"inputs":[],"name":"buy","outputs":[],"stateMutability":"payable","type":"function","payable":true,"signature":"0xa6f2ae3a"},{"inputs":[],"name":"draw","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x0eecae21"},{"inputs":[],"name":"getBuyers","outputs":[{"internalType":"address payable[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xf64bfaba"},{"inputs":[],"name":"getTicketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x87bb7ae0"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x481c6a75"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setTicketPrice","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x15981650"},{"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xdfbf53ae"}];

const lotteryContract = new web3.eth.Contract(abi, address);
export default lotteryContract;

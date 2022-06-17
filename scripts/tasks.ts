require("@nomiclabs/hardhat-web3");
import {task} from "hardhat/config";

// task("transfer", "Transfers token from wallet to another wallet")
//     .addParam("account", "The account to transfer tokens to")
//     .addParam("amount", "Amount of tokens to transfer")
//     .setAction(async (taskArgs) => {
//         const account = web3.utils.toChecksumAddress(taskArgs.account);
//         const balance = await web3.eth.getBalance(account);
//
//         console.log(web3.utils.fromWei(balance, "ether"), "ETH");
//     });
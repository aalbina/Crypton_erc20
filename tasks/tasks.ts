require("@nomiclabs/hardhat-web3");
import {task} from "hardhat/config";

task("transfer", "Transfer tokens")
  .addParam("token", "Token address")
  .addParam("to", "Reciever address")
  .addParam("amount", "Tokens amount")
  .setAction(async (taskArgs, {ethers}) => {
    const contract = await ethers.getContractFactory('Token');
    const token = contract.attach(taskArgs.token);

    await token.transfer(taskArgs.to, taskArgs.amount);
    console.log("Transfer task finished");
  });


task("transferFrom", "Transfer tokens from one to another")
  .addParam("token", "Token address")
  .addParam("from", "Sender address")
  .addParam("to", "Reciever address")
  .addParam("amount", "Tokens amount")
  .setAction(async (taskArgs, {ethers}) => {
    const contract = await ethers.getContractFactory('Token');
    const token = contract.attach(taskArgs.token);

    await token.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount);
    console.log("transferFrom task finished");
  });


task("approve", "Approve tokens to smn")
  .addParam("token", "Token address")
  .addParam("to", "Reciever address")
  .addParam("amount", "Tokens amount")
  .setAction(async (taskArgs, {ethers}) => {
    const contract = await ethers.getContractFactory('Token');
    const token = contract.attach(taskArgs.token);

    await token.approve(taskArgs.to, taskArgs.amount);
    console.log("approve task finished");
  });
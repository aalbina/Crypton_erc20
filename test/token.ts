import { expect } from "chai";
import { ethers } from "hardhat";
import {Contract, ContractFactory} from "ethers";

describe("Token", function () {
    let Token: ContractFactory;
    let token: Contract;
    let totalSupply = 10000000;
    let sendAmount = 50;
    let decimals = 18;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
    });

    describe("Deployment", function () {
        it("Should return the its name", async function () {
            expect(await token.name()).to.equal("Crypton ERC-20 task");
        });
        it("Should return the its symbol", async function () {
            expect(await token.symbol()).to.equal("CET");
        });
        it("Should return the its decimals", async function () {
            expect(await token.decimals()).to.equal(decimals);
        });
        it("Should return the its totalSupply", async function () {
            expect(await token.totalSupply()).to.equal(totalSupply);
        });
        it("Should add totalSupply to owner on start", async function () {
            const _owner = await token.owner();
            expect(await token.balances(_owner)).to.equal(totalSupply);
        });
    });

    describe("Transactions", function () {
        it("balanceOf should return account balance", async function () {
            const [owner] = await ethers.getSigners();
            expect(await token.owner()).to.equal(owner.address);
            expect(await token.balanceOf(owner.address)).to.equal(await token.totalSupply());
        });
        it("Should transfer tokens", async function () {
            const [owner, addr1] = await ethers.getSigners();

            await token.transfer(addr1.address, sendAmount);

            expect(await token.balanceOf(addr1.address)).to.equal(sendAmount);
            expect(await token.balanceOf(owner.address)).to.equal(totalSupply - sendAmount);
        });
        it("Should not transfer more tokens than awailable", async function () {
            const [owner, addr1] = await ethers.getSigners();

            await expect(
                token.transfer(addr1.address, totalSupply + 1)
            ).to.be.revertedWith("Not enough tokens");
        });
        it("Should transfer tokens from one to another", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();

            await token.transfer(addr1.address, sendAmount);
            await token.connect(addr1).approve(owner.address, sendAmount);

            await token.transferFrom(addr1.address, addr2.address, sendAmount);

            expect(await token.balanceOf(addr2.address)).to.equal(sendAmount);
            expect(await token.balanceOf(addr1.address)).to.equal(0);
            expect(await token.allowance(owner.address, addr1.address)).to.equal(0);
        });
        it("Should not transfer more than allowed", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();

            await token.transfer(addr1.address, sendAmount);
            await token.connect(addr1).approve(owner.address, sendAmount / 2);

            await expect(
                token.connect(addr1).transferFrom(addr1.address, addr2.address, sendAmount / 2 + 1)
            ).to.be.revertedWith("Not allowed");
        });
        it("Should save allowed amount", async function () {
            const [owner, addr1] = await ethers.getSigners();

            await token.approve(addr1.address, sendAmount);

            expect(await token.allowance(owner.address, addr1.address)).to.equal(sendAmount);
        });
        it("Should not allow more than have", async function () {
            const [addr1] = await ethers.getSigners();

            await expect(
                token.approve(addr1.address, totalSupply + 1)
            ).to.be.revertedWith("Not enough tokens");
        });
        it("Should burn tokens", async function () {
            const [owner] = await ethers.getSigners();

            await token.burn(sendAmount);

            expect(await token.totalSupply()).to.equal(totalSupply - sendAmount);
        });
        it("Should burn tokens only for owner", async function () {
            const [owner, addr1] = await ethers.getSigners();

            await expect(
                token.connect(addr1).burn(sendAmount)
            ).to.be.revertedWith("Not owner");
        });
        it("Should mint tokens", async function () {
            const [owner] = await ethers.getSigners();

            await token.mint(sendAmount);

            expect(await token.totalSupply()).to.equal(totalSupply + sendAmount);
        });
        it("Should mint tokens only for owner", async function () {
            const [owner, addr1] = await ethers.getSigners();

            await expect(
                token.connect(addr1).mint(sendAmount)
            ).to.be.revertedWith("Not owner");
        });
    });
});

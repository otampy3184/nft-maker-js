import { ethers } from "hardhat";

async function main() {
  const NFTMakerContractFactory = await ethers.getContractFactory("NFTMaker")
  const NFTMakerConract = await NFTMakerContractFactory.deploy()

  await NFTMakerConract.deployed()

  console.log("Contract deployed:", NFTMakerConract.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

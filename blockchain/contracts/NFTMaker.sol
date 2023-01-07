// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./libs/Base64.sol";
import "../node_modules/hardhat/console.sol";

contract NFTMaker is ERC721 {
    struct NFTAttributes {
        string name;
        string imageURL;
        string description;
    }

    NFTAttributes[] NFTArray;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFTCollections", "nft") {
        console.log("NFT Collections Contract");
    }

    event NewNFTMinted(address sender, uint256 tokenId);

    function mintNFT(string memory name, string memory imageURI, string memory description) public {
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        NFTArray.push(NFTAttributes({
            name: name,
            imageURL: imageURI,
            description: description
        }));

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newTokenId,
            msg.sender
        );

        _tokenIds.increment();

        emit NewNFTMinted(msg.sender, newTokenId);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        NFTArray[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "',
                        NFTArray[_tokenId].description,
                        '", "image": "ipfs://',
                        NFTArray[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string (
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}
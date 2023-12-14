//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNFT is ERC721Enumerable {

    uint maxSupply;
    string metadataURI;

    constructor (string memory _name,string memory _symbol,uint _maxSupply,string memory _metadataURI) ERC721 (_name,_symbol) {
        maxSupply= _maxSupply;
        metadataURI=_metadataURI;
        
    }
        // memory변수로 storage에 저장.
        function mintNFT() public {
            require(totalSupply()<500,"No more mint.");
            // 만족해야지 아래 토탈서플라이가 실행.
            uint tokenId=totalSupply() + 1;

            _mint(msg.sender,tokenId);
        }

        function tokenURI(uint _tokenId) public override view returns (string memory) {
                return string(abi.encodePacked(metadataURI,'/',Strings.toString(_tokenId),'.json'));

        }
    
}
// 판매에 대한 수수료 설정 가능.
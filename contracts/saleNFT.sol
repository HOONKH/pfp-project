//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import './MintNFT.sol';

contract saleNFT {
    //tokenId => price
    mapping (uint=>uint) public nftPrices; 
    // 판매가격 매핑
    uint[] public onSaleNFTs;


    function setForSaleNFT(address _mintNftAddress,uint _tokenId, uint _price)public {
        
        ERC721 mintNftContract=ERC721 (_mintNftAddress);
        // MintNFT타입으로 감싸주는 어드레스를 형식 
        address nftOwner = mintNftContract.ownerOf(_tokenId);
        // 주인값을 받아옴
        require(msg.sender == nftOwner,"Caller is not NFT owner.");
        require(_price>0,"Price is zero or lower.");
        require(nftPrices[_tokenId] == 0,"This NFT is already on sale.");
        // 현재 판매중이 아닌지.
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)),"NFT owner did not approve token");
        // 판매 권한에 대한 함수.
        nftPrices[_tokenId]=_price;
        // 가격등록
        onSaleNFTs.push(_tokenId);
    }
// 판매 등록기능 

    // 컨트랙트 주소 , 토큰id , 가격, 구매자
    function purchaseNFT(address _mintNftAddress,uint _tokenId )public payable {
        ERC721 mintNftContract=ERC721 (_mintNftAddress);
        // MintNFT타입으로 감싸주는 어드레스를 형식 
        address nftOwner = mintNftContract.ownerOf(_tokenId);
        // 주인값을 받아옴

        require(msg.sender != nftOwner,"Call is NFT owner.");
       
        require(nftPrices[_tokenId]>0,"This NFT not sale.");
        // 가격이 등록되어있어야함
        require(nftPrices[_tokenId]<=msg.value);
        // msg.value 입력한 가격
         // 돈이 낮으면 안되게끔 설정.

        payable(nftOwner).transfer(msg.value );
        // payable(Owner).transfer(msg.value /2) 둘이 나눌때. 수수료 형식. payable 두개.

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId); //내가 구매자에게 토큰을
    
        nftPrices[_tokenId]=0;
        // 팔렸을대.
        checkZeroPrice();
    }
// 구매 기능


// 인덱스값 -1 실제 갯수와 비교할때. 인덱스는 0부터라서 배열 마지막 조회할때는 -1
    function checkZeroPrice () public {
        for(uint i = 0 ; i<onSaleNFTs.length;i++){
            if(nftPrices[onSaleNFTs[i]]==0) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length -1];
                onSaleNFTs.pop();
            }
        }
    }
    function getOnSaleNFTs() public view returns (uint[] memory){
        return onSaleNFTs;
    }
}
// 없는 아이디일때도 날려주는 로직 작성.

// 계약생성자가 판매컨트랙트에 권한 부여
// 판매컨트랙트로 (민팅한컨트랙트)판매.
// 다른계정 판매컨트랙트로 민트nft컨트랙트로 구매.
// payable 함수 빨간색.
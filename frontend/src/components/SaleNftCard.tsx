import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NftCard, { INftCard } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext, NftMetadata } from "../types";
import { log } from "console";
import { MINT_NFT_CONTRACT } from "../abis/ContractAddress";

interface SaleNftCard extends INftCard {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard: FC<SaleNftCard> = ({
  image,
  name,
  tokenId,
  metadataArray,
  setMetadataArray,
}) => {
  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<MyOutletContext>();
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const getResistedPrice = async () => {
    try {
      // if(!saleNftContract)return 여기도 상관없음. 유즈이펙트.
      //@ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        //@ts-expect-error
        .ownerOf(tokenId)
        .call();

      //   console.log(nftOwner.toLowerCase());
      //   console.log(account.toLowerCase());

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

      await saleNftContract.methods
        //@ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          //@
          from: account,
          value: web3.utils.toWei(registedPrice, "ether"),
        });
      const temp = metadataArray.filter((v) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;
    getResistedPrice();
  }, [saleNftContract]);

  return (
    <ul>
      <NftCard image={image} name={name} tokenId={tokenId} />
      <div>
        {registedPrice} ETH <button onClick={onClickPurchase}>구매</button>
      </div>
    </ul>
  );
};

export default SaleNftCard;

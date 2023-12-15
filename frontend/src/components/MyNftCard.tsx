import { FC, FormEvent, useEffect, useState } from "react";
import NftCard, { INftCard } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/ContractAddress";

export interface IMyNftCard extends INftCard {
  image: string;
  name: string;
  tokenId: number;
  SaleStatus: boolean;
}

const MyNftCard: FC<IMyNftCard> = ({ image, name, tokenId, SaleStatus }) => {
  const { saleNftContract, account, web3 } =
    useOutletContext<MyOutletContext>();

  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  // e => FormEvent 타입.
  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;
      // 형변환
      await saleNftContract.methods

        .setForSaleNFT(
          //@ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegistedPrice(+price);
      setPrice("");
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    if (!saleNftContract) return;
    getResistedPrice();
  }, [saleNftContract]);

  return (
    <div className="flex flex-col">
      <NftCard image={image} name={name} tokenId={tokenId} />
      {registedPrice ? (
        <div>{registedPrice} ETH</div>
      ) : (
        SaleStatus && (
          <form onSubmit={onSubmitForSale} className="flex">
            <input
              type="text"
              className="border-2 mr-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input type="submit" value="등록" />
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;

// SaleStatus 로 권한있을때 판매기능 부여 없을대 철회

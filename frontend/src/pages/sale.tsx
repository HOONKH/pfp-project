import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext, NftMetadata } from "../types";
import axios from "axios";
import SaleNftCard from "../components/SaleNftCard";

const Sale: FC = () => {
  const { saleNftContract, mintNftContract } =
    useOutletContext<MyOutletContext>();

  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const getSaleNFTs = async () => {
    try {
      const onSaleNfts: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < onSaleNfts.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(onSaleNfts[i])
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(onSaleNfts[i]) });
        // 토큰아이디 포함.
      }
      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;
    getSaleNFTs();
  }, [saleNftContract]);

  useEffect(() => {
    console.log(metadataArray);
  }, [metadataArray]);
  return (
    <div className="bg-green-500 grow">
      {metadataArray.map((v, i) => (
        <div>
          <SaleNftCard
            key={i}
            image={v.image}
            name={v.name}
            tokenId={v.tokenId!}
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
          />
        </div>
      ))}
    </div>
  );
};

export default Sale;

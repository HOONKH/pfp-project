import { FC } from "react";
import NftCard, { INftCard } from "./NftCard";

export interface IMyNftCard extends INftCard {
  image: string;
  name: string;
  tokenId: number;
}

const MyNftCard: FC<IMyNftCard> = ({ image, name, tokenId }) => {
  return (
    <>
      <NftCard image={image} name={name} tokenId={tokenId} />
      <div>판매기능</div>
    </>
  );
};

export default MyNftCard;

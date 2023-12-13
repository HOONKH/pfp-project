import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { MyOutletContext, NftMetadata } from "../types";
import axios from "axios";

const Detail: FC = () => {
  const { tokenId } = useParams();

  const { mintNftContract } = useOutletContext<MyOutletContext>();
  const [metadata, setMetadata] = useState<NftMetadata>();
  const navigate = useNavigate();

  console.log(tokenId);

  const getMyNft = async () => {
    try {
      if (!mintNftContract) return;

      const metadataURI: string = await mintNftContract.methods
        //@ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);
      setMetadata(response.data);
    } catch (error) {
      console.warn("err");
    }
  };

  useEffect(() => {
    getMyNft();
  }, [mintNftContract]);

  return (
    <div className="flex grow justify-center items-center relative">
      <button
        onClick={() => navigate(-1)}
        // ( ) 안에 경로 입력 가능 -1 -> 이전
        className="absolute top-0 left-0 p-2 hover:text-gray-500"
      >
        Back
      </button>
      <div className="w-60">
        <img className="w-60 h-60" src={metadata?.image} alt={metadata?.name} />
        <div className="mt-1 font-bold">{metadata?.name}</div>
        <div className="mt-1 font-bold">{metadata?.description}</div>
        <ul className="flex mt-3 flex-wrap gap-2">
          {metadata?.attributes.map((v, i) => (
            <li key={i} className="">
              <span className="font-semibold">{v.trait_type}</span>
              <span>: {v.value}</span>
            </li>
          ))}
        </ul>
        <div className="text-center mt-2"></div>
      </div>
    </div>
  );
};

export default Detail;

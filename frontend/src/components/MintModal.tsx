import { Dispatch, FC, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext, NftMetadata } from "../types";
import axios from "axios";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MintModal: FC<MintModalProps> = ({ setIsOpen }) => {
  const { mintNftContract, account } = useOutletContext<MyOutletContext>();

  const [metadata, setMetadata] = useState<NftMetadata>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;
      await mintNftContract.methods.mintNFT().send({ from: account });
      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.warn("Errrr");
    }
  };

  return (
    <div className="fixed w-full h-full left-0 top-0 bg-opacity-60 bg-black flex justify-center items-center">
      <div className="p-8 bg-white rounded-lg shadow-inner shadow-gray-500 text-right">
        <button
          className="mb-4 hover:text-gray-500"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </button>
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            <div className="mt-1 font-bold">{metadata.name}</div>
            <div className="mt-1 font-bold">{metadata.description}</div>
            <ul className="flex mt-3 flex-wrap gap-2">
              {metadata.attributes.map((v, i) => (
                <li key={i} className="">
                  <span className="font-semibold">{v.trait_type}</span>
                  <span>: {v.value}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-500 font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <>
            {" "}
            <div>NFT를 민트하시겠습니까?</div>
            <div className="text-center mt-3">
              <button onClick={onClickMint}>확인</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MintModal;

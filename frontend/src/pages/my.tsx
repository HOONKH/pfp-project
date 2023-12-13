import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext } from "../types";
import MintModal from "../components/MintModal";

const My: FC = () => {
  const { mintNftContract, account } = useOutletContext<MyOutletContext>();
  // Layout 에 인터페이스 export로 받아옴.
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  return (
    <>
      <div className="bg-green-500 grow">
        <div className="bg-red-500 text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
      </div>
      {isOpen && <MintModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default My;

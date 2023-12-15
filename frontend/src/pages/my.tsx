import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MyOutletContext, NftMetadata } from "../types";
import MintModal from "../components/MintModal";

import axios from "axios";
import MyNftCard from "../components/MyNftCard";
import { SALE_NFT_CONTRACT } from "../abis/ContractAddress";

const My: FC = () => {
  const { mintNftContract, account, saleNftContract } =
    useOutletContext<MyOutletContext>();
  // Layout 에 인터페이스 export로 받아옴.
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  const getMyNft = async () => {
    try {
      if (!mintNftContract || !account) return;

      //@ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          //@ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(tokenId)
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
        // 토큰아이디 포함.
      }
      setMetadataArray(temp);
    } catch (error) {
      console.warn("err");
    }
  };

  const getSaleStatus = async () => {
    try {
      const isApproved: boolean = await mintNftContract.methods
        //@ts-expect-error
        .isApprovedForAll(account, SALE_NFT_CONTRACT)
        .call();

      setSaleStatus(isApproved);
      // console.log(isApproved); 콘솔로그로 True/False 확인.
    } catch (error) {}
  };

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  const onClickSaleStatus = async () => {
    try {
      await mintNftContract.methods
        // @ts-expect-error
        .setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus)
        .send({
          from: account,
        });

      setSaleStatus(!saleStatus);
      // (철회)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNft();
  }, [mintNftContract, account]);

  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);

  useEffect(() => {
    if (!account) return;
    getSaleStatus();
  }, [account]);

  return (
    <>
      <div className=" grow">
        <div className="flex justify-between p-2">
          <button className="hover:text-gray-500" onClick={onClickSaleStatus}>
            Sale Approved:{saleStatus ? <span>True</span> : <span>False</span>}
          </button>
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className="text-center py-8">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className="p-8 grid grid-cols-2 gap-2">
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
              SaleStatus={saleStatus}
            />
            // ! 존재한다
          ))}
        </ul>
      </div>
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;

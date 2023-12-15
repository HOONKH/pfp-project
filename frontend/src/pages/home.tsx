import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, MyOutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 6;

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<MyOutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        // 최초 메타데이터 0이 아닐때 체크
        getNfts();
      }
    });

    if (!detectRef.current) return;
    // 널이 들어올수있으므로 아닐경우에만 실행해라.
    observer.current.observe(detectRef.current);
  };
  // 수동으로 해제시켜주는 로직 추가.

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;

      const totalSupply = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalSupply));
      setTotalNFT(Number(totalSupply));
    } catch (error) {
      console.error(error);
    }
  };

  const getNfts = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId - i });
          // 임시배열에 리스폰스데이터 NFt에대한아이디도 필요해서 tokenId. 경로에 맞게끔 -i
        }
      }

      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
      // 계속해서 추가하는 스프레드
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNfts();
  }, [totalNFT]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
    // 기존에 인터섹션 옵저버 끊고 다시 탐지를해줘야함. 기준이 metadataArray
  }, [metadataArray]);

  useEffect(() => {
    console.log(searchTokenId);
  });

  return (
    <>
      <div className="flex grow justify-center items-center relative flex-col ">
        <ul className="p-8 grid grid-cols-2 gap-2">
          {metadataArray?.map((v, i) => (
            <NftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
            />
            // ! 존재한다
          ))}
        </ul>
      </div>
      <div ref={detectRef} className=" py-4 text-white">
        Detecting area
      </div>
    </>
  );
};

export default Home;
// 로딩추가!

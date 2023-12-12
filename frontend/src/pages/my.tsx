import { FC, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MyOutletContext } from "../components/Layout";

const My: FC = () => {
  const { mintNftContract } = useOutletContext<MyOutletContext>();
  // Layout 에 인터페이스 export로 받아옴.
  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return <div>My</div>;
};

export default My;

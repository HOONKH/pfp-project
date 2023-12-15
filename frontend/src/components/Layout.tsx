import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3 from "web3";
import { useSDK } from "@metamask/sdk-react";
// HOOKS
import Header from "./Header";
import mintNFtAbi from "../abis/mintNFtAbi.json";
import saleNftAbi from "../abis/saleNftAbi.json";
import { MINT_NFT_CONTRACT, SALE_NFT_CONTRACT } from "../abis/ContractAddress";
// FILES

const Layout: FC = () => {
  const { provider } = useSDK();

  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>("");
  const [mintNftContract, setMintNftContract] = useState<any>(); // <Contract<ContractAbi>> 제네릭안에 제네릭
  const [saleNftContract, setSaleNftContract] = useState<any>(); //

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(new web3.eth.Contract(mintNFtAbi, MINT_NFT_CONTRACT));
    setSaleNftContract(new web3.eth.Contract(saleNftAbi, SALE_NFT_CONTRACT));
  }, [web3]);

  // useEffect(() => {
  //   if (!web3) return;

  //   console.log(mintNftContract);
  // }, [mintNftContract]);

  // useEffect(() => {
  //   console.log(web3);
  // }, [web3]);

  return (
    <div className=" min-h-screen max-w-screen-md mx-auto flex flex-col">
      <Header account={account} setAccount={setAccount} />
      <Outlet
        context={{
          mintNftContract,
          setMintNftContract,
          account,
          saleNftContract,
          web3,
        }}
      />
    </div>
  );
};

export default Layout;

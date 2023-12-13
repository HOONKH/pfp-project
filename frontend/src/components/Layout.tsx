import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3 from "web3";
import { useSDK } from "@metamask/sdk-react";
// HOOKS
import Header from "./Header";
import mintNFtAbi from "../abis/mintNFtAbi.json";
// FILES

const Layout: FC = () => {
  const { provider } = useSDK();

  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>("");
  const [mintNftContract, setMintNftContract] = useState<any>(); // <Contract<ContractAbi>> 제네릭안에 제네릭

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(
      new web3.eth.Contract(
        mintNFtAbi,
        "0xe7E219cBaA8886Ac5D3141AdecE453E25D369aF5"
      )
    );
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
      <Outlet context={{ mintNftContract, setMintNftContract, account }} />
    </div>
  );
};

export default Layout;

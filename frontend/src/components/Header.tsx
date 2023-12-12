import { useSDK } from "@metamask/sdk-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  // Dispatch<SetStateAction<string>> = 구조분해 문법 적용!
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  // generic setStateAction 값을 바꾸는 함수.
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.warn("error");
    }
  };

  return (
    <div className="bg-pink-300 p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">HOME</Link>
        <Link to="/my">MY</Link>
        <Link to="/sale">SALE</Link>
      </div>
      <div>
        {account ? (
          <div className="flex gap-2">
            <span>
              {account.substring(0, 6)}...
              {account.substring(account.length - 5)}
            </span>
            <button onClick={() => setAccount("")}>Logout</button>
          </div>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask Login</button>
        )}
      </div>
    </div>
  );
};

export default Header;

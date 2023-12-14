import { FC, useState } from "react";
import { Link } from "react-router-dom";

export interface INftCard {
  image: string;
  name: string;
  tokenId: number;
}

const NftCard: FC<INftCard> = ({ image, name, tokenId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };
  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <Link to={`/detail/${tokenId}`}>
      <li
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative"
      >
        <img className="w-42 h-42" src={image} alt={name} />
        <div>{name}</div>

        {isHover && (
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div>
        )}
      </li>
    </Link>
  );
};

export default NftCard;

//     <li onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}> 마우스 호버시 액션 !!!!
// 버튼 호버 클래스 디브나 li 마우스호버

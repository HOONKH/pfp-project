import Web3, { Contract, ContractAbi } from "web3";

export interface MyOutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
  saleNftContract: Contract<ContractAbi>;
  // Contract<ContractAbi>;
  // 최상위 컴포넌트에 인터페이스
}
// 타입을 정의해줘야하는것은 안에 제네릭으로 되어있음.
export interface NftMetadata {
  tokenId?: number;
  // 있을수도 있고 없을수도있고.
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}
// 객체의 배열 표현 위에처럼
// 인터페이스는 앞에 I를 붙임,.

// export interface NftMetadataTokenId extends NftMetadata {
//   tokenId: number;
// }

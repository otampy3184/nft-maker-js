# NFT Maker for JS

- Hardhatから独自コントラクトをブロックチェーン上にデプロイし、Reactのフロントエンドアプリ上から好きな画像を添えてNFTとしてMintできる(改良版)

## 実行環境

- macOS Monterey 12.2.1
- Node.js v16.14.2
- Solidity 0.8.9
- React.js 18.2.0
- Hardhat 2.12.2

## 改善点

- 画像をIPFSにアップロードして固有IDを取得する工程と、NFTに画像のIPFS固有IDを付与してMintする工程を分けることで動作が安定(IPFSから取得したCIDを処理内でそのままMint用関数に引き渡していたことが原因？)
- 前回のバージョンではNFTの付加情報として画像のみ加えることしかできなかったが、Name(Opensea上で表示されるNFTの名前)とDescription(Opensea上で表示されるNFTの固有の説明文)
- コンポーネントの切り分けを行い、可読性を改善(？)

## フォルダ構成

```:
nft-maker-js
├── README.md
├── blockchain                         --- **Hardhatで作成したBlockchain関連のファイル**
│   ├── README.md
│   ├── artifacts                      --- **デプロイ後の生成物が格納されるフォルダ**
│   ├── cache
│   ├── contracts
│   │   ├── NFTMaker.sol               --- **作成したコントラクトの置き場**
│   │   └── libs
│   │       └── Base64.sol             --- **Json文字列編集のために用意したライブラリファイル**
│   ├── hardhat.config.ts               --- **HardhatとBlockchainとの接続を設定するファイル**
│   ├── package-lock.json
│   ├── package.json
│   ├── scripts
│   │   └── deploy.ts                   --- **作成したコントラクトをデプロイするためのファイル**
│   ├── test
│   │   └── NFTMaker_test.ts
│   ├── tsconfig.json
│   └── typechain-types
│
└── frontend                            --- **create–react–appで作成したフロントエンドアプリフォルダ**
    ├── README.md
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── index.html
    └── src
        ├── App.css
        ├── App.js                      --- **親コンポーネント**
        ├── abi
        │   ├── NFTMaker_goerli.json
        │   └── NFTMaker_mumbai.json    --- **コントラクトをデプロイ後に生成されたファイル(blockchain/artifacts/contracts/NFTMaker.json)をコピーしたもの(ネットワークの区別をするため、末尾に_mumbaiや_goerliを追記している)**
        ├── components
        │   ├── ConnectWallet.js        --- **Metamaskなどのウォレットとの接続用コンポーネント**
        │   ├── Loading.js              --- **ローディング表示を行うためのコンポーネント**
        │   ├── MintNFT.js              --- **NFTをMintする処理を行うコンポーネント**
        │   └── UploadToIPFS.js         --- **IPFSに画像をアップロードし、固有IDを取得するコンポーネント**
        ├── index.css
        └── index.js
```

## 利用方法(VercelにデプロイされWebたアプリケーション)

1. [ここ](https://metamask.io/download/)からMetamaskをブラウザにインストールする
2. [このサイト](https://wiki.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)を参考にMetamaskにMumbaiネットワークを追加する
3. [このサイト](https://mumbaifaucet.com/)か[このサイト](https://faucet.polygon.technology/)にアクセスし、アドレス入力欄にMetamaskに表示されているアドレスを貼り付けてリクエストを送りテストネット用のTokenを手に入れる
4. Vercel上にデプロイされたアプリケーションにアクセスし([リンク](https://nft-maker-js.vercel.app/))に「Connect Wallet」を押す
5. Metamaskの承認用ポップアップが出てくるので承認する
6. 「ファイルを選択」ボタンからアップロードしたい画像を選択し、ロード完了を待つと自動的にIPFSリンク入力欄にIPFS上の固有IDが入力される
7. 名前、説明文も入力し、「Mint」を押すと再びMetamaskの承認ポップアップが現れるので承認する
8. ロード完了を待つと画面下部にOpenseaへのリンクが表示されるので、リンク先に遷移するとMintしたNFTのページに移動できる

## 注意しておくべき点

- 本番環境では本物のMaticかEthを用意し、Metamask上の利用アカウントに入金しておくこと
- 動作確認は現状Polygon testnet上のみ
- NFTコレクションの名前が、現在は"NFT Collections"というものになっている
  - これはSolidityのコントラクト内で先にコンストラクタとしてNFTコレクションの名称をハードコーディングで決めてしまっているため
  - もし名称を変える場合は、NFTMaker.solを編集し、コンストラクタ部分にハードコーディングしているName部分を更新し、再度ブロックチェーン上にデプロイすること
  - 新規でコントラクトをデプロイした場合、フロントエンド上で利用しているコントラクトアドレスの値とコントラクトのABI(NFTMaker_mumbai.json)などのファイルを更新する必要がある(フォルダ構成の項を参照)

## Hardhatを使ったコントラクトのデプロイ方法

何らかの理由でSolidityコントラクトを更新し、新しくデプロイする場合は、以下の手順に従ってデプロイを行う

1. リポジトリをクローン

    ```:
    % git clone github.com/otampy3184/nft-maker-js
    % cd nft-maker-js/blockchain
    ```

2. パッケージをインストール

    ```:
    % npm install
    ```

3. blockchainフォルダ直下に.envを作成する

    ```:
    % touch .env
    ```

4. vimやVSCodeで.envファイルを編集し、以下の値を設定する

    ```:
    API_KEY="Alchemyで取得したGoerli用のAPIキー"
    SECRET_KEY="Metamaskアカウントのシークレットキー"
    API_KEY_MUM="Polygon用のAlchemyのAPIキー"
    ```

    AlchemyからのAPIキー取得方法は[こちら](https://www.youtube.com/watch?v=o3sO3KjwfAg)

    Metamaskのシークレットキー取得方法は[こちら](https://www.wise-sendai.jp/metamask-key/)

    また、テスト上記のAPI_KEYはテスト用だったのでPolygonメインネットではなくMumbaiテストネットに向いている。本番用に動作させたい場合は別途本番用のAPI_KEYを取得し、hardhat.config.tsを編集すること

5. vimやVSCodeなどでcontracts/NFTMaker.solを編集、または同じディレクトリに新規フォルダを作成し編集する

6. Hardhatを使ってデプロイする

    ```:
    % npx hardhat run script/deploy.ts --network mumbai  
    ```

    上記例はNFTMaker.solを編集し、mumbaiテストネットワークにデプロイしたい場合

    仮にNFTMaker.sol以外のファイルを作成したい場合、deployファイル(script/deploy.ts)を編集する

    ```typescript:deploy.ts
    import { ethers } from "hardhat";

    async function main() {
    // この部分でデプロイしたいNFTコントラクトを指定している
    // ethers.getContractFactory()の引数に新規作成したコントラクトの名前を入れておく(ファイル名ではなく、ファイル内のcontract{}で宣言した名前)
    const NFTMakerContractFactory = await ethers.getContractFactory("NFTMaker") 
    const NFTMakerConract = await NFTMakerContractFactory.deploy()

    await NFTMakerConract.deployed()

    console.log("Contract deployed:", NFTMakerConract.address)
    }

    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
    ```

7. デプロイが成功すると、コンソール上にデプロイしたアドレスが表示され、artifacts/contractsにコンパイルされたjsonファイルが生成される

8. 新規のアドレスはfrontend/src/components/MintNFT.js内で宣言しているCONTRACT_ADDRESSの値として入力する。frontend/src/abi直下に、artifactsに生成されたjsonファイルをコピーして移動しておく(元あったファイルは削除)(MintNFT.jsファイル内ではimportのファイル名に注意)

9. 最後にfrontendアプリをlocalhostで起動する

    ```:
    % npm run start
    ```

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

## 主要なソースコードの説明

client/src/components/NFTUploader/NFTUploader.jsx

```javascript:NFTUploader.jsx
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義
   */
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
```

画面上でMetamaskウォレットが接続されているかを確認する(後のuseEffectで利用)

```javascript:NFTUploader.jsx
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };
```

Metamaskからウォレット情報を画面上に繋ぐ処理を呼び出す

```javascript:NFTUploader.jsx
  const connectWallet = async () => {
    try {
      // Metamaskから取れるEthereumオブジェクトはwindowの中に入っている
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエスト
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付け
       */
      setCurrentAccount(accounts[0]);

      // EventListnerを起動させる
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };
```

Solidityコントラクトを呼び出してNFTのMint処理を呼び出す

```javascript:NFTUploader.jsx
  const askContractToMintNft = async (ipfs) => {
    try {
      // この辺の処理はConnectWalletと同じ
      const { ethereum } = window;
      if (ethereum) {
        // コントラクトをフロントエンドから呼び出す際は"abi", "signer", "contract address"が必要
        // abi　はHardhat側でコンパイルしたものをフロントエンド側にコピーしてImportしておく
        // signer はwallet情報から取得するが、取得のためにMetamask接続情報が詰まったethereumオブジェクトを利用する
        // contract addressはHardhat側でコントラクトをデプロイした際に出てくるアドレスを持ってくる(今回はハードコーディングしてある)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        // ↑で作成したconnectedContractインスタンスはSolidityコントラクトの関数を呼び出せる
        // 単純にconnectedContract.*someFunction*(*params*)で呼び出す
        // mintIpfsNFTは引数としてNFTの名前とIPFSのURL情報が必要
        // IPFSのURL情報は下のimageToNFT()の中で作成している
        // コントラクト実行は非同期処理で行うこと
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait.");
        // トランザクションが確実に実行されるよう、wait()処理を実行する
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://mumbai.etherscan.io/tx/${nftTxn.hash}`
        );
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
```

フロントエンド上から直接呼び出される関数

```javascript:NFTUploader.jsx
  const imageToNFT = async (e) => {
    // Loadingアイコンを使うためStateを更新
    setIsLoading(true);
    // Web3Storageのクライアント
    // 外部利用をする場合、API_KEYはgitに上げていない.envフォルダに書かれているため、自分でクライアントAPI_KEYをとってくること
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log(image)

    // ここで一度Web3Storage経由でIPFSにアップロードする
    // nameとかはなんでもいい
    const rootCid = await client.put(image.files, {
      name: 'experiment',
      maxRetries: 3
    })

    // アップロードされたファイルをとってくる
    // よくここで失敗する
    const res = await client.get(rootCid) // Web3Response
    const files = await res.files() // Web3File[]
    for (const file of files) {
      console.log("file.cid:", file.cid)
      askContractToMintNft(file.cid)
    }
  }
```

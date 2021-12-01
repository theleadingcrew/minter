- [Initialization](#initialization)
- [Deployment](#deployment)

## Initialization
The minter is based on [nft-minter](https://github.com/simjunjie/nft-minter-tutorial/tree/main/nft-minter) and this [website](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f).

Install with
```
npm install
npm install dotenv --save
npm install gh-pages
```

The initialization files required are:
- `.env`
  This file contains the `REACT_APP_ALCHEMY_KEY` and the `REACT_APP_CONTRACT_ADDRESS`.
  The `REACT_APP_ALCHEMY_KEY` is the API key that allows the minter to interact with Alchemy, the Ethereum node.
  The `REACT_APP_CONTRACT_ADDRESS` is the ETH address of the deployed contract.

- `src/contract-abi.json`
  The contract ABI is an interface that the React.js app is able to call functions from. Retrieve the contract ABI from etherscan and save it.

- Update `package.json` with the following:
  - line 4: `"homepage": "https://test.theleadingcrew.io",`
  - line 20: `"predeploy": "npm run build",`
  - line 21: `"deploy": "gh-pages -d build",`

## Deployment
For local testing, run
```
npm start
```

For live deployment, run
```
npm run deploy
```
This will create a `gh-pages` branch and push the branch onto git.
Next, start a subdomain page using the `CNAME Record`.
Set the root page on git to the `gh-pages` branch.

If there are any updates to the branch, it seems that it is easier to delete the branch on git and redeploy.
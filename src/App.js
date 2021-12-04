import './App.css';
import { useEffect, useState } from "react";
import {
	connectWallet,
	getCurrentWalletConnected,
	mint,
} from "./interact.js";
import gif from './promogif3.gif';

require("dotenv").config();

const App = () => {
	const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");

	const [mintAmount, setMintAmount] = useState("");

	useEffect(async () => {
	  const { address, status } = await getCurrentWalletConnected();

	  setWallet(address);
	  setStatus(status);

	  addWalletListener();
	}, []);

	function addWalletListener() {
	  if (window.ethereum) {
		window.ethereum.on("accountsChanged", (accounts) => {
		  if (accounts.length > 0) {
			setWallet(accounts[0]);
			setStatus("Check that you are connected to the Ethereum Mainnet.");
		  } else {
			setWallet("");
			setStatus("🦊 Connect to Metamask using the top right button.");
		  }
		});
	  } else {
		setStatus(
		  <p>
			{" "}
			🦊{" "}
			<a target="_blank" href={`https://metamask.io/download.html`}>
			  You must install Metamask, a virtual Ethereum wallet, in your
			  browser.
			</a>
		  </p>
		);
	  }
	}

	const connectWalletPressed = async () => {
	  const walletResponse = await connectWallet();
	  setStatus(walletResponse.status);
	  setWallet(walletResponse.address);
	};

	const onMintPressed = async () => {
	  const { success, status } = await mint(mintAmount);
	  setStatus(status);
	  if (success) {
		setMintAmount("");
	  }
	};

	return (
		walletAddress.length > 0
		?
		(
		<div className="Minter">
		<button id="walletButton">
		{
		"Connected: " +
		  String(walletAddress).substring(0, 6) +
		  "..." +
		  String(walletAddress).substring(38)
		}
	  	</button>
		{"Contract address: " + String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(0, 6) + "..." +	String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(38)}

		<h1 id="title">Mint TheLeadingCrew NFT</h1>
		<img src={gif} alt="Logo" width="400" height="400" />

		<form>
		<p>Enter the amount of NFTs you wish to mint and press "Mint"</p>
		<p>Each NFT cost 0.06 ETH </p>
        <input
          type="text"
          placeholder="Enter mint amount: 1 to 6 (Max)"
          onChange={(event) => setMintAmount(event.target.value)}
        />
      </form>

		<button id="mintButton" onClick={onMintPressed}>
			Mint
		</button>
		<p id="status" style={{ color: "red" }}>
		  {status}
		</p>
	  </div>
		)
		:
		(
		<div className="Minter">
		<button id="connectButton" onClick={connectWalletPressed}>
		  {<span>Connect Wallet</span>}
		</button>
		<br></br>
		<br></br>
		{"Contract address: " + String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(0, 6) + "..." +	String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(38)}
		<h1 id="title">The Leading Crew NFT Minter</h1>
		<img src={gif} alt="Logo" width="400" height="400" />
		</div>
		)
	);
  };

export default App;

import './App.css';
import { useEffect, useState } from "react";
import {
	connectWallet,
	getCurrentWalletConnected,
	mint,
} from "./interact.js";
import gif from './img/promogif3.gif';
import logo from './img/tlc_logo_black.png';

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
		walletAddress.length > 0 ?
		(
			<div className="Minter">
				<button id="walletButton">
					{"Connected: " + String(walletAddress).substring(0, 6) + "..." + String(walletAddress).substring(38)}
				</button>
				<img src={logo} width="75" height="75" />
				{"Contract address: " + String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(0, 6) + "..." +	String(process.env.REACT_APP_CONTRACT_ADDRESS).substring(38)}

				<h1 id="title">MINT THE LEADING CREW NFT</h1>
				<img src={gif} alt="Logo" width="400" height="400" />
				<form>
					<p>Each NFT cost 0.06 ETH (excluding gas fees). </p>
					<p>Enter the amount of NFTs you wish to mint and press "Mint".</p>
					<input
						type="text"
						placeholder="Enter mint amount: 1 to 6 (Max)"
						onChange={(event) => setMintAmount(event.target.value)}
					/>
				</form>

				<button id="mintButton" onClick={onMintPressed}>
					Mint
				</button>
				<p id="status" style={{ color: "red" }}> {status} </p>
			</div>
		) :
		(
			<div className="Minter">
				<img src={logo} width="400" height="400" />
				<br></br>
				<button id="connectButton" onClick={connectWalletPressed} height="70">
					{<span>Connect Wallet</span>}
				</button>
			</div>
		)
	);
};

export default App;

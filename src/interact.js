require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = require("./contract-abi.json");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				status: "Check that you are connected to the Ethereum Mainnet.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
					You must install Metamask, a virtual Ethereum wallet, in your
					browser.
					</a>
				</p>
				</span>
			),
		};
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
				address: addressArray[0],
				status: "Check that you are connected to the Ethereum Mainnet.",
				};
			} else {
				return {
				address: "",
				status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
					You must install Metamask, a virtual Ethereum wallet, in your
					browser.
					</a>
				</p>
				</span>
			),
		};
	}
};

export const mint = async (mintAmount) => {
	if (mintAmount.trim() == "") {
		return {
			success: false,
			status: "❗Please make sure all fields are completed before minting.",
		};
	}
	if (mintAmount > 6) {
		return {
		success: false,
		status: "You can only mint a maximum of 6 NFTs.",
		};
	}

	window.contract = await new web3.eth.Contract(contractABI, contractAddress);

	const transactionParameters = {
	to: contractAddress, // Required except during contract publications.
	from: window.ethereum.selectedAddress, // must match user's active address.
	value: (Number(6e16)* mintAmount).toString(16),
	data: window.contract.methods
		// .publicMint(mintAmount)
		.presaleMint(mintAmount)
		.encodeABI(),
	};

	try {
		const txHash = await window.ethereum.request({
		method: "eth_sendTransaction",
		params: [transactionParameters],
		});
		return {
		success: true,
		status:
			"✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" +
			txHash,
		};
	} catch (error) {
		return {
		success: false,
		status: "😥 Something went wrong: " + error.message,
		};
	}
};

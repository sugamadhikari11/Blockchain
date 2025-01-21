"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractAddress from "@/contracts/contract-address.json";
import abi from "@/contracts/Calculator.json";

interface StateType {
  provider: ethers.BrowserProvider | null;
  signer: any | null;
  contract: ethers.Contract | null;
}

const calculatorContractAddress = ContractAddress.Calculator;
const contractABI = abi.abi;
const SEPOLIA_NETWORK_ID = "11155111";
const HARDHAT_NETWORK_ID = "31337";

export default function Home() {
  const [state, setState] = useState<StateType>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [accounts, setAccounts] = useState("None");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });
          // if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
          if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            const account = await ethereum.request({
              method: "eth_requestAccounts",
            });

            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              calculatorContractAddress,
              contractABI,
              signer
            );
            setAccounts(account);
            setUserAddress(account[0]);
            setState({ provider, signer, contract });
          } else {
            setUserAddress("Other Network");
          }
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  const handleOperation = async (operation: string) => {
    if (!input1 || !input2) return alert("Please enter both numbers");
    if (!userAddress) return alert("You cannot perform operation");
    if (userAddress === "Other Network")
      // return alert("Please Switch to Sepolia Network");
      return alert("Please Switch to Hardhat Network");

    try {
      if (operation === "add") {
        await state.contract!.add(parseInt(input1), parseInt(input2));
      } else if (operation === "subtract") {
        await state.contract!.subtract(parseInt(input1), parseInt(input2));
      } else if (operation === "multiply") {
        await state.contract!.multiply(parseInt(input1), parseInt(input2));
      } else if (operation === "divide") {
        await state.contract!.divide(parseInt(input1), parseInt(input2));
      }
    } catch (error) {
      console.error("Error performing operation:", error);
    }
  };

  const handleGetResult = async () => {
    if (!userAddress) return alert("You cannot perform operation");
    if (userAddress === "Other Network")
      return alert("Please Switch to Hardhat Network");
    // return alert("Please Switch to Sepolia Network");
    const response = await state.contract!.getResult();
    setResult(response.toString());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Calculator DApp</h1>
        <h1 className="text-sm font-bold mb-6 text-center">
          Your Address: {accounts[0]}
        </h1>
        <input
          type="number"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Enter first number"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Enter second number"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />
        <div className="flex justify-around mb-4">
          <button
            onClick={() => handleOperation("add")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <button
            onClick={() => handleOperation("subtract")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Subtract
          </button>
          <button
            onClick={() => handleOperation("multiply")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Multiply
          </button>
          <button
            onClick={() => handleOperation("divide")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Divide
          </button>
        </div>
        <button
          onClick={() => handleGetResult()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Result
        </button>
        {result && (
          <div className="text-center text-xl font-bold">Result: {result}</div>
        )}
      </div>
    </div>
  );
}
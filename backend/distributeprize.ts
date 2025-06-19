import express from 'express';
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { CdpClient } from "@coinbase/cdp-sdk";
import { config, parse } from 'dotenv';
import { parseEther,parseUnits } from "viem";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
config();
const { CDP_API_KEY_ID, CDP_API_KEY_SECRET, WALLET_SECRET } = process.env;

const router = express.Router();


const cdp = new CdpClient({
    apiKeyId: CDP_API_KEY_ID,
    apiKeySecret: CDP_API_KEY_SECRET,
    walletSecret: WALLET_SECRET,
});

router.post('/prize/:amount', async (req, res) => {
   const { amount } = req.params;
   const parsedAmount = parseUnits(amount, 6); 
    const sender = await cdp.evm.getOrCreateAccount({ name: "haxry" });
const receiver = await cdp.evm.getOrCreateAccount({ name: "Alice" });
const { transactionHash } = await sender.transfer({
  to: receiver,
  amount: parsedAmount,
  token: "usdc",
  network: "base-sepolia"
});
console.log(`Transaction sent: ${transactionHash}`);
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const receipt = await publicClient.waitForTransactionReceipt({
  hash: transactionHash,
});
res.status(200).json({
   
    transactionHash: receipt.transactionHash,
    
    status: receipt.status ? 'Success' : 'Failed',
});
})


export default router;

import express from 'express';
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { CdpClient } from "@coinbase/cdp-sdk";
import { config } from 'dotenv';
config();
const { CDP_API_KEY_ID, CDP_API_KEY_SECRET, WALLET_SECRET } = process.env;

const router = express.Router();


const cdp = new CdpClient({
    apiKeyId: CDP_API_KEY_ID,
    apiKeySecret: CDP_API_KEY_SECRET,
    walletSecret: WALLET_SECRET,
});

router.post('/ask-ai', async (req, res) => {
  const { prompt } = req.body;
const accountName="Eve"
let account = await cdp.evm.getOrCreateAccount({
  name: accountName
});
const fetchWithPayment = wrapFetchWithPayment(fetch, account);
  const body = {
    prompt
  };

  const url = 'http://localhost:3000/ask';

  try {
    const response = await fetchWithPayment(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const paymentHeader = response.headers.get('x-payment-response');
    const decodedPayment = paymentHeader ? decodeXPaymentResponse(paymentHeader) : null;

    res.status(200).json({
      message: ' AI query successful with payment',
      bounty: data,
      paymentDetails: decodedPayment,
    });
  } catch (error: any) {
    console.error(' Payment or creation failed:', error);
    res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
});

export default router;

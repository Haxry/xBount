import { config } from "dotenv";
import express from "express";
import { exact } from "x402/schemes";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import {
  Network,
  PaymentPayload,
  PaymentRequirements,
  Price,
  Resource,
  settleResponseHeader,
} from "x402/types";
import { useFacilitator } from "x402/verify";
import { processPriceToAtomicAmount } from "x402/shared";
import { v4 as uuidv4 } from "uuid";
import bountyRouter from "./bounty";
import answerRouter from "./answer";
import askaiRouter from "./askai";
config();
const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
const payTo = process.env.ADDRESS as `0x${string}`;

if (!facilitatorUrl || !payTo) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', bountyRouter);
app.use('/api', answerRouter);
app.use('/api', askaiRouter);
const { verify, settle } = useFacilitator({ url: facilitatorUrl });
const x402Version = 1;

function createExactPaymentRequirements(
  price: Price,
  network: Network,
  resource: Resource,
  description = "",
): PaymentRequirements {
  const atomicAmountForAsset = processPriceToAtomicAmount(price, network);
  if ("error" in atomicAmountForAsset) {
    throw new Error(atomicAmountForAsset.error);
  }
  const { maxAmountRequired, asset } = atomicAmountForAsset;

  return {
    scheme: "exact",
    network,
    maxAmountRequired,
    resource,
    description,
    mimeType: "",
    payTo: payTo,
    maxTimeoutSeconds: 60,
    asset: asset.address,
    outputSchema: undefined,
    extra: {
      name: asset.eip712.name,
      version: asset.eip712.version,
    },
  };
}

/**
 * Verifies a payment and handles the response
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param paymentRequirements - The payment requirements to verify against
 * @returns A promise that resolves to true if payment is valid, false otherwise
 */
async function verifyPayment(
  req: express.Request,
  res: express.Response,
  paymentRequirements: PaymentRequirements[],
): Promise<boolean> {
  const payment = req.header("X-PAYMENT");
  if (!payment) {
    res.status(402).json({
      x402Version,
      error: "X-PAYMENT header is required",
      accepts: paymentRequirements,
    });
    return false;
  }

  let decodedPayment: PaymentPayload;
  try {
    decodedPayment = exact.evm.decodePayment(payment);
    decodedPayment.x402Version = x402Version;
  } catch (error) {
    res.status(402).json({
      x402Version,
      error: error || "Invalid or malformed payment header",
      accepts: paymentRequirements,
    });
    return false;
  }

  try {
    const response = await verify(decodedPayment, paymentRequirements[0]);
    if (!response.isValid) {
      res.status(402).json({
        x402Version,
        error: response.invalidReason,
        accepts: paymentRequirements,
        payer: response.payer,
      });
      return false;
    }
  } catch (error) {
    res.status(402).json({
      x402Version,
      error,
      accepts: paymentRequirements,
    });
    return false;
  }

  return true;
}


const mongoURI = 'mongodb+srv://Harrish:Harrish%4090600@cluster0.0rynh.mongodb.net/myDatabase?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


const SolutionSchema = new mongoose.Schema({
  title: String,
  solution: String,
  submittedBy: String,
  submittedAt: String,
});

const BountySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  submittedBy: String,
  submittedAt: String,
  solutions: [SolutionSchema],
});

const Bounty = mongoose.model('Bounty', BountySchema);


app.post('/question', async (req, res) => {
  
    const { title, description, price, submittedBy } = req.body;
    const resource = `${req.protocol}://${req.headers.host}${req.originalUrl}` as Resource;
    console.log("Creating bounty with resource:", resource);
     console.log("bounty by",submittedBy);
    const paymentRequirements = [
      createExactPaymentRequirements(
        price,
        "base-sepolia",
        resource,
        "A bounty for solving a challenge"
      ),
    ];

    console.log("verifying payment");
    const isValid = await verifyPayment(req, res, paymentRequirements);
    console.log("✅ Payment valid?", isValid);
    //move it after the settle call
    if (!isValid) return;
       const newBounty = new Bounty({
      title,
      description,
      price,
      submittedBy,
      submittedAt: new Date().toISOString(),
      solutions: [],
    });

    await newBounty.save();
    try{
    const settleResponse = await settle(
      exact.evm.decodePayment(req.header("X-PAYMENT")!),
      paymentRequirements[0],
    );
    console.log("✅ Payment settled:", settleResponse);
    const responseHeader = settleResponseHeader(settleResponse);
    res.setHeader("X-PAYMENT-RESPONSE", responseHeader);

    
    res.status(201).json({ message: 'Bounty created', bounty: newBounty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bounty' });
  }
});


app.post('/answer/:bountyId', async (req, res) => {
  
    const { bountyId } = req.params;
    const { title, solution, submittedBy } = req.body;
    
    const price = 0.01; 
    const resource = `${req.protocol}://${req.headers.host}${req.originalUrl}` as Resource;
    console.log("Creating bounty with resource:", resource);
    console.log("bounty by",submittedBy);
    const paymentRequirements = [
      createExactPaymentRequirements(
        price,
        "base-sepolia",
        resource,
        "Answer to a bounty",
      ),
    ];

    console.log("verifying payment");
    const isValid = await verifyPayment(req, res, paymentRequirements);
    console.log("✅ Payment valid?", isValid);
    if (!isValid) return;
    try {
      const settleResponse = await settle(
      exact.evm.decodePayment(req.header("X-PAYMENT")!),
      paymentRequirements[0],
    );
    console.log("✅ Payment settled:", settleResponse);
    const responseHeader = settleResponseHeader(settleResponse);
    res.setHeader("X-PAYMENT-RESPONSE", responseHeader);

    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }

    const newSolution = {
      title,
      solution,
      submittedBy,
      submittedAt: new Date().toISOString()
    };

    bounty.solutions.push(newSolution);
    await bounty.save();

    res.status(201).json({ message: 'Solution added', bounty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add solution' });
  }
});

app.get('/bounties', async (req, res) => {
  try {
    const bounties = await Bounty.find();

    const formatted = bounties.map(b => ({
      id: b._id.toString(),
      title: b.title,
      description: b.description,
      price: b.price,
      submittedBy: b.submittedBy,
      submittedAt: b.submittedAt,
      solutions: (b.solutions as unknown as any[]).map(s => ({
      id: s._id.toString(),
      title: s.title,
      solution: s.solution,
      submittedBy: s.submittedBy,
      submittedAt: s.submittedAt,
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bounties' });
  }
});

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;
 

  
     const price = 0.01; 
    const resource = `${req.protocol}://${req.headers.host}${req.originalUrl}` as Resource;
    console.log("Asking AI with resource:", resource);
    const paymentRequirements = [
      createExactPaymentRequirements(
        price,
        "base-sepolia",
        resource,
        "Payment for AI query",
      ),
    ];

    console.log("verifying payment");
    const isValid = await verifyPayment(req, res, paymentRequirements);
    console.log("✅ Payment valid?", isValid);
    if (!isValid) return;
    try {
      const settleResponse = await settle(
      exact.evm.decodePayment(req.header("X-PAYMENT")!),
      paymentRequirements[0],
    );
    console.log("✅ Payment settled:", settleResponse);
    const responseHeader = settleResponseHeader(settleResponse);
    res.setHeader("X-PAYMENT-RESPONSE", responseHeader);
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', 
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4000', // required by OpenRouter
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to query LLM' });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
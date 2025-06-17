import { config } from "dotenv";
import express from "express";
import { exact } from "x402/schemes";
import cors from "cors";
import mongoose from "mongoose";
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
  id: { type: String, required: true },
  title: String,
  solution: String,
  submittedBy: String,
  submittedAt: String,
}, { _id: false }); 


const BountySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  description: String,
  price: Number,
  submittedBy: String,
  submittedAt: String,
  solutions: [SolutionSchema]
});

const Bounty = mongoose.model('Bounty', BountySchema);


app.post('/question', async (req, res) => {
  try {
    const { title, description, price, submittedBy } = req.body;
     const bountyPrice = price;
     const resource = `${req.protocol}://${req.headers.host}${req.originalUrl}` as Resource;
  const paymentRequirements = [
    createExactPaymentRequirements(
      price, 
      "base-sepolia",
      resource,
      "A bounty for solving a challenge",
    ),
  ];
  console.log("verifying payment");
  const isValid = await verifyPayment(req, res, paymentRequirements);
 console.log("✅ Payment valid?", isValid);
 if (!isValid) return;
 const settleResponse = await settle(
      exact.evm.decodePayment(req.header("X-PAYMENT")!),
      paymentRequirements[0],
    );
    const responseHeader = settleResponseHeader(settleResponse);
    res.setHeader("X-PAYMENT-RESPONSE", responseHeader);
  
    const newBounty = new Bounty({
      id: uuidv4(),
      title,
      description,
      price,
      submittedBy,
      submittedAt: new Date().toISOString(),
      solutions: []
    });

    await newBounty.save();
    res.status(201).json({ message: 'Bounty created', bounty: newBounty });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bounty' });
  }
});

app.post('/answer/:bountyId', async (req, res) => {
  try {
    const { bountyId } = req.params;
    const { title, solution, submittedBy } = req.body;

    const bounty = await Bounty.findOne({ id: bountyId });
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }

    const newSolution = {
      id: uuidv4(),
      title,
      solution,
      submittedBy,
      submittedAt: new Date().toISOString()
    };

    bounty.solutions.push(newSolution);
    await bounty.save();

    res.status(201).json({ message: 'Solution added', bounty });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add solution' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
# XBount — Decentralized Bounty Platform with AI Assistance

**XBount** is a decentralized platform where users can post bounties, solve challenges to earn rewards, and receive AI-powered assistance. The entire payment system is built using the **x402 protocol** and **Coinbase CDP Wallet API**, enabling secure, trustless, and onchain microtransactions.

## Key Features

### 1. Bounty Posting
Users can post challenges with a specified title, description, and reward (e.g. USDC). To make the bounty active, the creator must transfer the reward amount to the platform wallet using a CDP wallet-powered x402 payment flow.

### 2. Solving Challenges
Other users can submit solutions to posted bounties. To submit a solution, a solver must pay a small fee (e.g., 0.01 USDC). This encourages high-quality answers and discourages spam. Once a bounty creator selects a solution, the prize is automatically transferred to the selected solver’s wallet.

### 3. AI Assistance (Ask AI)
XBount features multiple domain-specific AI Assistants trained on curated datasets (e.g., for coding, legal advice, or research). Users can submit queries to these AI agents by paying a small per-query fee (e.g., 0.01 USDC). This fee is directed to the developers who trained and deployed the assistant, incentivizing useful and high-quality AI tools.

### 4. x402 + CDP Wallet Integration
All transactions—whether bounty funding, solution submission, or AI queries—are handled via the **x402 protocol** and **CDP Wallet APIs**. This ensures seamless, secure, and permissionless interactions between users without manual wallet management.

## User Flow
![Screenshot 2025-06-19 021308](https://github.com/user-attachments/assets/1a45623e-956a-4b97-b24b-fbbf1a1e79de)


## Why XBount?

- **Incentivized Knowledge Sharing**: Contributors are rewarded with real value for solving challenges and answering questions.
- **AI-Enhanced Workflow**: Get help from domain-trained AI assistants to solve problems faster and more accurately.
- **Trustless and Transparent**: All payments are onchain and automated, ensuring fairness and transparency.
- **Better Than Traditional Forums**: Unlike StackOverflow and similar platforms, XBount motivates participation with real economic incentives.

## Use Cases

- Developers posting technical issues with USDC rewards.
- Community members earning by solving posted bounties.
- Users paying per-query to AI agents for guidance.
- Hackathons or companies offering bounties for bugs or feature development.

XBount reimagines community collaboration by merging bounties, AI assistance, and permissionless payments into a single decentralized platform.

## x402 integration 
you can see the code using the x402 protocol [here](https://github.com/Haxry/xBount/blob/master/backend/server.ts) 
. Below is a sample code from the backend for the question route which uses x402 for accepting payment(ie the bounty price )
```typescript
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
    console.log(" Payment valid?", isValid);
    
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
    console.log(" Payment settled:", settleResponse);
    const responseHeader = settleResponseHeader(settleResponse);
    res.setHeader("X-PAYMENT-RESPONSE", responseHeader);

    
    res.status(201).json({ message: 'Bounty created', bounty: newBounty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bounty' });
  }
});
```
similarly x402 is used for other operations such as submitting an answer to a bounty(0.01 usdc for each answer) or to ask domain specific ai agent(0.01 usdc per query)

## cdp wallet api integration 
The cdp wallet api is used to manage account for the user , user dont have to sign anything manually , below is an example code , that shows how the cdp wallet api handles the payment whenever user posts an aswer to a bounty 
```typescript
const cdp = new CdpClient({
    apiKeyId: CDP_API_KEY_ID,
    apiKeySecret: CDP_API_KEY_SECRET,
    walletSecret: WALLET_SECRET,
});

router.post('/answer-bounty/:bountyId', async (req, res) => {
   const { bountyId } = req.params;
    const { title, solution, submittedBy } = req.body;
const accountName="Eve" //the already registered user shown for sample purpose
let account = await cdp.evm.getOrCreateAccount({
  name: accountName
});
const fetchWithPayment = wrapFetchWithPayment(fetch, account);
  const body = {
    title,
    solution,
    submittedBy,
  };

  const url = `http://localhost:3000/answer/${bountyId}`; 

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
      message: ' Bounty answered with payment',
      bounty: data,
      paymentDetails: decodedPayment,
    });
  } catch (error: any) {
    console.error(' Payment or creation failed:', error);
    res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
});
```
Similarly the cdp wallet api is used to handle payment for ai queries and to post bounties.
This enables a very smooth flow for user. User don't have to worry about manually signing and confirming the transactions 
## Quickstart
Clone the repo
```bash
git clone https://github.com/Haxry/xBount.git
cd xBount
```
Add an env file with the following required variables
```
FACILITATOR_URL= // to confirm the x402 payments
NETWORK= // the chain where you want to transact
CDP_API_KEY_ID= // required for cdp wallet api
CDP_API_KEY_SECRET= // required for cdp wallet api
WALLET_SECRET= // required to create a wallet
ADDRESS= // platform wallet address(must be added to your cdp wallet so that it can transact on platforms behalf )
```
Run the backend
```bash
cd backend
npm install
npx tsx server.ts
```
Run the fontend
```bash
cd frontend
npm install
npm run dev
```
Now both your frontend and backend are running .....



const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

app.use(cors({
  origin: 'https://evgrandiose.fr',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route générique pour création PaymentIntent avec montant et description dynamiques
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { name, email, amount, description } = req.body;

    if (!name || !email || !amount || !description) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    const commissionPercent = 41;
    const platformFee = Math.round(amount * commissionPercent / 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      description,
      automatic_payment_methods: { enabled: true },
      transfer_data: { destination: 'acct_1RdG6aE3ESlhRSpw' },
      application_fee_amount: platformFee,
      receipt_email: email,
      metadata: { customer_name: name },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));

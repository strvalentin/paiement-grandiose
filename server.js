const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

app.use(cors({
  origin: 'https://evgrandiose.fr',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Sert les fichiers HTML depuis /public
app.use(express.static(path.join(__dirname, 'public')));

// Paiement coaching 190 €
app.post('/create-payment-intent-190', async (req, res) => {
  try {
    const { name, email, address, zipcode, city } = req.body;

    const amount = 19000;
    const commissionPercent = 41;
    const platformFee = Math.round(amount * commissionPercent / 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      description: 'Coaching 190€ avec Lana',
      automatic_payment_methods: { enabled: true },
      transfer_data: { destination: 'acct_1RdG6aE3ESlhRSpw' },
      application_fee_amount: platformFee,
      receipt_email: email,
      metadata: {
        customer_name: name,
        email,
        address,
        zipcode,
        city,
      },
    });

    console.log('✅ PaymentIntent 190€ OK');
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Erreur PaymentIntent 190€ :', error);
    res.status(500).json({ error: error.message });
  }
});

// Port d'écoute
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));

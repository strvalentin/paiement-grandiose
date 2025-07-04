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

// Sert tous les fichiers statiques dans public (checkout-190.html, checkout-600.html, etc)
app.use(express.static(path.join(__dirname, 'public')));

// Paiement 190€
app.post('/create-payment-intent-190', async (req, res) => {
  try {
    const { name, email } = req.body;

    const amount = 19000; // en centimes
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
      metadata: { customer_name: name },
      payment_method_data: { billing_details: { name, email } },
    });

    console.log('✅ PaymentIntent 190€ OK');
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Erreur PaymentIntent 190€ :', error);
    res.status(500).json({ error: error.message });
  }
});

// Paiement 600€
app.post('/create-payment-intent-600', async (req, res) => {
  try {
    const { name, email } = req.body;

    const amount = 60000; // en centimes
    const commissionPercent = 41;
    const platformFee = Math.round(amount * commissionPercent / 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      description: 'Accompagnement 4 séances – 600€',
      automatic_payment_methods: { enabled: true },
      transfer_data: { destination: 'acct_1RdG6aE3ESlhRSpw' },
      application_fee_amount: platformFee,
      receipt_email: email,
      metadata: { customer_name: name },
      payment_method_data: { billing_details: { name, email } },
    });

    console.log('✅ PaymentIntent 600€ OK');
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Erreur PaymentIntent 600€ :', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));

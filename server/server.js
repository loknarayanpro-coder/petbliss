require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase Admin (Bypasses RLS for secure server-side updates)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'Amount and bookingId are required' });
    }

    // Mock response if using dummy keys
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id_here') {
      console.log('Using dummy Razorpay keys, returning mock order');
      return res.json({
        success: true,
        orderId: 'order_mock_' + Date.now(),
        amount: amount * 100,
        currency: 'INR'
      });
    }

    const options = {
      amount: amount * 100, // Razorpay works in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      bookingId 
    } = req.body;

    // Mock verification if using dummy keys
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id_here') {
      console.log('Using dummy Razorpay keys, verifying mock payment');
      
      // If the service key is also dummy, skip the database update to avoid crashing
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'dummy_service_key_here' || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key_here') {
         console.log('Dummy Supabase Service Key detected. Bypassing database update.');
         return res.json({ success: true, message: 'Mock payment verified successfully (DB update skipped)' });
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          razorpay_payment_id: razorpay_payment_id || 'pay_mock'
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Failed to update Supabase:', error);
        return res.status(500).json({ error: 'Payment verified but database update failed' });
      }
      return res.json({ success: true, message: 'Mock payment verified successfully' });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Signature is valid, update Supabase
      const { data, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          razorpay_payment_id: razorpay_payment_id
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Failed to update Supabase:', error);
        return res.status(500).json({ error: 'Payment verified but database update failed' });
      }

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Razorpay backend running on port ${PORT}`);
});

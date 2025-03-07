const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer'); // Added for email

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves files from shopping-website/public (for product images, if any)

console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err.message));

// Product Schema with Image Field
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});
const Product = mongoose.model('Product', productSchema);

// Email Transporter (Simulated for now, configure for production)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail or another service (e.g., SendGrid, SES)
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASS || 'your-app-specific-password', // Replace with your app-specific password or API key
  },
});

// API Route to Fetch Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Route to Send Order Confirmation Email
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { orderDetails, userEmail } = req.body;
    if (!orderDetails || !userEmail) {
      return res.status(400).json({ error: 'Missing order details or user email.' });
    }

    // Simulate sending email (console log for now)
    console.log('Sending order confirmation email to:', userEmail, 'with details:', orderDetails);

    // In production, uncomment and configure the following:
    /*
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail, // Use shippingInfo.email or a user-provided email
      subject: `Order Confirmation #${orderDetails.orderId || Date.now()}`,
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order! Here are your details:</p>
        <h3>Order Items</h3>
        <ul>${orderDetails.localCart.map(item => `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.price} (Total: $${(item.price * item.quantity).toFixed(2)})</li>`).join('')}</ul>
        <h3>Shipping Information</h3>
        <p>Full Name: ${orderDetails.shippingInfo.fullName}</p>
        <p>Address: ${orderDetails.shippingInfo.address}</p>
        <p>City: ${orderDetails.shippingInfo.city}</p>
        <p>State: ${orderDetails.shippingInfo.state}</p>
        <p>Zip Code: ${orderDetails.shippingInfo.zipCode}</p>
        <p>Country: ${orderDetails.shippingInfo.country}</p>
        <h3>Shipping Method</h3>
        <p>${orderDetails.shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}</p>
        <h3>Payment Method</h3>
        <p>${orderDetails.paymentInfo.paymentMethod === 'creditCard' ? `Credit Card (****-****-****-${orderDetails.paymentInfo.cardNumber.slice(-4) || 'XXXX'})` : `PayPal (${orderDetails.paymentInfo.paypalEmail || 'N/A'})`}</p>
        <h3>Order Total</h3>
        <p>Subtotal: $${orderDetails.totalPrice}</p>
        <p>Shipping: $${orderDetails.shippingCost}</p>
        <p>Total: $${orderDetails.grandTotal}</p>
      `,
    });
    */

    res.json({ message: 'Order confirmation email sent successfully (simulated).' });
  } catch (error) {
    console.error('Email sending error:', error.message);
    res.status(500).json({ error: 'Failed to send order confirmation email. Please try again later.' });
  }
});

// Seed Initial Data
const seedProducts = async () => {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "CK One Summer Limited Edition Perfume",
      price: 49.99,
      description: "A vibrant, citrusy fragrance capturing the essence of summer with a sleek, colorful bottle design.",
      image: "https://parfumplusmag.com/wp-content/uploads/2013/04/ck-one-summer-limited-edition.jpg"
    },
    {
      name: "Summer Citrus Eau de Toilette",
      price: 59.99,
      description: "A refreshing blend of citrus and aquatic notes in a striking orange bottle, perfect for warm days.",
      image: "https://cdn.riah.ae/storage/upload/images/2023/09/04/64f6647193388.jpg"
    },
    {
      name: "CK One Summer Daze 2022",
      price: 54.99,
      description: "A playful, fruity scent with a modern twist, housed in a bold green and orange bottle.",
      image: "https://labelleperfumes.com/cdn/shop/products/ck-one-summer-daze-2022.webp?v=1670617409"
    },
    {
      name: "CK One Summer Daze Unisex Spray",
      price: 64.99,
      description: "An energetic, unisex fragrance with citrus and woody undertones, presented in a sleek bottle.",
      image: "https://uscloser.com/loja/49130-large_default/eau-de-toilette-spray-unisex-masculino-calvin-klein-ck-one-summer-daze-100-ml.jpg"
    },
    {
      name: "CK One Red Edition Perfume",
      price: 39.99,
      description: "A bold, spicy fragrance with a striking red bottle, ideal for those who dare to stand out.",
      image: "https://rukminim2.flixcart.com/image/850/1000/j8rnpu80/perfume/y/g/h/100-one-red-edition-eau-de-toilette-calvin-klein-women-original-imaeyhetw4pqqtmk.jpeg?q=20&crop=false"
    },
    {
      name: "CK One Red Edition Variant",
      price: 44.99,
      description: "A fresh take on the classic red edition with a vibrant, youthful scent and elegant packaging.",
      image: "https://www.dilaykozmetik.com/ProductImages/96107/big/calvin-klein-onered-edition-dilay.jpg"
    },
    {
      name: "CK IN2U for Him",
      price: 34.99,
      description: "A modern, woody fragrance with a cool, minimalist bottle design for the confident man.",
      image: "https://sigilscent.com/wp-content/uploads/2023/12/Ck-In-2u-for-Him2-1024x1024.jpg"
    }
  ]);
  console.log('Products seeded');
};
// Uncomment to seed, then comment out after running once
// seedProducts();

app.get('/', (req, res) => {
  res.send('Welcome to the Shopping Website API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
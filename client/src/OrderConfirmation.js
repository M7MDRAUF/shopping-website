// client/src/OrderConfirmation.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css'; // Use the same CSS for consistency

function OrderConfirmation() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const details = location.state;
    if (!details) {
      setNotification('No order details found. Please try again.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setOrderDetails(details);
    // Simulate sending confirmation email
    simulateEmailConfirmation(details);
  }, [location.state]);

  const simulateEmailConfirmation = (details) => {
    console.log('Simulating order confirmation email:', {
      orderId: Date.now(), // Simulated order ID
      items: details.localCart,
      shippingInfo: details.shippingInfo,
      shippingMethod: details.shippingMethod,
      paymentMethod: details.paymentInfo.paymentMethod,
      total: details.grandTotal,
    });
    // In production, use Nodemailer or an email service (e.g., SendGrid, SES) here:
    // Example with Nodemailer:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'user@example.com', // Replace with user's email (e.g., from shippingInfo)
      subject: 'Order Confirmation - Shopping Website',
      text: `Order Confirmation #${Date.now()}\n\nOrder Details:\n${JSON.stringify(details, null, 2)}`,
    }, (error, info) => {
      if (error) console.error('Email error:', error);
      else console.log('Email sent:', info.response);
    });
    */
  };

  if (!orderDetails) {
    return (
      <div className="checkout-page">
        <h2>Order Confirmation</h2>
        {notification && (
          <div className="checkout-notification" onClick={() => setNotification(null)}>
            <p>{notification}</p>
            <button className="close-btn" onClick={() => setNotification(null)}>×</button>
          </div>
        )}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Order Confirmation</h2>
      <div className="review-summary">
        <h3>Thank You for Your Order!</h3>
        <p>Your order has been placed successfully. Order ID: {Date.now()}</p>
        <h4>Order Items</h4>
        {orderDetails.localCart.map((item) => (
          <p key={item._id}>
            {item.name} - Quantity: {item.quantity} - Price: ${item.price} (Total: ${(item.price * item.quantity).toFixed(2)})
          </p>
        ))}
        <h4>Shipping Information</h4>
        <p>Full Name: {orderDetails.shippingInfo.fullName}</p>
        <p>Address: {orderDetails.shippingInfo.address}</p>
        <p>City: {orderDetails.shippingInfo.city}</p>
        <p>State: {orderDetails.shippingInfo.state}</p>
        <p>Zip Code: {orderDetails.shippingInfo.zipCode}</p>
        <p>Country: {orderDetails.shippingInfo.country}</p>
        <h4>Shipping Method</h4>
        <p>{orderDetails.shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}</p>
        <h4>Payment Method</h4>
        <p>
          {orderDetails.paymentInfo.paymentMethod === 'creditCard'
            ? `Credit Card (****-****-****-${orderDetails.paymentInfo.cardNumber.slice(-4) || 'XXXX'})`
            : `PayPal (${orderDetails.paymentInfo.paypalEmail || 'N/A'})`}
        </p>
        <h4>Order Total</h4>
        <p>Subtotal: ${orderDetails.totalPrice}</p>
        <p>Shipping: ${orderDetails.shippingCost}</p>
        <p>Total: ${orderDetails.grandTotal}</p>
      </div>
      <Link to="/" className="add-to-cart-btn">Continue Shopping</Link>
      {notification && (
        <div className="checkout-notification" onClick={() => setNotification(null)}>
          <p>{notification}</p>
          <button className="close-btn" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmation;
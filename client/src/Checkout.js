// client/src/Checkout.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CountryPicker from './CountryPicker';
import CityPicker from './CityPicker'; // Import the new component

const stripePromise = loadStripe('pk_test_51O6vQ2I8p5kQbT5mX7Y8Z9vW0pL1qM2nO3pK4j5L6mN7pO8qP9rQ0sT1uV2wX3y4z5A6B7C8D9E0F1G');

function Checkout({ cart, setCart, removeFromCart }) {
  const [shippingInfo, setShippingInfo] = React.useState({
    fullName: '',
    address: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });
  const [paymentInfo, setPaymentInfo] = React.useState({
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [savePayment, setSavePayment] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const navigate = useNavigate();

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated in Checkout useEffect:', cart);
  }, [cart]);

  // Handle shipping info changes
  const handleShippingChange = (field, value) => {
    setShippingInfo((prev) => {
      const newInfo = { ...prev, [field]: value };
      // If country changes, reset city to trigger CityPicker update
      if (field === 'country' && value !== prev.country) {
        newInfo.city = '';
      }
      return newInfo;
    });
  };

  // Handle save payment checkbox
  const handleSavePaymentChange = (e) => {
    setSavePayment(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.country || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.phoneNumber) {
      alert('Please fill in all shipping information.');
      return;
    }
    setShowPayment(true);
  };

  // Handle quantity increase
  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCart(updatedCart);
    console.log('Quantity increased in Checkout for:', item.name, 'New cart:', updatedCart);
  };

  // Handle quantity decrease
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCart(updatedCart);
      console.log('Quantity decreased in Checkout for:', item.name, 'New cart:', updatedCart);
    } else {
      removeFromCart(item._id);
    }
  };

  // Stripe payment form component
  const StripePaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleStripePayment = async (e) => {
      e.preventDefault();
      if (!stripe || !elements) {
        alert('Stripe is not loaded. Please try again.');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          alert(`Payment error: ${error.message}`);
          return;
        }

        const isPaymentSuccessful = Math.random() < 0.8;
        if (isPaymentSuccessful) {
          if (savePayment) {
            setPaymentInfo((prev) => ({
              ...prev,
              cardNumber: paymentMethod.card.last4,
              expiryDate: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year.toString().slice(-2)}`,
            }));
          }
          setShowPayment(false);
          setShowReview(true);
        } else {
          alert('Payment failed. Please check your details and try again.');
        }
      } catch (error) {
        alert(`Payment processing error: ${error.message}`);
      }
    };

    return (
      <form onSubmit={handleStripePayment}>
        <div className="input-box">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#1C3575', '::placeholder': { color: '#7397c1' } },
              invalid: { color: '#9e2146' },
            },
          }} />
        </div>
        <label>
          <input type="checkbox" name="savePayment" checked={savePayment} onChange={handleSavePaymentChange} />
          Save payment method for future use
        </label>
        <p className="payment-total">Total Due: ${grandTotal}</p>
        <button className="add-to-cart-btn" type="submit">Process Payment</button>
      </form>
    );
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    const shippingCost = 5.99;
    const grandTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);

    const orderDetails = {
      localCart: cart,
      shippingInfo,
      shippingMethod: 'standard',
      paymentInfo,
      totalPrice,
      shippingCost,
      grandTotal,
    };

    alert('Order confirmed successfully! Redirecting to confirmation...');
    setTimeout(() => {
      setShowReview(false);
      setCart([]);
      localStorage.removeItem('cart');
      navigate('/order-confirmation', { state: orderDetails });
    }, 3000);
  };

  // Calculate totals
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  const shippingCost = 5.99;
  const grandTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
      ) : (
        <div>
          <div className="checkout-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(item)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => increaseQuantity(item)}
                    >
                      +
                    </button>
                  </div>
                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="shipping-section">
            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-box">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleShippingChange('fullName', e.target.value)}
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={shippingInfo.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                    required
                  />
                </div>
                <div className="input-box">
                  <CountryPicker
                    value={shippingInfo.country}
                    onChange={(value) => handleShippingChange('country', value)}
                  />
                </div>
                <div className="input-box">
                  <CityPicker
                    country={shippingInfo.country}
                    value={shippingInfo.city}
                    onChange={(value) => handleShippingChange('city', value)}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingInfo.state}
                    onChange={(e) => handleShippingChange('state', e.target.value)}
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={shippingInfo.zipCode}
                    onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={shippingInfo.phoneNumber}
                    onChange={(e) => handleShippingChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>
                <button className="add-to-cart-btn" type="submit">Place Order</button>
              </form>
            </div>
          </div>
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {totalQuantity}</p>
            <p>Subtotal: ${totalPrice}</p>
            <p>Shipping: ${shippingCost}</p>
            <p>Total: ${grandTotal}</p>
          </div>
        </div>
      )}

      {showPayment && (
        <Elements stripe={stripePromise}>
          <div className="payment-section">
            <h3>Payment Information</h3>
            <StripePaymentForm />
          </div>
        </Elements>
      )}

      {showReview && (
        <div className="review-section">
          <h3>Order Review & Confirmation</h3>
          <div className="review-summary">
            <h4>Order Items</h4>
            {cart.map((item) => (
              <p key={item._id}>
                {item.name} - Quantity: {item.quantity} - Price: ${item.price} (Total: ${(item.price * item.quantity).toFixed(2)})
              </p>
            ))}
            <h4>Shipping Information</h4>
            <p>Full Name: {shippingInfo.fullName}</p>
            <p>Address: {shippingInfo.address}</p>
            <p>Country: {shippingInfo.country}</p>
            <p>City: {shippingInfo.city}</p>
            <p>State: {shippingInfo.state}</p>
            <p>Zip Code: {shippingInfo.zipCode}</p>
            <p>Phone Number: {shippingInfo.phoneNumber}</p>
            <h4>Shipping Method</h4>
            <p>Standard Shipping</p>
            <h4>Payment Method</h4>
            <p>Credit Card</p>
            <h4>Order Total</h4>
            <p>Subtotal: ${totalPrice}</p>
            <p>Shipping: ${shippingCost}</p>
            <p>Total: ${grandTotal}</p>
          </div>
          <button className="add-to-cart-btn" onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
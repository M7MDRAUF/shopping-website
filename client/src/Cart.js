// client/src/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Use the same CSS for consistency

function Cart({ cart, setCart, removeFromCart }) {
  // Calculate total quantity and price
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle quantity increase
  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCart(updatedCart); // Directly update cart state
    console.log('Quantity increased for:', item.name, 'New cart:', updatedCart);
  };

  // Handle quantity decrease
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCart(updatedCart); // Directly update cart state
      console.log('Quantity decreased for:', item.name, 'New cart:', updatedCart);
    } else {
      removeFromCart(item._id); // Remove item if quantity is 1
    }
  };

  return (
    <div className="checkout-page">
      <h2>Your Cart</h2>
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
                  <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p>Total Items: {totalQuantity}</p>
            <p>Total Price: ${totalPrice}</p>
            <Link to="/checkout" className="add-to-cart-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
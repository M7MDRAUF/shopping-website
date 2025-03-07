// client/src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Cart from './Cart';
import Login from './Login';
import Signup from './Signup';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import ForgotPassword from './ForgotPassword';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated in localStorage:', cart); // Debug log
  }, [cart]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((response) => {
        console.log('Fetched products:', response.data);
        setProducts(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products.');
      });
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId)); // Only remove items
    console.log('Item removed from cart:', productId);
  };

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="App">
      <div className="home-background">
        <div className="header-text">Fresh, iconic, CK, repeat.</div>
        <div className="auth-options">
          <Link to="/">Home</Link>
          <div className="cart-icon" onClick={goToCart}>
            <span role="img" aria-label="basket">🧺</span>
            {cartQuantity > 0 && (
              <span className="cart-badge">{cartQuantity}</span>
            )}
          </div>
        </div>
        <div className="product-container">
          <Routes>
            <Route
              path="/"
              element={
                <div className="product-list">
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  {products.length > 0 ? (
                    <div className="product-grid">
                      {products.map((product) => (
                        <div key={product._id} className="product">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                          />
                          <h3>{product.name}</h3>
                          <p>${product.price}</p>
                          <p>{product.description}</p>
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No products available.</p>
                  )}
                </div>
              }
            />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal
  } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        customer,
        items: cart,
        total: cartTotal,
        status: 'pending',
        createdAt: new Date()
      });
      setOrderPlaced(true);
      clearCart();
      setTimeout(() => {
        setOrderPlaced(false);
        setCheckoutMode(false);
        setIsCartOpen(false);
        setCustomer({ name: '', phone: '', address: '' });
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3>{checkoutMode ? 'Finalizar Pedido' : 'Tu Carrito'}</h3>
          <button onClick={() => setIsCartOpen(false)} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {orderPlaced ? (
          <div className="order-success">
            <h3>¡Pedido Recibido!</h3>
            <p>Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : checkoutMode ? (
          <div className="checkout-form-container">
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Teléfono / WhatsApp</label>
                <input type="text" required value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Dirección de Envío</label>
                <textarea required value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}></textarea>
              </div>

              <div className="checkout-summary">
                <p>Total a Pagar: <strong>${cartTotal.toFixed(2)}</strong></p>
              </div>

              <div className="checkout-actions">
                <button type="button" onClick={() => setCheckoutMode(false)} className="btn btn-outline">Volver</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>El carrito está vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="cart-img" />
                      ) : (
                        <div className="img-placeholder" style={{ backgroundColor: '#334155' }}></div>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <div className="item-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary checkout-btn"
                disabled={cart.length === 0}
                onClick={() => setCheckoutMode(true)}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          z-index: 2000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.3s ease;
        }

        .cart-drawer {
          width: 100%;
          max-width: 400px;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
        }

        .cart-header {
            padding: 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          gap: 15px;
          background: #f8fafc;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          align-items: center;
          border: 1px solid var(--border);
        }

        .img-placeholder, .cart-img {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          object-fit: cover;
        }

        .item-details h4 {
          font-size: 0.9rem;
          margin-bottom: 5px;
          color: var(--secondary);
        }

        .item-price { color: var(--primary); font-weight: bold; }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 5px;
        }

        .item-controls button {
          background: white;
          border: 1px solid var(--border);
          padding: 4px;
          border-radius: 4px;
          color: var(--secondary);
          cursor: pointer;
        }

        .item-controls span { color: var(--secondary); }

        .remove-btn {
          background: none;
          color: #ef4444;
          margin-left: auto;
          cursor: pointer;
        }

        .cart-footer {
          padding: 20px;
          border-top: 1px solid var(--border);
          background: #f8fafc;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--secondary);
        }

        .checkout-btn { width: 100%; }

        /* Checkout Form */
        .checkout-form-container { padding: 20px; flex: 1; overflow-y: auto; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--secondary); }
        .form-group input, .form-group textarea {
            width: 100%; padding: 10px;
            border: 1px solid var(--border); border-radius: 6px;
            font-family: inherit;
        }
        .checkout-actions { display: flex; gap: 10px; margin-top: 20px; }
        .checkout-actions button { flex: 1; }

        .order-success {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            text-align: center; color: var(--primary);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;

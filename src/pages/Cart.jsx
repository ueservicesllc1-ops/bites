import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal
    } = useCart();

    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

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
            // Redirect after 3 seconds or show success message on page
            setTimeout(() => {
                navigate('/store');
            }, 5000);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Error al procesar el pedido.");
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="cart-page section-padding container">
                <div className="empty-cart-state">
                    <div className="success-icon">
                        <ShoppingBag size={60} />
                    </div>
                    <h2>¡Pedido Recibido con Éxito!</h2>
                    <p>Gracias por tu compra. Nos pondremos en contacto contigo pronto para coordinar el envío.</p>
                    <Link to="/store" className="btn btn-primary">Seguir Comprando</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page section-padding container">
                <div className="empty-cart-state">
                    <h2>Tu carrito está vacío</h2>
                    <p>Parece que aún no has añadido productos.</p>
                    <Link to="/store" className="btn btn-primary">Ir a la Tienda</Link>
                </div>
                <style>{`
                    .empty-cart-state {
                        text-align: center;
                        padding: 60px 20px;
                        background: #fff;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                        border: 1px solid var(--border);
                    }
                    .empty-cart-state h2 { margin-bottom: 10px; color: var(--secondary); }
                    .empty-cart-state p { margin-bottom: 30px; color: var(--muted-text); }
                    .success-icon { color: #10b981; margin-bottom: 20px; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="cart-page section-padding container">
            <h1 className="page-title">Tu Carrito de Compras</h1>

            <div className="cart-layout">
                {/* Left Column: Cart Items */}
                <div className="cart-items-container">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <div className="item-image-wrapper">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                                ) : (
                                    <div className="item-placeholder" style={{ backgroundColor: '#e2e8f0' }}></div>
                                )}
                            </div>
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p className="price">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="item-actions">
                                <div className="qty-selector">
                                    <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}><Minus size={16} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                                </div>
                                <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Order Summary & Checkout */}
                <div className="order-summary-wrapper">
                    <div className="order-summary">
                        <h2>Resumen del Pedido</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envío</span>
                            <span>Calculado al confirmar</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <hr className="divider" />

                        <h3>Datos de Envío</h3>
                        <form onSubmit={handleCheckout} className="checkout-form">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={customer.name}
                                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={customer.phone}
                                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                    placeholder="Ej: 0991234567"
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección de Entrega</label>
                                <textarea
                                    required
                                    value={customer.address}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    placeholder="Calle Principal #123 y Secundaria"
                                    rows="3"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                                {loading ? 'Procesando Pedido...' : 'Confirmar Compra'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .cart-page {
                    min-height: 80vh;
                    padding-top: calc(var(--nav-height) + 40px);
                }
                
                .page-title {
                    font-size: 2rem;
                    margin-bottom: 40px;
                    color: var(--secondary);
                }

                .cart-layout {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 40px;
                }

                @media (max-width: 900px) {
                    .cart-layout {
                        grid-template-columns: 1fr;
                    }
                }

                /* Cart Items */
                .cart-items-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .cart-item-card {
                    display: flex;
                    align-items: center;
                    background: #fff;
                    border: 1px solid var(--border);
                    padding: 15px;
                    border-radius: 12px;
                    gap: 20px;
                }

                .item-image-wrapper {
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                }

                .cart-item-img, .item-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .item-info {
                    flex: 1;
                }

                .item-info h3 {
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                    color: var(--secondary);
                }

                .item-info .price {
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .item-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .qty-selector {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    overflow: hidden;
                }

                .qty-selector button {
                    background: #f8fafc;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                
                .qty-selector button:disabled { opacity: 0.5; cursor: not-allowed; }

                .qty-selector span {
                    padding: 0 12px;
                    font-weight: 600;
                }

                .delete-btn {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    padding: 5px;
                    transition: transform 0.2s;
                }
                .delete-btn:hover { transform: scale(1.1); }

                /* Order Summary */
                .order-summary-wrapper {
                    position: relative;
                }

                .order-summary {
                    background: #fff;
                    padding: 30px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    position: sticky;
                    top: calc(var(--nav-height) + 20px);
                }

                .order-summary h2 {
                    margin-bottom: 25px;
                    font-size: 1.5rem;
                    color: var(--secondary);
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    color: var(--muted-text);
                }

                .summary-row.total {
                    font-weight: 800;
                    font-size: 1.25rem;
                    color: var(--secondary);
                    margin-top: 10px;
                }

                .divider {
                    border: none;
                    border-top: 1px solid var(--border);
                    margin: 20px 0;
                }

                .checkout-form h3 {
                    font-size: 1.1rem;
                    margin-bottom: 15px;
                    color: var(--secondary);
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--secondary);
                    font-size: 0.9rem;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }

                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--primary);
                    outline: none;
                }

                .full-width {
                    width: 100%;
                    margin-top: 10px;
                    padding: 15px;
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};

export default Cart;

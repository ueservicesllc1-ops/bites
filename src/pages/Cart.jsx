import { useState, useEffect } from 'react';
// Version: 1.0.2 - Fixed Hero and Firestore Rules
console.log("Cart Component Loaded - v1.0.2");

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { calculateShipping } from '../services/shippoService';

const Cart = () => {
    // VERSION: 1.0.3 - ABSOLUTELY NO ALERTS IN SUCCESS PATH
    console.log("Cart Component Loaded - v1.0.3 (No Alerts Mode)");

    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', zip: '', city: '', state: 'NJ' });
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (user) {
            setCustomer(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone || '',
                address: user.address || prev.address || '',
                zip: user.zip || prev.zip || '',
                city: user.city || prev.city || ''
            }));
        }
    }, [user]);

    // Shipping State
    const [shippingRates, setShippingRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculateShipping = async () => {
        if (!customer.address || !customer.zip) {
            alert("Por favor ingresa dirección y código postal.");
            return;
        }
        setIsCalculating(true);
        try {
            const rates = await calculateShipping(`${customer.address}, ${customer.zip}`);
            setShippingRates(rates);
            setSelectedRate(rates[0]); // Auto-select first one
        } catch (error) {
            alert("Error al calcular envío: " + error.message);
        } finally {
            setIsCalculating(false);
        }
    };

    const totalWithShipping = cartTotal + (selectedRate ? selectedRate.price : 0);

    const onOrderSuccess = async (details) => {
        // 1. CLEAR UI AND SHOW HERO IMMEDIATELY!
        setOrderPlaced(true);
        clearCart();
        setLoading(true);

        console.log("PAYMENT CONFIRMED :) Showing success screen now.");

        try {
            // 2. Prepare order data
            const newOrder = {
                customer: {
                    name: customer.name || 'Sin nombre',
                    email: customer.email || 'Sin email',
                    phone: customer.phone || 'Sin teléfono',
                    address: customer.address || 'Sin dirección',
                    zip: customer.zip || '',
                    city: customer.city || '',
                    state: customer.state || ''
                },
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl || ''
                })),
                total: totalWithShipping,
                shipping: selectedRate || { name: 'Envío no especificado', price: 0 },
                paymentId: details.id || 'N/A',
                userId: user?.uid || 'guest',
                status: 'paid',
                createdAt: new Date()
            };

            // 3. Save to Firebase in the background
            console.log("Saving order info to database...");
            await addDoc(collection(db, "orders"), newOrder);
            console.log("Order saved successfully to Firestore.");

        } catch (error) {
            // Log the error but don't stop the user's happy success screen
            console.error("BG Error saving order:", error);
            // We can add a hidden retry or just rely on the PayPal receipt for manual recovery
        } finally {
            setLoading(false);
            // 4. Redirect after 8 seconds of "Hero Glory"
            setTimeout(() => { navigate('/'); }, 8000);
        }
    };


    if (orderPlaced) {
        return (
            <div className="cart-page success-hero-bg">
                <div className="success-hero-content">
                    {/* Decorative Stickers */}
                    <div className="deco-sticker ds1">¡PAGADO!</div>
                    <div className="deco-sticker ds2">GRACIAS</div>
                    <div className="deco-sticker ds3">✨</div>
                    <div className="deco-sticker ds4">Bites</div>

                    <div className="success-card-fun">
                        <div className="success-icon-wrap">
                            <ShoppingBag size={80} strokeWidth={2.5} />
                        </div>
                        <h1 className="success-title-fun">¡PAGO CON ÉXITO! 🎉</h1>
                        <p className="success-msg-fun">
                            Hemos recibido tu pedido correctamente. <br />
                            <strong>Prepararemos tus stickers y los enviaremos lo antes posible.</strong>
                        </p>
                        <div className="success-footer-fun">
                            <p>Serás redirigido al inicio en unos segundos...</p>
                            <Link to="/" className="btn-success-back">Volver Ahora</Link>
                        </div>
                    </div>
                </div>
                <style>{`
                    .success-hero-bg {
                        position: fixed;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background: #FFD600; /* Vibrant Yellow */
                        z-index: 2000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        overflow: hidden;
                        animation: slideUpIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .success-hero-content {
                        position: relative;
                        width: 100%;
                        max-width: 600px;
                    }
                    .success-card-fun {
                        background: white;
                        border: 8px solid #000;
                        border-radius: 40px;
                        padding: 60px 40px;
                        text-align: center;
                        box-shadow: 20px 20px 0px #000;
                        position: relative;
                        z-index: 5;
                    }
                    .success-icon-wrap {
                        background: #4ade80;
                        width: 140px;
                        height: 140px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 30px;
                        border: 6px solid #000;
                        color: white;
                        box-shadow: 8px 8px 0px #000;
                        transform: rotate(-5deg);
                    }
                    .success-title-fun {
                        font-size: 3.5rem;
                        font-weight: 900;
                        color: #000;
                        margin-bottom: 20px;
                        line-height: 0.9;
                        text-transform: uppercase;
                        letter-spacing: -2px;
                        -webkit-text-stroke: 1px #000;
                        text-shadow: 4px 4px 0px #FFD600;
                    }
                    .success-msg-fun {
                        font-size: 1.2rem;
                        color: #000;
                        margin-bottom: 30px;
                        line-height: 1.5;
                        font-weight: 700;
                    }
                    .success-footer-fun p {
                        font-size: 0.9rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        color: #64748b;
                        margin-bottom: 15px;
                    }
                    .btn-success-back {
                        display: inline-block;
                        background: #000;
                        color: #fff;
                        padding: 15px 40px;
                        border-radius: 12px;
                        font-weight: 900;
                        text-transform: uppercase;
                        text-decoration: none;
                        transition: all 0.2s;
                    }
                    .btn-success-back:hover {
                        transform: scale(1.05);
                        background: #E91E63;
                    }

                    /* Stickers */
                    .deco-sticker {
                        position: absolute;
                        background: white;
                        border: 4px solid #000;
                        padding: 10px 20px;
                        font-weight: 900;
                        box-shadow: 5px 5px 0px #000;
                        z-index: 10;
                    }
                    .ds1 { top: -40px; left: -20px; transform: rotate(-15deg); color: #FF006E; border-radius: 10px; font-size: 1.5rem; }
                    .ds2 { top: 20px; right: -50px; transform: rotate(20deg); color: #3A86FF; }
                    .ds3 { bottom: 40px; left: -60px; transform: rotate(-10deg); font-size: 3rem; background: none; border: none; box-shadow: none; }
                    .ds4 { bottom: -30px; right: 20px; transform: rotate(-5deg); color: #8338EC; border-radius: 50% 20%; }

                    @keyframes slideUpIn {
                        from { transform: translateY(100%) scale(0.8); opacity: 0; }
                        to { transform: translateY(0) scale(1); opacity: 1; }
                    }

                    @media (max-width: 600px) {
                        .success-title-fun { font-size: 2.22rem; }
                        .deco-sticker { display: none; }
                        .success-card-fun { padding: 40px 20px; margin: 0 10px; }
                    }
                `}</style>
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
                            <span>{selectedRate ? `$${selectedRate.price.toFixed(2)}` : 'Calculado al confirmar'}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${totalWithShipping.toFixed(2)}</span>
                        </div>

                        <hr className="divider" />

                        <h3>Datos de Envío</h3>
                        <div className="checkout-form">
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
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    placeholder="email@ejemplo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    required
                                    value={customer.address}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    placeholder="Calle Principal #123"
                                />
                            </div>
                            <div className="row-2-col">
                                <div className="form-group">
                                    <label>Código Postal</label>
                                    <input
                                        type="text"
                                        required
                                        value={customer.zip}
                                        onChange={e => setCustomer({ ...customer, zip: e.target.value })}
                                        placeholder="00000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ciudad</label>
                                    <input
                                        type="text"
                                        required
                                        value={customer.city}
                                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                        placeholder="Ciudad"
                                    />
                                </div>
                            </div>

                            {!shippingRates.length ? (
                                <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '10px', textAlign: 'center' }}>
                                        Ingresa tu dirección y código postal para calcular el envío y habilitar el pago.
                                    </p>
                                    <button
                                        className="btn btn-secondary full-width"
                                        onClick={handleCalculateShipping}
                                        disabled={isCalculating}
                                    >
                                        {isCalculating ? 'Calculando...' : 'Calcular Envío'}
                                    </button>
                                </div>
                            ) : (
                                <div className="shipping-rates-list">
                                    <h4>Selecciona un método de envío:</h4>
                                    {shippingRates.map(rate => (
                                        <label key={rate.id} className={`rate-card ${selectedRate?.id === rate.id ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={selectedRate?.id === rate.id}
                                                onChange={() => setSelectedRate(rate)}
                                            />
                                            <div className="rate-info">
                                                <span className="rate-name">{rate.name}</span>
                                                <span className="rate-estimate">{rate.estimated}</span>
                                            </div>
                                            <span className="rate-price">${rate.price.toFixed(2)}</span>
                                        </label>
                                    ))}
                                    <button className="change-address" onClick={() => setShippingRates([])}>Cambiar dirección</button>
                                </div>
                            )}

                            {selectedRate && (
                                <div className="paypal-container" style={{ marginTop: '30px' }}>
                                    {!import.meta.env.VITE_PAYPAL_CLIENT_ID ? (
                                        <p style={{ color: 'red', textAlign: 'center' }}>Error: PayPal Client ID no detectado en .env</p>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', textAlign: 'center' }}>
                                                ¡Todo listo! Paga con PayPal para completar tu pedido:
                                            </p>
                                            <PayPalButtons
                                                style={{ layout: "vertical" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    currency_code: "USD",
                                                                    value: totalWithShipping.toFixed(2),
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        onOrderSuccess(details);
                                                    });
                                                }}
                                                onError={(err) => {
                                                    console.error("PayPal Error:", err);
                                                    alert("Hubo un problema con la ventana de PayPal.");
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cart-page {
                    min-height: 80vh;
                    padding-top: calc(var(--nav-height) + 20px);
                }
                
                .page-title {
                    font-size: 1.8rem;
                    margin-bottom: 25px;
                    color: var(--secondary);
                    text-align: center;
                }

                .cart-layout {
                    display: grid;
                    grid-template-columns: 1fr; /* Stacked by default */
                    gap: 30px;
                }

                @media (min-width: 900px) {
                    .cart-layout {
                        grid-template-columns: 1.5fr 1fr; /* Side-by-side on desktop */
                        gap: 40px;
                    }
                    .page-title { text-align: left; font-size: 2.5rem; }
                    .cart-page { padding-top: calc(var(--nav-height) + 40px); }
                }

                /* Cart Items */
                .cart-items-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .cart-item-card {
                    background: #fff;
                    border: 1px solid var(--border);
                    padding: 15px;
                    border-radius: 12px;
                    display: grid;
                    grid-template-columns: 80px 1fr;
                    gap: 15px;
                    align-items: center;
                }

                .item-image-wrapper {
                    width: 80px;
                    height: 80px;
                }

                .cart-item-img, .item-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .item-info {
                    /* In grid layout, this just takes the next cell */
                }

                .item-info h3 {
                    font-size: 1rem;
                    margin-bottom: 5px;
                    color: var(--secondary);
                }

                .item-info .price {
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 1rem;
                }

                .item-actions {
                    grid-column: 1 / -1; /* Span full width on very small mobile if needed, or keep inline */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10px;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 10px;
                }

                @media (min-width: 480px) {
                    .cart-item-card {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }
                    
                    .item-actions {
                        margin-top: 0;
                        border-top: none;
                        padding-top: 0;
                        justify-content: flex-end;
                        width: auto;
                    }
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

                .row-2-col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .shipping-rates-list {
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .shipping-rates-list h4 {
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    color: var(--secondary);
                }

                .rate-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .rate-card:hover {
                    background: #f8fafc;
                }

                .rate-card.active {
                    border-color: var(--primary);
                    background: #f0f9ff;
                    box-shadow: 0 0 0 1px var(--primary);
                }

                .rate-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .rate-name {
                    font-weight: 700;
                    color: var(--secondary);
                }

                .rate-estimate {
                    font-size: 0.8rem;
                    color: var(--muted-text);
                }

                .rate-price {
                    font-weight: 800;
                    color: var(--primary);
                }

                .change-address {
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-decoration: underline;
                    cursor: pointer;
                    align-self: flex-start;
                    margin-top: 5px;
                }

                .btn-secondary {
                    background: #000;
                    color: #fff;
                }

                .btn-secondary:hover {
                   opacity: 0.8;
                }

                @media (max-width: 480px) {
                    .row-2-col { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Cart;

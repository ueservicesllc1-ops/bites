import { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, doc, setDoc, getDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Package, MessageSquare, Settings, Image as ImageIcon, Trash2, Save, ShoppingBag } from 'lucide-react';

/* --- SUBCOMPONENTS --- */

// 1. PRODUCTS MANAGER (Existing logic + List)
// 1. PRODUCTS MANAGER (Existing logic + List)
const ProductManager = () => {
    const [product, setProduct] = useState({ name: '', price: '', category: 'Ropa', description: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [productsList, setProductsList] = useState([]);
    const [uploadingGallery, setUploadingGallery] = useState({}); // Track uploading state per product ID

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setProductsList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
                const snapshot = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Create product document with initial empty gallery (cover is separate)
            const gallery = [];

            await addDoc(collection(db, "products"), {
                ...product,
                price: parseFloat(product.price) || 0,
                imageUrl, // Cover image Only
                gallery,  // Empty initially, filled via "Agregar Fotos"
                createdAt: new Date()
            });

            setMessage('Categoría creada exitosamente!');
            setProduct({ name: '', price: '', category: 'Ropa', description: '' });
            setImage(null);
            document.getElementById('fileInput').value = "";
            loadProducts();
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGalleryUpload = async (productId, files) => {
        if (!files || files.length === 0) return;

        setUploadingGallery(prev => ({ ...prev, [productId]: true }));

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const imageRef = ref(storage, `gallery/${productId}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(imageRef, file);
                return await getDownloadURL(snapshot.ref);
            });

            const newUrls = await Promise.all(uploadPromises);

            const productRef = doc(db, "products", productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const currentGallery = productSnap.data().gallery || [];
                const updatedGallery = [...currentGallery, ...newUrls];

                await setDoc(productRef, { gallery: updatedGallery }, { merge: true });
                alert(`${newUrls.length} fotos agregadas.`);
                loadProducts();
            }

        } catch (error) {
            console.error("Error uploading gallery images:", error);
            alert("Error subiendo imágenes");
        } finally {
            setUploadingGallery(prev => ({ ...prev, [productId]: false }));
        }
    };

    const removeImageFromGallery = async (productId, imageUrlToRemove) => {
        if (!window.confirm("¿Eliminar esta foto de la galería?")) return;

        try {
            const productRef = doc(db, "products", productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const currentGallery = productSnap.data().gallery || [];
                const updatedGallery = currentGallery.filter(url => url !== imageUrlToRemove);

                // If we removed the main imageUrl (cover), maybe update it too? 
                // For simplicity, let's keep imageUrl separate or update it if it was the first one.
                // Here we just update the array.
                await setDoc(productRef, { gallery: updatedGallery }, { merge: true });
                loadProducts();
            }
        } catch (error) {
            console.error("Error removing image:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar esta categoría completa y todas sus fotos?")) return;
        try {
            await deleteDoc(doc(db, "products", id));
            loadProducts();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="admin-section">
            <h3>Crear Nueva Categoría</h3>
            {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Nombre de la Categoría</label>
                    <input type="text" name="name" value={product.name} onChange={handleInputChange} required placeholder="Ej. Camisetas" />
                </div>

                <div className="form-group">
                    <label>Descripción Corta</label>
                    <textarea name="description" value={product.description} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Imagen de Portada</label>
                    <input type="file" id="fileInput" onChange={handleImageChange} accept="image/*" required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Categoría'}
                </button>
            </form>

            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />

            <h4 style={{ marginBottom: '20px', color: 'var(--secondary)' }}>Categorías Existentes ({productsList.length})</h4>
            <div className="products-list-container">
                {productsList.map(p => (
                    <div key={p.id} className="category-admin-card">
                        <div className="category-header">
                            <div className="cat-main-info">
                                <img src={p.imageUrl} alt="Cover" className="cat-cover-img" />
                                <div>
                                    <h5>{p.name}</h5>
                                    <small>{p.gallery ? p.gallery.length : 0} fotos en total</small>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(p.id)} className="btn-delete-cat">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Gallery Preview Grid */}
                        <div className="cat-gallery-preview">
                            {p.gallery && p.gallery.map((imgUrl, idx) => (
                                <div key={idx} className="mini-thumb">
                                    <img src={imgUrl} alt="thumb" />
                                    <button
                                        className="remove-img-btn"
                                        onClick={() => removeImageFromGallery(p.id, imgUrl)}
                                        title="Eliminar foto"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Upload Trigger */}
                        <div className="gallery-upload-area">
                            <label className="btn-upload-gallery" htmlFor={`gallery-${p.id}`}>
                                {uploadingGallery[p.id] ? 'Subiendo...' : '+ Agregar Más Fotos'}
                            </label>
                            <input
                                type="file"
                                id={`gallery-${p.id}`}
                                multiple
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleGalleryUpload(p.id, e.target.files)}
                                disabled={uploadingGallery[p.id]}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .products-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .category-admin-card {
                    background: #fff;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 15px;
                }
                .cat-main-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .cat-cover-img {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    object-fit: cover;
                    background: #f1f5f9;
                }
                .cat-main-info h5 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--secondary);
                }
                .cat-main-info small { color: var(--muted-text); }
                
                .cat-gallery-preview {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .mini-thumb {
                    width: 60px;
                    height: 60px;
                    position: relative;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid #eee;
                }
                .mini-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .remove-img-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: rgba(255,0,0,0.8);
                    color: white;
                    border: none;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                }
                
                .btn-delete-cat {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .btn-delete-cat:hover { background: #fca5a5; }

                .btn-upload-gallery {
                    text-align: center;
                    font-size: 0.9rem;
                    color: var(--primary);
                    border: 2px dashed #cbd5e1;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: block;
                    width: 100%;
                    background: #f8fafc;
                    transition: all 0.2s;
                }
                .btn-upload-gallery:hover {
                    background: #f0fdf4;
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

// 2. MESSAGES VIEWER
const MessageManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="admin-section">
            <h3>Mensajes Recibidos</h3>
            {loading ? <p>Cargando mensajes...</p> : (
                <div className="messages-list">
                    {messages.length === 0 ? <p>No hay mensajes aún.</p> : messages.map(msg => (
                        <div key={msg.id} className="message-card">
                            <div className="msg-header">
                                <strong>{msg.name}</strong> <span>{msg.email}</span>
                            </div>
                            <p className="msg-body">{msg.message}</p>
                            <small className="msg-date">{msg.createdAt?.toDate().toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 3. CONFIG MANAGER
const ConfigManager = () => {
    const [config, setConfig] = useState({ phone: '', email: '', address: '', instagram: '', facebook: '', tiktok: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            const docRef = doc(db, "settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => setConfig({ ...config, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, "settings", "general"), config);
            setMsg("Configuración guardada.");
        } catch (err) {
            setMsg("Error al guardar.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <h3>Configuración General</h3>
            {msg && <p className="message">{msg}</p>}
            <form onSubmit={handleSave} className="admin-form">
                <h4>Contacto</h4>
                <div className="form-group"><label>Teléfono</label><input type="text" name="phone" value={config.phone} onChange={handleChange} /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={config.email} onChange={handleChange} /></div>
                <div className="form-group"><label>Dirección</label><input type="text" name="address" value={config.address} onChange={handleChange} /></div>

                <h4>Redes Sociales (URLs)</h4>
                <div className="form-group"><label>Instagram</label><input type="text" name="instagram" value={config.instagram} onChange={handleChange} /></div>
                <div className="form-group"><label>Facebook</label><input type="text" name="facebook" value={config.facebook} onChange={handleChange} /></div>
                <div className="form-group"><label>TikTok</label><input type="text" name="tiktok" value={config.tiktok} onChange={handleChange} /></div>

                <button type="submit" className="btn btn-primary" disabled={loading}><Save size={18} /> Guardar Cambios</button>
            </form>
        </div>
    );
};

// 4. BANNER MANAGER
const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`);
            const snap = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snap.ref);
            await addDoc(collection(db, "banners"), { imageUrl: url, createdAt: new Date() });
            loadBanners();
        } catch (err) {
            console.error(err);
            alert("Error subiendo imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, url) => {
        if (!window.confirm("¿Borrar imagen?")) return;
        try {
            await deleteDoc(doc(db, "banners", id));
            // Optional: delete from storage if you want to keep it clean, but URL is enough for logic
            loadBanners();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-section">
            <h3>Gestor de Banner (Carrusel)</h3>
            <div className="upload-box admin-form">
                <label>Subir Nueva Imagen</label>
                <input type="file" onChange={handleUpload} disabled={uploading} accept="image/*" />
                {uploading && <span>Subiendo...</span>}
            </div>

            <div className="banners-grid">
                {banners.map(b => (
                    <div key={b.id} className="banner-item">
                        <img src={b.imageUrl} alt="Banner" />
                        <button onClick={() => handleDelete(b.id, b.imageUrl)} className="delete-btn"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5. ORDER MANAGER
const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error("Error loading orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await setDoc(doc(db, "orders", orderId), { status: newStatus }, { merge: true });
            loadOrders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-section">
            <h3>Gestión de Pedidos</h3>
            {loading ? <p>Cargando pedidos...</p> : (
                <div className="orders-list">
                    {orders.length === 0 ? <p>No hay pedidos pendientes.</p> : orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <strong>{order.customer.name}</strong>
                                    <span className="order-contact">{order.customer.phone}</span>
                                </div>
                                <span className={`order-status ${order.status}`}>
                                    {order.status === 'pending' ? 'Pendiente' : 'Completado'}
                                </span>
                            </div>
                            <div className="order-address">
                                <small>📍 {order.customer.address}</small>
                            </div>
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                                <div className="order-actions">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateStatus(order.id, 'completed')} className="btn-sm btn-success">
                                            Completar
                                        </button>
                                    )}
                                    <button onClick={async () => {
                                        if (window.confirm('¿Eliminar pedido?')) {
                                            await deleteDoc(doc(db, "orders", order.id));
                                            loadOrders();
                                        }
                                    }} className="btn-sm btn-danger">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <small className="order-date">{order.createdAt?.toDate().toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                .order-card {
                    background: #fafafa;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }
                .order-contact {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--muted-text);
                }
                .order-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .order-status.pending { background: #fff7ed; color: #c2410c; }
                .order-status.completed { background: #f0fdf4; color: #15803d; }
                
                .order-address { margin-bottom: 15px; color: var(--secondary); font-size: 0.9rem; }
                
                .order-items {
                    border-top: 1px solid #e5e7eb;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 10px 0;
                    margin-bottom: 10px;
                }
                .order-item-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                }
                
                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10px;
                }
                .order-total { font-weight: bold; font-size: 1.1rem; color: var(--primary); }
                
                .order-actions { display: flex; gap: 10px; }
                .btn-sm { padding: 5px 10px; font-size: 0.8rem; border-radius: 4px; border: none; cursor: pointer; color: white; display: flex; align-items: center; gap: 5px;}
                .btn-success { background: #22c55e; }
                .btn-danger { background: #ef4444; }
                
                .order-date { display: block; margin-top: 10px; font-size: 0.8rem; color: #94a3b8; text-align: right; }
            `}</style>
        </div>
    );
};

/* --- MAIN ADMIN COMPONENT --- */
const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (pin === '1619') {
            try {
                // Anonymous auth import should be at top, but we can dynamic import or assume it handles it if we imported auth
                // Better to use the auth object we exported.
                const { signInAnonymously } = await import("firebase/auth");
                const { auth } = await import("../firebase/config");
                await signInAnonymously(auth);
                setIsAuthenticated(true);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Error de autenticación');
            }
        } else {
            setError('PIN incorrecto');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-box section-padding">
                    <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Acceso Admin</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="password"
                            placeholder="Ingrese PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                        <button type="submit" className="btn btn-primary">Entrar</button>
                    </form>
                    {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
                </div>
                <style>{`
                    .login-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: #f1f5f9;
                    }
                    .login-box {
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                        width: 100%;
                        max-width: 400px;
                    }
                `}</style>
            </div>
        );
    }


    const renderContent = () => {
        switch (activeTab) {
            case 'products': return <ProductManager />;
            case 'orders': return <OrderManager />;
            case 'messages': return <MessageManager />;
            case 'config': return <ConfigManager />;
            case 'banner': return <BannerManager />;
            default: return <ProductManager />;
        }
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
                        <Package size={20} /> Productos
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                        <ShoppingBag size={20} /> Pedidos
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? 'active' : ''}>
                        <MessageSquare size={20} /> Mensajes
                    </button>
                    <button onClick={() => setActiveTab('config')} className={activeTab === 'config' ? 'active' : ''}>
                        <Settings size={20} /> Config
                    </button>
                    <button onClick={() => setActiveTab('banner')} className={activeTab === 'banner' ? 'active' : ''}>
                        <ImageIcon size={20} /> Banner
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                {renderContent()}
            </main>

            <style>{`
            /* Mobile First Admin Layout */
            .admin-layout {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                padding-top: var(--nav-height);
                padding-bottom: 70px; /* Space for bottom nav on mobile */
                background: #f1f5f9;
            }

            /* Sidebar becomes Bottom Nav on Mobile */
            .sidebar {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 60px;
                background: white;
                border-top: 1px solid var(--border);
                display: flex;
                flex-direction: row;
                z-index: 100;
                overflow-x: auto; /* Scroll if too many items */
            }

            .sidebar-header {
                display: none; /* Hide header on mobile */
            }

            .sidebar-nav {
                display: flex;
                width: 100%;
                padding: 0;
                justify-content: space-around;
            }

            .sidebar-nav button {
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
                padding: 8px;
                border: none;
                background: transparent;
                font-size: 0.75rem; /* Smaller text */
                color: var(--muted-text);
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
                flex: 1;
            }

            .sidebar-nav button:hover, .sidebar-nav button.active {
                background: transparent;
                color: var(--primary);
                border-right: none;
                border-top: 3px solid var(--primary); /* Indicator on top for bottom nav */
            }

            .main-content {
                flex: 1;
                margin-left: 0;
                padding: 20px;
                width: 100%;
            }

            .admin-section {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                width: 100%;
                margin: 0 auto;
            }

            .admin-section h3 {
                margin-bottom: 20px;
                color: var(--secondary);
                font-size: 1.3rem;
                border-bottom: 2px solid #f1f5f9;
                padding-bottom: 15px;
            }

            /* Forms */
            .admin-form .form-group { margin-bottom: 15px; }

            .admin-form label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
                color: var(--secondary);
                font-size: 0.9rem;
            }

            .admin-form input, .admin-form select, .admin-form textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 8px;
                font-family: inherit;
                font-size: 16px; /* Prevent zoom */
            }
            
            .form-row {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            /* Grids */
            .products-list-container, .banners-grid, .messages-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .banners-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 10px;
            }

            .banner-item {
                position: relative;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .banner-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .delete-btn {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(255,0,0,0.8);
                color: white;
                border: none;
                padding: 5px;
                border-radius: 4px;
                cursor: pointer;
            }

            /* Desktop Styles */
            @media (min-width: 900px) {
                .admin-layout {
                    flex-direction: row;
                    padding-bottom: 0;
                }

                .sidebar {
                    width: 250px;
                    height: auto; /* Full height */
                    position: fixed;
                    top: var(--nav-height);
                    left: 0;
                    bottom: 0;
                    border-top: none;
                    border-right: 1px solid var(--border);
                    flex-direction: column;
                    justify-content: flex-start;
                }

                .sidebar-header {
                    display: block;
                    padding: 20px;
                    border-bottom: 1px solid var(--border);
                }
                
                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    padding: 20px 0;
                }

                .sidebar-nav button {
                    flex-direction: row;
                    width: 100%;
                    padding: 15px 20px;
                    font-size: 1rem;
                    border-top: none;
                    justify-content: flex-start;
                }

                .sidebar-nav button:hover, .sidebar-nav button.active {
                    background: #eff6ff;
                    border-top: none;
                    border-right: 3px solid var(--primary);
                }

                .main-content {
                    margin-left: 250px;
                    padding: 40px;
                }

                .admin-section {
                    padding: 30px;
                    max-width: 900px;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                .banners-grid {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 15px;
                }
            }
        `}</style>
        </div>
    );
};

export default Admin;

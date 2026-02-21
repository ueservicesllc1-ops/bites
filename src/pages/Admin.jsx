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
            <div className="admin-header-row">
                <h3>Gestión de Pedidos</h3>
                <button onClick={loadOrders} className="btn-refresh">Actualizar</button>
            </div>
            {loading ? <p>Cargando pedidos...</p> : (
                <div className="orders-list">
                    {orders.length === 0 ? <p>No hay pedidos registrados.</p> : orders.map(order => (
                        <div key={order.id} className={`order-card status-${order.status}`}>
                            <div className="order-header">
                                <div className="customer-info-main">
                                    <div className="avatar-letter">
                                        {(order.customer?.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="customer-name">{order.customer?.name || 'Desconocido'}</h4>
                                        <p className="customer-meta">{order.customer?.email} | {order.customer?.phone}</p>
                                    </div>
                                </div>
                                <div className="order-badge-group">
                                    <span className={`status-badge ${order.status}`}>
                                        {order.status === 'paid' ? '💰 Pagado' :
                                            order.status === 'pending' ? '⏳ Pendiente' :
                                                order.status === 'completed' ? '✅ Entregado' : order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="order-body-grid">
                                <div className="order-details-col">
                                    <h5 className="section-small-title">Dirección de Envío</h5>
                                    <p className="address-text">
                                        {order.customer?.address}<br />
                                        {order.customer?.city}, {order.customer?.zip}
                                    </p>

                                    <h5 className="section-small-title">Método de Envío</h5>
                                    <p className="shipping-method-info">
                                        <Truck size={14} style={{ marginRight: '5px' }} />
                                        {order.shipping?.name || 'Envío estándar'} - <strong>${(order.shipping?.price || 0).toFixed(2)}</strong>
                                    </p>
                                </div>

                                <div className="order-items-col">
                                    <h5 className="section-small-title">Productos</h5>
                                    <div className="order-items-list">
                                        {(order.items || []).map((item, idx) => (
                                            <div key={idx} className="item-mini-row">
                                                <span className="item-qty">{item.quantity}x</span>
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-price">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-total-bar">
                                        <span>TOTAL PAGADO</span>
                                        <strong>${(order.total || 0).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="order-footer">
                                <span className="order-id-tag">REF: {order.paymentId || order.id.substring(0, 8)}</span>
                                <div className="order-actions-buttons">
                                    {order.status === 'paid' && (
                                        <button onClick={() => updateStatus(order.id, 'completed')} className="btn-action b-complete">
                                            Marcar como Enviado
                                        </button>
                                    )}
                                    <button onClick={async () => {
                                        if (window.confirm('¿Eliminar registro de pedido definitivamente?')) {
                                            await deleteDoc(doc(db, "orders", order.id));
                                            loadOrders();
                                        }
                                    }} className="btn-action b-delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="order-date-row">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Fecha no disponible'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                .admin-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .btn-refresh {
                    background: transparent;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    padding: 5px 15px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .order-card {
                    background: #fff;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    transition: transform 0.2s;
                }
                .order-card:hover { transform: translateY(-2px); }
                
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .customer-info-main { display: flex; align-items: center; gap: 12px; }
                .avatar-letter {
                    width: 45px; height: 45px;
                    background: #f0f9ff;
                    color: var(--primary);
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 12px; font-weight: 900; font-size: 1.2rem;
                    border: 1px solid #e0f2fe;
                }
                .customer-name { margin: 0; font-size: 1.1rem; color: #1e293b; }
                .customer-meta { margin: 0; font-size: 0.85rem; color: #64748b; }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .status-badge.paid { background: #dcfce7; color: #166534; }
                .status-badge.completed { background: #f1f5f9; color: #475569; }
                .status-badge.pending { background: #fef9c3; color: #854d0e; }

                .order-body-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                @media (min-width: 600px) {
                    .order-body-grid { grid-template-columns: 1fr 1fr; }
                }

                .section-small-title {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #94a3b8;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                    font-weight: 800;
                }
                .address-text { font-size: 0.9rem; line-height: 1.4; color: #334155; margin-bottom: 15px; }
                .shipping-method-info {
                    display: flex; align-items: center;
                    font-size: 0.9rem; background: #f8fafc;
                    padding: 8px 12px; border-radius: 8px; color: #475569;
                }

                .order-items-list {
                    background: #f8fafc;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }
                .item-mini-row {
                    display: flex; justify-content: space-between;
                    font-size: 0.85rem; margin-bottom: 6px;
                    padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;
                }
                .item-mini-row:last-child { border: none; margin: 0; padding: 0; }
                .item-qty { font-weight: 800; color: var(--primary); width: 25px; }
                .item-name { flex: 1; color: #334155; }
                .item-price { font-weight: 600; color: #1e293b; }

                .order-total-bar {
                    display: flex; justify-content: space-between;
                    align-items: center; padding: 10px 0;
                }
                .order-total-bar span { font-size: 0.8rem; font-weight: 800; color: #64748b; }
                .order-total-bar strong { font-size: 1.2rem; color: #000; }

                .order-footer {
                    display: flex; justify-content: space-between;
                    align-items: center; padding-top: 15px;
                    border-top: 1px solid #f1f5f9;
                }
                .order-id-tag { font-family: monospace; font-size: 0.7rem; color: #94a3b8; }
                .order-actions-buttons { display: flex; gap: 10px; }
                
                .btn-action {
                    padding: 8px 16px; border-radius: 8px;
                    border: none; cursor: pointer; font-weight: 700;
                    font-size: 0.85rem; transition: all 0.2s;
                }
                .b-complete { background: #000; color: #fff; }
                .b-complete:hover { background: #334155; }
                .b-delete { background: #fee2e2; color: #ef4444; }
                .b-delete:hover { background: #fca5a5; }

                .order-date-row {
                    margin-top: 15px; font-size: 0.75rem;
                    color: #cbd5e1; text-align: center;
                }
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

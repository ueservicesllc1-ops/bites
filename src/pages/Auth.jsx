import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Chrome, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Auth = () => {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            setError('Error al conectar con Google.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await loginWithEmail(formData.email, formData.password);
            } else {
                if (!formData.name) throw new Error("Nombre es requerido");
                await registerWithEmail(formData.email, formData.password, formData.name);
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message.includes('auth/user-not-found') ? 'Usuario no encontrado' : 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card-fun">
                <div className="auth-sticker-decor s1">STKRS</div>
                <div className="auth-sticker-decor s2">✨</div>

                <div className="auth-header">
                    <h1>{isLogin ? '¡Bienvenido de nuevo!' : 'Únete a Bites Creative'}</h1>
                    <p>{isLogin ? 'Accede para gestionar tus pedidos.' : 'Crea tu cuenta para pedir muestras gratis.'}</p>
                </div>

                <button className="google-btn-fun" onClick={handleGoogleAuth} disabled={loading}>
                    <Chrome size={20} />
                    <span>Continuar con Google</span>
                </button>

                <div className="divider-fun">
                    <span>o usa tu correo</span>
                </div>

                {error && <div className="auth-error-fun">{error}</div>}

                <form onSubmit={handleEmailAuth} className="auth-form-fun">
                    {!isLogin && (
                        <div className="form-group-fun">
                            <label><User size={16} /> Nombre</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group-fun">
                        <label><Mail size={16} /> Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="hola@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-fun">
                        <label><Lock size={16} /> Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-auth-btn" disabled={loading}>
                        {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarme'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="auth-footer-fun">
                    <p>
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya eres parte de la comunidad?'}
                        <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-btn">
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 100px;
                    padding-bottom: 60px;
                    background: #f8fafc;
                }

                .auth-card-fun {
                    background: white;
                    width: 100%;
                    max-width: 480px;
                    padding: 50px 40px;
                    border-radius: 30px;
                    border: 4px solid #000;
                    box-shadow: 12px 12px 0px #000;
                    position: relative;
                }

                .auth-sticker-decor {
                    position: absolute;
                    background: white;
                    border: 2px solid #000;
                    padding: 5px 12px;
                    font-weight: 900;
                    box-shadow: 4px 4px 0px #000;
                    z-index: 5;
                }
                .s1 { top: -15px; left: 20px; transform: rotate(-10deg); color: #FF006E; }
                .s2 { bottom: 20px; right: -25px; transform: rotate(15deg); font-size: 1.5rem; border-radius: 50%; }

                .auth-header { text-align: center; margin-bottom: 30px; }
                .auth-header h1 { font-size: 2rem; font-weight: 900; color: #000; line-height: 1.1; margin-bottom: 10px; }
                .auth-header p { color: #64748b; font-size: 0.95rem; }

                .google-btn-fun {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 14px;
                    background: #fff;
                    border: 2px solid #e2e8f0;
                    border-radius: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 25px;
                }
                .google-btn-fun:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-2px); }

                .divider-fun {
                    position: relative;
                    text-align: center;
                    margin: 30px 0;
                }
                .divider-fun::before {
                    content: '';
                    position: absolute;
                    top: 50%; left: 0; width: 100%; height: 1px;
                    background: #e2e8f0; z-index: 1;
                }
                .divider-fun span {
                    position: relative;
                    background: white;
                    padding: 0 15px;
                    color: #94a3b8;
                    font-size: 0.85rem;
                    font-weight: 600;
                    z-index: 2;
                }

                .auth-form-fun { display: flex; flex-direction: column; gap: 20px; }
                .form-group-fun label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 800;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    color: #1e293b;
                }
                .form-group-fun input {
                    width: 100%;
                    padding: 14px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .form-group-fun input:focus { border-color: #000; outline: none; }

                .auth-error-fun {
                    background: #fee2e2;
                    color: #ef4444;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid #fecaca;
                }

                .submit-auth-btn {
                    background: #000;
                    color: #fff;
                    border: none;
                    padding: 16px;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    margin-top: 10px;
                }
                .submit-auth-btn:hover { background: #334155; transform: scale(1.02); }

                .auth-footer-fun {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.95rem;
                    color: #64748b;
                }
                .toggle-auth-btn {
                    background: none;
                    border: none;
                    color: #FF006E;
                    font-weight: 800;
                    cursor: pointer;
                    margin-left: 8px;
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .auth-card-fun { padding: 40px 25px; margin: 0 10px; }
                }
            `}</style>
        </div>
    );
};

export default Auth;

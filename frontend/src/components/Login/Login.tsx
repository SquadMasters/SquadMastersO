import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password) {
            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });

                if (response.ok) {
                    const token = await response.text();
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    navigate('/karriereauswahl');
                } else {
                    const errorText = await response.text();
                    const messageMatch = errorText.match(/"message"\s*:\s*"([^"]+)"/);
                    const shortMessage = messageMatch ? messageMatch[1] : 'Login fehlgeschlagen.';
                    setErrorMessage(shortMessage);
                }
            } catch (error) {
                console.error('Fehler beim Login:', error);
                setErrorMessage('Ein Fehler ist aufgetreten.');
            }
        } else {
            setErrorMessage(' Kein User gefunden');
        }
    };

    return (
        <div className={styles['login-wrapper']}>
            {errorMessage && (
                <div className={styles['error-overlay']}>
                    <div className={styles['error-card']}>
                        <div className={styles['error-header']}>
                            <span className={styles['error-icon']}>❗</span>
                            <span className={styles['error-title']}>Error</span>
                        </div>
                        <div className={styles['error-message']}>
                            {errorMessage}
                        </div>
                        <button
                            className={styles['retry-button']}
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <div className={styles['login-card']}>
                <h2 className={styles['login-title']}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles['login-inputGroup']}>
                        <label htmlFor="username" className={styles['login-label']}>Benutzername</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Benutzername"
                            className={styles['login-input']}
                        />
                    </div>
                    <div className={styles['login-inputGroup']}>
                        <label htmlFor="password" className={styles['login-label']}>Passwort</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Passwort"
                            className={styles['login-input']}
                        />
                    </div>
                    <button type="submit" className={styles['login-button']}>
                        Einloggen
                    </button>
                </form>

                <div className={styles['login-link']}>
                    <small>Noch keinen Account? <a href="/registrieren">Registrieren</a></small>
                </div>
            </div>
        </div>
    );
};

export default Login;

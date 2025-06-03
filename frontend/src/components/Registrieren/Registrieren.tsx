import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Register.module.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Bitte Benutzername und Passwort eingeben.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                navigate('/');
            } else {
                const errorText = await response.text();
                const match = errorText.match(/"message"\s*:\s*"([^"]+)"/);
                const shortMessage = match ? match[1] : 'Registrierung fehlgeschlagen.';
                setErrorMessage(shortMessage);
            }
        } catch (error) {
            console.error('Fehler bei der Registrierung:', error);
            setErrorMessage('Ein Fehler ist aufgetreten.');
        }
    };

    return (
        <div className={styles['register-wrapper']}>
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

            <div className={styles['register-card']}>
                <h2 className={styles['register-title']}>Registrieren</h2>
                <form onSubmit={handleRegister}>
                    <div className={styles['register-inputGroup']}>
                        <label htmlFor="username" className={styles['register-label']}>Benutzername</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Benutzername"
                            className={styles['register-input']}
                        />
                    </div>
                    <div className={styles['register-inputGroup']}>
                        <label htmlFor="password" className={styles['register-label']}>Passwort</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Passwort"
                            className={styles['register-input']}
                        />
                    </div>
                    <button type="submit" className={styles['register-button']}>
                        Registrieren
                    </button>
                </form>
                <div className={styles['register-link']}>
                    <small>Schon einen Account? <a href="/">Login</a></small>
                </div>
            </div>
        </div>
    );
};

export default Register;

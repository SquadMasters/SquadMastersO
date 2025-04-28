import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (username === storedUser.username && password === storedUser.password) {
            navigate('/karriereauswahl');
        } else {
            alert('Falscher Benutzername oder Passwort.');
        }
    };

    return (
        <div className={styles['login-wrapper']}>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const token = await response.text();
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username); // ✅ speichert aktuellen User
                    navigate('/karriereauswahl');
                } else {
                    const errorData = await response.text();
                    alert(`Login fehlgeschlagen: ${errorData}`);
                }
            } catch (error) {
                console.error('Fehler beim Login:', error);
                alert('Ein Fehler ist aufgetreten.');
            }
        } else {
            alert('Bitte Benutzername und Passwort eingeben.');
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

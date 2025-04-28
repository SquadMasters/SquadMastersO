import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // eigenes CSS Modul

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password) {
            localStorage.setItem('user', JSON.stringify({ username, password }));
            navigate('/');
        } else {
            alert('Bitte Benutzername und Passwort eingeben.');
        }
    };

    return (
        <div className={styles['register-wrapper']}>
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

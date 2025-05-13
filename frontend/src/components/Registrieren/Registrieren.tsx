import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Register.module.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password) {
            try {
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Registrierung erfolgreich:', data);
                    navigate('/'); // Weiterleitung auf Login-Seite oder Startseite
                } else {
                    const errorData = await response.text();
                    alert(`Registrierung fehlgeschlagen: ${errorData}`);
                }
            } catch (error) {
                console.error('Fehler bei der Registrierung:', error);
                alert('Ein Fehler ist aufgetreten.');
            }
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

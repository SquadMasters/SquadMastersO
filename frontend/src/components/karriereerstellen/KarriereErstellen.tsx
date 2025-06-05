import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../Login/Login.module.css";

interface Club {
    club_id: number;
    clubName: string;
}

const KarriereErstellen: React.FC = () => {
    const [careerName, setCareerName] = useState('');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [selectedClubName, setSelectedClubName] = useState<string>('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/clubs/all')
            .then(res => {
                setClubs(res.data);
                if (res.data.length > 0) {
                    setSelectedClubName(res.data[0].clubName);
                }
            })
            .catch(() => alert('Fehler beim Laden der Clubs'));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!careerName || !selectedClubName || !username) {
            alert('Bitte fülle alle Felder aus');
            return;
        }

        const request = {
            careerName,
            username,
            clubName: selectedClubName
        };

        try {
            await axios.post('http://localhost:8080/newCareer/create', request, {
                headers: {'Content-Type': 'application/json'}
            });
            navigate('/karriereauswahl');
        } catch (err) {
            setErrorMessage('Fehler beim Erstellen der Karriere');
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">

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
            <h1 className="text-center mb-4">Eigene Karriere erstellen</h1>
            <div className="card p-4 shadow mx-auto" style={{maxWidth: '600px'}}>
                <form onSubmit={handleCreate}>
                    <div className="mb-3">
                        <label className="form-label">Karriere-Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={careerName}
                            onChange={(e) => setCareerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Team auswählen</label>
                        <select
                            className="form-select"
                            value={selectedClubName}
                            onChange={(e) => setSelectedClubName(e.target.value)}
                            required
                        >
                            {clubs.map(club => (
                                <option key={club.club_id} value={club.clubName}>
                                    {club.clubName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-primary">Karriere erstellen</button>
                        <button type="button" className="btn btn-outline-secondary"
                                onClick={() => navigate('/karriereauswahl')}>
                            Zurück
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KarriereErstellen;

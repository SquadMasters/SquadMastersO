// KarriereBeitreten.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const KarriereBeitreten: React.FC = () => {
    const [careers, setCareers] = useState<string[]>([]);
    const [selectedCareer, setSelectedCareer] = useState('');
    const [availableClubs, setAvailableClubs] = useState<string[]>([]);
    const [selectedClub, setSelectedClub] = useState('');
    const username = localStorage.getItem('username') ?? '';
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/careers/toJoin/${username}`)
            .then(res => {
                const careerList = res.data;
                setCareers(careerList);
                if (careerList.length > 0) {
                    setSelectedCareer(careerList[0]);
                }
            })
            .catch(() => alert('Fehler beim Laden der Karrieren'));
    }, [username]);

    useEffect(() => {
        if (!selectedCareer) return;
        axios.get(`http://localhost:8080/trainerCareer/toJoin/${selectedCareer}`)
            .then(res => {
                const clubList = res.data;
                setAvailableClubs(clubList);
                if (clubList.length > 0) {
                    setSelectedClub(clubList[0]);
                }
            })
            .catch(() => alert('Fehler beim Laden der Teams'));
    }, [selectedCareer]);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();

        const request = {
            username,
            careername: selectedCareer,
            clubname: selectedClub,
        };

        try {
            await axios.patch('http://localhost:8080/trainerCareer/joinTrainerCareer', request, {
                headers: { 'Content-Type': 'application/json' }
            });

            const joined = JSON.parse(localStorage.getItem('joinedCareers') || '[]');
            joined.push(selectedCareer);
            localStorage.setItem('joinedCareers', JSON.stringify(joined));

            navigate('/karriereauswahl');
        } catch (err) {
            alert('Fehler beim Beitritt zur Karriere.');
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Bestehender Karriere beitreten</h1>

            <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleJoin}>
                    <div className="mb-3">
                        <label className="form-label">Karriere auswählen</label>
                        <select className="form-select" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} required>
                            {careers.map(career => (
                                <option key={career} value={career}>{career}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Verfügbares Team auswählen</label>
                        <select className="form-select" value={selectedClub} onChange={e => setSelectedClub(e.target.value)} required>
                            {availableClubs.map(club => (
                                <option key={club} value={club}>{club}</option>
                            ))}
                        </select>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-success">Beitreten</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/karriereauswahl')}>Zurück</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KarriereBeitreten;
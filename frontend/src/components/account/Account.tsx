import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";

interface Team {
    id: number;
    name: string;
    country: string;
    league: string;
    logoUrl: string;
}

interface Career {
    careerName: string;
    team: Team;
    createdAt: string;
}

const Account: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [career, setCareer] = useState<Career | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Benutzername direkt als String holen
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        // Karriere aus LocalStorage holen
        const storedCareer = JSON.parse(localStorage.getItem('career') || '{}');
        if (storedCareer && storedCareer.team) {
            setCareer(storedCareer);
        }
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Account Übersicht</h1>

            <div className="card p-4 shadow mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
                <h4 className="mb-3">Benutzername:</h4>
                <p className="fs-5">{username || 'Kein Benutzer gefunden || Loggen Sie sich ein'}</p>

                <hr />

                <h4 className="mt-4 mb-3">Gewähltes Team:</h4>
                {career && career.team ? (
                    <div className="text-center">
                        <img src={career.team.logoUrl} alt={career.team.name} style={{ width: '100px' }} className="mb-3" />
                        <p className="fs-5">{career.team.name}</p>

                        <hr className="my-4" />

                        <h5>Karriere-Name:</h5>
                        <p className="text-primary">{career.careerName}</p>

                        <small className="text-muted">Erstellt am: {new Date(career.createdAt).toLocaleDateString()}</small>

                        <button className="btn btn-danger mt-4 w-100"  onClick={() => navigate('/')}>
                            Log Out
                        </button>

                    </div>
                ) : (
                    <p className="text-muted">Keine Karriere gestartet.</p>
                )}
            </div>
        </div>
    );
};

export default Account;

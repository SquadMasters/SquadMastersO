import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    useEffect(() => {
        // Benutzername aus LocalStorage holen
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUsername(storedUser.username || null);

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
                <p className="fs-5">{username || 'Kein Benutzer gefunden'}</p>

                <hr />

                <h4 className="mt-4 mb-3">Gewähltes Team:</h4>
                {career && career.team ? (
                    <div className="text-center">
                        <img src={career.team.logoUrl} alt={career.team.name} style={{ width: '100px' }} className="mb-3" />
                        <p className="fs-5">{career.team.name}</p>
                        <small className="text-muted">{career.team.league} - {career.team.country}</small>

                        <hr className="my-4" />

                        <h5>Karriere-Name:</h5>
                        <p className="text-primary">{career.careerName}</p>

                        <small className="text-muted">Erstellt am: {new Date(career.createdAt).toLocaleDateString()}</small>
                    </div>
                ) : (
                    <p className="text-muted">Kein Team ausgewählt.</p>
                )}
            </div>
        </div>
    );
};

export default Account;

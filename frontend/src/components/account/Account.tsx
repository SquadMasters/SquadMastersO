import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";
import "./Account.css";


const teamColorMap: { [key: string]: string[] } = {
    'Arsenal': ['#E30613', '#C8102E', '#9B1B30'],
    'Atlético Madrid': ['#C8102E', '#003B5C', '#FFFFFF'],
    'FC Barcelona': ['#A50021', '#004D98'],
    'Bayern München': ['#D50032', '#FFFFFF'],
    'Manchester City': ['#3E8FC7', '#FFFFFF'],
    'Inter Mailand': ['#003DA5', '#FFFFFF'],
    'Juventus Turin': ['#000000', '#FFFFFF'],
    'Liverpool': ['#C8102E', '#00B5A0'],
    'AC Mailand': ['#9C1B29', '#FFFFFF'],
    'Paris Saint-Germain': ['#0060A9', '#E30613'],
    'Real Madrid': ['#D4AF37', '#FFFFFF'],
};

interface Team {
    id: number;
    name: string;
    country: string;
    league: string;
    logoUrl: string;
    teamColor: string[];
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
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        const storedCareer = JSON.parse(localStorage.getItem('career') || '{}');
        if (storedCareer && storedCareer.team) {
            setCareer(storedCareer);
        }
    }, []);

    const team = career?.team;
    const teamColors = team ? teamColorMap[team.name] : ['#1e88e5'];
    const primaryColor = teamColors[0];


    return (
        <div className="account-container" style={{backgroundColor: '#ffffff'}}>
            <h1 className="account-title" style={{color: primaryColor}}>Account Übersicht</h1>

            <div className="account-card" style={{borderColor: primaryColor}}>
                <h4 className="account-subtitle">Benutzername:</h4>
                <p className="account-username">{username || 'Kein Benutzer gefunden'}</p>

                <hr className="account-divider"/>

                <h4 className="account-subtitle">Gewähltes Team:</h4>
                {career && career.team ? (
                    <div className="account-team-section">
                        <img
                            src={career.team.logoUrl}
                            alt={career.team.name}
                            className="account-team-logo"
                        />
                        <p className="account-team-name" style={{color: primaryColor}}>{career.team.name}</p>

                        <hr className="account-divider"/>

                        <h5 className="account-career-title" style={{color: primaryColor}}>Karriere-Name:</h5>
                        <p className="account-career-name">{career.careerName}</p>

                        <small className="account-created-date">
                            Erstellt am: {new Date(career.createdAt).toLocaleDateString()}
                        </small>

                        <button
                            className="account-logout-btn"
                            onClick={() => navigate('/')}
                            style={{backgroundColor: primaryColor}}
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <p className="account-no-career">Keine Karriere gestartet.</p>
                )}
            </div>
        </div>
    );
};

export default Account;

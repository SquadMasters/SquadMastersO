import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Team {
    id: number;
    name: string;
    country: string;
    league: string;
    logoUrl: string;
    careerName: string;
}



const defaultTeams: Team[] = [
    {
        id: 1,
        name: "AC Mailand",
        country: "Italy",
        league: "Serie A",
        logoUrl: "src/components/Karriereauswahl/milan.png",
        careerName: "Mailand Meistertraum",
    },
    {
        id: 2,
        name: "Juventus",
        country: "Italy",
        league: "Serie A",
        logoUrl: "src/components/Karriereauswahl/juve.png",
        careerName: "Juventus Rückkehr zur Spitze",
    },
];


const saveTeamsToLocalStorage = (teams: Team[]) => {
    localStorage.setItem('teams', JSON.stringify(teams));
};

const loadTeamsFromLocalStorage = (): Team[] => {
    const stored = localStorage.getItem('teams');
    return stored ? JSON.parse(stored) : [];
};

const Karriereauswahl: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadedTeams = loadTeamsFromLocalStorage();

        if (loadedTeams.length === 0) {
            saveTeamsToLocalStorage(defaultTeams);
            setTeams(defaultTeams);
        } else {
            setTeams(loadedTeams);
        }
    }, []);

    const startCareer = () => {
        if (selectedTeam) {
            const career: Career = {
                careerName: selectedTeam.careerName || `${selectedTeam.name} Karriere`,
                team: selectedTeam,
                createdAt: new Date().toISOString(),
            };

            localStorage.setItem('career', JSON.stringify(career));
            navigate('/home');
        }
    };

    const goToCareerCreate = () => {
        navigate('/karriereerstellen');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Wähle dein Team für die Karriere</h1>

            <div className="row mb-5 justify-content-center">

                <div className="col-md-4 mb-4">
                    <div
                        className="card h-100 d-flex flex-column justify-content-center align-items-center border-secondary"
                        style={{ cursor: 'pointer', minHeight: '450px' }}
                        onClick={goToCareerCreate}
                    >
                        <div className="card-body text-center">
                            <h4 className="card-title">Eigene Karriere erstellen</h4>
                            <p className="card-text text-muted mt-3">
                                Erstelle dein eigenes Team und starte eine individuelle Karriere.
                            </p>
                        </div>
                    </div>
                </div>


                {teams.map((team) => (
                    <div className="col-md-4 mb-4" key={team.id}>
                        <div
                            className={`card h-100 ${selectedTeam?.id === team.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedTeam(team)}
                            style={{ cursor: 'pointer', minHeight: '450px' }}
                        >
                            <img
                                src={team.logoUrl}
                                className="card-img-top p-3"
                                alt={`${team.name} logo`}
                                style={{ height: '300px', objectFit: 'contain' }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{team.name}</h5>
                                <p className="card-text" >{team.league} - {team.country}</p>
                                <h3 className="card-text">{team.careerName}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTeam && (
                <div className="text-center mb-3">
                    <button className="btn btn-primary btn-lg" onClick={startCareer}>
                        Karriere starten mit {selectedTeam.name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Karriereauswahl;

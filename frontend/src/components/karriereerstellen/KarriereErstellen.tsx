import React, { useState } from 'react';
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

// Beispielhafte Team-Liste
const testTeams = [
    { name: "FC Bayern", country: "Deutschland", league: "Bundesliga", logoUrl: "/images/test1.png" },
    { name: "Real Madrid", country: "Spanien", league: "La Liga", logoUrl: "src/assets/reallogo.png" },
    { name: "Test Team 3", country: "England", league: "Premier League", logoUrl: "/images/test3.png" },
];

const KarriereErstellen: React.FC = () => {
    const [careerName, setCareerName] = useState('');
    const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(0);
    const navigate = useNavigate();

    const handleCreateCareer = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedTeam = testTeams[selectedTeamIndex];

        if (careerName && selectedTeam) {
            const existingTeams = JSON.parse(localStorage.getItem('teams') || '[]') as Team[];

            const newTeam: Team = {
                id: existingTeams.length > 0 ? existingTeams[existingTeams.length - 1].id + 1 : 1,
                name: selectedTeam.name,
                country: selectedTeam.country,
                league: selectedTeam.league,
                logoUrl: selectedTeam.logoUrl,
                careerName: careerName,
            };

            const updatedTeams = [...existingTeams, newTeam];
            localStorage.setItem('teams', JSON.stringify(updatedTeams));


            navigate('/karriereauswahl');
        } else {
            alert('Bitte Karriere-Name auswählen.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Eigene Karriere erstellen</h1>
            <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px', borderRadius: '15px' }}>
                <form onSubmit={handleCreateCareer}>
                    <div className="mb-3">
                        <label className="form-label">Karriere-Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={careerName}
                            onChange={(e) => setCareerName(e.target.value)}
                            placeholder="Karriere-Name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Team auswählen</label>
                        <select
                            className="form-select"
                            value={selectedTeamIndex}
                            onChange={(e) => setSelectedTeamIndex(parseInt(e.target.value))}
                        >
                            {testTeams.map((team, index) => (
                                <option key={index} value={index}>
                                    {team.name} ({team.league})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Karriere erstellen
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KarriereErstellen;

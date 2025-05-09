import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Karriereauswahl.css';
import axios from 'axios';

import arsenal from '../../assets/arsenalwappen.png';
import atletico from '../../assets/atleticowappen.png';
import barca from '../../assets/barcawappen.png';
import bayern from '../../assets/bayernwappen.png';
import city from '../../assets/citywappen.png';
import inter from '../../assets/interwappen.png';
import juve from '../../assets/juve.png';
import liverpool from '../../assets/liverpool.png';
import milan from '../../assets/milan.png';
import psg from '../../assets/psgwappen.png';
import real from '../../assets/reallogo.png';

interface Team {
    id: number;
    name: string;
    country: string;
    league: string;
    logoUrl: string;
    careerName: string;
    startUser?: string;
    type?: 'create' | 'join' | 'empty';
}

const logoMap: { [key: string]: string } = {
    'Arsenal': arsenal,
    'Atlético Madrid': atletico,
    'FC Barcelona': barca,
    'Bayern München': bayern,
    'Manchester City': city,
    'Inter Mailand': inter,
    'Juventus Turin': juve,
    'Liverpool': liverpool,
    'AC Mailand': milan,
    'Paris Saint-Germain': psg,
    'Real Madrid': real,
};

const Karriereauswahl: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [joinedCareers, setJoinedCareers] = useState<string[]>([]);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') ?? '';

    useEffect(() => {
        const fetchTrainerCareers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trainerCareer/allByUser/${username}`);
                const fetchedTeams: Team[] = response.data.map((career: any, index: number) => {
                    const logoUrl = logoMap[career.clubName] || '';
                    return {
                        id: index + 1,
                        name: career.clubName,
                        country: 'Unbekannt',
                        league: 'Unbekannt',
                        logoUrl,
                        careerName: career.careerName,
                        startUser: career.startUser,
                    };
                });
                setTeams(fetchedTeams);

                const joined = JSON.parse(localStorage.getItem('joinedCareers') || '[]');
                setJoinedCareers(joined);
            } catch (error) {
                console.error('Fehler beim Laden der Karrieren:', error);
            }
        };

        fetchTrainerCareers();
    }, [username]);

    const startCareer = () => {
        if (!selectedTeam) return;

        const career = {
            careerName: selectedTeam.careerName,
            team: selectedTeam,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem('career', JSON.stringify(career));
        localStorage.setItem('careername', selectedTeam.careerName);
        localStorage.setItem('username', username);
        localStorage.setItem('selectedTeam', JSON.stringify({ name: selectedTeam.name }));

        const otherClubs = Object.keys(logoMap).filter(name => name !== selectedTeam.name);
        const randomOpponentName = otherClubs[Math.floor(Math.random() * otherClubs.length)];

        if (randomOpponentName) {
            localStorage.setItem('opponentTeamName', randomOpponentName);
            console.log("✅ Gegner gesetzt:", randomOpponentName);
        }

        navigate('/home');
    };

    const allItems: Team[] = [
        ...teams,
        ...Array(Math.max(0, 5 - teams.length)).fill(null).map((_, i) => ({
            id: 10000 + i,
            name: '',
            country: '',
            league: '',
            logoUrl: '',
            careerName: '',
            type: 'empty'
        })),
        {
            id: 9001,
            name: 'Erstellen',
            country: '',
            league: '',
            logoUrl: '',
            careerName: 'Eigene Karriere erstellen',
            type: 'create',
        },
        {
            id: 9002,
            name: 'Beitreten',
            country: '',
            league: '',
            logoUrl: '',
            careerName: 'Bestehender Karriere beitreten',
            type: 'join',
        },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % allItems.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Wähle dein Team für die Karriere</h1>
            <div className="carousel-container">
                <button className="nav-button prev" onClick={prevSlide}>&lt;</button>
                <div className="carousel-track">
                    {allItems.map((item, index) => {
                        const offset = ((index - currentIndex + allItems.length) % allItems.length);
                        const visible = offset >= 0 && offset < 5;
                        const scale = offset === 2 ? 1 : 0.9;
                        const zIndex = 10 - Math.abs(2 - offset);
                        const translate = (offset - 2) * 160;

                        return (
                            <div
                                key={item.id}
                                className={`carousel-card ${offset === 2 ? 'active' : ''}`}
                                style={{ transform: `translateX(${translate}px) scale(${scale})`, zIndex, opacity: visible ? 1 : 0 }}
                                onClick={() => {
                                    if (item.type === 'empty') return;
                                    if (item.type === 'create') navigate('/karriereerstellen');
                                    else if (item.type === 'join') navigate('/karrierebeitreten');
                                    else {
                                        setSelectedTeam(item);
                                        // zentriere die Karte in der Mitte (Index 2 sichtbar = Mitte von 5)
                                        const middleIndex = 2;
                                        const newIndex = (index - middleIndex + allItems.length) % allItems.length;
                                        setCurrentIndex(newIndex);
                                    }
                                }}

                            >
                                {item.type === 'create' ? (
                                    <div className="create-card">
                                        <h3>{item.careerName}</h3>
                                        <p>Erstelle dein eigenes Team</p>
                                        <button className="btn btn-outline-primary" onClick={() => navigate('/karriereerstellen')}>
                                            Erstellen
                                        </button>
                                    </div>
                                ) : item.type === 'join' ? (
                                    <div className="create-card">
                                        <h3>{item.careerName}</h3>
                                        <p>Wähle ein Team aus einer bestehenden Karriere</p>
                                        <button className="btn btn-outline-success" onClick={() => navigate('/karrierebeitreten')}>
                                            Beitreten
                                        </button>
                                    </div>
                                ) : item.type === 'empty' ? (
                                    <div className="create-card">
                                        <h3>Leerer Slot</h3>
                                        <p>Keine Karriere vorhanden</p>
                                    </div>
                                ) : (
                                    <div className="card-body">
                                        <h3>{item.name}</h3>
                                        <h4>{item.careerName}</h4>
                                        <p style={{ fontSize: '0.85rem' }} className="text-muted">
                                            Erstellt von: {item.startUser}
                                        </p>
                                        {joinedCareers.includes(item.careerName) && (
                                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                Beigetretene Karriere
                                            </p>
                                        )}
                                        {item.logoUrl && (
                                            <img src={item.logoUrl} alt={item.name} style={{ width: '80px', marginBottom: '10px' }} />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button className="nav-button next" onClick={nextSlide}>&gt;</button>
            </div>

            {selectedTeam && (
                <div className="text-center mt-4">
                    <button className="btn btn-primary btn-lg" onClick={startCareer}>
                        Karriere starten mit {selectedTeam.name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Karriereauswahl;

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
    type?: 'create' | 'join';
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
                    };
                });
                setTeams(fetchedTeams);

                // Lese alle beigetretenen Karrieren aus localStorage
                const joined = JSON.parse(localStorage.getItem('joinedCareers') || '[]');
                setJoinedCareers(joined);
            } catch (error) {
                console.error('Fehler beim Laden der Karrieren:', error);
            }
        };

        fetchTrainerCareers();
    }, [username]);

    const startCareer = () => {
        if (selectedTeam) {
            const career = {
                careerName: selectedTeam.careerName,
                team: selectedTeam,
                createdAt: new Date().toISOString(),
            };

            localStorage.setItem('career', JSON.stringify(career));
            localStorage.setItem('careername', selectedTeam.careerName);
            localStorage.setItem('username', username); // ✅ Hier sicherstellen
            localStorage.setItem('selectedTeam', JSON.stringify({
                name: selectedTeam.name,
                logo: selectedTeam.logoUrl,
            }));

            navigate('/home');
        }
    };


    const allItems: Team[] = [
        ...teams,
        {
            id: teams.length + 1000,
            name: 'Erstellen',
            country: '',
            league: '',
            logoUrl: '',
            careerName: 'Eigene Karriere erstellen',
            type: 'create',
        },
        {
            id: teams.length + 1001,
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
                        const position = (index - currentIndex + allItems.length) % allItems.length;
                        let transform = '', scale = 1, zIndex = 0, opacity = 1;

                        if (position === 0) {
                            transform = 'translateX(0)';
                            scale = 1;
                            zIndex = 5;
                        } else if (position === 1) {
                            transform = 'translateX(30%)';
                            scale = 0.9;
                            zIndex = 4;
                        } else if (position === allItems.length - 1) {
                            transform = 'translateX(-30%)';
                            scale = 0.9;
                            zIndex = 4;
                        } else {
                            transform = 'translateX(0) scale(0)';
                            opacity = 0;
                        }

                        return (
                            <div
                                key={item.id}
                                className={`carousel-card ${position === 0 ? 'active' : ''}`}
                                style={{ transform: `${transform} scale(${scale})`, zIndex, opacity }}
                                onClick={() => {
                                    if (index < teams.length) {
                                        setSelectedTeam(item);
                                        setCurrentIndex(index);
                                    } else if (item.type === 'create') {
                                        navigate('/karriereerstellen');
                                    } else if (item.type === 'join') {
                                        navigate('/karrierebeitreten');
                                    }
                                }}
                            >
                                {index < teams.length ? (
                                    <div className="card-body">
                                        <h3>{item.name}</h3>
                                        <h4>{item.careerName}</h4>
                                        {joinedCareers.includes(item.careerName) && (
                                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                Beigetretene Karriere
                                            </p>
                                        )}
                                        {item.logoUrl && (
                                            <img src={item.logoUrl} alt={item.name} style={{ width: '80px', marginBottom: '10px' }} />
                                        )}
                                    </div>
                                ) : item.type === 'create' ? (
                                    <div className="create-card">
                                        <h3>{item.careerName}</h3>
                                        <p>Erstelle dein eigenes Team</p>
                                        <button className="btn btn-outline-primary" onClick={() => navigate('/karriereerstellen')}>
                                            Erstellen
                                        </button>
                                    </div>
                                ) : (
                                    <div className="create-card">
                                        <h3>{item.careerName}</h3>
                                        <p>Wähle ein Team aus einer bestehenden Karriere</p>
                                        <button className="btn btn-outline-success" onClick={() => navigate('/karrierebeitreten')}>
                                            Beitreten
                                        </button>
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

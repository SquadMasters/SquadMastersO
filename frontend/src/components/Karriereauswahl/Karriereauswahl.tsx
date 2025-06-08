import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
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
                    const logoUrl = logoMap[career.clubname] || '';
                    return {
                        id: index + 1,
                        name: career.clubname,
                        country: 'Unbekannt',
                        league: 'Unbekannt',
                        logoUrl,
                        careerName: career.careername,
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
        localStorage.setItem('selectedTeam', JSON.stringify({name: selectedTeam.name}));

        navigate('/home');
    };

    const allItems: Team[] = [
        {
            id: 9001,
            name: 'Erstellen',
            league: '',
            logoUrl: '',
            careerName: 'Eigene Karriere erstellen',
            type: 'create',
        },
        {
            id: 9002,
            name: 'Beitreten',
            league: '',
            logoUrl: '',
            careerName: 'Bestehender Karriere beitreten',
            type: 'join',
        },
        ...teams,
        ...Array(Math.max(0, 5 - teams.length))
            .fill(null)
            .map((_, i) => ({
                id: 10000 + i,
                name: '',
                league: '',
                logoUrl: '',
                careerName: '',
                type: 'empty' as 'empty',
            })),
    ];

    const nextSlide = () => setCurrentIndex(prev => (prev + 1) % allItems.length);
    const prevSlide = () => setCurrentIndex(prev => (prev - 1 + allItems.length) % allItems.length);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Wähle dein Team für die Karriere</h1>
            <div className="carousel-container">
                <button className="nav-button prev" onClick={prevSlide}>&lt;</button>
                <div className="carousel-track">
                    {allItems.map((item, index) => {
                        const offset = (index - currentIndex + allItems.length) % allItems.length;

                        const isActive = offset === 2;

                        return (
                            <div
                                key={item.id}
                                className={`carousel-card ${isActive ? 'active' : ''}`}
                                data-offset={offset}
                                onClick={() => {
                                    if (item.type === 'empty' || item.type === 'create') {
                                        navigate('/karriereerstellen');
                                    } else if (item.type === 'join') {
                                        navigate('/karrierebeitreten');
                                    } else {
                                        setSelectedTeam(item);
                                        const middleIndex = 2;
                                        const newIndex = (index - middleIndex + allItems.length) % allItems.length;
                                        setCurrentIndex(newIndex);
                                    }
                                }}
                            >
                                {item.type === 'create' || item.type === 'join' ? (
                                    <div className="create-card">
                                        <h3>{item.careerName}</h3>
                                        <p>{item.type === 'create' ? 'Erstelle dein eigenes Team' : 'Wähle ein Team aus einer bestehenden Karriere'}</p>
                                        <button
                                            className={`btn ${item.type === 'create' ? 'btn-outline-primary' : 'btn-outline-success'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(item.type === 'create' ? '/karriereerstellen' : '/karrierebeitreten');
                                            }}
                                        >
                                            {item.type === 'create' ? 'Erstellen' : 'Beitreten'}
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
                                        <p className="text-muted">Erstellt von: {item.startUser}</p>
                                        {joinedCareers.includes(item.careerName) && (
                                            <p className="text-muted">Beigetretene Karriere</p>
                                        )}
                                        {item.logoUrl && (
                                            <img src={item.logoUrl} alt={item.name} className="team-logo"/>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button className="nav-button next" onClick={nextSlide}>&gt;</button>
            </div>

            {selectedTeam && !selectedTeam.type && (
                <div className="text-center mt-4">
                    <button className="btn btn-primary start-career-btn" onClick={startCareer}>
                        Karriere starten mit {selectedTeam.name}
                    </button>
                </div>
            )}

        </div>
    );
};

export default Karriereauswahl;

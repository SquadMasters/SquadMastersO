import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useLocation } from 'react-router-dom';
import './NavbarLeft.css';

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

// Deine logoMap, die du schon hast
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

function NavbarLeft() {
    const location = useLocation();
    const [isNavDisabled, setIsNavDisabled] = useState(false);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        // Hole den gespeicherten Teamnamen direkt aus localStorage
        const selectedTeam = localStorage.getItem('selectedTeam');

        // Wenn das Team gespeichert ist, dann parse es
        if (selectedTeam) {
            const parsedTeam = JSON.parse(selectedTeam); // Parsing des JSON-Objekts
            console.log("Team Name aus localStorage:", parsedTeam.name); // Debugging-Ausgabe
            setTeamName(parsedTeam.name || 'Arsenal'); // Setze den Teamnamen (oder Arsenal als Fallback)
        } else {
            setTeamName('Arsenal'); // Wenn kein Team gefunden wird, setze 'Arsenal' als Standardwert
        }

        const checkStatus = () => {
            const simulationStatus = localStorage.getItem("simulationStatus");
            const transferWindow = localStorage.getItem("transferWindow");

            const shouldDisable = simulationStatus === "active" ||
                (simulationStatus === "inactive" && transferWindow === "closed");

            setIsNavDisabled(shouldDisable);
        };

        checkStatus();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "simulationStatus" || e.key === "transferWindow") {
                checkStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const intervalId = setInterval(checkStatus, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    // Teamfarben Map
    const teamColorMap: { [key: string]: string[] } = {
        'Arsenal': ['#9B1B30', '#ffffff'],
        'Atlético Madrid': ['#003B5C', '#C8102E'],
        'FC Barcelona': ['#004D98', '#A50021'],
        'Bayern München': ['#D50032', '#FFFFFF'],
        'Manchester City': ['#3E8FC7', '#FFFFFF'],
        'Inter Mailand': ['#003DA5', '#FFFFFF'],
        'Juventus Turin': ['#000000', '#FFFFFF'],
        'Liverpool': ['#00B5A0', '#C8102E'],
        'AC Mailand': ['#9C1B29', '#FFFFFF'],
        'Paris Saint-Germain': ['#0060A9', '#E30613'],
        'Real Madrid': ['#D4AF37', '#FFFFFF'],
    };

    // Prüfen, ob der Teamname im teamColorMap existiert
    const teamColors = teamColorMap[teamName.trim()] || ['#1e88e5', '#ffffff']; // Standard zu Blau und Weiß, wenn kein Teamname vorhanden
    const primaryColor = teamColors[0];
    const secondaryColor = teamColors[1];

    const activeLinkStyle = {
        color: '#fff',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, // Farbverlauf für den aktiven Tab
        boxShadow: `0px 0px 12px ${primaryColor}`,
    };

    // Hole das Logo des aktuellen Teams für den Account Tab
    const accountLogo = logoMap[teamName] || '/default-logo.png'; // Fallback-Logo, falls kein Team gefunden wird

    return (
        <div style={{
            width: '150px',
            borderRight: '1px solid #ccc',
            minHeight: '500px',
            position: 'fixed',
            left: 5,
            top: 5,
            height: '100vh',
            backgroundColor: '#ffffff', // Keep the background white
        }}>
            <Nav
                variant="tabs"
                activeKey={location.pathname}
                className="justify-content-start flex-column"
                style={{ height: '100%' }}
            >
                <Nav.Item className="mb-3" data-team={teamName}>
                    <Nav.Link
                        as={NavLink}
                        to="/home"
                        eventKey="/home"
                        disabled={isNavDisabled}
                        className={isNavDisabled ? "nav-disabled" : ""}
                        style={location.pathname === '/home' ? activeLinkStyle : {}}
                    >
                        <img
                            src={"src/components/navbarleft/pictures/haus.png"}
                            alt={"haus"}
                            width={"50px"}
                            height={"50px"}
                        />
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className="mb-3" data-team={teamName}>
                    <Nav.Link
                        as={NavLink}
                        to="/team_builder"
                        eventKey="/team_builder"
                        disabled={isNavDisabled}
                        className={isNavDisabled ? "nav-disabled" : ""}
                        style={location.pathname === '/team_builder' ? activeLinkStyle : {}}
                    >
                        <img
                            src={"src/components/navbarleft/pictures/feld.png"}
                            alt={"feld"}
                            width={"50px"}
                            height={"50px"}
                        />
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className="mb-3" data-team={teamName}>
                    <Nav.Link
                        as={NavLink}
                        to="/market"
                        eventKey="/market"
                        disabled={isNavDisabled}
                        className={isNavDisabled ? "nav-disabled" : ""}
                        style={location.pathname === '/market' ? activeLinkStyle : {}}
                    >
                        <img
                            src="src/components/navbarleft/pictures/money-management.png"
                            alt="geld"
                            width="50px"
                            height="50px"
                        />
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className="mb-3" data-team={teamName}>
                    <Nav.Link
                        as={NavLink}
                        to="/simulation"
                        eventKey="/simulation"
                        disabled={isNavDisabled}
                        className={isNavDisabled ? "nav-disabled" : ""}
                        style={location.pathname === '/simulation' ? activeLinkStyle : {}}
                    >
                        <img
                            src={"src/components/navbarleft/pictures/goldener-pokal.png"}
                            alt={"pokal"}
                            width={"50px"}
                            height={"50px"}
                        />
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className="mt-auto" style={{ paddingBottom: "20px" }} data-team={teamName}>
                    <Nav.Link
                        as={NavLink}
                        to="/account"
                        eventKey="/account"
                        disabled={isNavDisabled}
                        className={isNavDisabled ? "nav-disabled" : ""}
                        style={location.pathname === '/account' ? activeLinkStyle : {}}
                    >
                        <img
                            src={accountLogo}  // Das dynamische Logo für den Account-Tab
                            alt={teamName}
                            width={"50px"}
                            height={"50px"}
                        />
                        <p>Account</p>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}

export default NavbarLeft;

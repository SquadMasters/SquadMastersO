import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./TeamBuild.css";
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
import { Modal, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';



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

const teamColorMap: { [key: string]: string[] } = {
    'Arsenal': ['#9B1B30', '#E30613'],
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

const fieldPositions = ["TW", "LV", "RV", "IV1", "IV2", "ZDM", "ZM1", "ZM2", "LF", "RF", "ST"];



const TeamBuild = () => {
    const savedTeam = localStorage.getItem("selectedTeam");
    const parsedTeam = savedTeam ? JSON.parse(savedTeam) : null;
    const clubName = parsedTeam?.name || "Unbekanntes Team";
    const clubLogo = logoMap[parsedTeam?.name] || "/default-logo.png";
    const [teamColors, setTeamColors] = useState<string[]>(['#1e88e5', '#ffffff']);


    const username = localStorage.getItem("username") || "";
    const careername = localStorage.getItem("careername") || "";

    const [players, setPlayers] = useState<any[]>([]);
    const [field, setField] = useState<Record<string, any>>({});
    const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
    const [assignedPlayers, setAssignedPlayers] = useState<Set<string>>(new Set());
    const [selectedPosition, setSelectedPosition] = useState("Alle");
    const [,setIsLoading] = useState(true);
    const [removePlayerPosition, setRemovePlayerPosition] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {


        const initialField: Record<string, any> = {};
        fieldPositions.forEach(pos => initialField[pos] = null);
        setField(initialField);

        const loadData = async () => {
            const shouldReload = localStorage.getItem("reloadTeamBuild") === "true";
            try {
                const playersData = await fetchPlayers();
                setPlayers(playersData);

                const newField = { ...initialField };
                const newAssigned = new Set<string>();

                playersData.forEach((player: any) => {
                    if (player.positionInLineup && player.positionInLineup !== "B") {
                        newField[player.positionInLineup] = player;
                        newAssigned.add(player.short);
                    }
                });

                setField(newField);
                setAssignedPlayers(newAssigned);
                setIsLoading(false);

                if (shouldReload) {
                    localStorage.removeItem("reloadTeamBuild");
                    console.log("🔄 TeamBuild reload triggered!");
                }
            } catch (err) {
                console.error("Fehler beim Laden der Daten:", err);
                setIsLoading(false);
            }
        };

        loadData();
    }, [username, careername]);



    useEffect(() => {
        if (parsedTeam?.name) {
            setTeamColors(teamColorMap[parsedTeam.name] || ['#1e88e5', '#ffffff']);
        }
    }, [parsedTeam]);

    const fetchPlayers = async () => {
        const url = `http://localhost:8080/trainerCareerPlayer/allPlayersFromTrainerCareer?username=${encodeURIComponent(username)}&careername=${encodeURIComponent(careername)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fehler: ${response.status}`);

        const data = await response.json();
        return data.map((p: any) => ({
            ...p,
            short: getInitials(p.firstname, p.lastname),
            age: p.ageNow,
            value: `€${(p.value / 1_000_000).toFixed(1)}M`,
        }));
    };




    const getInitials = (first: string, last: string) => {
        return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
    };

    const handleDragStart = (event: React.DragEvent, player: any) => {
        event.dataTransfer.setData("player", JSON.stringify(player));
    };

    const handleDrop = (event: React.DragEvent, position: string) => {
        event.preventDefault();
        const droppedPlayer = JSON.parse(event.dataTransfer.getData("player"));
        const validPositions: { [key: string]: string[] } = {
            TW: ["TW"],
            IV: ["IV1", "IV2","LV","RV"],
            LV: ["LV","RV","IV","IV1","IV2"],
            RV: ["RV","IV","LV","IV1","IV2"],
            ZM: ["ZM1", "ZM2", "ZDM"],
            ZDM: ["DZM", "ZM1", "ZM2","ZDM","ZM"],
            OM: ["ZM1", "ZM2", "ZDM"],
            ST: ["ST","LF","RF"],
            LF: ["LF","ST","RF"],
            RF: ["RF","LF","ST"],
        };

        const allowedPositions = validPositions[droppedPlayer.position] || [];
        if (!allowedPositions.includes(position)) return;

        setField(prev => {
            const newField = {...prev};
            const oldPlayer = newField[position]; // Der Spieler, der aktuell auf der Position steht
            newField[position] = droppedPlayer; // Der neue Spieler, der abgelegt wurde

            // Tausche die Positionen der beiden Spieler
            if (oldPlayer) {
                newField[oldPlayer.positionInLineup] = oldPlayer;
            }

            setAssignedPlayers(prevAssigned => {
                const updated = new Set(prevAssigned);
                updated.add(droppedPlayer.short);
                if (oldPlayer) updated.delete(oldPlayer.short);
                return updated;
            });

            return newField;
        });

        setHighlighted(prev => ({ ...prev, [position]: true }));
        setTimeout(() => {
            setHighlighted(prev => ({ ...prev, [position]: false }));
        }, 1000);
    };


    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const getSelectedPlayerCount = () => {
        return Object.values(field).filter(p => p !== null).length;
    };

    const getTotalRating = () => {
        return Object.values(field).reduce((sum, p) => sum + (p?.rating || 0), 0);
    };

    const getTotalValue = () => {
        const total = Object.values(field).reduce((sum, p) => {
            if (!p?.value) return sum;
            const num = parseFloat(p.value.replace(/[^0-9.]/g, ""));
            return sum + num;
        }, 0);
        return `€${total.toFixed(1)}M`;
    };

    const generateRandomLineup = () => {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        const newField: Record<string, any> = {};
        const usedShorts = new Set<string>();

        fieldPositions.forEach(pos => {
            const match = shuffled.find(p => {
                const validPositions: { [key: string]: string[] } = {
                    TW: ["TW"],
                    IV: ["IV1", "IV2","LV","RV"],
                    LV: ["LV","RV","IV","IV1","IV2"],
                    RV: ["RV","IV","LV","IV1","IV2"],
                    ZM: ["ZM1", "ZM2", "ZDM"],
                    ZDM: ["DZM", "ZM1", "ZM2","ZDM","ZM"],
                    OM: ["ZM1", "ZM2", "ZDM"],
                    ST: ["ST","LF","RF"],
                    LF: ["LF","ST","RF"],
                    RF: ["RF","LF","ST"],
                };
                return !usedShorts.has(p.short) &&
                    (validPositions[p.position]?.includes(pos) ?? false);
            });

            newField[pos] = match || null;
            if (match) usedShorts.add(match.short);
        });

        setField(newField);
        setAssignedPlayers(usedShorts);
    };

    const handleSaveLineup = async () => {
        const lineup = fieldPositions.map(pos => field[pos]?.playerId).filter(id => id !== undefined);

        if (lineup.length !== 11) {
            setErrorMessage("Bitte stelle 11 Spieler auf!");
            setShowErrorModal(true);
            return;
        }

        try {
            const url = `http://localhost:8080/trainerCareerPlayer/changeStartElevenPlayers?username=${encodeURIComponent(username)}&careername=${encodeURIComponent(careername)}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: lineup }),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorText = "Unknown error";

                if (contentType && contentType.includes("application/json")) {
                    const errorJson = await response.json();
                    errorText = errorJson.message || JSON.stringify(errorJson);
                } else {
                    errorText = await response.text();
                }

                throw new Error(errorText);
            }

            setErrorMessage("Aufstellung erfolgreich gespeichert!");
            setShowErrorModal(true);
        } catch (error) {
            setErrorMessage('Fehler beim Speichern: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
            setShowErrorModal(true);
        }
    };




    const handleRemoveAllPlayers = () => {
        setField(prev => {
            const newField = { ...prev };
            // Alle Positionen auf null setzen, um alle Spieler zu entfernen
            fieldPositions.forEach(position => {
                newField[position] = null;
            });

            setAssignedPlayers(new Set()); // Leere die Liste der zugewiesenen Spieler
            return newField;
        });
        // Keine Fehlermeldung und kein Modal für diese Funktion
    };



    const handleRemovePlayer = (position: string) => {
        setField(prev => {
            const newField = { ...prev };
            newField[position] = null; // Entferne den Spieler, indem du die Position auf `null` setzt

            setAssignedPlayers(prevAssigned => {
                const updated = new Set(prevAssigned);
                const player = prev[position];
                if (player) updated.delete(player.short); // Entferne den Spieler aus der Liste der zugewiesenen Spieler
                return updated;
            });

            return newField;
        });

        // Entferne den "Remove"-Modus nach dem Entfernen des Spielers
        setRemovePlayerPosition(null);
    };






    const handlePlayerClick = (position: string) => {
        // Toggle für das rote Kreuz - wenn bereits angezeigt, dann entfernen
        setRemovePlayerPosition(prevPosition => (prevPosition === position ? null : position));
    };




    return (
        <div className="teambuild-container">
            <div className="club-header">
                <img src={clubLogo} alt={clubName} className="club-logo" />
                <h2>{clubName}</h2>
            </div>

            <div className="team-info">
                <p>Spieler: <strong>{getSelectedPlayerCount()}</strong> / {fieldPositions.length}</p>
                <p>Gesamt-Rating: <strong>{getTotalRating()}</strong></p>
                <p>Gesamt-Marktwert: <strong>{getTotalValue()}</strong></p>
                <Button style={{ background: teamColors[0] }} onClick={generateRandomLineup}>Zufällige Aufstellung</Button>
                <Button style={{ background: teamColors[0] }} onClick={handleSaveLineup}>Aufstellung speichern</Button>


                {/* Neuer Button zum Entfernen aller Spieler */}
                <Button style={{ background: teamColors[0] }} onClick={handleRemoveAllPlayers}>Alle Spieler entfernen</Button>


            </div>

            <div className="teambuild-content">
                <div className="team-field-container">
                    <div className="team-field">
                        <div className="field-lines">
                            <div className="half-line"></div>
                            <div className="center-circle"></div>
                            <div className="goal-area top"></div>
                            <div className="goal-area bottom"></div>
                            <div className="penalty-box top"></div>
                            <div className="penalty-box bottom"></div>
                        </div>

                        {Object.keys(field).map((position, index) => {
                            const player = field[position];
                            const isRemoveMode = removePlayerPosition === position; // Prüfen, ob der Spieler im "Remove"-Modus ist

                            return (
                                <div
                                    key={index}
                                    className={`player ${position} ${highlighted[position] ? "highlight" : ""} ${player ? "occupied" : ""}`}
                                    onDrop={(event) => handleDrop(event, position)}
                                    onDragOver={handleDragOver}
                                    title={player ? `${player.firstname} ${player.lastname}` : position}
                                    onClick={() => handlePlayerClick(position)}
                                >
                                    {player ? (
                                        <>
                                            {isRemoveMode ? (
                                                <span
                                                    className="remove-player"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemovePlayer(position);
                                                    }}
                                                >
                    ❌
                </span>
                                            ) : (
                                                <div className="shirt-icon">
                                                    <FontAwesomeIcon icon={faShirt} className="shirt-icon-image" />
                                                    <span className="shirt-icon-text">{player.short}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="shirt-icon">
                                            <FontAwesomeIcon icon={faShirt} className="shirt-icon-image" />
                                            <span className="shirt-icon-text">{position}</span> {/* Position anzeigen, falls kein Spieler */}
                                        </div>
                                    )}
                                </div>


                            );
                        })}



                    </div>
                </div>

                <div className="player-list">
                    <h2>Spielerliste</h2>

                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ marginRight: "10px" }}>Position filtern:</label>
                        <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                            <option value="Alle">Alle</option>
                            <option value="TW">TW</option>
                            <option value="LV">LV</option>
                            <option value="RV">RV</option>
                            <option value="IV">IV</option>
                            <option value="ZM">ZM</option>
                            <option value="ZDM">ZDM</option>
                            <option value="OM">OM</option>
                            <option value="LF">LF</option>
                            <option value="RF">RF</option>
                            <option value="ST">ST</option>
                        </select>
                    </div>

                    <div className="scroll-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Short</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Position</th>
                                <th>Alter</th>
                                <th>Wert</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players
                                .filter(p => selectedPosition === "Alle" || p.position === selectedPosition)
                                .map((p, idx) => {
                                    const isAssigned = assignedPlayers.has(p.short);
                                    return (
                                        <tr
                                            key={idx}
                                            className={isAssigned ? "assigned-row" : ""}
                                            draggable={!isAssigned}
                                            onDragStart={(event) => !isAssigned && handleDragStart(event, p)}
                                            style={{
                                                opacity: isAssigned ? 0.5 : 1,
                                                cursor: isAssigned ? "not-allowed" : "grab",
                                            }}
                                        >
                                            <td>{p.rating}</td>
                                            <td>{p.short}</td>
                                            <td>{p.firstname}</td>
                                            <td>{p.lastname}</td>
                                            <td>{p.position}</td>
                                            <td>{p.age}</td>
                                            <td>{p.value}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>



            </div>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Schließen
                    </Button>
                </Modal.Footer>
            </Modal>



        </div>
    );
};

export default TeamBuild;

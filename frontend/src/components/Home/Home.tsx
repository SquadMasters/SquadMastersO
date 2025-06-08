import {useEffect, useState} from "react";
import api from "../../api";
import {Card, Carousel, Col, Container, ListGroup, Row, Table} from "react-bootstrap";
import "./Home.css";

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
    'Arsenal': ['#9B1B30', '#FFFFFF'],
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

interface TableDataDTO {
    clubname: string;
    wins: number;
    draws: number;
    losses: number;
    goalDiff: number;
}

interface NextGameDTO {
    opponentTeamName: string;
    gameDate: string;
}

interface TransferPlayerDTO {
    firstname: string;
    lastname: string;
    valueNow: number;
    oldClubname: string;
    newClubname: string;
}


const Home = () => {
    const [tableData, setTableData] = useState<TableDataDTO[]>([]);
    const [userClubName, setUserClubName] = useState('');
    const [nextGame, setNextGame] = useState<NextGameDTO | null>(null);
    const [homepageInfo, setHomepageInfo] = useState<{
        clubname: string;
        firstname: string;
        lastname: string;
        username: string;
        season: number;
        leagueTitleCount: number;
    } | null>(null);
    const [teamColors, setTeamColors] = useState<string[]>(['#ffffff', '#ffffff']);
    const [recentTransfers, setRecentTransfers] = useState<TransferPlayerDTO[]>([]);


    useEffect(() => {
        const careerName = localStorage.getItem("careername");
        if (!careerName) return;

        api.get(`/trainerCareer/tableDataByCareer/${careerName}`)
            .then(res => {
                setTableData(res.data);
            })
            .catch(err => {
                console.error("Fehler beim Laden der Tabelle:", err);
            });


        const career = JSON.parse(localStorage.getItem("career") || "{}");
        if (career?.team?.name) {
            setUserClubName(career.team.name);
            setTeamColors(teamColorMap[career.team.name] || ['#ffffff', '#ffffff']);
        }


        const username = localStorage.getItem("username") || "";
        if (username && careerName) {
            api.get(`/games/nextGame/${username}/${careerName}`)
                .then(res => {
                    if (res.data) {
                        const nextGameData = res.data;
                        const opponentTeamName = nextGameData.homeTeam === userClubName ? nextGameData.awayTeam : nextGameData.homeTeam;
                        setNextGame({
                            opponentTeamName,
                            gameDate: nextGameData.date
                        });
                    }
                })
                .catch(err => {
                    console.error("Fehler beim Laden des nächsten Spiels:", err);
                });
        }

        api.get(`/trainerCareer/homepageInfo/${username}/${careerName}`)
            .then(async res => {
                setHomepageInfo(res.data);


                if (res.data.season > 2025) {
                    const transfersRes = await api.get(`/trainerCareerPlayer/allPlayersFromCareerWithTransfer`, {
                        params: {careername: careerName}
                    });

                    setRecentTransfers(transfersRes.data);
                }
            })
            .catch(err => {
                console.error("Fehler beim Laden der Homepage-Daten:", err);
            });

    }, [userClubName]);


    const activeLinkStyle = {
        color: '#fff',
        background: `linear-gradient(135deg, ${teamColors[0]} 0%, ${teamColors[1]} 100%)`,
        boxShadow: `0px 0px 12px ${teamColors[0]}`,
    };

    return (
        <Container className="home">
            <Row>
                <Col sm={9} style={{paddingLeft: "0"}}>
                    <Row>
                        <Col sm={5}>
                            <h2 className="home-blue_color" style={{color: teamColors[0]}}>{userClubName}</h2>
                            <img
                                src={logoMap[userClubName]}
                                alt={userClubName}
                                className="team-logo"
                            />
                        </Col>
                        <Col sm={2} style={{paddingTop: "180px"}}>
                            <h5 className="home-next-match-text" style={{color: teamColors[0]}}>Next Match</h5>
                            <h1 className="display-4 home-next-match-vs" style={{color: teamColors[0]}}>VS</h1>
                            <h3 className="home-next-match-date" style={{color: teamColors[0]}}>
                                {nextGame?.gameDate || "Datum nicht verfügbar"}
                            </h3>
                        </Col>
                        <Col sm={5} style={{borderColor: teamColors[0]}}>
                            <h2 className="home-blue_color"
                                style={{color: teamColors[0]}}>{nextGame?.opponentTeamName || "Kein Gegner"}</h2>
                            {nextGame?.opponentTeamName && logoMap[nextGame.opponentTeamName] ? (
                                <img
                                    src={logoMap[nextGame.opponentTeamName]}
                                    alt={nextGame.opponentTeamName}
                                    className="team-logo"
                                />
                            ) : (
                                <p className="text-muted">Kein Gegner-Logo verfügbar</p>
                            )}
                        </Col>
                    </Row>

                    <Row style={{paddingTop: "100px"}}>
                        <Col sm={6}>
                            <Card className="home-trainer-card" style={activeLinkStyle}>
                                <Card.Img
                                    variant="top"
                                    src="src/components/navbarleft/pictures/mannlich.png"
                                    className="profile-img"
                                />
                                <Card.Body>
                                    <Card.Title>
                                        {homepageInfo ? `${homepageInfo.firstname} ${homepageInfo.lastname}` : "Trainername..."}
                                    </Card.Title>
                                    <Card.Text>
                                        Benutzer: <strong>{homepageInfo?.username || "..."}</strong>
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>
                                        Verein: <strong>{homepageInfo?.clubname || "..."}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Saison: <strong>{homepageInfo?.season || "..."}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Titel: <strong>{homepageInfo?.leagueTitleCount || 0}</strong>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <h1 className="home-blue_color" style={{color: teamColors[0]}}>Top-Transfers</h1>

                            {(homepageInfo?.season || 0) <= 2025 ? (
                                <Carousel className="home-carousel">
                                    <Carousel.Item>
                                        <img
                                            src={"src/components/Home/hometest/bellingham.png"}
                                            height={"200px"}
                                            width={"400px"}
                                            alt="Jude Bellingham"
                                        />
                                        <Carousel.Caption className="home-carousel-caption">
                                            <h3 style={{color: "white"}}>Jude Bellingham</h3>
                                            <p>From Dortmund to Real Madrid</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={"src/components/Home/hometest/mbappe.png"}
                                            height={"200px"}
                                            width={"400px"}
                                            alt="Kylian Mbappe"
                                        />
                                        <Carousel.Caption className="home-carousel-caption">
                                            <h3 style={{color: "white"}}>Kylian Mbappe</h3>
                                            <p>From PSG to Real Madrid</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={"src/components/Home/hometest/pogba.png"}
                                            height={"200px"}
                                            width={"400px"}
                                            alt="Paul Pogba"
                                        />
                                        <Carousel.Caption className="home-carousel-caption">
                                            <h3 style={{color: "white"}}>Paul Pogba</h3>
                                            <p>From Juventus to Manchester United</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                </Carousel>
                            ) : (
                                <div className="transfer-list-container">
                                    <ul className="transfer-list">
                                        {[...recentTransfers]
                                            .sort((a, b) => b.valueNow - a.valueNow)
                                            .slice(0, 5)
                                            .map((t, idx) => (
                                                <li key={idx} className="transfer-list-item styled-transfer">
                                                    <span className="transfer-rank">#{idx + 1}</span>
                                                    <div className="transfer-info">
                                                        <span
                                                            className="transfer-name"><strong>{t.firstname} {t.lastname}</strong></span>
                                                        <span className="transfer-clubs">
                      <em style={{color: "red"}}>{t.oldClubname}</em> → <em
                                                            style={{color: "green"}}>{t.newClubname}</em>
                    </span>
                                                    </div>
                                                    <span className="transfer-value">
                    {(t.valueNow / 1_000_000).toFixed(1)} M €
                  </span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </Col>

                    </Row>

                </Col>

                <Col sm={3}>
                    <Table striped className="home-table">
                        <thead>
                        <tr>
                            <th style={{textAlign: "center"}}>Place</th>
                            <th style={{textAlign: "center"}}>Club</th>
                            <th style={{textAlign: "center"}}>Logo</th>
                            <th style={{textAlign: "center"}}>Games</th>
                            <th style={{textAlign: "center"}}>Win</th>
                            <th style={{textAlign: "center"}}>Lost</th>
                            <th style={{textAlign: "center"}}>Draw</th>
                            <th style={{textAlign: "center"}}>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...tableData]
                            .sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws))
                            .map((team, index) => {
                                const games = team.wins + team.draws + team.losses;
                                const points = team.wins * 3 + team.draws;

                                return (
                                    <tr key={index}>
                                        <td style={{textAlign: "center"}}>{index + 1}</td>
                                        <td style={{textAlign: "center"}}>{team.clubname}</td>
                                        <td style={{textAlign: "center"}}>
                                            <div className="table-logo-wrapper">
                                                <img
                                                    src={logoMap[team.clubname] || ''}
                                                    alt={team.clubname}
                                                    height="20px"
                                                    width="20px"
                                                />
                                            </div>
                                        </td>
                                        <td style={{textAlign: "center"}}>{games}</td>
                                        <td style={{textAlign: "center"}}>{team.wins}</td>
                                        <td style={{textAlign: "center"}}>{team.losses}</td>
                                        <td style={{textAlign: "center"}}>{team.draws}</td>
                                        <td style={{textAlign: "center"}}>{points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );

};

export default Home;

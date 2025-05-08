import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Carousel, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import "./Home.css";

// Logo-Imports
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

interface TableDataDTO {
    clubName: string;
    wins: number;
    draws: number;
    losses: number;
    goalDiff: number;
}

const Home = () => {
    const [tableData, setTableData] = useState<TableDataDTO[]>([]);
    const [userClubName, setUserClubName] = useState('');
    const [opponentClubName, setOpponentClubName] = useState('');

    useEffect(() => {
        const careerName = localStorage.getItem("careername");
        if (!careerName) return;

        axios.get(`http://localhost:8080/trainerCareer/tableDataByCareer/${careerName}`)
            .then(res => {
                setTableData(res.data);
            })
            .catch(err => {
                console.error("Fehler beim Laden der Tabelle:", err);
            });

        const career = JSON.parse(localStorage.getItem("career") || "{}");
        if (career?.team?.name) {
            setUserClubName(career.team.name);
        }

        const opponentName = localStorage.getItem("opponentTeamName") || '';
        setOpponentClubName(opponentName);
    }, []);

    return (
        <Container className="home">
            <Row>
                <Col sm={9} style={{ paddingLeft: "0" }}>
                    <Row>
                        <Col sm={5}>
                            <h2 className="home-blue_color">{userClubName}</h2>
                            <img
                                src={logoMap[userClubName] || ''}
                                alt={userClubName}
                                height={"350px"}
                                width={"250px"}
                            />
                        </Col>
                        <Col sm={2} style={{ paddingTop: "180px" }}>
                            <h5 className="home-next-match-text">Next Match</h5>
                            <h1 className="display-4 home-next-match-vs">VS</h1>
                            <h3 className="home-next-match-date">01.01.2025</h3>
                        </Col>
                        <Col sm={5}>
                            <h2 className="home-blue_color">{opponentClubName}</h2>
                            <img
                                src={logoMap[opponentClubName] || ''}
                                alt={opponentClubName}
                                height={"350px"}
                                width={"250px"}
                            />
                        </Col>
                    </Row>

                    <Row style={{ paddingTop: "100px" }}>
                        <Col sm={6}>
                            <Card className="home-trainer-card">
                                <Card.Img
                                    variant="top"
                                    src="src/components/navbarleft/pictures/mannlich.png"
                                    className="profile-img"
                                />
                                <Card.Body>
                                    <Card.Title>Sebastian Hörmann</Card.Title>
                                    <Card.Text>„ka was des für ein text is“</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>{userClubName}</ListGroup.Item>
                                    <ListGroup.Item>1st Place</ListGroup.Item>
                                    <ListGroup.Item>5 Titles</ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Card.Link href="#">Profil ansehen</Card.Link>
                                    <Card.Link href="#">Mehr Infos</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <h1 className="home-blue_color">Top-Transfer</h1>
                            <Carousel className="home-carousel">
                                <Carousel.Item>
                                    <img
                                        src={"src/components/Home/hometest/bellingham.png"}
                                        height={"200px"}
                                        width={"400px"}
                                        alt="Jude Bellingham"
                                    />
                                    <Carousel.Caption className="home-carousel-caption">
                                        <h3>Jude Bellingham</h3>
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
                                        <h3>Kylian Mbappe</h3>
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
                                        <h3>Paul Pogba</h3>
                                        <p>From Juventus to Manchester United</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                    </Row>
                </Col>

                <Col sm={3}>
                    <Table striped className="home-table">
                        <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>Place</th>
                            <th style={{ textAlign: "center" }}>Club</th>
                            <th style={{ textAlign: "center" }}>Logo</th>
                            <th style={{ textAlign: "center" }}>Games</th>
                            <th style={{ textAlign: "center" }}>Win</th>
                            <th style={{ textAlign: "center" }}>Lost</th>
                            <th style={{ textAlign: "center" }}>Draw</th>
                            <th style={{ textAlign: "center" }}>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((team, index) => {
                            const games = team.wins + team.draws + team.losses;
                            const points = team.wins * 3 + team.draws;

                            return (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td style={{ textAlign: "center" }}>{team.clubName}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <img
                                            src={logoMap[team.clubName] || ''}
                                            alt={team.clubName}
                                            height="20px"
                                            width="20px"
                                        />
                                    </td>
                                    <td style={{ textAlign: "center" }}>{games}</td>
                                    <td style={{ textAlign: "center" }}>{team.wins}</td>
                                    <td style={{ textAlign: "center" }}>{team.losses}</td>
                                    <td style={{ textAlign: "center" }}>{team.draws}</td>
                                    <td style={{ textAlign: "center" }}>{points}</td>
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

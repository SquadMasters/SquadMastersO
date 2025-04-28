import Nav from 'react-bootstrap/Nav';
import {NavLink, useLocation} from 'react-router-dom';
import './NavbarLeft.css';

function NavbarLeft() {
    const location = useLocation();

    return (
        <div
            style={{
                width: '150px',
                borderRight: '1px solid #ccc',
                minHeight: '500px',
                position: 'fixed',
                left: 5,
                top: 5,


                height: '100vh',

            }}
        >
            <Nav
                variant="tabs"
                activeKey={location.pathname}
                className="justify-content-start flex-column"
                style={{height: '100%'}}
            >
                <Nav.Item className="mb-3">
                    <Nav.Link as={NavLink} to="/home" eventKey="/home">
                        <img src={"src/components/navbarleft/pictures/haus.png"} alt={"haus"} width={"50px"}
                             height={"50px"}/>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link as={NavLink} to="/team_builder" eventKey="/team_builder">
                        <img src={"src/components/navbarleft/pictures/feld.png"} alt={"feld"} width={"50px"}
                             height={"50px"}/>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link as={NavLink} to="/market" eventKey="/market">
                        <img src={"src/components/navbarleft/pictures/money-management.png"} alt={"geld"} width={"50px"}
                             height={"50px"}/>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link as={NavLink} to="/simulation" eventKey="/simulation">
                        <img src={"src/components/navbarleft/pictures/goldener-pokal.png"} alt={"pokal"} width={"50px"}
                             height={"50px"}/>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mt-auto" style={{paddingBottom:"20px"}}>
                    <Nav.Link as={NavLink} to="/account" eventKey="/account">
                        <img src={"src/components/navbarleft/pictures/mannlich.png"} alt={"user"} width={"50px"}
                             height={"50px"}/>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}

export default NavbarLeft;

import {Route, Routes, BrowserRouter, useLocation} from 'react-router-dom';

import './App.css';
import NavbarLeft from "./components/navbarleft/NavbarLeft";
import Home from "./components/Home/Home";
import Transfermarkt from "./components/Transfermarkt/Transfermarkt";
import TeamBuild from "./components/TeamBuild/TeamBuild";
import Simulation from "./components/Simulation/Simulation";
import Login from "./components/Login/Login";
import Karriereauswahl from "./components/Karriereauswahl/Karriereauswahl";
import Registrieren from "./components/Registrieren/Registrieren.tsx";
import Account from "./components/account/Account.tsx";
import KarriereErstellen from "./components/karriereerstellen/KarriereErstellen.tsx";
import {useEffect} from "react";
import KarriereBeitreten from "./components/KarriereBeitreten/KarriereBeitreten.tsx";

function AppContent() {

    useEffect(() => {
        localStorage.clear();
    }, []);

    const location = useLocation();


    const hideNavbarRoutes = ['/','/karriereauswahl','/registrieren','/karriereerstellen'];

    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <NavbarLeft />}
            <Routes>
                <Route path="/karriereauswahl" element={<Karriereauswahl />} />
                <Route path="/home" element={<Home />} />
                <Route path="/market" element={<Transfermarkt />} />
                <Route path="/team_builder" element={<TeamBuild />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/" element={<Login />} />
                <Route path={"/registrieren"} element={<Registrieren/>}/>
                <Route path={"/account"} element={<Account/>}/>
                <Route path={"/karriereerstellen"} element={<KarriereErstellen/>}/>
                <Route path={"/karrierebeitreten"} element={<KarriereBeitreten/>}/>
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;

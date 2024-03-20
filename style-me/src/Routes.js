import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengesLayout from './layouts/ChallengesLayout';
import AutenticationLayout from './layouts/AutenticationLayout';
import ProfileLayout from './layouts/ProfileLayout';
import RankingLayout from './layouts/RankingLayout';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<AutenticationLayout />} />
                <Route path="/challenges" element={<ChallengesLayout />} />
                <Route path="/profile" element={<ProfileLayout />} />
                <Route path="/ranking" element={<RankingLayout />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

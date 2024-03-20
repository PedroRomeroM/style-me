import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengesLayout from './layouts/ChallengesLayout';
import AutenticationLayout from './layouts/AutenticationLayout';
import ProfileLayout from './layouts/ProfileLayout';
import RankingLayout from './layouts/RankingLayout';
import PasswordRecoverLayout from './layouts/PasswordRecoverLayout';
import PasswordRecoverConfirmationLayout from './layouts/PasswordRecoverConfirmationLayout';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<AutenticationLayout />} />
                <Route path="/challenges" element={<ChallengesLayout />} />
                <Route path="/profile" element={<ProfileLayout />} />
                <Route path="/ranking" element={<RankingLayout />} />
                <Route path="/recover-password" element={<PasswordRecoverLayout />} />
                <Route path="/recover-password-confirmation" element={<PasswordRecoverConfirmationLayout />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

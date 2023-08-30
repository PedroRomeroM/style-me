import './Challenges.scss';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';

const ChallengesLayout = () => {
    return (
        <div className='Challenges'>
            <Header/>
            <ChallengeCard/>
        </div>
    )
}

export default ChallengesLayout;
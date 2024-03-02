import './Challenges.scss';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';

const ChallengesLayout = () => {

    const challenges = 6;

    const generateCards = (count, color) => {
        const cards = [];
        for (let i = 0; i < count; i++) {
            cards.push(<ChallengeCard key={i} color={color} />);
        }
        return cards;
    };

    return (
        <div className='Challenges'>
            <Header/>
            <div className='ChallengesContainer'>
                <div className='Easy'>
                    <ChallengeHeader color="green" difficulty="Fácil"/>
                    {generateCards(challenges, 'green')}
                </div>
                <div className='Medium'>
                    <ChallengeHeader color="yellow" difficulty="Médio"/>
                    {generateCards(challenges, 'yellow')}
                </div>
                <div className='Hard'>
                    <ChallengeHeader color="red" difficulty="Difícil"/>
                    {generateCards(challenges, 'red')}
                </div>
            </div>
            <footer></footer>
        </div>
    )
}

export default ChallengesLayout;
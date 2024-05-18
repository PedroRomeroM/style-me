import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import './Challenges.scss';

const ChallengesLayout = () => {
    const initialChallenges = new Array(16).fill().map((_, index) => ({ id: index }));
    const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');

    const renderChallenges = (difficulty) => {
        return (
            <div className="ChallengeList">
                {initialChallenges.map(challenge => (
                    <ChallengeCard key={challenge.id} color={difficulty} />
                ))}
            </div>
        );
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    return (
        <div className='Challenges'>
            <Header />
            <div className='ChallengesContainer'>
                <div className={selectedDifficulty === 'Fácil' ? 'Fácil' : selectedDifficulty === 'Médio' ? 'Médio' : 'Difícil'}>
                    <ChallengeHeader
                        color={selectedDifficulty === 'Fácil' ? 'green' : selectedDifficulty === 'Médio' ? 'yellow' : 'red'}
                        difficulty={`Nível ${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}`}
                        selectedDifficulty={selectedDifficulty}
                        onSelectDifficulty={handleDifficultyChange}
                    />
                    {selectedDifficulty === 'Fácil' && renderChallenges('green')}
                    {selectedDifficulty === 'Médio' && renderChallenges('yellow')}
                    {selectedDifficulty === 'Difícil' && renderChallenges('red')}
                </div>
            </div>
            <footer></footer>
        </div>
    );
};

export default ChallengesLayout;

import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import './Challenges.scss';
import { getUserInfo } from "../../services/ApiServices";

const ChallengesLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */}
    const initialChallenges = new Array(16).fill().map((_, index) => ({ id: index }));
    const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');
    const [easyPage, setEasyPage] = useState(0);
    const [mediumPage, setMediumPage] = useState(0);
    const [hardPage, setHardPage] = useState(0);
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState();
    
    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();   
    const [totalScore, setTotalScore] = useState();

    const challengesPerPage = 3;

    const handleNext = (difficulty, direction) => {
        switch (difficulty) {
            case 'easy':
                if (direction === 'next') {
                    setEasyPage(prevPage => prevPage + 1);
                } else {
                    setEasyPage(prevPage => prevPage - 1);
                }
                break;
            case 'medium':
                if (direction === 'next') {
                    setMediumPage(prevPage => prevPage + 1);
                } else {
                    setMediumPage(prevPage => prevPage - 1);
                }
                break;
            case 'hard':
                if (direction === 'next') {
                    setHardPage(prevPage => prevPage + 1);
                } else {
                    setHardPage(prevPage => prevPage - 1);
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token
        getUsersInfo(token)
    }, [profile]);

    function getUsersInfo(token) {
        const profile = getUserInfo(token);
        profile.then(res => {

            setUsername(res.data.username)
            setimgType(res.data.imgType)
            setImg(res.data.img)

            if (res.data.totalScore === null) {
                setTotalScore(0);
            } else {
                setTotalScore(res.data.totalScore)
            }

          }).catch(e => {
            console.log(e)
        });
    };

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
            <Header username={username} img={img} imgType={imgType} totalScore={totalScore}/>
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

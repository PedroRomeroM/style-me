import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import './Challenges.scss';
import { getUserInfo, getChallenges, getTypeUser } from "../../services/ApiServices";

const ChallengesLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */}
    const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');
    const [username, setUsername] = useState();
    const [initialChallenges, setInitialChallenges] = useState();
    const [profile, setProfile] = useState(null);

    const [tipoUser, setTipoUser] = useState();

    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();   
    const [totalScore, setTotalScore] = useState();
    const [isAdmin, setIsAdmin] = useState();

    useEffect(() => {
        renderChallenges('green')
    }, [initialChallenges])

    useEffect(() => {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token
        getUsersInfo(token)
        getTipoUser(token)

        const challenges = getChallenges(token)
        challenges.then(res => {
             setInitialChallenges(res);
        }).catch (e => {
            console.log(e)
        })

        
    }, [profile]);
 
    function getTipoUser (token) {
        const response = getTypeUser(token);
        response.then(res => {
            if (res.data != 'ADM') {
                setIsAdmin('false')
            } else {
                setIsAdmin('true')
            }
        }).catch (e => {
            console.log(e)
        })
    }

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
        if (initialChallenges != null) {
            return (
                <div className="ChallengeList">
                    {
                        initialChallenges
                        .filter(done => done.done == false)
                        .filter(level => {
                            if (difficulty === 'green') {
                                return level.level === 1
                            }else if (difficulty === 'yellow'){
                                return level.level === 2
                            }else{
                                return level.level === 3
                            }
                        })
                        .map(challenge => (
                            <ChallengeCard key={challenge.id} id={challenge.id} color={difficulty} title={challenge.title} description={challenge.description} isAdmin={isAdmin}/>
                        ))    
                    }
                </div>
            );
        }        
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    return (
        <div className='Challenges'>
            <Header username={username} img={img} imgType={imgType} totalScore={totalScore} isAdmin={isAdmin}/>
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

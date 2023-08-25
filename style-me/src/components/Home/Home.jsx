import './Home.scss';

const Home = () => {
    return (
        <>
            <div className="MainContainer">
                <div className="LoginContainer">
                    <div className='LeftContainer'>
                        <div className="LoginSection">
                        <img src="./images/logo.svg" alt="logo image" />
                        <div className='separador'></div>
                        <div className='inputSection'>
                            <input type="text" placeholder='Usuário'/>
                            <input type="text" placeholder='Senha'/>
                            <input type="submit" placeholder='Submit'/>
                            <p>Esqueceu a senha?</p>
                        </div>

                        </div>
                    </div>
                    <div className='rightContainer'>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;
import './Autentication.scss';
import Login from '../../components/Autentication/AutenticationComponent';
import Header from '../../components/Header/Header';

const AutenticationLayout = () => {
    return (
        <div className='AutenticationLayout'>
            <Header/>
            <Login/>
        </div>
    )
}

export default AutenticationLayout;
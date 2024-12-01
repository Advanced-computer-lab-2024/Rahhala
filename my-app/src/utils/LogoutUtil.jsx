import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
        });
        navigate('/login');
    };

    return handleLogout;
};

export default useLogout;
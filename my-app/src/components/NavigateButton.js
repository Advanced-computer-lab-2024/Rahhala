import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateButton = (props) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(props.path);
    };

    return (
        <button
            onClick={handleRedirect}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
            {props.text}
        </button>
    );
};

export default NavigateButton;
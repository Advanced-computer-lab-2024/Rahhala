import React from 'react'
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const NavigateButton = (props) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(props.path); // Replace '/desired-path' with your target path
    };
    return (
        <Button onClick={handleRedirect}>
            {props.text}
        </Button>
    )
}

export default NavigateButton
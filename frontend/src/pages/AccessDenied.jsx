// AccessDenied.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Add this to the top of your AccessDenied.jsx file
const globalStyles = `
    html, body, #root {
        height: 100%;
        margin: 0;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

// Inject the global styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

const AccessDenied = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'white',
        padding: '60px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 1s ease-in-out',
        maxWidth: '500px',
        width: '80%',
    };

    const headingStyle = {
        fontSize: '2.5rem',
        color: '#dc3545',
        marginBottom: '20px',
        animation: 'slideIn 1s ease-in-out',
    };

    const paragraphStyle = {
        fontSize: '1.2rem',
        color: '#6c757d',
        marginBottom: '30px',
    };

    const linkStyle = {
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#007bff',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
    };

    const linkHoverStyle = {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={headingStyle}>Access Denied</h1>
                <p style={paragraphStyle}>You do not have permission to view this page.</p>
                <Link
                    to="/login"
                    style={linkStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor;
                        e.currentTarget.style.transform = linkHoverStyle.transform;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default AccessDenied;
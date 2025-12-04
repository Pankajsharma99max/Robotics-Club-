import React from 'react';

// Minimal test version
function App() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0f',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#00f0ff' }}>
                Robotics Club
            </h1>
            <p style={{ fontSize: '20px', color: '#b000ff' }}>
                Website is loading...
            </p>
            <p style={{ marginTop: '20px', color: '#888' }}>
                If you see this, React is working!
            </p>
        </div>
    );
}

export default App;

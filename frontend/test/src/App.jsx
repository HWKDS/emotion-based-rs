import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from 'react-router-dom';

import ItemsPage from "./ItemsPage";

function App() {
    const [output, setOutput] = useState(null);
    const [customerTranscript, setCustomerTranscript] = useState('');
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');

    const getOutput = async () => {
        try {
            const response = await axios.post('http://localhost:5175/api/output', {
                customer_transcript: customerTranscript,
                question: question
            });
            setOutput(response.data.output);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Done!!!');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getOutput();
    };

    return (
        <Router>
            <div style={styles.appContainer}>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.link}>Home</Link> |{" "}
                    <Link to="/items" style={styles.link}>Results</Link>
                </nav>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div style={styles.contentContainer}>
                                <div style={styles.formContainer}>
                                    <h1 style={styles.header}>Ask a Question</h1>
                                    <form onSubmit={handleSubmit} style={styles.form}>
                                        <label style={styles.label}>Customer Transcript:</label>
                                        <input
                                            type="text"
                                            value={customerTranscript}
                                            onChange={(event) => setCustomerTranscript(event.target.value)}
                                            style={styles.input}
                                        />
                                        <label style={styles.label}>Question:</label>
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(event) => setQuestion(event.target.value)}
                                            style={styles.input}
                                        />
                                        <button type="submit" style={styles.button}>Get Output</button>
                                    </form>
                                    {error && <div style={styles.error}>{error}</div>}
                                    {output && <div style={styles.output}>Output: {output}</div>}
                                </div>
                                <div style={styles.imageContainer}>
                                    <img
                                        src="/public/image.jpg"
                                        alt="Description"
                                        style={styles.image}
                                    />
                                </div>
                            </div>
                        }
                    />
                    <Route path="/items" element={<ItemsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

const styles = {
    appContainer: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        margin: '0',
    },
    nav: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#4CAF50',
        padding: '10px',
        borderRadius: '5px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
    },
    contentContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '20px',
    },
    formContainer: {
        flex: '1',
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        textAlign: 'center',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    label: {
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        marginTop: '20px',
        color: 'red',
    },
    output: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ddd',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
    },
    imageContainer: {
        flex: '1',
        textAlign: 'center',
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
};

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5175/api/items');
                console.log('Data fetched:', response.data); // Log the response
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching items.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return (
            <div style={{ color: 'white', backgroundColor: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'white', backgroundColor: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
            <h1>Items List</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '10px',
                                padding: '10px',
                                border: '1px solid white',
                                borderRadius: '5px',
                                backgroundColor: 'black',
                                color: 'white',
                            }}
                        >
                            <strong>Emotions:</strong> {item?.emotions 
                                ? Array.isArray(item.emotions) 
                                    ? item.emotions.join(', ') 
                                    : item.emotions 
                                : 'N/A'} <br />
                            <strong>Sentiment:</strong> {item?.sentiment || 'N/A'} <br />
                            <strong>Intent:</strong> {item?.intent || 'N/A'} <br />
                            <strong>Location:</strong> {item?.location?.join(', ') || 'N/A'} <br />
                            <strong>Organization:</strong> {item?.organization?.join(', ') || 'N/A'} <br />
                            <strong>People:</strong> {item?.people?.join(', ') || 'N/A'} <br />
                            <strong>Question:</strong> {item?.question || 'N/A'} <br />
                            <strong>Answer:</strong> {item?.answer || 'N/A'} <br />
                            <strong>Rating:</strong> {item?.rating || 'N/A'} <br />
                            <strong>Source:</strong> {item?.source || 'N/A'}
                        </li>
                    ))
                ) : (
                    <p>No items found.</p>
                )}
            </ul>
        </div>
    );
};

export default ItemsPage;

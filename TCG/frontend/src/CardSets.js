import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const CardSets = () => {
  const [sets, retrieveSets] = useState([]);

  useEffect(() => {
    // Fetch pokemon sets data from the server
    const url = 'http://localhost:5000/sets';
    const req = {};
    axios.post(url,req)
      .then(response => retrieveSets(response.data))
      .catch(error => console.error(error));
  }, []);

  //Rendering
  return (
    <div>
      {Object.entries(sets).map(([setName, cards]) => (
        <div key={setName}>
          <h2>Cards Set : {setName}</h2>
          <div className="card-list">
            {cards.map(card => (
              <Card card={card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSets;

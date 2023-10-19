import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const CardSets = () => {
  const [sets, retrieveSets] = useState([]);

  useEffect(() => {
    // Fetch pokemon sets data from the server
    axios.get('http://localhost:5000/sets')
      .then(response => retrieveSets(response.data))
      .catch(error => console.error(error));
  }, []);

  
  console.log(sets);
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

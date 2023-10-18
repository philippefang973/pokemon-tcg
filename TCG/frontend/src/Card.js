import React from 'react';

const Card = ({ card }) => {
  return (
    <div className="card" style={{display: "inline-block"}}>
      <img src={card.images.small} alt={card.name} width="50%" height="50%" class="enlarge"/>
    <h3>{card.name}</h3>
    </div>
  );
};

export default Card;

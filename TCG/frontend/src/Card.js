import React from 'react';

const Card = ({ card, userType, userList, handler }) => {
  return (
    <div className="card" style={{display: "inline-block", padding:"10px"}}>
      <img src={card.images.small} alt={card.name} width="50%" height="50%" class="enlarge"/><br/>
    <b>{card.name}</b><br/>
    {(userType=='Administrator') && (
      <select style={{fontWeight:'bold'}} onChange={handler}>
      <option disbaled hidden>Mint</option>
      <option value={`Test;${card.name}`}>Test</option>
      </select>
      )}
    </div>
  );
};

export default Card;

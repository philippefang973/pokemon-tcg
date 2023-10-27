import React from 'react';

const Card = ({ card, userType, handlerInputText, handlerSubmit , inputText}) => {
  return (
    <div className="card" style={{display: "inline-block", padding:"10px"}}>
      <img src={card.images.small} alt={card.name} width="50%" height="50%" className="enlarge"/><br/>
    <b>{card.name}</b><br/>
    {(userType=='Administrator') && (
      <div>
        <input
          type="text"
          placeholder="User Address"
          id={card.name}
          value={inputText[card.name]}
          onChange={(e) => handlerInputText(card.name,e.target.value)}
        />
      <button onClick={(e) => handlerSubmit(card.name)}><b>Mint</b></button>
      </div>
      )}
    </div>
  );
};

export default Card;

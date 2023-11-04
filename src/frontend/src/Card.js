import React from 'react';

const Card = ({ card, userType, handlerInputText, handlerSubmit , inputText}) => {
  const id = `${card.name};${card.set}`;
  return (
    <div className="card" style={{display: "inline-block", padding:"10px"}}>
      <img src={card.images.small} alt={card.name} width="50%" height="50%" className="enlarge"/><br/>
    <b>{card.name}</b><br/>
    {card.user && (<small><em>{card.user}</em><br/></small>)}
    {(userType=='Administrator') && (
      <div>
        <input
          type="text"
          placeholder="User Address"
          id={id}
          value={inputText[id]}
          onChange={(e) => handlerInputText(id,e.target.value)}
        />
      <button onClick={(e) => handlerSubmit(id)}><b>Mint</b></button>
      </div>
      )}
    </div>
  );
};

export default Card;

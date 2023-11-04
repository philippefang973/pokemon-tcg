import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const CardSets = ({ sets, userType,  handlerInputText, handlerSubmit , inputText}) => {
  //Rendering
  return (
    <div>
      {Object.entries(sets).map(([setName, cards]) => (
        <div key={setName}>
          <h2>Cards Set : {setName}</h2>
          <div className="card-list">
            {cards.map(card => (
              <Card card={card} userType={userType} handlerInputText={handlerInputText} handlerSubmit={handlerSubmit} inputText={inputText}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSets;

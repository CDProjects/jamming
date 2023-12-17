import React from 'react';
import './Track.css';

function Track({ track, onAdd, onRemove, isRemoval }) {
  const addTrack = () => {
    onAdd(track);
  };

  const removeTrack = () => {
    onRemove(track);
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {
        isRemoval 
        ? <button className="Track-action" onClick={removeTrack}>-</button>
        : <button className="Track-action" onClick={addTrack}>+</button>
      }
    </div>
  );
}

export default Track;

import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

function TrackList({ tracks, isRemoval }) {
  return (
    <div className="TrackList">
      {
        tracks.map(track => <Track key={track.id} track={track} isRemoval={isRemoval} />)
      }
    </div>
  );
}

export default TrackList;

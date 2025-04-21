import { React } from 'react'
import './Playlist.css'


function Playlist({ playlistName='Add new album' }) {
  return (
    <div className="playlist">
      <h4>{playlistName}</h4>
    </div>
  )
}

export default Playlist

import { React, useContext } from 'react'
import './Playlist.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFolder } from '@fortawesome/free-solid-svg-icons'
import { PlayerContext } from '../Player/PlayerContext'
import FolderPicker from '../FolderPicker/FolderPicker'


function Playlist({ playlistName='Add new album' }) {
  const { songs, isPlaylistOpen, setIsPlaylistOpen } = useContext(PlayerContext)

  return isPlaylistOpen ? (
    <div className='playlist'>
      <div className='header'>
        <h4 className='album-name folder-name'>{playlistName}</h4>
        <FontAwesomeIcon 
          className='close-playlist-button' 
          icon={faXmark} 
          onClick={() => setIsPlaylistOpen(false)} 
        />
      </div>

      <div className='playlist-songs'>
        {/* <div className='playlist-song'>
          <div className='playlist-song-number center'>01</div>
          <div className='playlist-song-cover center'>
            <img src='src\assets\TTPD\cover.jpg' />
          </div>
          <div className='playlist-song-name'>Fortnight</div>
          <div className='playlist-song-duration center'>1:00</div>
        </div> */}
      </div>

      <FolderPicker />
    </div>
  ) : null
}

export default Playlist

import { useState } from 'react'
import Player from './components/Player/Player.jsx'
import Playlist from './components/Playlist/Playlist.jsx'
import { PlayerContext } from './components/Player/PlayerContext.js'
import songs from './assets/songs'


function App() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
  const [files, setFiles] = useState([])

  return (
    <PlayerContext.Provider value={{ 
        songs, 
        files, 
        setFiles, 
        isPlaylistOpen, 
        setIsPlaylistOpen 
      }}>
      <div className='container'>
        <Player />
        <Playlist />
      </div>
    </PlayerContext.Provider>
  )
}

export default App

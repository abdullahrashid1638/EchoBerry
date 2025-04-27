import { useState, useEffect } from 'react'
import Player from './components/Player/Player.jsx'
import Playlist from './components/Playlist/Playlist.jsx'
import { PlayerContext } from './components/Player/PlayerContext.js'
import Song from './components/classes/songClass.js'
import './app.css'


function App() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true)
  const [files, setFiles] = useState([])
  const [songsUploaded, setSongsUploaded] = useState(false)
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)

  if (!currentSong && !songs) setIsPlaylistOpen(true)

  // useEffect(() => {
  //   setCurrentSong(new Song({
  //     index: 0,
  //     name: 'Fortnight',
  //     coverImage: 'src/assets/TTPD/cover.jpg',
  //     artist: 'Taylor Swift',
  //     path: 'src/assets/TTPD/06. But Daddy I Love Him.flac'
  //   }))
  // }, [])

  return (
    <PlayerContext.Provider value={{ 
        songs, 
        setSongs,
        files, 
        setFiles, 
        isPlaylistOpen, 
        setIsPlaylistOpen,
        songsUploaded,
        setSongsUploaded,
        currentSong,
        setCurrentSong
      }}>
      <div className='container'>
        {currentSong && <Player />}
        {
        !currentSong && !isPlaylistOpen && 
          <button 
          className='add-button' onClick={() => setIsPlaylistOpen(true)}>Add
          </button>
        }
        <Playlist />
      </div>
    </PlayerContext.Provider>
  )
}

export default App

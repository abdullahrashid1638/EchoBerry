import { useState } from 'react'
import Player from './components/Player/Player.jsx'
import Playlist from './components/Playlist/Playlist.jsx'


function App() {

  return (
    <div className='container'>
      <Player />
      <Playlist />
    </div>
  )
}

export default App

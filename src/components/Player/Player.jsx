import { React, useEffect, useState, useRef, useMemo, useContext } from 'react'
import { PlayerContext } from './PlayerContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faShuffle,
  faListUl,
  faRepeat
} from '@fortawesome/free-solid-svg-icons'
import './Player.css'


function ProgressBar({ seek, setSeek, progress }) {
  const barRef = useRef(null)

  const handleInput = (e) => {
    const val = Number(e.target.value)
    setSeek(val)
    const bar = e.target
    const percentage = (val / bar.max) * 100
    gradient(percentage)
  }

  const gradient = (val) => {
    if (barRef.current) {
      barRef.current.style.background = `linear-gradient(to right, black ${val}%, gray ${val}%)`
    }
  }

  useEffect(() => {
    setSeek(progress)
    gradient(progress)
  }, [progress])

  return (
    <div className="progress-bar">
      <input
        ref={barRef}
        type="range"
        value={seek}
        max="100"
        onInput={handleInput}
        onChange={(e) => setSeek(e.target.value)}
      />
    </div>
  )
}

function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [seek, setSeek] = useState(0)
  const [loop, setLoop] = useState(false)

  const { 
    songs, 
    isPlaylistOpen, 
    setIsPlaylistOpen,
    currentSong,
    setCurrentSong,
  } = useContext(PlayerContext)

  const songIdRef = useRef(null)
  const playlistButtonRef = useRef(null)

  useEffect(() => {
    if (!currentSong) return
    currentSong.loadHowl()
    setProgress(0)
    const id = currentSong.howl.play()
    songIdRef.current = id
    return () => {
      currentSong.unloadHowl()
    }
  }, [currentSong])


  useEffect(() => {
    if (!currentSong.duration) return

    let intervalId
    if (isPlaying) {
      intervalId = setInterval(() => {
        const secondsPassed = currentSong.howl.seek()
        const percentage = (secondsPassed / currentSong.duration) * 100
        setProgress(percentage)
      }, 500)
    }

    return () => clearInterval(intervalId)
  }, [isPlaying, currentSong])


  // seek the song if the value of the seek state changes
  useEffect(() => {
    const seconds = (seek / 100) * currentSong.duration
    currentSong.howl.seek(seconds)
  }, [seek])


  // Handle isPlaying state
  useEffect(() => {
    const song = currentSong
    if (!song) return

    if (isPlaying) {
      const id = currentSong.howl.play()
      songIdRef.current = id
    } else {
      currentSong.howl.pause(songIdRef.current)
    }
  }, [isPlaying])


  // Handle spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault() // avoid scrolling
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])


  // Button controls
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev)
  }


  useEffect(() => {
    const playlistButton = playlistButtonRef.current
    if (!playlistButton) return
    const handleClick = () => {
      setIsPlaylistOpen(prev => !prev)
    }
    playlistButton.addEventListener('click', handleClick)
    return () => playlistButton.removeEventListener('click', handleClick)
  }, [])


  function changeSong(direction) {
    const idx = songs.findIndex(s => s === currentSong)
    let newIdx = direction === 'nextSong' ? idx + 1 : idx - 1
  
    if (newIdx >= 0 && newIdx < songs.length) {
      setCurrentSong(songs[newIdx])
      setIsPlaying(true)
    }
  }


  function handleLoop() {
    loop ? setLoop(false) : setLoop(true)
  }


  useEffect(() => {
    const howl = currentSong.howl
    if (!howl) return

    const handleEnd = () => {
      console.log('song ended')
      if (loop) {
        console.log('playing the same song')
        howl.play()
      } else {
        console.log('playing next song')
        const idx = songs.findIndex(s => s == currentSong)
        const nextSong = songs[idx + 1]
        setCurrentSong(nextSong)
      }
    }

    howl.on('end', handleEnd)

    return () => {
      howl.off('end', handleEnd)
    }
  }, [loop, currentSong, songs, seek])


  return (
    <div id="player">
      <div className="song">
        <div className="song-info">
          <p className="song-name">{currentSong.name}</p>
          <p className="artist-name">{currentSong.artist}</p>
        </div>

        <div className="song-cover">
          {/* <img src="src/components/default_cover.webp" alt="song-cover" /> */}
          <img src={currentSong.coverImage} alt="song-cover" />
        </div>

        <div className="progress-bar">
          <ProgressBar
            seek={seek}
            setSeek={setSeek}
            progress={progress}
          />
        </div>
      </div>


      <div className="controls">
        <div className="controls-shuffle-repeat">
          <FontAwesomeIcon icon={faShuffle} />
          <FontAwesomeIcon 
            icon={faRepeat} 
            className='loop-button'
            onClick={handleLoop}
            style={{
              color: loop ? 'violet' : 'black',
              transform: loop ? 'scale(110%)' : 'scale(100%)'
            }}
          />
        </div>

        <div className="controls-main">
          <FontAwesomeIcon 
            icon={faBackward} 
            onClick={() => changeSong('previousSong')}
          />

          {!isPlaying && 
            <FontAwesomeIcon 
            icon={faPlay} 
            onClick={handlePlayPause} 
          />}

          {isPlaying && 
          <FontAwesomeIcon 
            icon={faPause} 
            onClick={handlePlayPause} 
          />}

          <FontAwesomeIcon 
            icon={faForward} 
            onClick={() => changeSong('nextSong')}
          />
        </div>

        <div className="control-playlist">
          <FontAwesomeIcon 
            icon={faListUl} 
            ref={playlistButtonRef} 
            style={{ 
              color: isPlaylistOpen ? 'grey' : 'black',
              transform: isPlaylistOpen ? 'scale(115%)' : 'scale(100%)',
              transition: 'transform 150ms ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Player

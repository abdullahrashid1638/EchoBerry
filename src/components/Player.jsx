import { React, useEffect, useState, useRef } from 'react'
import './Player.css'
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
import { Howl } from 'howler'
import { songs } from '../assets/music/songs.js'

console.log(songs)

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
  const [songName, setSongName] = useState('Fortnight!')
  const [artistName, setArtistName] = useState('Taylor Swift')
  const [songDuration, setSongDuration] = useState(null)
  const [progress, setProgress] = useState(0)
  const [seek, setSeek] = useState(0)


  const songRef = useRef(null)
  const songIdRef = useRef(null)


  // Create Howl instance only once
  useEffect(() => {
    const sound = new Howl({
      src: ['src/assets/music/TTPD/01. Fortnight.flac'],
      onload: () => {
        const duration = sound.duration()
        setSongDuration(duration)
      }
    })

    songRef.current = sound
  }, [])


  // calculated song progress
  useEffect(() => {

    if (!songDuration) return

    const intervalId = setInterval(() => {
      const secondsPassed = songRef.current.seek()
      const percentage = (secondsPassed / songDuration) * 100
      setProgress(percentage)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [songDuration])


  // seek the song if the value of the seek state changes
  useEffect(() => {
    const seconds = (seek / 100) * songDuration
    songRef.current.seek(seconds)
  }, [seek])


  // Handle isPlaying state
  useEffect(() => {
    const song = songRef.current
    if (!song) return

    if (isPlaying) {
      const id = song.play()
      songIdRef.current = id
    } else {
      song.pause(songIdRef.current)
      setIsPlaying(songRef.current.playing())
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



  return (
    <div id="player">
      <div className="song">
        <div className="song-info">
          <p className="song-name">{songName}</p>
          <p className="artist-name">{artistName}</p>
        </div>

        <div className="song-cover">
          {/* <img src="src/components/default_cover.webp" alt="song-cover" /> */}
          <img src="src/assets/music/TTPD/cover.jpg" alt="song-cover" />
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
          <FontAwesomeIcon icon={faRepeat} />
        </div>

        <div className="controls-main">
          <FontAwesomeIcon icon={faBackward} />
          {!isPlaying && <FontAwesomeIcon icon={faPlay} onClick={handlePlayPause} />}
          {isPlaying && <FontAwesomeIcon icon={faPause} onClick={handlePlayPause} />}
          <FontAwesomeIcon icon={faForward} />
        </div>

        <div className="control-playlist">
          <FontAwesomeIcon icon={faListUl} />
        </div>
      </div>
    </div>
  )
}

export default Player



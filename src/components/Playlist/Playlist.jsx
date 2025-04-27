import { React, useContext, useEffect, useState } from 'react'
import './Playlist.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { PlayerContext } from '../Player/PlayerContext'
import FolderPicker from '../FolderPicker/FolderPicker'
import Song from '../classes/songClass'


function Playlist({ playlistName='Add new album' }) {
  const { 
    files, 
    isPlaylistOpen, 
    setIsPlaylistOpen, 
    songsUploaded,
    songs,
    setSongs,
    currentSong,
    setCurrentSong
  } = useContext(PlayerContext)

  useEffect(() => {
    async function loadSongs() {
      const validAudioFiles = files.filter(file =>
        ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.webm'].some(ext =>
          file.name.toLowerCase().endsWith(ext)
        )
      )
  
      const newSongs = []
  
      for (const file of validAudioFiles) {
        const songIndex = file.name.slice(0, 3)
        const songName = file.name.slice(4, file.name.lastIndexOf('.'))
        const ext = file.name.split('.').pop()
  
        const song = new Song({
          file,
          index: songIndex,
          extension: ext
        })
  
        await song.ready // wait until metadata and Howl are ready
        newSongs.push(song)
      }
  
      setSongs(prevSongs => [...prevSongs, ...newSongs])
    }
    
    if (files.length > 0) {
      loadSongs()
    }
  }, [files])

  function getAlbumName() {
    if (songs.length === 0) {
      return 'Add new Songs'
    }
    return songs[0].album || 'Unknown'
  }

  function getArtistName() {
    if (songs.length === 0) {
      return 'No Artist'
    }
    return songs[0].artist
  }

  return isPlaylistOpen ? (
    <div className='playlist'>
      <div className='header'>
        <h4 className='album-name folder-name'>
          {getAlbumName()}
        </h4>
        <h4 className='album-artist-name'>
          {getArtistName()}
        </h4>
        <FontAwesomeIcon 
          className='close-playlist-button' 
          icon={faXmark} 
          onClick={() => setIsPlaylistOpen(false)} 
        />
      </div>

      {songsUploaded ? (
        <div className='playlist-songs'>
          {songs.map(song => (
            <div className='playlist-song' key={song.index}>
              <div className='playlist-song-number center'>{song.index}</div>
              <div className='playlist-song-cover center'>
                <img src='src\assets\TTPD\cover.jpg' />
              </div>
              <div className='playlist-song-name'>{song.name}</div>
              <div className='playlist-song-duration center'>{song.formattedDuration}</div>
            </div>
            ))}
          </div>
      ) : (
        <FolderPicker />
      )}
    </div>
  ) : null
}

export default Playlist

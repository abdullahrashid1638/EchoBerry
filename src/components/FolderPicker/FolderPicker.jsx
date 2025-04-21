import { React, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { PlayerContext } from '../Player/PlayerContext'
import './FolderPicker.css'


function FolderPicker() {
  const { files, setFiles } = useContext(PlayerContext)

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    setFiles(files)
  }

  useEffect(() => {
    console.log(files.map((file, index) => (`${file.webkitRelativePath} (${(file.size / 1024).toFixed(2)} KB)`)))
  }, [files])

  return (
    <div className='add-songs'>
        <div className='add-songs-button'>
          <label htmlFor='add-songs'>
            <FontAwesomeIcon icon={faFolder} />
          </label>
          <input
            type='file'
            id='add-songs'
            webkitdirectory='true'
            mozdirectory='true'
            multiple
            onChange={handleFiles}
          />
          <p>Add Album/Folder</p>
        </div>
      </div>
  )
}

export default FolderPicker

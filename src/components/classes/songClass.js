import { Howl } from 'howler'
import { parseBlob } from 'music-metadata'

async function retrieveMetadata(file) {
  try {
    const metadata = await parseBlob(file)
    const album = metadata.common.album
    const artist = metadata.common.artist
    const title = metadata.common.title
    const duration = metadata.format.duration // Fallback only
    const picture = metadata.common.picture?.[0]

    let coverImageUrl = null
    if (picture) {
      const blob = new Blob([picture.data], { type: picture.format })
      coverImageUrl = URL.createObjectURL(blob)
    }

    return {
      album,
      artist,
      title,
      duration,
      coverImage: coverImageUrl
    }
  } catch (error) {
    console.log('No metadata found:', error)
    return {}
  }
}

class Song {
  constructor({ file, index, extension }) {
    this.name = ''
    this.coverImage = ''
    this.artist = ''
    this.album = ''
    this.file = file
    this.index = index
    this.extension = extension
    this.path = URL.createObjectURL(file)
    this.duration
    this.formattedDuration
    this.howl = null

    this.ready = this.init() // returns a Promise for awaiting outside if needed
  }

  async init() {
    const metadata = await retrieveMetadata(this.file)

    this.name = metadata.title
    this.coverImage = metadata.coverImage || 'src/components/Player/default_cover.webp'
    this.artist = metadata.artist
    this.album = metadata.album

    const totalSeconds = Math.floor(metadata.duration) || 0
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    this.formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  loadHowl() {
    if (this.howl) return

    // Initialize Howler
    this.howl = new Howl({
      src: [this.path],
      format: [this.extension]
    })
  }
}

export default Song

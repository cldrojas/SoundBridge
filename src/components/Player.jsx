import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Previous,
  Next,
  Shuffle,
  Repeat,
  RepeatOne,
  VolumeUp,
  Queue,
  Playlist
} from '@icons/playerIcons'

const twoDigits = (number) => (number < 10 ? `0${number}` : number)
const timeToMinutes = (time) => {
  if (!time) return '00:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${twoDigits(minutes)}:${twoDigits(seconds)}`
}
const timeToMs = (time) => {
  const [minutes, seconds] = time.split(':')
  return minutes * 60 + seconds
}
const repatingOptions = {
  none: <Repeat />,
  all: (
    <div class="text-teal-600">
      <Repeat />
    </div>
  ),
  one: (
    <>
      <div class="text-teal-600">
        <RepeatOne />
      </div>
    </>
  )
}

export const Player = () => {
  const soundRef = useRef()

  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [repeating, setRepeating] = useState('none')
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [songs, setSongs] = useState()
  const [currentPlaylist, setCurrentPlaylist] = useState([])

  useEffect(() => {
    soundRef.current.ontimeupdate = () => setCurrentTime(timeToMinutes())
  })

  const handlePlay = () => {
    if (isPlaying) {
      soundRef.current.pause()
      setCurrentTime(timeToMinutes(soundRef.current.currentTime))
    } else if (currentTime > 0) {
      soundRef.current.currentTime = timeToMs(currentTime)
      soundRef.current.play()
    } else {
      soundRef.current.src = `/music/${songs[currentSongIndex + 1]}`
      soundRef.current.volume = 0.2
      soundRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleRepeat = () => {
    setRepeating((prev) => {
      if (prev === 'none') {
        // loop through the current list
        return 'all'
      }
      if (prev === 'all') {
        soundRef.current.loop = true
        return 'one'
      }
      return 'none'
    })
  }

  return (
    <section className="flex justify-between z-50 fixed bottom-0 w-full bg-gray-800 py-2 border-t border-slate-900 border-opacity-60 text-[#c1c2c3] accent-teal-600">
      <audio ref={soundRef}></audio>
      <aside className="ml-10 flex gap-4 items-center">
        <img src="/favicon.svg" alt="current song" className="size-16 border" />
        <div className="">
          <header>Song Name</header>
          <h6>Artist Name</h6>
        </div>
      </aside>
      <main className="md:min-w-96">
        <div className="flex justify-center gap-x-4 items-center py-2">
          <button onClick={() => console.log('shuffling')}>
            <Shuffle />
          </button>
          <button>
            <Previous />
          </button>
          <button
            className="bg-white text-slate-800 rounded-full p-1"
            onClick={() => handlePlay()}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button>
            <Next />
          </button>
          <button onClick={() => toggleRepeat()}>
            {repeating === 'none' ? <Repeat /> : repatingOptions[repeating]}
          </button>
        </div>
        <div className="flex justify-between gap-2">
          <span>{currentTime}</span>
          <input
            type="range"
            value={soundRef.current?.currentTime}
            onChange={(value) => {
              soundRef.current.time = value
            }}
            max={soundRef.current?.duration || 100}
            className="w-full"
          />
          <span>{timeToMinutes(soundRef.current?.duration)}</span>
        </div>
      </main>
      <aside className="mr-10 flex gap-1 items-center">
        <button class="text-white">
          <Queue />
        </button>
        <button class="text-white">
          <Playlist />
        </button>
        <span class="flex">
          <VolumeUp />
          <input type="range" value={soundRef.current?.volume} class="ms-1" />
        </span>
      </aside>
    </section>
  )
}

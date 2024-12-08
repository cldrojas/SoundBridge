import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Previous, Next, Shuffle, Repeat } from '@icons/playerIcons'

const twoDigits = (number) => (number < 10 ? `0${number}` : number)
const timeToMinutes = (time) => {
  if (!time) return '00:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${twoDigits(minutes)}:${twoDigits(seconds)}`
}

export const Player = () => {
  const musicRef = useRef()

  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00')

  useEffect(() => {
    musicRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(timeToMinutes(musicRef.current.currentTime))
    })
  }, [])

  const handlePlay = () => {
    if (isPlaying) {
      musicRef.current.pause()
      setCurrentTime(timeToMinutes(musicRef.current.currentTime))
    } else {
      musicRef.current.src = '/music/complex-desire.mp3'
      musicRef.current.volume = 0.2
      musicRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="flex justify-between z-50 fixed bottom-0 w-full bg-gray-800 py-2 border-t border-slate-900 border-opacity-60 accent-teal-600">
      <audio ref={musicRef}></audio>
      <aside className="ml-10 flex gap-4 items-center">
        <img src="/images/logo.svg" alt="current song" className="size-16 border" />
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
          <button>
            <Repeat />
          </button>
        </div>
        <div className="flex justify-between gap-2">
          <span>{currentTime}</span>
          <input
            type="range"
            value={musicRef.current?.currentTime}
            onChange={(value) => {
              musicRef.current.time = value
            }}
            max={musicRef.current?.duration || 100}
            className="w-full"
          />
          <span>{timeToMinutes(musicRef.current?.duration)}</span>
        </div>
      </main>
      <aside className="mr-10 flex gap-1 items-center">
        {/* <button class="text-white">
          <QueueIcon />
        </button>
        <button class="text-white">
          <PlaylistIcon />
        </button>
        <span class="flex">
          <Volumeup />
          <input type="range" value="50" class="ms-1" />
        </span> */}
      </aside>
    </section>
  )
}

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
  VolumeDown,
  Muted,
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
    <div className="text-teal-600">
      <Repeat />
    </div>
  ),
  one: (
    <>
      <div className="text-teal-600">
        <RepeatOne />
      </div>
    </>
  )
}

export const Player = () => {
  const soundRef = useRef(undefined)

  const [songs, setSongs] = useState()
  const [currentSong, setCurrentSong] = useState(undefined)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [repeating, setRepeating] = useState('none')
  const [currentTime, setCurrentTime] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(1)
  const [currentPlaylist, setCurrentPlaylist] = useState([])

  if (soundRef.current) {
    soundRef.current.volume = currentVolume
    soundRef.current.ontimeupdate = () => setCurrentTime(soundRef.current.currentTime)
    soundRef.current.onended = () => {
      if (!isShuffling && repeating === 'none' && currentSong.index === songs.length - 1)
        setIsPlaying(false)
      onNext()
    }
  }

  useEffect(() => {
    if (!songs) {
      fetch('/api/songs')
        .then((res) => res.json())
        .then((data) => {
          console.log(`songs`, data)
          setSongs(data)
        })
    } else {
      setCurrentSong(songs[0])
    }
  }, [songs])

  useEffect(() => {
    if (currentSong) {
      soundRef.current.src = currentSong.url
      isPlaying && soundRef.current.play()
    } else {
      console.log(`no song selected`)
    }
  }, [songs, currentSong])

  // useEffect(() => {
  //   soundRef.current.onended = () => {
  //     if (repeating === 'all') {
  //       soundRef.current.play()
  //     } else {
  //       onNext()
  //     }
  //   }
  // }, [repeating])

  // useEffect(() => {

  // })

  // useEffect(() => {
  //   if (soundRef.current)
  // }, [currentVolume])

  const handlePlay = () => {
    if (currentSong && soundRef.current.readyState === 4) {
      console.log(`DEBUG:try to play/pause:`, `${currentSong.title}.mp3`)

      if (isPlaying) {
        soundRef.current.pause()
        setCurrentTime(soundRef.current.currentTime)
      } else if (currentTime > 0) {
        soundRef.current.currentTime = currentTime
        soundRef.current.play()
      } else {
        soundRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
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

  const onPrev = () => {
    if (currentTime > 1) {
      soundRef.current.currentTime = 0
      return
    }
    if (isShuffling) {
      setCurrentSong(songs[Math.floor(Math.random() * songs.length)])
    } else {
      currentSong.index === 0
        ? setCurrentSong(songs[songs.length - 1])
        : setCurrentSong(songs[currentSong.index - 1])
    }
  }
  const onNext = () => {
    if (isShuffling) {
      setCurrentSong(songs[Math.floor(Math.random() * songs.length)])
    } else {
      currentSong.index === songs.length - 1
        ? setCurrentSong(songs[0])
        : setCurrentSong(songs[currentSong.index + 1])
    }
  }

  return (
    currentSong && (
      <section className="flex justify-between z-50 fixed bottom-0 w-full bg-gray-800 py-2 border-t border-slate-900 border-opacity-60 text-[#c1c2c3] accent-teal-600 max-h-[72px]">
        <audio ref={soundRef}></audio>
        <aside className="ml-3 flex gap-4 items-center min-w-44">
          <picture className="w-12 h-12 rounded-md overflow-hidden">
            <img
              src={`${currentSong?.image || '/favicon.svg'}`}
              alt="current song"
              className="size-12 rounded-md aspect-square bg-contain"
            />
          </picture>
          <div className="">
            <header className="font-semibold text-sm">{currentSong?.title}</header>
            <h6 className="text-xs">{currentSong?.artists}</h6>
          </div>
        </aside>
        <main className="md:min-w-96 max-h-16">
          <div className="flex justify-center gap-x-4 items-center">
            <button
              onClick={() => setIsShuffling(!isShuffling)}
              className={isShuffling && 'text-teal-600 font-bold scale-110'}
            >
              <Shuffle />
            </button>
            <button onClick={() => onPrev()}>
              <Previous />
            </button>
            <button
              className="bg-white text-slate-800 rounded-full size-8 flex items-center justify-center"
              onClick={() => handlePlay()}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={() => onNext()}>
              <Next />
            </button>
            <button
              onClick={() => toggleRepeat()}
              className={repeating !== 'none' && 'scale-110'}
            >
              {repeating === 'none' ? <Repeat /> : repatingOptions[repeating]}
            </button>
          </div>
          <div className="flex justify-between gap-2">
            <span>{timeToMinutes(currentTime)}</span>
            <input
              type="range"
              value={soundRef.current?.currentTime}
              onChange={(ev) => {
                setCurrentTime(ev.target.value)
              }}
              max={soundRef.current?.duration || 0}
              className="w-full h-1 self-center appearance-none hover:appearance-auto"
            />
            <span>{timeToMinutes(soundRef.current?.duration)}</span>
          </div>
        </main>
        <aside className="mr-4 flex gap-1 items-center">
          <button>
            <Queue />
          </button>
          <button>
            <Playlist />
          </button>
          <span className="flex items-center text-gray-400">
            {currentVolume === 0 ? (
              <Muted />
            ) : currentVolume < 0.4 ? (
              <VolumeDown />
            ) : (
              <VolumeUp />
            )}
            <input
              type="range"
              defaultValue={currentVolume}
              value={soundRef.current?.volume * 100}
              className="ms-1 h-1 appearance-none hover:appearance-auto w-10"
              onChange={(ev) => setCurrentVolume(ev.target.value / 100)}
            />
          </span>
        </aside>
      </section>
    )
  )
}

import { useEffect, useState } from "react";
import "./App.css";
import { GiNextButton, GiPauseButton, GiPlayButton, GiPreviousButton } from "react-icons/gi";

function App() {
  const [musics, setMusics] = useState(null);
  const [errorStatus, setErrorStatus] = useState("");
  const [playing, setPlaying] = useState(false);
  const [load, setLoad] = useState(false);
  const [ci, setCi] = useState(null);
  // Keep the raw HTML5 Audio element instance in a single state variable
  const [audioInstance, setAudioInstance] = useState(null);

  async function loadMusic() {
    try {
      let res = await fetch("http://192.168.29.122:3001/songs", {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`HTTP Server Error: ${res.status}`);

      let data = await res.json();
      setMusics(data);
    } catch (err) {
      console.error("Network fetch failed:", err.message);
      setErrorStatus(err.message);
    }
  }

  const playMusic = (i) => {
    if (ci == i) {
      // openDrawer();
      audioInstance.play();
      return;
    }
    
    setCi(i);

    if (audioInstance) {
      audioInstance.pause();
      audioInstance.src = ""; // Force garbage collection of the old stream
    }

    setLoad(true);
    let path = musics.url + musics.data[i].name;
    let aud = new Audio(path);

    // FIX: Listen to actual audio events to keep React state perfectly accurate
    aud.addEventListener('loadstart', () => setLoad(true));
    aud.addEventListener('canplay', () => setLoad(false));

    aud.addEventListener('play', () => setPlaying(true));
    aud.addEventListener('pause', () => setPlaying(false));

    // Auto-reset UI when song naturally ends
    aud.addEventListener('ended', () => setPlaying(false));

    aud.play().catch(err => {
      console.error("Playback failed:", err);
      setLoad(false);
    });

    setAudioInstance(aud);
  }

  useEffect(() => {
    loadMusic();

    // Cleanup function: If the component unmounts, kill the music
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    };
  }, []);

  let togglePlay = () => {
    if (audioInstance) {
      if (playing) {
        audioInstance.pause();
      } else {
        audioInstance.play().catch(err => console.error(err));
      }
    } else {
      alert("No song is playing currently");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white py-12" onContextMenu={e => e.preventDefault()}>
      <div className="flex flex-col items-center lg:items-start my-6 lg:mx-10">
        <h1 className="text-4xl cursor-pointer" onClick={loadMusic}>MusicMine</h1>
        <input className="px-4 focus:outline-none border border-gray-500 bg bg-gray-700 h-10 my-4 rounded-full text-white" placeholder="Search..." />
      </div>

      {errorStatus && <div className="text-red-500 text-center my-4">Error: {errorStatus}</div>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 px-4 lg:px-10">
        {musics && musics.data.map((a, i) => (
          <div key={a.name} className="p-4 flex flex-col bg-blue-950 rounded-xl cursor-pointer hover:bg-blue-900 transition-colors" onClick={() => playMusic(i)}>
            <img src={a.user_metadata.thumbnail} className="rounded-lg w-full object-cover aspect-video" alt={a.user_metadata.title} />
            <h1 className="mt-4 font-medium">{a.user_metadata.title}</h1>
          </div>
        ))}
      </div>

      <div className="fixed bg-black bottom-0 left-0 h-20 w-full flex flex-col justify-around items-center bbar border-t border-gray-800">
        <div className="flex w-full lg:w-1/2 justify-center items-center gap-6">
          <GiPreviousButton className="size-6 cursor-pointer text-gray-400 hover:text-white" />

          <div className="rounded-full grid place-items-center size-12 bg-white text-blue-700 cursor-pointer shadow-md hover:scale-105 transition-transform" onClick={togglePlay}>
            {load ? (
              /* Your custom Tailwind spinner */
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-e-transparent"></div>
            ) : playing ? (
              <GiPauseButton className="size-6" />
            ) : (
              <GiPlayButton className="size-6 ml-0.5" /> /* Tiny margin adjustment to visually center the play icon triangle */
            )}
          </div>

          <GiNextButton className="size-6 cursor-pointer text-gray-400 hover:text-white" />
        </div>
      </div>
    </main>
  );
}

export default App;


import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSongs([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(
        `https://saavnapi-nine.vercel.app/result/?query=${encodeURIComponent(query)}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            setSongs([]);
            return;
          }

          const songResults = data.map((song) => ({
            title: song.song,
            artist: song.primary_artists,
            image: song.image,
            audio: song.media_url,
            id: song.id,
          }));

          setSongs(songResults);
        })
        .catch((error) => {
          console.error("Songs fetch error:", error);
          setSongs([]);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const playSong = (song) => {
    setCurrentSong(song);
    setSelectedSong(song);
  };

  return (
    <div>
      <header>
        <h1>Vibely 🎧💜</h1>
      </header>

      <div className="app-layout">
        <aside>
          <h2>🏠 Home</h2>
          <p>Search</p>
          <p>Your Library</p>
        </aside>

        <main>
          {!selectedSong && (
            <>
              <section className="hero-banner">
                <h2>Your music, your mood.</h2>
                <p>Discover songs that match your vibe.</p>
                <button
                  onClick={() =>
                    document.querySelector(".search-bar input")?.focus()
                  }
                >
                  Listen Now
                </button>
              </section>

              <section className="search-section">
                <div className="search-heading">
                  <h2>Find your vibe</h2>
                  <p>Search songs, artists and albums.</p>
                </div>

                <div className="search-bar">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                  />
                </div>
              </section>

              {songs.length > 0 ? (
                <section className="music-section">
                  <h2>Search Results</h2>

                  <div className="music-cards">
                    {songs.map((song) => (
                      <div className="music-card" key={song.id}>
                        <img src={song.image} alt={song.title} />
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>

                        <button onClick={() => playSong(song)}>
                          ▶ Play
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="discover-section">
                  <h2>✨ Discover Your Vibe</h2>
                  <p>Pick a mood and find your next favourite song.</p>

                  <div className="mood-cards">
                    <div className="mood-card mood-chill">
                      <span>🌙</span>
                      <h3>Chill Nights</h3>
                      <p>Relax and unwind</p>
                    </div>

                    <div className="mood-card mood-romantic">
                      <span>💜</span>
                      <h3>Love &amp; Romance</h3>
                      <p>Feel every melody</p>
                    </div>

                    <div className="mood-card mood-energy">
                      <span>⚡</span>
                      <h3>High Energy</h3>
                      <p>Boost your mood</p>
                    </div>

                    <div className="mood-card mood-dreamy">
                      <span>☁️</span>
                      <h3>Dreamy Vibes</h3>
                      <p>Get lost in music</p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {selectedSong && (
            <section className="now-playing">
              <button
                className="back-button"
                onClick={() => setSelectedSong(null)}
              >
                ← Back to Vibely
              </button>

              <img
                src={selectedSong.image}
                alt={selectedSong.title}
              />

              <p className="playing-label">NOW PLAYING</p>
              <h2>{selectedSong.title}</h2>
              <p>{selectedSong.artist}</p>

              <audio
                key={selectedSong.id}
                controls
                autoPlay
                src={selectedSong.audio}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import "../App.scss"
import "aos/dist/aos.css";
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import MangaSearch from '../components/MangaSearch/MangaSearch';


const GeneralPage = () => {
  const [query, setQuery] = useState('');
  const [orderBy, setOrderBy] = useState('score')
  const [sortBy, setSortBy] = useState('desc')
  const [rating, setRating] = useState('pg13')


  return (

    <main className='genralWrapper' id="main-content">
      <section className="bounty-hero" aria-labelledby="bounty-hero-title">
        <div className="bounty-hero__copy">
          <p className="section-kicker">Night archive // Jikan bounty board</p>
          <h1 id="bounty-hero-title">Track down the next title worth pinning to your shelf.</h1>
          <p>
            Search anime and manga like a late-night poster wall: scan the art, compare score seals, filter by mood, and open the trail before the queue gets cold.
          </p>
        </div>
        <div className="bounty-hero__ledger" aria-label="Discovery tools">
          <div>
            <span>01</span>
            <strong>Search</strong>
            <p>Debounced Jikan lookup for anime and manga.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Sort</strong>
            <p>Score, title, popularity, and directional filters.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Shelve</strong>
            <p>Save picks locally for offline browsing.</p>
          </div>
        </div>
      </section>

      <AnimeSearch
        sortBy={sortBy}
        query={query}
        setQuery={setQuery}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        setRating={setRating}
        rating={rating}
        orderBy={orderBy}
        deferUntilVisible />

      <MangaSearch
        sortBy={sortBy}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        deferUntilVisible />
    </main>
  );
}

export default GeneralPage;

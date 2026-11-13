import { useState } from 'react';
import '../App.scss';
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import MangaSearch from '../components/MangaSearch/MangaSearch';

const GeneralPage = () => {
  const [orderBy, setOrderBy] = useState('score');
  const [sortBy, setSortBy] = useState('desc');
  const [rating, setRating] = useState('pg13');

  return (
    <main className="genralWrapper" id="main-content">
      <section className="discovery-intro" aria-labelledby="discovery-title">
        <div className="discovery-intro__copy">
          <h1 id="discovery-title">Good stories.<br />Great finds.</h1>
          <p>Discover anime and manga. Keep your next great find on your shelf.</p>
          <div className="discovery-intro__actions">
            <a className="discovery-button" href="#anime">Explore anime</a>
            <a className="discovery-button discovery-button--quiet" href="#manga">Explore manga</a>
          </div>
        </div>
        <div className="discovery-intro__art" aria-hidden="true">
          <div className="shelf-book shelf-book--one"><span>Anime</span><i>映</i></div>
          <div className="shelf-book shelf-book--two"><span>Manga</span><i>漫</i></div>
          <div className="shelf-book shelf-book--three"><span>Your next find</span><i>✦</i></div>
          <div className="shelf-base" />
        </div>
      </section>
      <AnimeSearch sortBy={sortBy} setOrderBy={setOrderBy} setSortBy={setSortBy}
        setRating={setRating} rating={rating} orderBy={orderBy} deferUntilVisible />
      <MangaSearch sortBy={sortBy} orderBy={orderBy} setOrderBy={setOrderBy}
        setSortBy={setSortBy} deferUntilVisible />
    </main>
  );
};

export default GeneralPage;

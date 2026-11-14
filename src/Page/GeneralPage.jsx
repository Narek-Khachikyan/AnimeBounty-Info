import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import MangaSearch from '../components/MangaSearch/MangaSearch';

const GeneralPage = () => {
  const [orderBy, setOrderBy] = useState('score');
  const [sortBy, setSortBy] = useState('desc');
  const [rating, setRating] = useState('pg13');
  useEffect(() => {
    const root = document.getElementById('main-content');
    window.dispatchEvent(new CustomEvent('taste:mount', { detail: root }));
    return () => window.dispatchEvent(new CustomEvent('taste:unmount', { detail: root }));
  }, []);

  return (
    <main className="genralWrapper" id="main-content">
      <section className="discovery-intro hero" data-enter aria-labelledby="discovery-title">
        <div className="discovery-intro__copy">
          <p className="discovery-label">THE ANIME & MANGA FIELD GUIDE</p>
          <h1 id="discovery-title">Anime. Manga.<br />Your next find<span>.</span></h1>
          <p>Anime to get lost in. Manga you can’t put down. Find a title, check the details, make it yours.</p>
          <div className="discovery-intro__actions">
            <a className="discovery-button btn" href="#anime">Explore anime <span aria-hidden="true">↗</span></a>
            <a className="discovery-button discovery-button--quiet btn" href="#manga">Explore manga <span aria-hidden="true">↗</span></a>
          </div>
          <div className="discovery-quick-search"><a href="#anime-search-input">Search anime by title ↓</a><a href="#manga-search-input">Search manga by title ↓</a></div>
        </div>
        <div className="discovery-features" data-enter-media>
          <div className="discovery-features__label"><span>START WITH A STORY</span><span aria-hidden="true">01 — 02</span></div>
          <div className="discovery-features__grid">
            <Link className="discovery-pick" to="/anime/52991">
              <div className="discovery-pick__image"><img src="/art/frieren.webp" alt="Frieren in a sunlit forest" width="450" height="640" /></div>
              <div className="discovery-pick__body"><span>FANTASY · TV SERIES</span><h2>Frieren: Beyond<br />Journey’s End</h2><p>An elf’s journey after the adventure ends.</p><span className="discovery-pick__link">Explore the series ↗</span></div>
            </Link>
            <Link className="discovery-pick" to="/anime/9253">
              <div className="discovery-pick__image"><img src="/art/steins-gate.webp" alt="Steins;Gate key artwork" width="450" height="640" /></div>
              <div className="discovery-pick__body"><span>SCI-FI · TV SERIES</span><h2>Steins;Gate</h2><p>A time-travel experiment changes everything.</p><span className="discovery-pick__link">Explore the series ↗</span></div>
            </Link>
          </div>
        </div>
      </section>
      <AnimeSearch sortBy={sortBy} setOrderBy={setOrderBy} setSortBy={setSortBy}
        setRating={setRating} rating={rating} orderBy={orderBy} previewLimit={5} deferUntilVisible />
      <MangaSearch sortBy={sortBy} orderBy={orderBy} setOrderBy={setOrderBy}
        setSortBy={setSortBy} previewLimit={5} deferUntilVisible />
      <section className="shelf-statement" data-moment="giant-type-pass" data-moment-opts='{"image":"/art/frieren.webp","travel":40}'>
        <h2 className="mo-gt__type">Keep the<br />good ones.</h2>
        <div className="mo-gt__row"><p>Your watchlist, reading list and favourites, together.<br />Saved on this device. Available offline.</p><Link className="discovery-button btn" to="/library">Build your library ↗</Link></div>
      </section>
      <footer className="discovery-footer"><span>AnimeBounty-Info / A field guide for the curious.</span><span>Catalogue: Tenrai · Cover artwork: MyAnimeList</span></footer>
    </main>
  );
};
export default GeneralPage;

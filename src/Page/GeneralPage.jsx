import { useState } from 'react';
import "../App.scss"
import "aos/dist/aos.css";
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import MangaSearch from '../components/MangaSearch/MangaSearch';




const GeneralPage = () => {
  const [query, setQuery] = useState('naruto');
  const [orderBy, setOrderBy] = useState('title')
  const [sortBy, setSortBy] = useState('asc')
  const [raiting, setRaiting] = useState('pg13')


  return (

    <div className='genralWrapper' >
      <AnimeSearch
        sortBy={sortBy}
        query={query}
        setQuery={setQuery}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        setRaiting={setRaiting}
        raiting={raiting}
        orderBy={orderBy} />

      <MangaSearch
        sortBy={sortBy}
        raiting={raiting}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy} />
    </div>
  );
}

export default GeneralPage;

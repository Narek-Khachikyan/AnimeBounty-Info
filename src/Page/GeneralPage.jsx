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

    <div className='genralWrapper' >
      <AnimeSearch
        sortBy={sortBy}
        query={query}
        setQuery={setQuery}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        setRating={setRating}
        rating={rating}
        orderBy={orderBy} />

      <MangaSearch
        sortBy={sortBy}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy} />
    </div>
  );
}

export default GeneralPage;

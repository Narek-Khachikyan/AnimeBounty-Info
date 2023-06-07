import axios from 'axios';
import { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Link } from 'react-router-dom';
import "../App.scss"
import Filter from '../components/Filter/Filter';
import Sort from '../components/Filter/Sort';

function GeneralPage() {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState([])
  const [orderBy, setOrderBy] = useState('')
  const [sortBy, setSortBy] = useState('')


  const fetchSearch = async () => {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?order_by=${orderBy}&sort=${sortBy}&q=${query}`)
    setValue(response.data.data)
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearch()
    }, 1000);
    return () => clearTimeout(timer);
  }, [query, orderBy, sortBy]);
  console.log(sortBy)

  return (
    <div>
      <div className="searchInput-wrapper">
        <p className='text-2xl'>Search your anime!</p>
        <input className='searchInput' placeholder='Search Anime...' type="text" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      <div className="filter flex justify-between items-center mb-4">
        <div className="orderedBy">
          <p className='text-2xl mb-2'>Ordered By:</p>
          <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        <div className="sortBy">
          <p className='text-2xl mb-2'>Sort By:</p>
          <Sort setSortBy={setSortBy} />
        </div>

      </div>
      <div className="search-content grid grid-cols-4 grid-rows-3 gap-4">
        {
          value.map(obj => (
            <Link key={obj.mal_id} to={`anime/anime/${obj.mal_id}`}>
              <AnimeCard {...obj} />
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default GeneralPage;

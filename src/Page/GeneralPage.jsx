import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Link } from 'react-router-dom';
import "../App.scss"
import Filter from '../components/Filter/Filter';
import Sort from '../components/Filter/Sort';
import MangaCard from '../components/MangaCard/MangaCard';
import LazyLoading from "../components/LazyLoading/LazyLoading"
import Raiting from '../components/Filter/Raiting';
import AOS from "aos";
import "aos/dist/aos.css";


const GeneralPage = () => {
  const [query, setQuery] = useState('');
  const [queryManga, setQueryManga] = useState('');
  const [value, setValue] = useState([])
  const [valueManga, setValueManga] = useState([])
  const [orderBy, setOrderBy] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [raiting, setRaiting] = useState('')
  const [isLoading, setIsLoading] = useState(true)


  const fetchSearch = useCallback(async () => {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?&q=${query}`)
    setValue(response.data.data)

  }, [orderBy, sortBy, query, raiting])

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    const timer = setTimeout(() => {
      fetchSearch()
      setIsLoading(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, [query, orderBy, sortBy, raiting]);


  const fetchSearchManga = useCallback(async () => {
    const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${queryManga}`)
    setValueManga(response.data.data)
  }, [orderBy, sortBy, queryManga])
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchManga()
    }, 1000);
    return () => clearTimeout(timer);
  }, [queryManga, orderBy, sortBy]);


  return (
    <div className='genralWrapper'>
      <div className="searchInput-wrapper flex flex-col gap-3  my-5 sm:flex-col sm:gap-3 md:flex-row md:justify-between md:items-center" >
        <p className='text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Search your <a>anime</a> or <a href="#manga"><b>manga</b></a>!</p>
        <input className='searchInput' placeholder='Search Anime...' type="text" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      <div data-aos="fade-up" className="filter mb-8 sm:flex sm:flex-col sm:gap-3 md:flex md:justify-between md:items-center md:flex-row">
        <div className="orderedBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Ordered By:</p>
          <Filter setOrderBy={setOrderBy} />
        </div>
        <div className="raiting">
          <p className='text-base mt-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Raiting:</p>
          <Raiting setRaiting={setRaiting} />
        </div>
        <div className="sortBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl '>Sort By:</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-3">
        {
          isLoading ? (
            <LazyLoading />
          ) : value.map(obj => (
            <Link key={obj.mal_id} to={`anime/anime/${obj.mal_id}`}>
              {<AnimeCard /> ? <AnimeCard {...obj} /> : null}
            </Link>
          ))

        }
      </div>

      <div id='manga' className="MangaSearch pt-8">
        <div className="searchInputManga-wrapper flex flex-col gap-3  my-5 sm:flex-col sm:gap-3 md:flex-row md:justify-between md:items-center" >
          <p className='text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Search your manga or <a onClick={() => scrollTo(0, 0)}><b className=' cursor-pointer'>anime</b></a>!</p>
          <input className='searchInput' placeholder='Search Manga...' type="text" value={queryManga} onChange={event => setQueryManga(event.target.value)} />
        </div>
        <div data-aos="fade-up" className="filter mb-8 sm:flex sm:flex-col sm:gap-3 md:flex md:justify-between md:items-center md:flex-row">
          <div className="orderedBy">
            <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Ordered By:</p>
            <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
          <div className="sortBy">
            <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl '>Sort By:</p>
            <Sort setSortBy={setSortBy} />
          </div>
        </div>
        <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-3">
          {
            valueManga.map(obj => (
              <Link key={obj.mal_id} to={`manga/manga/${obj.mal_id}`}>
                <MangaCard {...obj} />
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default GeneralPage;

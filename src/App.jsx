import './App.scss';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import FullAnime from './components/FullAnime/FullAnime';
import Anime from './Page/Anime';
import Manga from './Page/Manga';
import FullManga from './components/FullManga/FullManga';
import GeneralPage from './Page/GeneralPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route path='/' element={<GeneralPage />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/anime/:id" element={<FullAnime />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/manga/manga/:id" element={<FullManga />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

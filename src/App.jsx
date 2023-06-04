import './App.scss';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TopAnimeSlider from './components/TopAnimeSlider/TopAnimeSlider';
import TopManga from './components/TopManga/TopManga';
import FullAnime from './components/FullAnime/FullAnime';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route path="/anime" element={<TopAnimeSlider />} />
          <Route path="/anime/anime/:id" element={<FullAnime />} />
          <Route path="/manga" element={<TopManga />} />
          <Route path="/manga/manga/:id" element={<FullAnime />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

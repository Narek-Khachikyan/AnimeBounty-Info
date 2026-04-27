import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import FullAnime from './components/FullAnime/FullAnime';
import CharacterPage from './components/CharacterPage/CharacterPage';
import Anime from './Page/Anime';
import Manga from './Page/Manga';
import FullManga from './components/FullManga/FullManga';
import GeneralPage from './Page/GeneralPage';
import About from './Page/About';
import Library from './Page/Library';


const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route path="/" element={<GeneralPage />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<FullAnime />} />
          <Route path="/character/:id" element={<CharacterPage />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/manga/:id" element={<FullManga />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

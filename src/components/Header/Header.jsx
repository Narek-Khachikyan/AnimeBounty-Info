import "./header.scss";
import githubIcon from "../../assets/images/githubicon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()

  const navigateToHome = () => {
    navigate('/');
    scrollTo(0, 0)
    setIsActive(false)
  };
  const scrollUp = () => {
    setIsActive(false);
    window.scrollTo(0, 0);
  };
  return (
    <div className="header bg-white shadow-md">
      <div className="header__container">
        <div className="header__content py-2">
          <button onClick={() => navigateToHome()} className="header__logo text-xl text-black justify-self-start content-center">
            AnimeBounty-Info
          </button>
          <nav className={isActive ? "navigation show" : "navigation justify-self-center content-center"}>
            <ul className="navigation__list flex gap-8 text-black">
              <li className="navigation__list-item ">
                <Link onClick={() => scrollUp()} to={'/anime'} className={location.pathname === "/anime" ? "header__active" : "navigation__list-link"}>
                  <p>Anime</p>
                </Link>
              </li>
              <li className={location.pathname === "/manga" ? "header__active" : "navigation__list-link"}>
                <Link onClick={() => scrollUp()} to={"/manga"} className="navigation__list-link">
                  <p>Manga</p>
                </Link>
              </li>
              <li className={location.pathname === "/about" ? "header__active" : "navigation__list-link"}>
                <Link onClick={() => scrollUp()} to={'/about'} className="navigation__list-link">
                  <p>About</p>
                </Link>
              </li>
              <li className="github-mobile">
                <a target="_blank" href="https://github.com/magiccwarss" rel="noreferrer"><img width={30} height={30} src={githubIcon} alt="" /></a>
              </li>
            </ul>
          </nav>
          <div className="github justify-self-end">
            <a target="_blank" href="https://github.com/magiccwarss" rel="noreferrer"><img width={30} height={30} src={githubIcon} alt="" /></a>
          </div>
          <button onClick={() => setIsActive(!isActive)} className="burger">
            <div className="burger__line"></div>
            <div className="burger__line"></div>
            <div className="burger__line"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

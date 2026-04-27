import "./header.scss";
import githubIcon from "../../assets/images/githubicon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: "/anime", label: "Anime" },
    { to: "/manga", label: "Manga" },
    { to: "/library", label: "Library" },
    { to: "/about", label: "About" },
  ];

  const navigateToHome = () => {
    navigate('/');
    scrollTo(0, 0);
    setIsActive(false);
  };

  const scrollUp = () => {
    setIsActive(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__content py-2">
          <button onClick={() => navigateToHome()} className="header__logo text-xl justify-self-start content-center">
            AnimeBounty-Info
          </button>
          <nav className={isActive ? "navigation show" : "navigation justify-self-center content-center"}>
            <ul className="navigation__list flex gap-8">
              {navItems.map((item) => (
                <li className="navigation__list-item" key={item.to}>
                  <Link
                    onClick={() => scrollUp()}
                    to={item.to}
                    className={location.pathname === item.to ? "navigation__list-link header__active" : "navigation__list-link"}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="github-mobile">
                <a target="_blank" href="https://github.com/magiccwarss" rel="noreferrer" aria-label="Open GitHub profile"><img width={30} height={30} src={githubIcon} alt="" /></a>
              </li>
            </ul>
          </nav>
          <div className="github justify-self-end">
            <a target="_blank" href="https://github.com/magiccwarss" rel="noreferrer" aria-label="Open GitHub profile"><img width={30} height={30} src={githubIcon} alt="" /></a>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={isActive ? "burger burger--open" : "burger"}
            aria-label={isActive ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isActive}
            type="button"
          >
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

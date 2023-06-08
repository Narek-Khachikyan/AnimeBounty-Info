import "./header.scss";
import githubIcon from "../../assets/images/githubicon.svg";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  console.log(location.pathname)
  return (
    <div className="Header bg-white shadow-md">
      <div className="header__container">
        <div className="header__content py-4 grid grid-cols-3 grid-rows-1 content-center">
          <Link to={"/"} className="header__logo text-xl text-black justify-self-start content-center">
            AnimeBounty-Info
          </Link>
          <nav className="navigation justify-self-center content-center">
            <ul className="navigation__list flex gap-8 text-black">
              <li className="navigation__list-item ">
                <Link to={'/anime'} className={location.pathname === "/anime" ? "header__active" : "navigation__list-link"}>
                  Anime
                </Link>
              </li>
              <li className={location.pathname === "/manga" ? "header__active" : "navigation__list-link"}>
                <Link to={"/manga"} className="navigation__list-link">
                  Manga
                </Link>
              </li>
              <li className="navigation__list-item">
                <a href="#" className="navigation__list-link">
                  Character
                </a>
              </li>
              <li className={location.pathname === "/about" ? "header__active" : "navigation__list-link"}>
                <Link to={'/about'} className="navigation__list-link">
                  About
                </Link>
              </li>
            </ul>
          </nav>
          <div className="github justify-self-end content-center">
            <img width={30} height={30} src={githubIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

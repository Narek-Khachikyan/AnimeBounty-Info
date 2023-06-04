import "./header.scss";
import githubIcon from "../../assets/images/githubicon.svg";
import { Link } from "react-router-dom";

const Header = () => {
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
                <Link to={'/anime'} className="navigation__list-link">
                  Anime
                </Link>
              </li>
              <li className="navigation__list-item">
                <Link to={"/manga"} className="navigation__list-link">
                  Manga
                </Link>
              </li>
              <li className="navigation__list-item">
                <a href="#" className="navigation__list-link">
                  Character
                </a>
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

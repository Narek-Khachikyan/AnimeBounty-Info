import "./header.scss";
import githubIcon from "../../assets/images/githubicon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  const closeMenu = () => {
    setIsActive(false);
    menuButtonRef.current?.focus();
  };

  const navItems = [
    { to: "/anime", label: "Anime" },
    { to: "/manga", label: "Manga" },
    { to: "/library", label: "Library" },
    { to: "/about", label: "About" },
  ];

  const navigateToHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
    setIsActive(false);
  };

  const scrollUp = () => {
    if (isActive) closeMenu();
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 720px)");
    const onResize = () => {
      if (!mobile.matches) setIsActive(false);
    };
    mobile.addEventListener("change", onResize);
    return () => mobile.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;
    navigationRef.current?.querySelector("a")?.focus();

    const handleMenuKeys = (event) => {
      if (!window.matchMedia("(max-width: 720px)").matches) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
      if (event.key === "Tab") {
        const links = [...navigationRef.current.querySelectorAll("a")];
        const first = links[0];
        const last = menuButtonRef.current;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleMenuKeys);
    return () => window.removeEventListener("keydown", handleMenuKeys);
  }, [isActive]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content py-2">
          <button type="button" onClick={() => navigateToHome()} className="header__logo text-xl justify-self-start content-center">
            <span className="header__mark" aria-hidden="true">✦</span>
            <span>AnimeBounty-Info</span>
          </button>
          <nav
            ref={navigationRef}
            id="primary-navigation"
            aria-label="Primary navigation"
            className={isActive ? "navigation show" : "navigation justify-self-center content-center"}
          >
            <ul className="navigation__list flex gap-8">
              {navItems.map((item) => (
                <li className="navigation__list-item" key={item.to}>
                  <Link
                    onClick={() => scrollUp()}
                    to={item.to}
                    className={location.pathname === item.to ? "navigation__list-link header__active" : "navigation__list-link"}
                    aria-current={location.pathname === item.to ? "page" : undefined}
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
            ref={menuButtonRef}
            onClick={() => isActive ? closeMenu() : setIsActive(true)}
            className={isActive ? "burger burger--open" : "burger"}
            aria-label={isActive ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="primary-navigation"
            aria-expanded={isActive}
            type="button"
          >
            <div className="burger__line" aria-hidden="true"></div>
            <div className="burger__line" aria-hidden="true"></div>
            <div className="burger__line" aria-hidden="true"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

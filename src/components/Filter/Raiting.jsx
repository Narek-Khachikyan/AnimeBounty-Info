import { useState } from "react";
import "./filter.scss"


const Raiting = ({ setRaiting }) => {
  const [active, setActive] = useState(2);

  const raiting = [
    { id: 1, sortType: 'pg', info: "PG - Children" },
    { id: 2, sortType: 'pg13', info: "PG-13 - Teens 13 or older" },
    { id: 3, sortType: 'r17', info: "R - 17+ (violence & profanity)" },
  ];

  const handleRaitingClick = (sortType, id) => {
    setRaiting(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {raiting.map((item) => (
        <>
          <button
            className={active === item.id ? "raiting-btn active text-base sm:text-base md:text-xl lg:text-xl xl:text-xl" : "raiting-btn text-base sm:text-base md:text-xl lg:text-xl xl:text-xl"}
            onClick={() => handleRaitingClick(item.sortType, item.id)}
            key={item.id}
          >
            {item.sortType}
            <div className="info">
              <p className="info__item"> {active === item.id && item.info}</p>
            </div>
          </button>

        </>
      ))}
    </div>
  )
}

export default Raiting

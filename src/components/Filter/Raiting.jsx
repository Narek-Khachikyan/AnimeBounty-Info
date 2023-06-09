import { useState } from "react";
import "./filter.scss"


const Raiting = ({ setRaiting }) => {
  const [active, setActive] = useState(3);

  const raiting = [
    { id: 1, sortType: 'PG' },
    { id: 2, sortType: 'PG-13' },
    { id: 3, sortType: 'R - 17+' },
    { id: 4, sortType: 'R+' },
  ];

  const handleRaitingClick = (sortType, id) => {
    setRaiting(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4">
      {raiting.map((item) => (
        <button
          className={active === item.id ? "active text-base sm:text-base md:text-xl lg:text-xl xl:text-xl" : "text-base sm:text-base md:text-xl lg:text-xl xl:text-xl"}
          onClick={() => handleRaitingClick(item.sortType, item.id)}
          key={item.id}
        >
          {item.sortType}
        </button>
      ))}
    </div>
  )
}

export default Raiting

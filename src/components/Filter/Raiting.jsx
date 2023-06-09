import { useState } from "react";
import "./filter.scss"


const Raiting = ({ setRaiting }) => {
  const [active, setActive] = useState(3);

  const raiting = [
    { id: 1, sortType: 'G' },
    { id: 2, sortType: 'PG' },
    { id: 3, sortType: 'PG-13' },
    { id: 4, sortType: 'R - 17+' },
    { id: 5, sortType: 'R+' },
  ];

  const handleButtonClick = (sortType, id) => {
    setRaiting(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4">
      {raiting.map((item) => (
        <button
          className={active === item.id ? "active text-xl" : "text-xl"}
          onClick={() => handleButtonClick(item.sortType, item.id)}
          key={item.id}
        >
          {item.sortType}
        </button>
      ))}
    </div>
  )
}

export default Raiting

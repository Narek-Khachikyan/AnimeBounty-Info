import { useState } from "react";
import "./filter.scss"

const Sort = ({ setSortBy }) => {
  const [active, setActive] = useState(1);

  const sort = [
    { id: 1, sortType: 'asc' },
    { id: 2, sortType: 'desc' },
  ];

  const handleButtonClick = (sortType, id) => {
    setSortBy(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4">
      {sort.map((item) => (
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

export default Sort

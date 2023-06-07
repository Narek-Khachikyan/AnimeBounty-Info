import React, { useState } from "react";
import "./filter.scss";

const Filter = ({ setOrderBy }) => {
  const [active, setActive] = useState(1);

  const order = [
    { id: 1, sortType: 'title' },
    { id: 2, sortType: 'score' },
    { id: 3, sortType: 'popularity' }
  ];

  const handleButtonClick = (sortType, id) => {
    setOrderBy(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4">
      {order.map((item) => (
        <button
          className={active === item.id ? "active text-xl" : "text-xl"}
          onClick={() => handleButtonClick(item.sortType, item.id)}
          key={item.id}
        >
          {item.sortType}
        </button>
      ))}
    </div>
  );
};

export default Filter;

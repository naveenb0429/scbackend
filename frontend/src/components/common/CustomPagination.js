import React from "react";

const CustomPagination = ({ activeIndex, totalSlides, onSlideChange }) => {
  const paginationItems = [];

  for (let i = 0; i < totalSlides; i++) {
    const pageNumber = i + 1;
    paginationItems.push(
      <div
        key={i}
        onClick={() => onSlideChange(i)}
        className={`pagination-item ${i === activeIndex ? "active" : ""}`}
      >
        {pageNumber}
      </div>
    );
  }

  return <div className="custom-pagination">{paginationItems}</div>;    
};

export default CustomPagination;

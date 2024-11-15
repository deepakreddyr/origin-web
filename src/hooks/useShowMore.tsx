import { useState } from "react";

const useShowMore = (initialVisibleItems: number, totalItems: number) => {
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems);
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setVisibleItems(totalItems);
    setShowAll(true);
  };

  const handleShowLess = () => {
    setVisibleItems(initialVisibleItems);
    setShowAll(false);
  };

  return {
    visibleItems,
    showAll,
    handleShowMore,
    handleShowLess,
    setShowAll,
  };
};

export default useShowMore;

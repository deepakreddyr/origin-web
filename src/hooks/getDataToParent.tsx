import { useState } from "react";

const useDataToParent = (initialState: boolean) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const handleShowAllChange = (showAll: boolean) => {
    setIsExpanded(showAll);
  };
  return { handleShowAllChange, isExpanded, setIsExpanded };
};

export default useDataToParent;

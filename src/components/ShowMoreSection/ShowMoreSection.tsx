import React, { useEffect } from "react";
import { Box, Collapse, useMediaQuery, useTheme } from "@mui/material";
import OriginButton from "../OriginButton"; // Adjust the path as necessary
import classNames from "classnames";
import useShowMore from "../../hooks/useShowMore";

interface ShowMoreSectionProps {
  children: React.ReactNode;
  initialVisibleItems: number;
  totalItems: number;
  collapsedSize?: number | string | undefined;
  onShowAllChange?: (showAll: boolean) => void;
  orientation?: "vertical" | "horizontal" | undefined;
  classes?: {
    root?: string;
    collapse?: string;
    buttonsContainer?: string;
    btnText?: string;
    showMorebtnClass?: string;
    showLessbtnClass?: string;
  };
}

const ShowMoreSection: React.FC<ShowMoreSectionProps> = ({
  children,
  initialVisibleItems,
  totalItems,
  onShowAllChange,
  collapsedSize = 500,
  classes,
  orientation = "vertical",
}) => {
  const { visibleItems, showAll, handleShowMore, handleShowLess } = useShowMore(
    initialVisibleItems,
    totalItems
  );

  useEffect(() => {
    if (onShowAllChange) {
      onShowAllChange(showAll);
    }
  }, [showAll, onShowAllChange]);

  return (
    <Box className={classNames(classes?.root)}>
      <Collapse
        className={classNames(classes?.collapse, "duration-500 transition-all")}
        in={showAll}
        collapsedSize={collapsedSize} // Disable collapsedSize on mobile
        orientation={orientation}
        timeout={1500}
        easing={{
          enter: "easeInOut",
          exit: "easeInOut",
        }}
      >
        {children}
      </Collapse>
      <Box
        className={classNames(
          "flex justify-center w-full",
          classes?.buttonsContainer
        )}
      >
        {!showAll && visibleItems < totalItems && (
          <OriginButton
            variant="primary"
            classes={{
              buttonText: classNames("font-medium", classes?.btnText),
              iconButton: classNames(classes?.showMorebtnClass),
            }}
            handleClick={handleShowMore}
            buttonText={`Show More (${totalItems})`}
          />
        )}
        {showAll && (
          <OriginButton
            variant="primary"
            classes={{
              buttonText: classNames("font-medium", classes?.btnText),
              iconButton: classNames(classes?.showLessbtnClass),
            }}
            handleClick={handleShowLess}
            buttonText={"Show less"}
          />
        )}
      </Box>
    </Box>
  );
};

export default ShowMoreSection;

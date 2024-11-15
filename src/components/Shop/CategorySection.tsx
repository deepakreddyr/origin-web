import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import ShowMoreSection from "../ShowMoreSection";
import useDataToParent from "../../hooks/getDataToParent";
import { CategoriesGrid } from "../OriginGrids";
import classNames from "classnames";
import { Categories } from "../../utilities/types";
import { useTheme } from "@mui/material";

interface CategorySectionProps {
  categories: Categories;
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  const initialVisibleItems = 30;
  const totalCategories = 100;
  const { isExpanded, handleShowAllChange } = useDataToParent(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      className={classNames(
        "relative pt-[214px] md:pt-[190px] after:h-[144px] px-0 md:px-8 md:pb-0 overflow-hidden rounded-[20px] md:rounded-[60px] rounded-t-none border-primary-200 border",
        isExpanded
          ? "after:opacity-1 after:translate-y-[144px]"
          : "after:opacity-1 after:translate-y-0",
        "after:bg-gradient-to-t  after:left-0 after:z-[1] after:from-primary-200-80 after:to-primary-100-0 after:absolute after:bottom-0 after:w-full after:transition after:duration-[.5s] after:ease-in-out"
      )}
    >
      <Container maxWidth="lg">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          className="mb-9 md:mb-10 md:py-3 md:pt-5 md:pb-5"
        >
          Shop all categories
        </Typography>
      </Container>
      <ShowMoreSection
        initialVisibleItems={initialVisibleItems}
        totalItems={totalCategories}
        onShowAllChange={handleShowAllChange}
        collapsedSize={500}
        classes={{
          root: classNames(
            "transition-all duration-1000 ease-in-out",
            isExpanded && "mb-[100px]"
          ),
          buttonsContainer: classNames(`absolute z-10 bottom-5 left-0`),
        }}
      >
        <Container>
          <CategoriesGrid categories={categories} />
        </Container>
      </ShowMoreSection>
    </Box>
  );
};

export default CategorySection;

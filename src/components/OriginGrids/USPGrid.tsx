import { Grid } from "@mui/material";
import { UspCard } from "../Cards";
import { UspCardsData } from "../../utilities/types";

export const USPGrid = ({ uspCardsData }: { uspCardsData: UspCardsData }) => {
  return (
    <Grid
      container
      rowSpacing={{ xs: "40px", md: "20px" }}
      spacing={{ xs: "20px", md: "60px" }}
    >
      {uspCardsData?.map((card) => (
        <Grid key={card.title} item xs={6} sm={6} md={3}>
          <UspCard cardData={card} />
        </Grid>
      ))}
    </Grid>
  );
};

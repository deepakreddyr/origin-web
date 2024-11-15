import { useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Recipe } from "@/utilities/types";
import { useRouter } from "next/router";

const useRecipePage = (recipe: Recipe) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const watchVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [prepOpen, setPrepOpen] = useState(false);
  const [watchStepsOpen, setWatchStepsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(0);
  const [isInstructionFullView, setIsInstructionFullView] = useState(false);

  const handlePrepStepOpen = () => setPrepOpen(true);
  const handlePrepClose = () => setPrepOpen(false);
  const handleWatchStepsOpen = () => setWatchStepsOpen(true);
  const handleWatchStepsClose = () => setWatchStepsOpen(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems((prev) => (event.target.checked ? prev + 1 : prev - 1));
  };

  const router = useRouter();
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`;

  return {
    isMobile,
    videoRef,
    watchVideoRefs,
    isPlaying,
    prepOpen,
    watchStepsOpen,
    selectedItems,
    isInstructionFullView,
    handlePrepStepOpen,
    handlePrepClose,
    handleWatchStepsOpen,
    handleWatchStepsClose,
    handleCheckboxChange,
    baseUrl,
    setIsPlaying,
    setIsInstructionFullView,
  };
};

export default useRecipePage;

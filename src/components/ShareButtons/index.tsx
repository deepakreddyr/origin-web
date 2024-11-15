import React, { useState } from "react";
import {
  WhatsappShareButton,
  PinterestShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";
import {
  LinkedIn,
  Link as LinkIcon,
  Pinterest,
  WhatsApp,
  X,
} from "@mui/icons-material";
import OriginButton from "@/components/OriginButton";
import { Box, Slide, Snackbar, Typography } from "@mui/material";
import classNames from "classnames";

type ShareButtonsProps = {
  baseUrl: string;
  data: { title: string; imgSrc: string; description: string };
  classes?: {
    root?: string;
    shareBtnContainer?: string;
    shareIconClass?: string;
  };
  className?: string;
  hidePinterest?: boolean;
  hideTwitter?: boolean;
  hideWhatsapp?: boolean;
  hideLinkedin?: boolean;
  hideCopyLink?: boolean;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({
  baseUrl,
  data,
  classes,
  className,
  hidePinterest,
  hideTwitter,
  hideWhatsapp,
  hideLinkedin,
  hideCopyLink,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopytoClipboard = () => {
    navigator.clipboard.writeText(baseUrl);
    setIsCopied(true);
  };
  return (
    <>
      <Box
        className={classNames(
          className,
          classes?.root,
          "flex items-center gap-3"
        )}
      >
        {!hideWhatsapp && (
          <Box
            className={classNames(
              "inline-grid place-content-center  rounded-xl transition-all duration-200 ease-in-out",
              classes?.shareBtnContainer
            )}
          >
            <WhatsappShareButton
              url={baseUrl}
              separator="::"
              title={data.title}
              style={{ display: "flex", padding: 12 }}
            >
              <WhatsApp
                className={classNames(
                  "w-[18px] h-auto aspect-square",
                  classes?.shareIconClass
                )}
              />
            </WhatsappShareButton>
          </Box>
        )}
        {!hidePinterest && (
          <Box
            className={classNames(
              "inline-grid place-content-center  rounded-xl transition-all duration-200 ease-in-out",
              classes?.shareBtnContainer
            )}
          >
            <PinterestShareButton
              url={baseUrl}
              media={data.imgSrc}
              description={data.description}
              style={{ display: "flex", padding: 12 }}
            >
              <Pinterest
                className={classNames(
                  "w-[18px] h-auto aspect-square",
                  classes?.shareIconClass
                )}
              />
            </PinterestShareButton>
          </Box>
        )}
        {!hideTwitter && (
          <Box
            className={classNames(
              "inline-grid place-content-center  rounded-xl transition-all duration-200 ease-in-out",
              classes?.shareBtnContainer
            )}
          >
            <TwitterShareButton
              style={{ display: "flex", padding: 12 }}
              url={baseUrl}
              title={data.title}
            >
              <X
                className={classNames(
                  "w-[18px] h-auto aspect-square",
                  classes?.shareIconClass
                )}
              />
            </TwitterShareButton>
          </Box>
        )}
        {!hideLinkedin && (
          <Box
            className={classNames(
              "inline-grid place-content-center  rounded-xl transition-all duration-200 ease-in-out",
              classes?.shareBtnContainer
            )}
          >
            <LinkedinShareButton
              style={{ display: "flex", padding: 12 }}
              url={baseUrl}
              title={data.title}
            >
              <LinkedIn
                className={classNames(
                  "w-[18px] h-auto aspect-square",
                  classes?.shareIconClass
                )}
              />
            </LinkedinShareButton>
          </Box>
        )}
        {!hideCopyLink && (
          <OriginButton
            variant="textOnly"
            handleClick={handleCopytoClipboard}
            classes={{
              iconButton: classNames(
                "p-3 inline-grid place-content-center  rounded-xl transition-all duration-200 ease-in-out",
                classes?.shareBtnContainer
              ),
            }}
          >
            <LinkIcon
              sx={{
                path: {
                  transformOrigin: "center",
                  transform: "rotate(-45deg)",
                },
              }}
              className={classNames(
                "w-[20px] h-[20px] aspect-square copyLinkIcon",
                classes?.shareIconClass
              )}
            />
          </OriginButton>
        )}
      </Box>
      <Snackbar
        open={isCopied}
        onClose={() => setIsCopied(false)}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          classes: { root: "bg-secondary rounded-3xl" },
        }}
        message={<Typography variant="body1">Copied to clipboard!</Typography>}
      />
    </>
  );
};

export default ShareButtons;

// This will show a slide transition effect for the snackbar
function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

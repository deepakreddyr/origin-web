import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
import CA from "classnames";
import Link from "next/link";
import { Blog, Recipe } from "@/utilities/types";
import classNames from "classnames";

type CardProps = {
  imgClassName?: string;
  item: Blog | Recipe;
  tag?: string;
  classes?: {
    cardRoot?: string;
    cardTitle?: string;
    imgClassName?: string;
    cardContent?: string;
    tag?: string;
    shortDesc?: string;
  };
};

type CardVariant = {
  variant?: "vertical" | "vertical-2" | "horizontal";
  big?: boolean;
  showShortDescription?: boolean;
};

const OriginCardv2: React.FC<CardProps & CardVariant> = ({
  classes,
  item,
  variant = "vertical",
  big,
  showShortDescription,
}) => {
  if (!item) return "No items found!";
  switch (variant) {
    case "horizontal": {
      return (
        <HorizontalCard
          showShortDescription={showShortDescription}
          big={big}
          item={item}
          classes={classes}
        />
      );
    }
    case "vertical": {
      return (
        <VerticalCard
          showShortDescription={showShortDescription}
          big={big}
          item={item}
          classes={classes}
          variant={variant}
        />
      );
    }
    case "vertical-2": {
      return (
        <VerticalCard
          showShortDescription={showShortDescription}
          big={big}
          item={item}
          classes={classes}
          variant={variant}
        />
      );
    }
    default: {
      return null;
    }
  }
};

export default OriginCardv2;

const VerticalCard = ({
  item,
  classes,
  big,
  showShortDescription,
  variant,
}: CardProps & CardVariant) => {
  const { title, link, imgSrc, date, author, tag, shortDescription } = item;

  switch (variant) {
    case "vertical": {
      return (
        <Link href={link} className="pointer-events-auto" data-tag={tag}>
          <Card
            className={classNames(
              classes?.cardRoot,
              "md:hover:scale-105 rounded-none bg-transparent shadow-none m-auto transition duration-200  ease-in-out"
            )}
          >
            <Image
              width={237}
              height={175}
              src={imgSrc}
              alt={title}
              className={CA(
                "rounded-3xl w-full h-full object-cover",
                classes?.imgClassName
              )}
            />
            <CardContent
              className={classNames(
                "pt-5 rounded-3xl transition",
                classes?.cardContent
              )}
            >
              <Box display="flex" justifyContent="space-between" mb={1.75}>
                <Typography
                  variant="body1"
                  className={classNames("font-medium text-sm")}
                >
                  {date}
                </Typography>
              </Box>
              <Typography
                gutterBottom
                variant={big ? "h4" : "body1"}
                component="h4"
                className={classNames(
                  classes?.cardTitle,
                  "mb-2",
                  big ? "font-bold" : "text-lg font-medium"
                )}
                title={title}
              >
                {title}
              </Typography>
              {showShortDescription && (
                <Typography variant="body1">{shortDescription}</Typography>
              )}
              <Typography variant="body1">{author.name}</Typography>
            </CardContent>
          </Card>
        </Link>
      );
    }
    case "vertical-2": {
      return (
        <Link href={link} className="pointer-events-auto">
          <Card
            className={classNames(
              classes?.cardRoot,
              "md:hover:scale-105 group rounded-none bg-transparent shadow-none m-auto transition duration-200  ease-in-out"
            )}
          >
            <Image
              width={237}
              height={175}
              src={imgSrc}
              alt={title}
              className={CA(
                "rounded-3xl w-full h-full object-cover aspect-square",
                classes?.imgClassName
              )}
            />
            <CardContent
              className={classNames(
                "p-0 mt-6 rounded-3xl transition",
                classes?.cardContent
              )}
            >
              <Typography
                variant="body1"
                className={classNames(
                  "font-medium",
                  classes?.tag,
                  big
                    ? "text-[22px] text-secondary mb-[14px]"
                    : "text-sm text-black-op-60 mb-2"
                )}
              >
                {tag}
              </Typography>
              <Typography
                gutterBottom
                variant={big ? "h4" : "body1"}
                component="h4"
                className={classNames(
                  classes?.cardTitle,
                  "mb-2",
                  big ? "font-bold" : "text-lg font-medium"
                )}
                title={title}
              >
                {title}
              </Typography>
              {showShortDescription && (
                <Typography
                  variant="body1"
                  className={classNames(
                    classes?.shortDesc,
                    "mb-2 font-light text-sm"
                  )}
                >
                  {shortDescription}
                </Typography>
              )}
              <Typography
                variant="body1"
                className={classNames("font-light text-sm text-black-op-50")}
              >
                {date}, By <span className="font-medium">{author.name}</span>
              </Typography>
            </CardContent>
          </Card>
        </Link>
      );
    }
  }
};
const HorizontalCard = ({
  item,
  classes,
  big = false,
}: CardProps & CardVariant) => {
  const { title, link, imgSrc, date, author, tag } = item;
  return (
    <Link href={link} className="pointer-events-auto">
      <Card
        sx={{
          margin: "auto",
          boxShadow: 0,
          background: "transparent",
        }}
        className={classNames(
          classes?.cardRoot,
          "md:hover:scale-105 flex flex-row h-min transition duration-200 ease-in-out"
        )}
      >
        <Image
          width={124}
          height={124}
          src={imgSrc}
          alt={title}
          className={CA(
            "rounded-3xl w-[124px] min-w-[124px] h-auto aspect-square object-cover",
            classes?.imgClassName
          )}
        />
        <Box
          className={classNames(
            "ps-4 p-0 rounded-3xl transition",
            classes?.cardContent
          )}
        >
          <Typography
            variant="body1"
            className={classNames("font-medium text-sm text-secondary mb-2")}
          >
            {tag}
          </Typography>
          <Typography
            gutterBottom
            variant={big ? "h4" : "body1"}
            component="h4"
            className={classNames(
              classes?.cardTitle,
              "mb-2",
              big ? "font-bold" : "text-lg font-medium"
            )}
            title={title}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            className={classNames("font-light text-sm text-black-op-50")}
          >
            {date}, By <span className="font-medium">{author.name}</span>
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

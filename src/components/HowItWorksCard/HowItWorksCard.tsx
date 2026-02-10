import { HowItWorksList } from '../../utilities/types';
import { Badge, Card, Stack, Typography } from '@mui/material';
import CA from 'classnames';
import Image from 'next/image';

interface HowItWorksCardProps extends HowItWorksList {
  reversed: boolean;
  index: number;
}

const HowItWorksCard = ({ image, title, desc, reversed, index }: HowItWorksCardProps) => {
  return (
    <Card
      className={CA(
        'border-none flex justify-between sm:items-center bg-transparent gap-5 md:gap-10 lg:gap-0 flex-col',
        reversed ? 'sm:flex-row-reverse' : 'sm:flex-row'
      )}
      variant="outlined"
    >
      <Image
        height={396}
        width={396}
        src={image.url}
        alt={image.alt}
        title={image.title}
        className={CA(
          'md:h-[396px] md:w-[396px] sm:h-[300px] sm:w-[300px] h-[350px] w-[350px]',
          reversed ? 'ml-0' : 'lg:ml-[75px]'
        )}
      />
      <Stack direction={'row'} className="gap-4 md:gap-[26px]">
        <Badge className="place-content-center grid bg-primary rounded-full w-[52px] h-[52px] aspect-square">
          <Typography className="font-medium text-[26px] leading-none">{index}</Typography>
        </Badge>
        <Stack direction={'column'} className={CA('max-w-[282px] sm:max-w-[444px] gap-3 sm:gap-[30px]')}>
          <Typography
            variant="body2"
            className="font-semibold text-[32px] text-secondary md:text-[56px] leading-[38.4px] md:leading-[61.6px]"
          >
            {title}
          </Typography>
          <Typography className="font-semibold text-lg md:text-xl">{desc}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default HowItWorksCard;

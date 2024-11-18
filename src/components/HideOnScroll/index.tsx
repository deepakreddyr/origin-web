import { Slide, useScrollTrigger } from '@mui/material';

interface Props {
  // @ts-ignore
  window?: () => Window;
  children?: any;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default HideOnScroll;

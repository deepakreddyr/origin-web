import { Box, Button, Typography } from "@mui/material";

// import { isAddressIsOpen } from '../../context/atoms';
import styles from "./style.module.css";

export default function DeliveryChangeConfirmation() {
  // const [, setIsOpen] = useAtom(isAddressIsOpen);
  // const [, setIsOpenCart] = useAtom(isCartPageIsOpen);

  // const onClose = () => {
  //   setIsOpen(false);
  //   setIsOpenCart(true);
  // };
  return (
    <Box className={styles["main-container"]}>
      <Typography className={styles["delivery-change-heading"]}>
        Delivery Location changed!
      </Typography>
      <Typography className={styles["delivery-change-content"]}>
        This might affect the maximum item limit, prices and availability based
        on changed location.
      </Typography>
      <Typography className={styles["review-cart-content"]}>
        Please review your cart & continue.
      </Typography>
      <Button>Delete</Button>
      <Button>Contact Support</Button>
    </Box>
  );
}

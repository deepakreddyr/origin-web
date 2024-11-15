import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

import styles from "./styles.module.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelOrderModal(props: Props) {
  const { isOpen, onClose, onConfirm } = props;
  return (
    <Modal className={styles["cancel-modal"]} open={isOpen} onClose={onClose}>
      <Box sx={style} className={styles["cancel-container"]}>
        <Typography className={styles["cancel-heading"]}>
          Cancel this Order?
        </Typography>
        <Typography className={styles["cancel-text"]}>
          Are you sure? that you cancel this order?
        </Typography>
        <Box className={styles["cancel-btn-container"]}>
          <Button onClick={onConfirm} className={styles["cancel-btn"]}>
            Yes Cancel
          </Button>
          <Button onClick={onClose} className={styles["go-btn"]}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

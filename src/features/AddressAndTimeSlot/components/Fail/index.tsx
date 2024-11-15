import { Button } from "@mui/material";
import { useAtom } from "jotai";

import { razorPayObjectAtom } from "../../context/atoms";

const Fail = () => {
  const [razorPayObject, setRazorPayObject] = useAtom(razorPayObjectAtom);

  const onClick = () => {
    try {
      if (!razorPayObject) return;
      // @ts-ignore
      const razorpayInstance = new Razorpay(razorPayObject);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button onClick={onClick}>Retry Payment</Button>
    </>
  );
};

export default Fail;

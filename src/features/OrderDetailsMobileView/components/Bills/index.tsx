// import { Box } from '@mui/material';
import { useAtomValue } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import type { Bill } from "../../types/Bill";
import ToggleBill from "../ToggleBill";

const Bills = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const totalSavings = React.useMemo(() => {
    const saving = orderDetails.data?.items.reduce((savings, item) => {
      const itemSavings = item.ordered_uoms.reduce((uomSavings, uom) => {
        return uomSavings + (uom.market_price_sub_total - uom.subtotal);
      }, 0);
      return savings + itemSavings;
    }, 0);

    return Math.round((saving ?? 0) * 10) / 10;
  }, [orderDetails]);

  return (
    <>
      {orderDetails?.data?.bills
        .filter((bill) => bill.payment_method !== "Refund")
        .map((bill: Bill) => {
          return (
            <ToggleBill
              bill={bill}
              key={bill.bill_id}
              totalSavings={totalSavings}
            />
          );
        })}
    </>
  );
};

export default Bills;

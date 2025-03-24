// import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import ToggleBill from './ToggleBill';

const Bills = (props: any) => {
  const { orderDetails } = props;
  const totalSavings = React.useMemo(() => {
    const saving = orderDetails.items.reduce((savings: any, item: any) => {
      const itemSavings = item.ordered_uoms.reduce((uomSavings: any, uom: any) => {
        return uomSavings + (uom.market_price_sub_total - uom.subtotal);
      }, 0);
      return savings + itemSavings;
    }, 0);

    return Math.round((saving ?? 0) * 10) / 10;
  }, [orderDetails]);

  return (
    <>
      {orderDetails?.bills
        .filter((bill: any) => bill.payment_method !== 'Refund')
        .map((bill: any) => {
          return <ToggleBill bill={bill} key={bill.bill_id} totalSavings={totalSavings} orderDetails={orderDetails} />;
        })}
    </>
  );
};

export default Bills;

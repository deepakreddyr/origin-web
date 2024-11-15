export default function getEditCartTotal(editOrder: any) {
  return () => {
    if (editOrder.orderItems && Array.isArray(editOrder.orderItems)) {
      let totalPrice: number = 0;

      editOrder.orderItems.forEach((item: any) => {
        item.uom.forEach((uom: any) => {
          totalPrice += uom.qty * uom.price;
        });
      });

      return totalPrice;
    }
    return 0;
  };
}

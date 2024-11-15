export const DeliveryStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED_BY_ADMIN: "rejected by admin",
  PROCESSING: "processing",
  PREPARING_FOR_DISPATCH: "preparing for dispatch",
  OUT_FOR_DELIVERY: "out for delivery",
  ON_THE_WAY: "on the way",
  NEAR_BY: "nearby",
  DELIVERED: "delivered",
  NOT_DELIVERED: "not delivered",
  CANCEL_BY_USER: "cancelled by user",
  ARRIVED_AT_LOCATION: "arrived at location",
};

export const DeliveryStatusTitle = {
  PENDING: "Placed",
  ACCEPTED: "Accepted",
  REJECTED_BY_ADMIN: "Rejected_by_admin",
  PROCESSING: "processing",
  OUT_FOR_DELIVERY: "out for delivery",
  PREPARING_FOR_DISPATCH: "preparing for dispatch",
  ON_THE_WAY: "on the way",
  NEAR_BY: "nearby",
  DELIVERED: "delivered",
  NOT_DELIVERED: "not delivered",
  ARRIVED_AT_LOCATION: "arrived at location",
};

export const DeliveryStatusText = {
  PENDING: "ORDER PLACED",
  ACCEPTED: "ORDER Confirmed!",
  REJECTED_BY_ADMIN: "ORDER FAILED",
  PROCESSING: "GETTING PACKED",
  PREPARING_FOR_DISPATCH: "PREPARING FOR DISPATCH",
  OUT_FOR_DELIVERY: "OUT FOR DELIVERY",
  ON_THE_WAY: "ON THE WAY",
  NEAR_BY: "ON THE WAY",
  DELIVERED: "SUCCESSFULLY DELIVERED",
  NOT_DELIVERED: "DELIVERY FAILED",
  ARRIVED_AT_LOCATION: "ARRIVED AT YOUR LOCATION",
};

export const DeliveryStatusDesc = {
  PENDING: "Your order got placed! and will shortly be confirmed",
  ACCEPTED: "Hang tight! We will sort and pack your order.",
  REJECTED_BY_ADMIN:
    "We are sorry! Please reach out to customer care or refresh the app and order again",
  PROCESSING: "Your order is being weighed & checked",
  PREPARING_FOR_DISPATCH:
    "Your order is being prepared and will soon be collected by our delivery agent.",
  OUT_FOR_DELIVERY:
    "Our agent has left the building! We will notify you when they are about to reach!",
  ON_THE_WAY:
    "Our agent has started from store, we will notify you when its nearby",
  NEAR_BY: "Our Agent has is on the way to deliver freshness to your door step",
  DELIVERED: "Your order has been delivered! ",
  NOT_DELIVERED:
    "We tried our best, and now we leave the rest to Customer Care! Get in touch to locate your order. ",
  ARRIVED_AT_LOCATION:
    "The delivery partner has arrived at your location your order will be delivered soon.",
};

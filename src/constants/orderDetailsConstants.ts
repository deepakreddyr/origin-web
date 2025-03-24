import { IllustrationsList } from '@/assets/OrderStatusAnimations';

export const DeliveryStatusDetails: any = {
  pending: {
    status: 'pending',
    title: 'Placed',
    text: 'ORDER PLACED',
    description: 'Your order got placed! and will shortly be confirmed',
    illustration: IllustrationsList.orderPlacedLottie,
    background: '#F8BE29',
    color: '#000000',
    statusTitle: ' Awaiting',
    statusDesc: 'CONFIRMATION'
  },
  accepted: {
    status: 'accepted',
    title: 'Accepted',
    text: 'ORDER Confirmed!',
    description: 'Hang tight! We will sort and pack your order.',
    illustration: IllustrationsList.orderPlaceConfirmedLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Order',
    statusDesc: 'CONFIRMED'
  },
  'rejected by admin': {
    status: 'rejected by admin',
    title: 'Rejected_by_admin',
    text: 'ORDER FAILED',
    description: 'We are sorry! Please reach out to customer care or refresh the app and order again',
    illustration: IllustrationsList.orderPlacedRejectedLottie,
    background: '#854000',
    color: '#fff',
    statusTitle: 'Order',
    statusDesc: 'Admin rejected'
  },
  processing: {
    status: 'processing',
    title: 'processing',
    text: 'GETTING PACKED',
    description: 'Your order is being weighed & checked',
    illustration: IllustrationsList.orderPackedLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Order',
    statusDesc: 'Processing'
  },
  'preparing for dispatch': {
    status: 'preparing for dispatch',
    title: 'preparing for dispatch',
    text: 'PREPARING FOR DISPATCH',
    description: 'Your order is being prepared and will soon be collected by our delivery agent.',
    illustration: IllustrationsList.preparingForDispatch,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Staring',
    statusDesc: ''
  },
  'out for delivery': {
    status: 'out for delivery',
    title: 'out for delivery',
    text: 'OUT FOR DELIVERY',
    description: 'Our agent has left the building! We will notify you when they are about to reach!',
    illustration: IllustrationsList.outForDelivery,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Reaching in',
    statusDesc: 'timer'
  },
  'on the way': {
    status: 'on the way',
    title: 'on the way',
    text: 'ON THE WAY',
    description: 'Our agent has started from store, we will notify you when its nearby',
    illustration: IllustrationsList.ontheWayLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Reaching in',
    statusDesc: 'timer'
  },
  nearby: {
    status: 'nearby',
    title: 'nearby',
    text: 'ON THE WAY',
    description: 'Our Agent is on the way to deliver freshness to your doorstep',
    illustration: IllustrationsList.deliveryNearyLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Reaching in',
    statusDesc: 'timer'
  },
  delivered: {
    status: 'delivered',
    title: 'delivered',
    text: 'SUCCESSFULLY DELIVERED',
    description: 'Your order has been delivered!',
    illustration: IllustrationsList.orderDeliveredLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: ' Order',
    statusDesc: 'FULFILLED'
  },
  'not delivered': {
    status: 'not delivered',
    title: 'not delivered',
    text: 'DELIVERY FAILED',
    description: 'We tried our best, and now we leave the rest to Customer Care! Get in touch to locate your order.',
    illustration: IllustrationsList.orderNotDeliveredLottie,
    background: '#854000',
    color: '#fff',
    statusTitle: ' Delivery',
    statusDesc: 'FAILED'
  },
  'arrived at location': {
    status: 'arrived at location',
    title: 'arrived at location',
    text: 'ARRIVED AT YOUR LOCATION',
    description: 'The delivery partner has arrived at your location your order will be delivered soon.',
    illustration: IllustrationsList.mapLottie,
    background: '#00855B',
    color: '#fff',
    statusTitle: 'Order',
    statusDesc: 'ARRIVED'
  },
  'cancelled by user': {
    status: 'cancelled by user',
    title: 'Cancelled by user',
    text: 'ORDER CANCELLED',
    description: 'Order Cancelled',
    illustration: IllustrationsList.orderPlacedRejectedLottie,
    background: '#854000',
    color: '#fff',
    statusTitle: 'Order',
    statusDesc: 'CANCELLED'
  }
};

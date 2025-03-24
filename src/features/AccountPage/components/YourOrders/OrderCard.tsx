import React from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon'; // Import DateTime from Luxon
import { activeAccountsPageAtom, isAccountIsOpen } from '../../context/atoms';
import { useAtom } from 'jotai';
import ActiveSidebar from '../../enums/ActiveSidebar';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';

interface Props {
  order: {
    order_id: string;
    created_at: number;
    status: string;
    item_details: string;
    total: number;
  };
}

const OrderCard = (props: Props) => {
  const { order } = props;
  const router = useRouter();
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setIsOpen] = useAtom(isAccountIsOpen);
  const dispatch = useDispatch();
  const formattedDate = order.created_at
    ? DateTime.fromMillis(order.created_at * 1000).toFormat("h:mm a '-' MMM  d, yyyy ")
    : '';

  const redirectOnClick = (orderId: any) => {
    router.push(`/orders/${orderId}`);
    setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
    dispatch(setIsSidebarOpen(false));
    setIsOpen(false);
  };

  return (
    <div
      key={order.order_id}
      className="cursor-pointer bg-[#F8F4E9] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[3vw] rounded-[.83vw] "
      onClick={() => redirectOnClick(order.order_id)}
    >
      <div className="flex justify-between items-center mob:pb-[2.5vw] pb-[.6vw]">
        <span className="font-bold text-[.97vw] mob:text-[3.6vw] font-[SofiaPro] ">{`ORDER ID ${order.order_id}`}</span>

        <div>
          {order.status === 'Delivered' ? (
            <div className="bg-[#231F201A] px-[1.1vw] mob:px-[4.1vw] mob:py-[1.5vw] py-[.4vw] mob:rounded-[2vw] rounded-[.6vw]">
              <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-black">DELIVERED</p>
            </div>
          ) : order.status === 'Not Delivered' || order.status === 'Rejected by admin' ? (
            <div className="bg-[#C700001A] px-[1.1vw] mob:px-[4.1vw] mob:py-[1.5vw] py-[.4vw] mob:rounded-[2vw] rounded-[.6vw]">
              <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-danger">NOT DELIVERED</p>
            </div>
          ) : (
            <div className=" bg-[#25874D1A] px-[1.1vw] mob:px-[4.1vw] mob:py-[1.5vw] py-[.4vw] mob:rounded-[2vw] rounded-[.6vw] ">
              <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-secondary">IN PROGRESS</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">{order.item_details}</p>
      <div className="flex justify-between text-[.83vw] mob:text-[3vw] text-gray-600 font-medium">
        <span className="">{`Ordered at ${formattedDate}`}</span>
        <span className="font-bold text-black text-[.83vw] mob:text-[3vw]">{`Total ₹${order.total}`}</span>
      </div>
    </div>
  );
};

export default OrderCard;

import { useAtom } from "jotai";
import React from "react";
import {
  checkoutAPI,
  FailOrSuccess,
  failOrSuccess,
  isPaymentIsOpen,
  paymentPrefillAtom,
  razorPayObjectAtom,
} from "../context/atoms";
import {
  cartAtom,
  cartItems,
  checkoutExtraDetailsAtom,
  isCartPageIsOpen,
} from "@/features/CartPage/context/atoms";
import { useRouter } from "next/router";
import useCartCalculation from "@/features/CartPage/hooks/useCartCalculation";
import toast from "react-hot-toast";
import { isAddressAndTimeSlotIsOpen } from "@/features/AddressAndTimeSlot/context/atoms";
import { header, request } from "@/utilities/request";
import { mainApiUrl } from "@/url";
import { isCouponApplied } from "@/features/CouponPage/context/atoms";

const usePaymentHook = () => {
  const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const [cartItemsAtom, setCartItems] = useAtom(cartItems);
  const [appliedCoupon] = useAtom(isCouponApplied);
  const [isFailOrSuccess, setFailOrSuccess] = useAtom(failOrSuccess);
  const router = useRouter();
  const [, setRazorPayObject] = useAtom(razorPayObjectAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [checkoutExtraDetails, setCheckoutExtraDetails] = useAtom(
    checkoutExtraDetailsAtom
  );
  const [checkoutDetails] = useAtom(checkoutAPI);
  const [, setIsOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  const [, setIsCartPageOpen] = useAtom(isCartPageIsOpen);
  const [, setIsPaymentPageOpen] = useAtom(isPaymentIsOpen);
  const { subTotal, total } = useCartCalculation();

  const [paymentPrefill, setPaymentPrefill] = useAtom(paymentPrefillAtom);

  const onSuccess = (orderId?: number) => {
    setRazorPayObject(null);
    setFailOrSuccess(FailOrSuccess.SUCCESS);
    if (orderId) {
      setTimeout(() => {
        router.push(`/home/orders/${orderId}`);
        resetPaymentStates();
      }, 500);
    }
  };
  const onFailure = () => {
    setFailOrSuccess(FailOrSuccess.FAIL);
  };

  const resetPaymentStates = () => {
    setCart({
      loading: false,
      success: false,
      error: false,
      cart: null,
      cartValues: null,
    });
    setCheckoutExtraDetails({
      instructions: "",
      isRewardsEnabledInCart: false,
    });
    setCartItems([]);
    setFailOrSuccess(FailOrSuccess.NONE);
    setIsCartPageOpen(false);
    setIsPaymentPageOpen(false);
    setIsOpen(false);
  };

  const getTimeSlot = () => {
    if (!cart.cartValues?.timeSlotId) return "";
    if (cart.cartValues?.timeSlotId === "instant") return null;
    return cart.cartValues?.timeSlotId;
  };

  const onInitiatePayment = async () => {
    try {
      const isCash = paymentPrefill.toLowerCase() === "cash";
      const payload: any = {
        items:
          cartItemsAtom?.map((e) => ({
            item_code: e.item_code,
            uom: e.uom
              .map((uomItem: any) => {
                return {
                  variant_id: uomItem.variant_id,
                  qty: uomItem.qty,
                };
              })
              .filter((uomItem: any) => uomItem.qty !== 0),
          })) || [],
        delivery_fee: 0,
        delivery_type: "normal",
        individual_package_enabled: false,
        delivery_date: checkoutDetails.data?.delivery_date
          ? checkoutDetails.data?.delivery_date[0]
          : 0,
        sub_total: subTotal,
        tax: 0,
        total,
        payment_method: isCash ? paymentPrefill : "razorpay",
        time_slot_id: getTimeSlot(),
        uuid: "18925c07-21f7-4af7-96bc-249479e5f92b",
        is_exotel_enabled: true,
        instructions: checkoutExtraDetails.instructions,
        meta: {
          device_type: "web",
        },
      };

      if (!isCash) {
        payload.sub_payment_method = paymentPrefill;
      }

      if (appliedCoupon.isApplied && appliedCoupon.coupon) {
        if (appliedCoupon.coupon.id) {
          payload.coupon_id = appliedCoupon.coupon.id;
        }
      }

      const orderResponse: any = await request(mainApiUrl.fetchOrders, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: header(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (isCash) {
        onSuccess(orderResponse?.data.order_id);
        return;
      }

      const razorpayOptions = {
        key: razKey,
        amount: String(total),
        currency: "INR",
        name: "Madras Mandi",
        description: "Madras Mandi",
        prefill: {
          name: "name",
          email: "email",
          contact: "9999999999",
          method: paymentPrefill,
        },
        order_id: orderResponse?.data?.razorpay_order_id,
        handler() {
          onSuccess(orderResponse?.data.order_id);
        },
        modal: {
          ondismiss() {
            onFailure();
          },
        },
        theme: {
          color: "#EAE5CF",
        },
      };

      setRazorPayObject(razorpayOptions);

      // @ts-ignore
      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (err: any) {
      if (err?.response) {
        try {
          // Attempt to extract JSON error message
          const errorData = await err.response?.json();
          console.error(
            "Parsed error message:",
            errorData.message || "Unknown error response"
          );
          if (errorData.message) {
            toast.error(errorData.message);
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          console.error("Raw error response:", await err);
        }
      } else {
        console.error("Fetch failed:", err.message || err);
      }
    }
  };

  return {
    setPaymentPrefill,
    paymentPrefill,
    onInitiatePayment,
    isFailOrSuccess,
    setFailOrSuccess,
    resetPaymentStates,
  };
};

export default usePaymentHook;

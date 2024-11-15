import { useAtom } from 'jotai';
import React from 'react';

import type {
  DeliveryInstructionType,
  SingleDeliveryInstruction,
} from '../components/DeliveryInstruction/data/deliveryInstructions';
import deliveryInstructionDefault, {
  slugGenerator,
} from '../components/DeliveryInstruction/data/deliveryInstructions';
import TypeOfDeliveryInstruction from '../components/DeliveryInstruction/data/typeOfDeliveryInstruction';
import { checkoutExtraDetailsAtom } from '../context/atoms';

const { AVOID_CALLING, DO_NOT_RING_BILL, GIVE_TO_SECURITY, LEAVE_AT_DOOR } =
  TypeOfDeliveryInstruction;

const useDeliveryInstructionActions = () => {
  const [deliveryInstruction, setDeliveryInstruction] =
    React.useState<DeliveryInstructionType>(deliveryInstructionDefault);

  const [, setCheckoutExtraDetails] = useAtom(checkoutExtraDetailsAtom);

  const setInstructionString = (instruction: string) => {
    setCheckoutExtraDetails((prevState) => ({
      ...prevState,
      instructions: instruction,
    }));
  };

  React.useEffect(() => {
    const deliveryInstructionName = [...deliveryInstruction]
      .filter((item) => item.isActivated && !item.isDisabled)
      .map((item) => item.name);
    let deliveryInstructionString = '';
    deliveryInstructionName.forEach((item, index) => {
      if (
        index === deliveryInstructionName.length - 1 &&
        deliveryInstructionName.length > 1
      ) {
        deliveryInstructionString += `and ${item}`;
      } else if (index === deliveryInstructionName.length - 1) {
        deliveryInstructionString += item;
      } else if (index === deliveryInstructionName.length - 2) {
        deliveryInstructionString += `${item} `;
      } else {
        deliveryInstructionString += `${item}, `;
      }
    });
    setInstructionString(deliveryInstructionString);
  }, [deliveryInstruction]);

  const swapStateValues = (
    itemInstruction: SingleDeliveryInstruction,
    slugChange: string = ''
  ) => {
    if (slugChange) {
      const matchingSlug = [...deliveryInstruction].find(
        (item) => item.slug === slugChange
      );
      if (matchingSlug?.isActivated) {
        return [...deliveryInstruction].map((item) => {
          const tempItem = item;

          if (
            item.slug === matchingSlug.slug ||
            item.slug === itemInstruction.slug
          ) {
            tempItem.isActivated = !tempItem.isActivated;
          }
          return tempItem;
        });
      }
    }
    return [...deliveryInstruction].map((item) => {
      const tempItem = item;
      if (item.slug === itemInstruction.slug) {
        tempItem.isActivated = !item.isActivated;
      }
      return item;
    });
  };

  const onChangeDeliveryInstruction = (slug: string) => () => {
    const itemInstruction = [...deliveryInstruction].find(
      (item) => item.slug === slug
    );

    // Return if column is disabled
    if (!itemInstruction || itemInstruction.isDisabled) return;

    let deliveryInstructionVal = [...deliveryInstruction];

    switch (itemInstruction.slug) {
      case slugGenerator(AVOID_CALLING): {
        // if (
        //   (paymentMethod === 'razorpay' || paymentMethod === 'wallet') &&
        //   props.getSubPaymentMethod !== 'payOnDelivery'
        // ) {
        //   deliveryInstructionVal = swapStateValues(item_instruction);
        // } else {
        deliveryInstructionVal = swapStateValues(
          itemInstruction,
          slugGenerator(DO_NOT_RING_BILL)
        );
        // }
        break;
      }

      case slugGenerator(DO_NOT_RING_BILL): {
        // if (
        //   (paymentMethod === 'razorpay' || paymentMethod === 'wallet') &&
        //   props.getSubPaymentMethod !== 'payOnDelivery'
        // ) {
        //   deliveryInstructionVal = swapStateValues(item_instruction);
        // } else {
        deliveryInstructionVal = swapStateValues(
          itemInstruction,
          slugGenerator(AVOID_CALLING)
        );
        // }
        break;
      }

      case slugGenerator(GIVE_TO_SECURITY): {
        deliveryInstructionVal = swapStateValues(
          itemInstruction,
          slugGenerator(LEAVE_AT_DOOR)
        );
        break;
      }

      case slugGenerator(LEAVE_AT_DOOR): {
        deliveryInstructionVal = swapStateValues(
          itemInstruction,
          slugGenerator(GIVE_TO_SECURITY)
        );
        break;
      }

      default:
        deliveryInstructionVal = [...deliveryInstruction].map((item) => {
          const tempItem = item;
          if (item.slug === itemInstruction.slug) {
            tempItem.isActivated = !item.isActivated;
          }
          return tempItem;
        });
        break;
    }

    setDeliveryInstruction(deliveryInstructionVal);
  };

  return { data: deliveryInstruction, onChange: onChangeDeliveryInstruction };
};

export default useDeliveryInstructionActions;

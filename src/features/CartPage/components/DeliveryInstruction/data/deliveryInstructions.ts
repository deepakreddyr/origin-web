import NotRingBell from '../../../assets/avoid-bell.svg';
import NoCalling from '../../../assets/avoid-calling.svg';
import LeaveAtGate from '../../../assets/leave-at-gate.svg';
import TypeOfDeliveryInstruction from './typeOfDeliveryInstruction';

const { AVOID_CALLING, DO_NOT_RING_BILL, GIVE_TO_SECURITY, LEAVE_AT_DOOR } =
  TypeOfDeliveryInstruction;

export const slugGenerator = (name: string) => name.split(' ').join('_');

export type SingleDeliveryInstruction = {
  slug: string;
  name: TypeOfDeliveryInstruction;
  isActivated: boolean;
  isDisabled: boolean;
  image: any;
};

export type DeliveryInstructionType = SingleDeliveryInstruction[];

const deliveryInstructionDefault: DeliveryInstructionType = [
  {
    slug: slugGenerator(LEAVE_AT_DOOR),
    name: LEAVE_AT_DOOR,
    isActivated: false,
    isDisabled: false,
    image: LeaveAtGate,
  },
  {
    slug: slugGenerator(GIVE_TO_SECURITY),
    name: GIVE_TO_SECURITY,
    isActivated: false,
    isDisabled: false,
    image: LeaveAtGate,
  },
  {
    slug: slugGenerator(AVOID_CALLING),
    name: AVOID_CALLING,
    isActivated: false,
    isDisabled: false,
    image: NoCalling,
  },
  {
    slug: slugGenerator(DO_NOT_RING_BILL),
    name: DO_NOT_RING_BILL,
    isActivated: false,
    isDisabled: false,
    image: NotRingBell,
  },
];

export default deliveryInstructionDefault;

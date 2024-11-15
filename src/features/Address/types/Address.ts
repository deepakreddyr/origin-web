export default interface Address {
  address_id: number;
  address: string;
  address_name: string;
  is_default: boolean;
  deliverable: boolean;
  latitude: number;
  longitude: number;
  enable_instant_delivery: boolean;
  door_no: string | null;
  locality: string | null;
  landmark: string | null;
  earliest_timeslot: string | null;
  earliest_timeslot_instant: string;
  earliest_timeslot_message: string | null;
  earliest_timeslot_message_instant: string;
  store_id: number | null;
  show_instant_delivery: boolean;
}

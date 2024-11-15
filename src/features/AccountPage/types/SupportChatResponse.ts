interface Option {
  id: number;
  message: string;
}

interface Chat {
  id: number;
  question: string;
  message: null;
  image: null;
  rating: false;
  type: string;
  options: Option[];
  user_type: string;
}

export default interface SupportChatResponse {
  id: number;
  order_id: string | number;
  order_total: number;
  ticket_raised_at: number;
  chats: Chat[];
  ticket_status: null;
  enable_custom_message: false;
}

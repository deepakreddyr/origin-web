import type SupportChatResponse from "./SupportChatResponse";

type SupportChatAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: SupportChatResponse | null;
};

export default SupportChatAtom;

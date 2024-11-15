import type ReferEarnResponse from './ReferEarnResponse';

type ReferEarnAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: ReferEarnResponse | null;
};

export default ReferEarnAtom;

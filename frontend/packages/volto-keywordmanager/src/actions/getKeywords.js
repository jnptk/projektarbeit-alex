import { GET_KEYWORDS } from '../constants/ActionTypes';

export default function getKeywords(keyword) {
  return {
    type: GET_KEYWORDS,
    request: {
      op: 'get',
      path: `/@Tags?keyword=${keyword}`,
    },
  };
}

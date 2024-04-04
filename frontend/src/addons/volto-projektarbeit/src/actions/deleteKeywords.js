import { DELETE_KEYWORDS } from '../constants/ActionTypes';

export default function deleteKeywords(keywords) {
  return {
    type: DELETE_KEYWORDS,
    request: {
      op: 'delete',
      path: '/@Tags',
    },
  };
}

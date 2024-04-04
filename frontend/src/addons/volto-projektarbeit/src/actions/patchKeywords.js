import { PATCH_KEYWORDS } from '../constants/ActionTypes';
// TODO : REFAKTOR DEN BODY
export default function patchKeywords(keywords, changeto) {
  return {
    type: PATCH_KEYWORDS,
    request: {
      op: 'patch',
      path: '/@Tags',
      // data: {`"keywords":"${keywords}","changeto":"${changeto}`},
      // body : {}
      data: { keywords: keywords, changeto: changeto },
    },
  };
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords, patchKeywords } from '../../actions';

import { Button } from 'semantic-ui-react';

const KeywordControlPanel = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(getKeywords('')), []);
  // useEffect(() => dispatch(patchKeywords(), [patchKeywords]));
  const keywords = useSelector((state) => state.keywords?.items) || [];
  // const [showSearch, setShowSearch] = useState(true);
  // const [showChange, setShowChange] = useState(false);
  // const [showDelete, setShowDelete] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState('');
  const [mode, setMode] = useState('change');
  const [selectedChangeto, setSelectedChangeto] = useState('');

  keywords[0]?.Levenshtein &&
    keywords.sort((a, b) => a.Levenshtein - b.Levenshtein);
  return (
    <>
      <span>
        <h1>Keywordmanager</h1>
        <Button onClick={() => setMode('change')}>Ändern</Button>
        <Button onClick={() => setMode('delete')}>Löschen</Button>
      </span>

      <label htmlFor="keyword">Enter Keyword: </label>
      <input
        onChange={(e) => {
          dispatch(getKeywords(e.target.value));
        }}
      />
      <h2>
        {keywords.map((keyword, index) => (
          <React.Fragment key={index}>
            <span>{keyword.Keywordname}</span>
            <br />
          </React.Fragment>
        ))}
      </h2>

      {mode === 'change' && (
        <div>
          <label>Enter Keywords you wish to change: </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            onChange={(e) => {
              setSelectedKeywords(e.target.value);
            }}
          />
          <br />
          <label>Enter the new Keyword: </label>
          <input
            type="text"
            id="changeto"
            name="changeto"
            onChange={(e) => {
              setSelectedChangeto(e.target.value);
            }}
          />
          <br />
          <Button
            onClick={() =>
              dispatch(patchKeywords(selectedKeywords, selectedChangeto))
            }
          >
            Ändern
          </Button>
          {/* <span>

          </span> */}
        </div>
      )}
      {mode === 'delete' && (
        <div>
          <label>Enter Keyword you wish to delete</label>
          <input type="text" id="keyword" name="keyword" />
          <input type="submit" value="submit" />
        </div>
      )}
    </>
  );
};

export default KeywordControlPanel;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords, patchKeywords, deleteKeywords } from '../../actions';

import { Button, Checkbox, Icon, Container } from 'semantic-ui-react';

const KeywordControlPanel = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(getKeywords('')), [dispatch]);

  const keywords = useSelector((state) => state.keywords?.items) || [];

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [mode, setMode] = useState('');
  const [selectedChangeto, setSelectedChangeto] = useState('');

  function removeKeywords(keyword) {
    let indexToRemove = selectedKeywords.indexOf(keyword);

    selectedKeywords.splice(indexToRemove, 1);
    setSelectedKeywords(selectedKeywords);
  }
  keywords[0]?.Levenshtein &&
    keywords.sort((a, b) => a.Levenshtein - b.Levenshtein);

  return (
    <Container>
      <span>
        <h1>Keywordmanager</h1>
        <label htmlFor="keyword">Enter Keyword: </label>
        <input
          onChange={(e) => {
            dispatch(getKeywords(e.target.value));
          }}
        />
        <Button
          toggle
          active={mode === 'change'}
          onClick={() => {
            mode === 'change' ? setMode('') : setMode('change');
          }}
        >
          Ändern
        </Button>
        <Button
          toggle
          active={mode === 'delete'}
          onClick={() => {
            mode === 'delete' ? setMode('') : setMode('delete');
          }}
        >
          Löschen
        </Button>
      </span>

      <h2>
        {mode === '' &&
          keywords.map((keyword, index) => (
            <React.Fragment key={index}>
              <span>{keyword.Keywordname}</span>
              <Button
                class="miniDeleteButton"
                onClick={() => dispatch(deleteKeywords([keyword.Keywordname]))}
              >
                <Icon name="delete" />
              </Button>
              <br />
            </React.Fragment>
          ))}

        {(mode === 'delete' || mode === 'change') &&
          keywords.map((keyword, index) => (
            <div key={index}>
              <span>
                {keyword.Keywordname}
                <Checkbox
                  onChange={(e, data) => {
                    data.checked
                      ? setSelectedKeywords([
                          ...selectedKeywords,
                          keyword.Keywordname,
                        ])
                      : removeKeywords(keyword.Keywordname);
                  }}
                />
              </span>
              <br />
            </div>
          ))}
      </h2>

      {mode === 'change' && (
        <div>
          <label>Enter the new Keyword: </label>
          <input
            type="text"
            id="changeto"
            name="changeto"
            onChange={(e) => {
              setSelectedChangeto(e.target.value);
            }}
          />

          <Button
            onClick={() =>
              dispatch(patchKeywords(selectedKeywords, selectedChangeto))
            }
          >
            Ändern
          </Button>
        </div>
      )}
      {mode === 'delete' && (
        <div>
          <label>Enter Keyword you wish to delete</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            onChange={(e) => {
              setSelectedKeywords(e.target.value);
            }}
          />
          <Button onClick={() => dispatch(deleteKeywords(selectedKeywords))}>
            Löschen
          </Button>
        </div>
      )}
    </Container>
  );
};

export default KeywordControlPanel;

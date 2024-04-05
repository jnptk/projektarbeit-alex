import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords, patchKeywords, deleteKeywords } from '../../actions';
import trashcansvg from '@plone/volto/icons/delete.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';

import {
  Button,
  Checkbox,
  Icon,
  Container,
  Modal,
  ModalHeader,
  ModalActions,
  ModalContent,
  List,
  ListItem,
} from 'semantic-ui-react';

const KeywordControlPanel = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(getKeywords('')), [dispatch]);

  const keywords = useSelector((state) => state.keywords?.items) || [];

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [mode, setMode] = useState('');
  const [selectedChangeto, setSelectedChangeto] = useState('');
  const [showModal, setshowModal] = useState(false);

  function removeKeywords(keyword) {
    let indexToRemove = selectedKeywords.indexOf(keyword);

    selectedKeywords.splice(indexToRemove, 1);
    setSelectedKeywords(selectedKeywords);
  }
  keywords[0]?.Levenshtein &&
    keywords.sort((a, b) => a.Levenshtein - b.Levenshtein);

  return (
    <Container>
      <Modal open={showModal}>
        {(mode === 'delete' || mode === '') && (
          <>
            <ModalHeader>Warning</ModalHeader>
            <ModalContent text>
              Really delete{' '}
              <List>
                {selectedKeywords.map((keyword, index) => (
                  <ListItem key={index}>
                    {keyword}
                    {/* {' ,'} */}
                  </ListItem>
                ))}
              </List>{' '}
              ?
            </ModalContent>
            <ModalActions>
              <Button
                color="black"
                onClick={() => {
                  setshowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => {
                  dispatch(deleteKeywords(selectedKeywords));
                  setSelectedKeywords([]);
                  setshowModal(false);
                }}
              >
                Delete
              </Button>
            </ModalActions>
          </>
        )}
        {mode === 'change' && (
          <>
            <ModalHeader>Warning</ModalHeader>
            <ModalContent text>
              Really Overwrite{' '}
              <List>
                {selectedKeywords.map((keyword) => (
                  <ListItem>
                    {keyword}
                    {' ,'}
                  </ListItem>
                ))}
              </List>{' '}
              with {selectedChangeto} ?
            </ModalContent>
            <ModalActions>
              <Button
                color="black"
                onClick={() => {
                  setshowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => {
                  dispatch(patchKeywords(selectedKeywords, selectedChangeto));
                  setSelectedKeywords([]);
                  setshowModal(false);
                }}
              >
                Overwrite
              </Button>
            </ModalActions>
          </>
        )}
      </Modal>

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
          Change
        </Button>
        <Button
          toggle
          active={mode === 'delete'}
          onClick={() => {
            mode === 'delete' ? setMode('') : setMode('delete');
          }}
        >
          Delete
        </Button>
      </span>
      {/*  */}
      <div>
        {mode === '' && (
          <List horizontal>
            {keywords.map((keyword, index) => (
              <ListItem key={index}>
                {keyword.Keywordname}
                <Button
                  circular
                  size="mini"
                  class="miniDeleteButton"
                  onClick={() => {
                    setSelectedKeywords([keyword.Keywordname]);
                    setshowModal(true);
                  }}
                >
                  <VoltoIcon name={trashcansvg} size="18px" color="red" />
                </Button>
              </ListItem>
            ))}
          </List>
        )}
        {(mode === 'delete' || mode === 'change') && (
          <List horizontal>
            {keywords.map((keyword, index) => (
              <ListItem key={index}>
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
              </ListItem>
            ))}
          </List>
        )}
      </div>

      {mode === 'change' && (
        <div>
          <label>Enter the new Keyword you wish to change to: </label>
          <input
            type="text"
            id="changeto"
            name="changeto"
            onChange={(e) => {
              setSelectedChangeto(e.target.value);
            }}
          />

          <Button onClick={() => setshowModal(true)}>Change</Button>
        </div>
      )}
      {mode === 'delete' && (
        <div>
          <Button onClick={() => setshowModal(true)}>Delete</Button>
        </div>
      )}
    </Container>
  );
};

export default KeywordControlPanel;

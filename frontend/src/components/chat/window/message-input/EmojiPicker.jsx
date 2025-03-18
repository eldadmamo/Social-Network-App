// EmojiPicker.jsx
import React from 'react';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';

const groupNames = { smileys_people: 'PEOPLE' }; // Static object

const EmojiPicker = ({ onEmojiClick, pickerStyle }) => (
  <div className="emoji-picker" data-testid="emoji-container">
    <Picker
      onEmojiClick={onEmojiClick}
      native={true}
      groupNames={groupNames}
      pickerStyle={pickerStyle}
    />
  </div>
);

EmojiPicker.propTypes = {
  onEmojiClick: PropTypes.func,
  pickerStyle: PropTypes.object
};

export default React.memo(EmojiPicker);
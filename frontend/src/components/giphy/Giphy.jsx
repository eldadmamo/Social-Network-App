import Input from '../input/input';
import { GiphyUtils } from '../../services/utils/giphy-utils.service'; 
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

import './Giphy.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostItem } from '../../redux-toolkit/reducers/post/post.reducer';
import { toggleGifModal } from '../../redux-toolkit/reducers/model/modal.reducer';
import Spinner from '../spinner/Spinner';

const Giphy = () => {
  const {gifModelIsOpen} = useSelector((state) => state.modal);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const selectGif = (gif) => {
    dispatch(updatePostItem({gifUrl:gif, image: ''}));
    dispatch(toggleGifModal(!gifModelIsOpen));
  }

  useEffect(()=> {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  },[])

  return (
    <>
      <div className="giphy-container" id="editable" data-testid="giphy-container">
        <div className="giphy-container-picker" style={{ height: '500px' }}>
          <div className="giphy-container-picker-form">
            <FaSearch className="search" />
            <Input
              id="gif"
              name="gif"
              type="text"
              labelText=""
              placeholder="Search Gif"
              className="giphy-container-picker-form-input"
              handleChange={(e) => GiphyUtils.searchGif(e.target.value, setGifs, setLoading)}
            />
          </div>

          {loading && <Spinner/>}

          <ul className="giphy-container-picker-list" data-testid="unorderedList">
            {gifs.map((gif, index) => (
              <li
                className="giphy-container-picker-list-item"
                data-testid="list-item"
                key={index}
                onClick={()=> selectGif(gif.images.original.url)}
              >
                <img style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
              </li>
            ))}
          </ul>

          {!gifs && !loading && (
            <ul className="giphy-container-picker-list">
              <li className="giphy-container-picker-list-no-item">No GIF found</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default Giphy;

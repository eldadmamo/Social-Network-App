import PropTypes from 'prop-types';
import './ImageGridModal.scss';
import { Utils } from '../../services/utils/utils.service';
import ReactionWrapper from './../posts/modal-wrappers/reaction-wrapper/ReactionWrapper';

const ImageGridModal = ({ images, closeModal, selectedImage }) => {
  return (
    <ReactionWrapper closeModal={closeModal}>
      <div className="modal-image-header">
        <h2>Select Photo</h2>
      </div>
      <div className="modal-image-container">
        {images.map((data, index) => (
          <img
            key={index}
            className="grid-image"
            alt=""
            src={`${Utils.getImage(data?.imgId, data?.imgVersion)}`}
            onClick={() => {
              selectedImage(Utils.getImage(data?.imgId, data?.imgVersion));
              closeModal();
            }}
          />
        ))}
      </div>
    </ReactionWrapper>
  );
};

ImageGridModal.propTypes = {
  images: PropTypes.array,
  closeModal: PropTypes.func,
  selectedImage: PropTypes.func
};

export default ImageGridModal;

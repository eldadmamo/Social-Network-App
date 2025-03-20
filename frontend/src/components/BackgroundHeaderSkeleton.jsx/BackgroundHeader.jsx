import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ImageGridModal from '../image-grid-modal/ImageGridModal';
import Spinner from '../spinner/Spinner';
import Button from '../button/Button';
import Avatar from '../avatar/Avatar';
import { FaCamera } from 'react-icons/fa';
import './BackgroundHeader.scss'
import Input from '../input/input';
import BackgroundHeaderSkeleton from './BackgroundHeaderSkeleton';

const BackgroundHeader = ({
    user,
    loading,
    url,
    onClick,
    tab, 
    hasImage,
    tabItems,
    hasError,
    hideSettings,
    selectedFileImage,
    saveImage,
    cancelFileSelection,
    removeBackgroundImage,
    galleryImages
}) => {
    const [selectedBackground, setSelectedBackground] = useState('');
    const [selectedProfileImage, setSelectedProfileImage] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showImagesModal, setShowImageModal] = useState(false);
    const backgroundFileRef = useRef();
    const profileImageRef = useRef();

    const backgroundFileInputClicked = () => {
        backgroundFileRef.current.click();
    }

    const profileFileInputClicked = () => {
        profileImageRef.current.click();
    };

    const hideSaveChangesContainer = () => {
        setSelectedBackground('');
        setSelectedProfileImage('');
        setShowSpinner(false);
    };

    const onAddProfileClick = () => setIsActive(!isActive);

    const BackgroundSelectDropdown = () => {
        return (
            <nav className='menu' data-testid="menu">
                <ul>
                    {galleryImages.length > 0 && (
                        <li
                        onClick={()=> {
                            setShowImageModal(true)
                            setIsActive(false)
                        }}
                        >
                            <div className='item'>Select</div>
                        </li>
                    )}
                    <li
                    onClick={()=> {
                        backgroundFileInputClicked()
                        setIsActive(false)
                        setShowImageModal(false)
                    }}
                    >
                        <div className='item'>Upload</div>
                    </li>
                </ul>
            </nav>
        )
    }

    useEffect(()=> {
        if (!hasImage){
            setShowSpinner(false);
        }
    },[hasImage]);

  return (
    <>
    {showImagesModal && (
        <ImageGridModal
        images={galleryImages}
        closeModal={()=> setShowImageModal(false)}
        selectedImage={(event)=> {
            setSelectedBackground(event);
            selectedFileImage(event, 'background');
        }}
        />
    )}
    {loading ? (
        <BackgroundHeaderSkeleton tabItems={tabItems} />
    ): (
        <div className="profile-banner" data-testid="profile-banner">
    {hasImage && (
    <div className="save-changes-container" data-testid="save-changes-container">
         <div className="save-changes-box">
             <div className="spinner-container">
                 {showSpinner && !hasError && <Spinner bgColor="white"/>}
             </div>
             <div className="save-changes-buttons">
                 <div className="save-changes-buttons-bg">
                     <Button label="Cancel" className="cancel change-btn" disabled={false} 
                     handleClick={()=> {
                        setShowSpinner(false)
                        cancelFileSelection()
                        hideSaveChangesContainer()
                     }}
                     />
                     <Button label="Save Changes" className="save change-btn" disabled={false} 
                       handleClick={()=> {
                        setShowSpinner(true)
                        const type = selectedBackground ? 'background': 'profile';
                        saveImage(type);
                       }}
                     />
                 </div>
             </div>
         </div>
     </div>
    )}
   
    <div data-testid="profile-banner-image" className="profile-banner-image" style={{ background: `${!selectedBackground ? user?.avatarColor: ''}` }}>
        {url && hideSettings && (
          <div className="delete-btn" data-testid="delete-btn">
            <Button 
            label="Remove" 
            className="remove" 
            disabled={false} 
            handleClick={()=> {
                removeBackgroundImage(user?.bgImageId)
            }}/>
          </div>
        )}
        {!selectedBackground && !url && 
        <h3>Add a background image</h3>
        }
        {selectedBackground ? <img src={`${selectedBackground}`} alt="" /> : <img src={`${url}`} alt="" />}
        
    </div>
    <div className="profile-banner-data">
        <div data-testid="profile-pic" className="profile-pic"
        style={{
            width: `${user?.profilePicture ? '180px': ''}`
        }}
        >
            <Avatar name={user?.username} bgColor={user?.avatarColor} textColor="#ffffff" size={180} 
                avatarSrc={selectedProfileImage || user?.profilePicture} />
            {hideSettings && (
            <div className="profile-pic-select" data-testid="profile-pic-select">
                <Input ref={profileImageRef} name="profile" type="file" className="inputFile" 
                onClick={()=> {
                    if (profileImageRef.current){
                        profileImageRef.current.value = null;
                    }
                }}
                handleChange={(event)=> {
                    setSelectedProfileImage(URL.createObjectURL(event.target.files[0]));
                    selectedFileImage(event.target.files[0], 'profile');
                }}
                />
                <label onClick={() => profileFileInputClicked()}>
                    <FaCamera className="camera" />
                </label>
            </div>
            )}
        </div>
        <div className="profile-name">{user?.username}</div>
        {
            hideSettings && (
        <div className="profile-select-image">
            <Input 
            ref={backgroundFileRef} name="background" type="file" className="inputFile"
            onClick={()=> {
                if (backgroundFileRef.current){
                    backgroundFileRef.current.value = null;
                }
            }}
            handleChange={(event)=> {
                setSelectedBackground(URL.createObjectURL(event.target.files[0]));
                selectedFileImage(event.target.files[0], 'background');
            }}
            />
            <label data-testid="add-cover-photo" onClick={()=> onAddProfileClick()}>
                <FaCamera className="camera" /> <span>Add Cover Photo</span>
            </label>
            {isActive && <BackgroundSelectDropdown/>}
        </div>
            )
        }
    </div>
    <div className="profile-banner-items">
        <ul className="banner-nav">
            {tabItems.map((data) => (
              <div data-testid="tab-elements" key={data.key}>
                {data.show && (
                    <li className="banner-nav-item" key={data.key}>
                    <div className={`banner-nav-item-name ${tab === data.key.toLowerCase() ? 'active':''}`}
                    onClick={() => onClick(data.key.toLowerCase())}
                    >
                        {data.icon}
                        <p className="title">{data.key}</p>
                    </div>
                </li>
                )}
            </div>
            ))}
        </ul>
    </div>
  </div>
    )}

    </>
  );
}

BackgroundHeader.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    url: PropTypes.string,
    onClick: PropTypes.func,
    tab: PropTypes.string,
    hasImage: PropTypes.bool,
    tabItems: PropTypes.array,
    hasError: PropTypes.bool,
    hideSettings: PropTypes.bool,
    selectedFileImage: PropTypes.func,
    saveImage: PropTypes.func,
    cancelFileSelection: PropTypes.func,
    removeBackgroundImage: PropTypes.func,
    galleryImages: PropTypes.array
}

export default BackgroundHeader
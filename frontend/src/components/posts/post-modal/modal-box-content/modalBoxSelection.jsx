import React, { useRef } from 'react'
import photo from '../../../../assets/images/photo.png'
import gif from '../../../../assets/images/gif.png'
import feeling from '../../../../assets/images/feeling.png'
import Input from '../../../input/input'
import useDetectOutsideClick from '../../../../hooks/useDetectOutsideClick'
import { useSelector } from 'react-redux'
import Feelings from '../../../feelings/Feelings'

const ModalBoxSelection = () => {
	const {feelingIsOpen} = useSelector((state) => state.modal);
	const feelingsRef = useRef(null);
	const [toggleFeelings,setToggleFeelings] = useDetectOutsideClick(feelingsRef, feelingIsOpen);


  return (
    <>
	{toggleFeelings && (
		<div ref={feelingsRef}>
			<Feelings/>
		</div>
	)}
    <div className="modal-box-selection" data-testid="modal-box-selection">
	  <ul className="post-form-list" data-testid="list-item">
		<li className="post-form-list-item image-select">
			<Input name="image"  type="file" className="file-input" />
			<img src={photo} alt="" /> Photo
		</li>
		<li className="post-form-list-item">
			<img src={gif} alt="" /> Gif
		</li>
		<li className="post-form-list-item" onClick={()=> setToggleFeelings(!toggleFeelings)}>
			<img src={feeling} alt="" /> Feeling
		</li>
	  </ul>
   </div>;

    </>
  )
}

export default ModalBoxSelection;

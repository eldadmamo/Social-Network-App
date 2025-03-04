import React from 'react'
import Button from '../button/Button'
import Avatar from '../avatar/Avatar'
import './Suggesstions.scss'
import { useEffect , useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Suggesstions = () => {
  const {suggestions} = useSelector(state => state)
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(()=> {
    setUsers(suggestions?.users)
  },[suggestions, users])


  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={user?._id}>
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                />
              </div>
            </div>
          ))}
        </div>
        {users.length > 8 && (
          <div className='view-more' onClick={() => navigate('/app/social/people') }>View More</div>
        )}
      </div>
    </div>
  )
}

export default Suggesstions

import React from 'react'
import PropTypes from 'prop-types'
import './SearchList.scss'
import Avatar from '../../../avatar/Avatar'

const SearchList = ({result, isSearching, searchTerm, setSelectedUser, setSearch, setIsSearching, setSearchResult, setComponentType}) => {
  return (
    <div className='search-result'>
        <div className='search-result-container'>
            {!isSearching && result.length > 0 && (
                <>
                {result.map((user) => (
                    <div
                    data-testid="search-result-item"
                    className='search-result-container-item'
                    key={user._id}

                    >
                        <Avatar
                        name={user.username}
                        bgColor={user.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={user.profilePicture}
                        />
                        <div className='username'>
                            {user.username}
                        </div>
                    </div>
                ))}

                {searchTerm && isSearching && result.length === 0 && (
                    <div className='search-result-container-wmpty' data-testid="searching-text">
                        <span>Searching...</span>
                    </div>
                )}
                {searchTerm && !isSearching && result.length === 0 && (
                    <div className='search-result-container-empty' data-testid="nothing-found">
                        <span>Nothing found</span>
                        <p className='search-result-container-empty-msg'>We couldn't find any match for {searchTerm} </p>
                    </div>
                )}
                </>
            )}
        </div>
    </div>
  )
}

SearchList.propTypes = {
    result: PropTypes.array,
    isSearching: PropTypes.bool,
    searchTerm: PropTypes.string,
    setSelectedUser: PropTypes.func,
    setSearch: PropTypes.func,
    setIsSearching: PropTypes.func,
    setSearchResult: PropTypes.func,
    setComponentType: PropTypes.func,
}

export default SearchList
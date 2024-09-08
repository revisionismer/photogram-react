import React from 'react';

import '../../assets/css/search.css';

import Person from '../../assets/images/person.jpeg';

const Search = () => {
    return (
        <div className='searchSection'>
            <h1>검색</h1>
            <form>
                <input type='text' placeholder='검색'/>
            </form>
            <div className='searchSection__find'>
                <div className='searchSection__desc'>
                    <h4>최근</h4>
                    <p>초기화</p>
                </div>
                <div className='searchSection__cart'>
                    <div className='searchSection__profile'>
                        <div className='searchSection__img'>
                            <img src={Person} alt=''></img>
                        </div>
                        <div className='searchSection__info'>
                            <p className='searchSection__text'>베스트프렌드</p>
                            <p className='searchSection__name'>정아무개</p>
                        </div>
                    </div>
                    <div className='searchSection__clear'>X</div>
                </div>
            </div>
        </div>
    );
};

export default Search;
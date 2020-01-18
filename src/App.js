import React from 'react';
import './App.css';
import Character from './character';
import Filters from './filters';
import {getCharactersByName} from './lib/api'; 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, lastSearchValue:'', notFound:false, results:[], characterName:''}
  }

  

  render() {
    return (
      <div className="App grid-container">
        <header className="App-header item1">
          <h3>Rick and Morty</h3>
        </header>
        <Character className="item-3"></Character>
        {/* <div className="item3">Search</div>  
        <div className="item4">Filter</div> */}
        
      </div>
    );
  }

}

export default App;

import React from 'react';
import './App.css';
import Character from './character';

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
      </div>
    );
  }

}

export default App;

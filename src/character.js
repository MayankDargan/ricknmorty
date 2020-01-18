import React from 'react';
import { getAllCharacters, getCharactersByName } from "./lib/api";
import './character.css';
import Filters from './filters';

class Character extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            results: this.props.characters,
            notFound: false,
            isLoading: false,
            filters: []
        }
    }
    UNSAFE_componentWillMount(){
        getAllCharacters()
          .then((result)=>{
            this.setState({results: result.results, isLoading: true});
          }).catch((error) => {
              console.log(error);
              this.setState({ notFound: true, results: [], isLoading: false })
            });
    }
    searchCharacter(characterName){
        getCharactersByName(characterName.currentTarget.value)
        .then((result)=>{
            // this.props.characters = result.results;
            this.setState({
            results : result.results
            });
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    onFilterSelect(filters){
        this.setState({
            filters: filters
        });
    }
    render(){
        const { isLoading, results, notFound } = this.state;
        let characters = [];
        if(isLoading || notFound){
            this.state.results.map(character =>{
                // eslint-disable-next-line no-unused-expressions
                characters.push(
                <div key={character.id} className="grid-item item-15">
                        <img src={character.image} alt={character.name} />
                        <p>{character.name}
                            <sub>id:{character.id} | created: {character.created}</sub>
                        </p>
                        <ul className="characterstics">
                            <li>
                                <label>Status</label>
                                <samp>{character.status}</samp>
                            </li>
                            <li>
                                <label>Species</label>
                                <samp>{character.species}</samp>
                            </li>
                            <li>
                                <label>Gender</label>
                                <samp>{character.gender}</samp>
                            </li>
                            <li>
                                <label>Origin</label>
                                <samp><a href={character.origin.url}>{character.origin.name}</a></samp>
                            </li>
                            <li>
                                <label>Last Location</label>
                                <samp><a href={character.location.url}>{character.location.name}</a></samp>
                            </li>
                        </ul>
                </div>);
            });
        }
        return(
            <div className="grid-characters">
                <div className="item2">
                    Search
                    <input type="text" onKeyPress={(e)=>{this.searchCharacter(e)}} />
                </div>
                <aside className="item4">
                <Filters></Filters>
                </aside>
                <main className="item5">
                    <div className="grid-inner-container">
                        {characters}
                    </div>
                </main>
            </div>
        )
    }
}

export default Character;
import React from 'react';
import { getAllCharacters, getCharactersByName, getMoreCharacters } from "./lib/api";
import './character.css';
import Filters from './filters';
import _ from 'lodash';

class Character extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            results: this.props.characters,
            notFound: false,
            isLoading: false,
            filters: [],
            orderBy: "asc",
            page: 1
        }
        this.sortCharacters = this.sortCharacters.bind(this);
        this.handleScroll = _.debounce(this.handleScroll.bind(this),2000);
        this.onFilterSelect = this.onFilterSelect.bind(this);
    }
    lastScrollY = 0;
    ticking = false;
    UNSAFE_componentWillMount(){
        getAllCharacters()
          .then((result)=>{
            this.setState({
                results: result.results, 
                gender: _.uniq(_.map(result.results,'gender')),
                species: _.uniq(_.map(result.results,'species')),
                origin: _.uniq(_.map(_.map(result.results,'origin'),'name')),
                isLoading: true
            });
          }).catch((error) => {
            console.log(error);
            this.setState({ notFound: true, results: [], isLoading: false })
        });
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(){
        let pageNumber = this.state.page;
        this.lastScrollY = window.scrollY;

    if (window.scrollY >= document.getElementsByTagName('main')[0].offsetHeight) {
      window.requestAnimationFrame(() => {
        // this.current.style.top = `${this.lastScrollY}px`;
        this.ticking = false;
      });
      getMoreCharacters(pageNumber+1)
        .then((result)=>{
            this.setState({results: result.results, isLoading: true});
            window.scrollTo(0,0);
          }).catch((error) => {
              console.log(error);
              this.setState({ notFound: true, results: [], isLoading: false })
            });
        this.setState({
            page: pageNumber+1
        });
      this.ticking = true;
    }
        

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
    onFilterSelect(event){
        let filterValue = event.target.value;
        let filteredCharacters =[];
        let criterias = this.state.filters;
        if(criterias.includes(filterValue)){
            criterias = _.remove(criterias, function(criteria){
                return criteria !== filterValue;
            });
        } else {
            criterias.push(filterValue);
            this.state.results.map((character) => {
                if(_.values(character).includes(filterValue) || character.origin.name === filterValue){
                    filteredCharacters.push(character);
                }
            });
            
        }
        
        if(criterias.length !==0){
            this.setState({
                results: filteredCharacters,
                filters: criterias
            });
        } else {
            getAllCharacters()
            .then((result)=>{
                this.setState({
                    results: result.results, 
                    gender: _.uniq(_.map(result.results,'gender')),
                    species: _.uniq(_.map(result.results,'species')),
                    origin: _.uniq(_.map(_.map(result.results,'origin'),'name')),
                    isLoading: true,
                    filters: []
                });
            }).catch((error) => {
                console.log(error);
                this.setState({ notFound: true, results: [], isLoading: false })
            });
        }
        
    }
    sortAscending(a,b){
        const bandA = a.id;
        const bandB = b.id;
        
        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
    sortDescending(a,b){
        const bandA = a.id;
        const bandB = b.id;
        
        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    sortCharacters(event){
        let sortBy = event.target.value;
        let sortedCharacters = this.state.results;
        if(sortBy === "asc"){
            sortedCharacters = this.state.results.sort(this.sortAscending);
            this.setState({
                results: sortedCharacters,
                orderBy: sortBy
            });
        } else{
            sortedCharacters = this.state.results.sort(this.sortDescending);
            console.log(sortedCharacters);
            this.setState({
                results: sortedCharacters,
                orderBy: sortBy
            });
        }
        
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
                    <select onChange={(e)=>{this.sortCharacters(e)}} value={this.state.orderBy}>
                        <option>Sort by ID</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <aside className="item4">
                <Filters clause={this.onFilterSelect} gender={this.state.gender} origin={this.state.origin} species={this.state.species}></Filters>
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
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
            filters: '',
            orderBy: "asc",
            page: 1,
            conditions: []
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
        let filterCriteria = this.state.filters;
        if(filterCriteria !== ''){
            if(filterCriteria.indexOf('name') !== -1){
                filterCriteria = `name= ${characterName.target.value}`;
            } else{
                filterCriteria = filterCriteria + `&name=${characterName.target.value}`
            }
        } else{
            filterCriteria = `name=${characterName.target.value}`;
        }
        this.setState({
            filters: filterCriteria
        });
        getCharactersByName(filterCriteria)
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
        let filterCriteria = this.state.filters;
        let filters = this.state.conditions;
        if(filterCriteria.indexOf(filterValue) !== -1){
            if(this.state.gender.includes(filterValue)){
                filterCriteria = filterCriteria.replace(`&gender=${filterValue}`,'');
            } else if(this.state.species.includes(filterValue)){
                filterCriteria = filterCriteria.replace(`&species=${filterValue}`,'');
            }
        } else {
            if(this.state.gender.includes(filterValue)){
                filterCriteria = filterCriteria + `&gender=${filterValue}`;
            } else if(this.state.species.includes(filterValue)){
                filterCriteria = filterCriteria + `&species=${filterValue}`;
            }
        }
        if(!filters.includes(filterValue)){
            filters.push(filterValue);
            this.setState({
                conditions: filters
            });
        } else {
            filters = _.remove(filters, function(filter){
                return filter !== filterValue;
            });

            this.setState({
                conditions: filters
            });
        }

        getCharactersByName(filterCriteria)
        .then((result)=>{
            this.setState({
                results: result.results,
                isLoading: true,
                filters: filterCriteria
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ notFound: true, results: [], isLoading: false })
        });
        
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

    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var elapsed = current - previous;
    
        if (elapsed < msPerYear) {
            return 'created ' + Math.round(elapsed/msPerMonth) + ' months ago';   
        }
    
        else {
            return 'created ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    render(){
        const { isLoading, results, notFound } = this.state;
        let characters = [], filterConditions = [];
        if(isLoading || notFound){
            this.state.results.map(character =>{
                // eslint-disable-next-line no-unused-expressions
                let createdDate = this.timeDifference(new Date(),new Date(character.created.split('T')[0]))
                characters.push(
                <div key={character.id} className="grid-item item-15">
                        <img src={character.image} alt={character.name} />
                        <p>{character.name}
                            <sub>id:{character.id} - {createdDate}</sub>
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
        this.state.conditions.map((filter)=>{
            filterConditions.push(<li><a href="#" className="tag">{filter}</a></li>)
        });
        return(
            <div className="grid-characters">
                <div className="item2">
                    <ul className="tags">
                        {filterConditions}
                    </ul>
                    <input type="text" className="search-input" placeholder="Search character by name" onKeyPress={(e)=>{this.searchCharacter(e)}} />
                    <select onChange={(e)=>{this.sortCharacters(e)}} className="sort-by" value={this.state.orderBy}>
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
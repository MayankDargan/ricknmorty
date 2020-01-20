import React from 'react';
import './filters.css';

class Filters extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let speciesElements = [], genderElements=[], originElements=[];

        if(this.props.species !== undefined){
            this.props.species.map((specie)=>{
                speciesElements.push(<li key={specie}><input type="checkbox" className="regular-checkbox" onClick={(e)=>this.props.clause(e)} value={specie} />{specie}</li>);
            });
            this.props.gender.map((gender)=>{
                genderElements.push(<li key={gender}><input type="checkbox" className="regular-checkbox" onClick={(e)=>this.props.clause(e)} value={gender} />{gender}</li>);
            });
            this.props.origin.map((origin)=>{
                originElements.push(<li key={origin}><input type="checkbox" className="regular-checkbox" onClick={(e)=>this.props.clause(e)} value={origin} />{origin}</li>)
            })
        }
        return(
            <div className="filter-container">
                <div className="filter">
                    <h5>Species</h5>
                    <ul>
                        {speciesElements}
                    </ul>
                </div>
                <div className="filter">
                    <h5>Gender</h5>
                    <ul>
                        {genderElements}
                    </ul>
                </div>
                <div className="filter">
                    <h5>Origin</h5>
                    <ul>
                        {originElements}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Filters;
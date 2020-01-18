import React from 'react';
import './filters.css';

class Filters extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="filter-container">
                <div className="filter">
                    <h5>Species</h5>
                    <ul>
                        <li>
                            <input type="checkbox" />Human
                        </li>
                        <li>
                            <input type="checkbox" />Myhtolog
                        </li>
                        <li>
                            <input type="checkbox" />Other Species
                        </li>
                    </ul>
                </div>
                <div className="filter">
                    <h5>Gender</h5>
                </div>
                <div className="filter">
                    <h5>Origin</h5>
                </div>
            </div>
        )
    }
}

export default Filters;
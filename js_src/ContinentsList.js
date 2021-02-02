import React, {useContext} from 'react';
import MyContext from './context';
import actions from './actions';

function ContinentLink({contName, active}) {
    const dispatch = useContext(MyContext);
    const class_ = active ? "active" : "";
    return <li class="nav-item">
        <a class={`nav-link ${class_}`}
           onClick={() => dispatch({type: actions.CONTINENT_SELECT, value: contName})}
           >
            {contName}
        </a>
    </li>

}

function ContinentsList({continents, selectedContinent}) {
    console.log('continent list');
    return <div>
        <h2>Select continent</h2>
            <ul class="nav nav-pills nav-fill">
            {continents.map((cont) => 
                <ContinentLink 
                    key={cont} 
                    contName={cont} 
                    active={selectedContinent.name == cont}/> )}
        </ul>
    </div>
}

export default React.memo(ContinentsList);
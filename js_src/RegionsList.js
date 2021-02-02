import React, {useContext, useEffect} from 'react';
import MyContext from './context';
import actions from './actions';

function RegionLink({regName, active}) {
    const dispatch = useContext(MyContext);
    return <li class="nav-item">
        <a class={`nav-link ${active ? "active": ''}`} onClick={() => dispatch({type: actions.REGION_SELECT, value: regName})}>{regName}</a>
    </li>;
}

function RegionsList({regions, selectedRegion}) {
    if (regions.length == 0) {
        return null;
    }
    return <div>
            <h2>Select region</h2>
            <ul class="nav nav-pills nav-fill">
            {regions.map((reg) => <RegionLink key={reg} regName={reg} active={selectedRegion.name == reg}/>)}
        </ul>
    </div>
}

export default React.memo(RegionsList);

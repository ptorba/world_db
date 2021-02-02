import React, {useContext, useEffect} from 'react';
import MyContext from './context';
import actions from './actions';
import CountryView from './CountryView';

function CountryLink({country, active}) {
    const dispatch = useContext(MyContext);
    return  <a class={`list-group-item ${active ? "active" : ""}`} onClick={() => dispatch({type: actions.COUNTRY_SELECT, value: country})}>
            {country.name}
        </a>
}

function CountriesList({countries, selectedCountry}) {
    console.log('countries', countries)
    if (countries.length == 0) {
        return null;
    }
    return <div>
            <h3>Select country</h3>
            <div class="list-group">
                {countries.map(c => <CountryLink key={c.code} country={c} active={selectedCountry.code == c.code}/>)}
            </div>
        </div>;
}

export default React.memo(CountriesList);
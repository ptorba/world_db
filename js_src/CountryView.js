import React, {useContext, useEffect, useRef} from 'react';
import MyContext from './context';
import actions from './actions';
import CountryCities from './CountryCities';

function CountrySummary({ country }) {
    const entries = Object.entries(country).filter(e => e[0][0] != '_');
    return <ul>
        {entries.map(([key,value]) =>
            <li>{key[0].toUpperCase()}{key.slice(1)}: {value}</li>
         )}
    </ul>
}


function CountryLanguages({country}) {
    if (!country._languages) {
        return null;
    }
    return <ul>
        {country._languages.map(lang => <Language key={lang.language} lang={lang} />)}
    </ul>
}

function Language({lang}) {
    const isOfficial = lang.isofficial ? "Yes" : "No";
    return <li>
        {lang.language}, Is official: {isOfficial}, percentage: {lang.percentage}
    </li>;
}

function CountryView({country, countryDisplay}) {
    if (!country.code) {
        return null;
    }
    const myRef = useRef(null);
    useEffect(() => {
        myRef.current.scrollIntoView();
    }, [country]);
    
    let displayComp = null;
    switch(countryDisplay) {
        case 'summary':
            displayComp = <CountrySummary country={country} />;
            break;
        case 'cities':
            displayComp = <CountryCities country={country} />;
            break;
        case 'languages':
            displayComp = <CountryLanguages country={country} />;
            break;
    }

    const dispatch = useContext(MyContext);
    return <div class="row" ref={(div) => {myRef.current = div}}>
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h3>{country.name}</h3>
                    </div>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class={`nav-link ${countryDisplay == 'summary' ? 'active' : ''}`}
                            onClick={() => dispatch({type: actions.SHOW_COUNTRY_SUMMARY})}>
                                Summary
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class={`nav-link ${countryDisplay == 'languages' ? 'active' : ''}`}
                            onClick={() => dispatch({type: actions.SHOW_LANGUAGES})}>
                                Languages
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class={`nav-link ${countryDisplay == 'cities' ? 'active' : ''}`}
                                onClick={() => dispatch({type: actions.SHOW_CITIES})}>
                                Cities
                            </a>
                        </li>
                    </ul>
                    <div class="card-body">
                        {displayComp}
                    </div>
                </div>
            </div>
        </div>
}

export default React.memo(CountryView);
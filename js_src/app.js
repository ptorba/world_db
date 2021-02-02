import "preact/debug";
import React, {useEffect, useReducer} from 'react';
import ReactDOM from 'react-dom';
import produce from 'immer';
import actions from './actions';
import MyContext from './context';
import ContinentsList from './ContinentsList';
import RegionsList from './RegionsList';
import CountryView from './CountryView';
import CountriesList from './CountriesList';

const reducer = produce((draft, action) => {
    console.log('reducer', action);
    switch(action.type) {
        case actions.CONTINENTS_FETCHED:
            draft.continents = action.value;
            break;
        case actions.CONTINENT_SELECT:
            draft.selectedContinent.name = action.value;
            break;
        case actions.REGIONS_FETCHED:
            draft.regions = action.value;
            break;
        case actions.REGION_SELECT:
            draft.selectedRegion.name = action.value;
            break;
        case actions.COUNTRIES_FETCHED:
            draft.countries = action.value;
            break;
        case actions.CITIES_FETCHED:
            draft.selectedCountry.cities = action.value;
            break;
        case actions.LANGUAGES_FETCHED:
            draft.selectedCountry.languages = action.value;
            break;
        case actions.COUNTRY_SELECT:
            draft.selectedCountry = action.value;
            break;
        case actions.SHOW_COUNTRY_SUMMARY:
            draft.countryDisplay = 'summary';
            break;
        case actions.SHOW_CITIES:
            draft.countryDisplay = 'cities';
            break;
        case actions.SHOW_LANGUAGES:
            draft.countryDisplay = 'languages';
            break;
    }
});

function setupAJAX(state, dispatch) {
    // CONTINENTS
    useEffect(async () => {
        const response = await fetch(window.URLS.continents);
        if (response.ok) {
            const respJson = await response.json();
            console.log('response ok', respJson);
            dispatch({
                type: actions.CONTINENTS_FETCHED,
                value: respJson.continents
            });
        }
        else {
            console.error('Fetching continents failed');
        }
    }, []);

    // REGIONS
    useEffect(async () => {
        if (!state.selectedContinent.name) {
            return;
        }
        const params = new URLSearchParams({continent: state.selectedContinent.name});
        const response = await fetch(`${window.URLS.regions}?${params.toString()}`);
        if (response.ok) {
            const respJson = await response.json()
            dispatch({type: actions.REGIONS_FETCHED, value: respJson.regions });
        }
    }, [state.selectedContinent.name]); 

    // COUNTRIES
    useEffect(async () => {
        if (!state.selectedRegion.name) {
            return;
        }
        const params = new URLSearchParams({region: state.selectedRegion.name});
        const response = await fetch(`${window.URLS.countries}?${params.toString()}`);
        if (response.ok) {
            const respJson = await response.json();
            dispatch({type: actions.COUNTRIES_FETCHED, value: respJson.countries});
        }
    }, [state.selectedRegion.name])

    // CITIES
    useEffect(async () => {
        if (!state.selectedCountry.code) {
            return;
        }
        const params = new URLSearchParams({country: state.selectedCountry.code});
        const response = await fetch(`${window.URLS.cities}?${params.toString()}`);
        if (response.ok) {
            const respJson = await response.json();
            dispatch({type: actions.CITIES_FETCHED, value: respJson.cities});
        }
    }, [state.selectedCountry.code])

    // LANGUAGES
    useEffect(async () => {
        if (!state.selectedCountry.code) {
            return;
        }
        const params = new URLSearchParams({country: state.selectedCountry.code});
        const response = await fetch(`${window.URLS.cities}?${params.toString()}`);
        if (response.ok) {
            const respJson = await response.json();
            dispatch({type: actions.CITIES_FETCHED, value: respJson.cities});
        }
    }, [state.selectedCountry.code])
}

function App() {
    console.log('app');
    const [state, dispatch] = useReducer(reducer, {
        continents: [],
        selectedContinent: {},
        regions: [],
        selectedRegion: {},
        countries: [],
        selectedCountry: {
            cities: [],
            languages: [],
        },
        countryDisplay: '',
    });
    setupAJAX(state, dispatch);
    return <MyContext.Provider value={dispatch}>
        <ContinentsList continents={state.continents} selectedContinent={state.selectedContinent}/>
        <RegionsList regions={state.regions} selectedRegion={state.selectedRegion} />
        <CountriesList countries={state.countries} selectedCountry={state.selectedCountry} />
        <hr/>
        <CountryView country={state.selectedCountry} countryDisplay={state.countryDisplay} />
    </MyContext.Provider>
}


ReactDOM.render(React.createElement(App), document.getElementById('app'));

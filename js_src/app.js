// Must be the first import
if (process.env.NODE_ENV==='development') {
  // Must use require here as import statements are only allowed
  // to exist at top-level.
  require("preact/debug");
}
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
    let city = null;
    switch(action.type) {
        case actions.CONTINENTS_FETCHED:
            draft.continents = action.value;
            break;
        case actions.CONTINENT_SELECT:
            const differs = draft.selectedContinent.name != action.value;
            draft.selectedContinent.name = action.value;
            if (differs) {
                draft.selectedRegion = {};
                draft.regions = [];
                draft.selectedCountry = {};
                draft.countries = [];
            }
            break;
        case actions.REGIONS_FETCHED:
            draft.regions = action.value;
            break;
        case actions.REGION_SELECT:
            if (draft.selectedRegion.name != action.value) {
                draft.selectedRegion.name = action.value;
                draft.selectedCountry = {};
                draft.countries = [];
            }
            break;
        case actions.COUNTRIES_FETCHED:
            draft.countries = action.value;
            break;
        case actions.CITIES_FETCHED:
            draft.selectedCountry._cities = action.value.cities;
            draft.selectedCountry._citiesPagination = {
                page: action.value.page,
                totalpages: action.value.totalpages
            };
            break;
        case actions.LANGUAGES_FETCHED:
            draft.selectedCountry._languages = action.value;
            break;
        case actions.COUNTRY_SELECT:
            if (draft.selectedCountry.code != action.value.code) {
                draft.selectedCountry = action.value;
                draft.countryDisplay = 'summary';
            }
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
        case actions.DELETE_CITY:
            draft.cityToDelete = {id: action.id};
            break;
        case actions.EDIT_CITY:
            city = draft.selectedCountry._cities.find(c => c.id == action.id);
            city._edit = true;
            break;
        case actions.EDIT_CITY_PROP:
            city = draft.selectedCountry._cities.find(c => c.id == action.id);
            city[action.prop] = action.value;
            break;
        case actions.CANCEL_CITY_EDIT:
            city = draft.selectedCountry._cities.find(c => c.id == action.id);
            city._edit = false;
            if (city.id < 0) {
                // remove yet non-existing city
                draft.selectedCountry._cities = draft.selectedCountry._cities.filter(c => c.id != city.id);
            }
            break;
        case actions.SAVE_CITY:
            city = draft.selectedCountry._cities.find(c => c.id == action.id);
            draft.cityToSave = Object.assign({}, city);
            break;
        case actions.CITY_SAVED:
            city = draft.selectedCountry._cities.find(c => c.id == action.id);
            draft.cityToSave = {};
            city._edit = false;
            break;
        case actions.CITY_DELETED:
            draft.selectedCountry._cities = draft.selectedCountry._cities.filter(c => c.id != action.id);
            draft.cityToDelete = {};
            break;
        case actions.CREATE_NEW_CITY:
            draft.selectedCountry._cities.unshift({id: -(draft.selectedCountry._cities.length+1), _edit: true});
            break;
        case actions.CITY_CREATED:
            city = draft.selectedCountry._cities.find(c => c.id == action.oldId);
            city.id = action.newId;
            draft.cityToSave = {};
            city._edit = false;
            break;
        case actions.CITY_NEXT_PAGE:
            draft.selectedCountry._citiesPagination.page += 1;
            draft._fetchPagination += 1;
            break;
        case actions.CITY_PREV_PAGE:
            draft.selectedCountry._citiesPagination.page -= 1;
            draft._fetchPagination += 1;
            break;


    }
});

function setupAJAX(state, dispatch) {
    // GET CONTINENTS
    useEffect(async () => {
        const response = await fetch(window.URLS.continents);
        if (response.ok) {
            const respJson = await response.json();
            dispatch({
                type: actions.CONTINENTS_FETCHED,
                value: respJson.continents
            });
        }
        else {
            alert('Fetching continents failed');
        }
    }, []);

    // GET REGIONS
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
        else {
            alert("Fetching regions failed");
        }
    }, [state.selectedContinent.name]); 

    // GET COUNTRIES
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
        else {
            alert("Fetching countries failed");
        }
    }, [state.selectedRegion.name])

    // GET CITIES
    /*
        For pagination this is abusing a state variable `_fetchPagination` to trigger the fetch
        It is using the data from `selectedCountry._citiesPagination`
    */
    useEffect(async () => {
        if (!state.selectedCountry.code) {
            return;
        }
        const params = new URLSearchParams();
        if (state.selectedCountry._citiesPagination) {
            params.append('page', state.selectedCountry._citiesPagination.page);
        }
        const url = `${window.URLS.cities.replace(':code', state.selectedCountry.code)}?${params.toString()}`
        const response = await fetch(url);
        if (response.ok) {
            const respJson = await response.json();
            dispatch({type: actions.CITIES_FETCHED, value: respJson});
        }
        else {
            alert("Fetching cities failed");
        }
    }, [state.selectedCountry.code, state._fetchPagination])

    // GET LANGUAGES
    useEffect(async () => {
        if (!state.selectedCountry.code) {
            return;
        }
        const response = await fetch(window.URLS.languages.replace(':code', state.selectedCountry.code));
        if (response.ok) {
            const respJson = await response.json();
            dispatch({type: actions.LANGUAGES_FETCHED, value: respJson.languages});
        }
        else {
            alert("Fetching languages failed");
        }
    }, [state.selectedCountry.code])

    // DELETE CITY
    useEffect(async () => {
        if (!state.cityToDelete.id) {
            return;
        }
        const response = await fetch(window.URLS.city.replace(':id', state.cityToDelete.id),
        {
            method: 'DELETE'
        });
        if (response.ok) {
            dispatch({type: actions.CITY_DELETED, id: state.cityToDelete.id});
        }
        else {
            alert("Deleting city failed");
        }
    }, [state.cityToDelete])

    // UPDATE / CREATE CITY
    useEffect(async () => {
        if (!state.cityToSave.id) {
            return;
        }
        if (state.cityToSave.id < 0) {
            const response = await fetch(window.URLS.cityCreate.replace(':code', state.selectedCountry.code),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(state.cityToSave)
            });
            if (response.ok) {
                const respJson = await response.json();
                dispatch({type: actions.CITY_CREATED, oldId: state.cityToSave.id, newId: respJson.city.id})
            }
            else {
                alert("Creating city failed");
            }
        }
        else {
            const response = await fetch(window.URLS.city.replace(':id', state.cityToSave.id),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify(state.cityToSave)
            });
            if (response.ok) {
                dispatch({type: actions.CITY_SAVED, id: state.cityToSave.id});
            }
            else {
                alert("Updating city failed");
            }
        }
    }, [state.cityToSave])

}

function App() {
    const [state, dispatch] = useReducer(reducer, {
        continents: [],
        selectedContinent: {},
        regions: [],
        selectedRegion: {},
        countries: [],
        selectedCountry: {
        },
        countryDisplay: '',
        cityToDelete: {},
        cityToSave: {},
        _fetchPagination: 0
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

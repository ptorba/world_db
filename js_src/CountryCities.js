import React, {useContext, useEffect, useRef} from 'react';
import MyContext from './context';
import actions from './actions';

function CountryCities({country}) {
    if(!country._cities) {
        return null;
    }
    const dispatch = useContext(MyContext);
    const CityView = React.memo(City);
    return <div>
        <div class="row">
            <div class="col">
                <a class="btn btn-outline-primary" 
                onClick={() => dispatch({type: actions.CREATE_NEW_CITY})}
                >
                    Create new
                </a>
            </div> 
            <div class="col">
                <CityPagination country={country} />
            </div>
        </div>
        {country._cities.map(city => {
            if (city._edit) {
                return <CityEdit city={city} />;
            }
            return <CityView key={city.id} city={city} />;
        } )}
    </div>
}

function City({city}) {
    const dispatch = useContext(MyContext);
    return <div class="card my-2">
        <div class="card-body">
            <h5 class="card-title">
                {city.name}
            </h5>
            <p class="card-text">
                <p>District: {city.district}</p>
                <p>Population: {city.population}</p>
                <a class="btn btn-warning mx-2" onClick={() => dispatch({type: actions.EDIT_CITY, id: city.id})}>Edit</a>
                <a class="btn btn-danger" onClick={() =>{
                    if (confirm(`Are you sure you want to delete ${city.name}`)) {
                        dispatch({type: actions.DELETE_CITY, id: city.id})
                    }
                }}>Delete</a>
            </p>
        </div>
    </div>
}

function CityEdit({city}) {
    const dispatch = useContext(MyContext);
    return <div class="card my-2">
            <div class="card-body">
                <form onSubmit={(ev) =>{
                    ev.preventDefault();
                    dispatch({type: actions.SAVE_CITY, id: city.id})
                    }}>
                    <h5 class="card-title">
                        <input type="text" 
                            required 
                            placeholder="Name"
                            value={city.name} 
                            onChange={(ev) => dispatch({
                                type: actions.EDIT_CITY_PROP, 
                                prop: 'name', 
                                value: ev.target.value, 
                                id: city.id})} />
                    </h5>
                    <p class="card-text">
                        <label>
                            District:<br/>
                            <input type="text" 
                                required 
                                placeholder="District"
                                value={city.district} 
                                onChange={(ev) => dispatch({
                                    type: actions.EDIT_CITY_PROP, 
                                    prop: 'district', 
                                    value: ev.target.value, 
                                    id: city.id})} />
                        </label>
                        <label>
                            Population:<br/>
                            <input type="number" 
                                required 
                                placeholder="Population"
                                value={city.population} 
                                onChange={(ev) => dispatch({
                                    type: actions.EDIT_CITY_PROP, 
                                    prop: 'population', 
                                    value: ev.target.value, 
                                    id: city.id})} />
                        </label>
                        <div class="text-right my-2">
                            <a class="btn btn-outline-secondary mx-2"
                                onClick={() => dispatch({
                                    type: actions.CANCEL_CITY_EDIT, 
                                    id: city.id})}
                                    >
                                Cancel
                            </a>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </p>
                </form>
            </div>
        </div>
}

function CityPagination({country}) {
    const pagination = country._citiesPagination
    const dispatch = useContext(MyContext);
    return <>
            {pagination.page > 1 ? 
                <a class="btn btn-outline-secondary mx-2"
                onClick={() => dispatch({type: actions.CITY_PREV_PAGE})}
                >
                    Prev page
                </a> : null}
            Page: {pagination.page} of {pagination.totalpages}
            {pagination.page < pagination.totalpages ? 
                <a class="btn btn-outline-secondary mx-2"
                    onClick={() => dispatch({type: actions.CITY_NEXT_PAGE})}

                >
                    Next page
                </a> : null}
    </>;
}

export default React.memo(CountryCities);
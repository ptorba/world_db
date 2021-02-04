import math
from pyramid.view import view_config
from pyramid.response import Response

from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import joinedload

from .. import models
from .validation import validate_city_params


@view_config(route_name="home", renderer="../templates/mytemplate.mako")
def home(request):
    return {}


@view_config(route_name="continents", renderer="json")
def continents(request):
    continents = request.dbsession.query(models.Country.continent).distinct().order_by("continent")
    return {"continents": [c.continent for c in continents]}


@view_config(route_name="regions", renderer="json")
def regions(request):
    continent = request.GET["continent"]
    regions = (
        request.dbsession.query(models.Country.region)
        .filter_by(continent=continent)
        .distinct()
        .order_by("region")
    )
    return {"regions": [r.region for r in regions]}


@view_config(route_name="countries", renderer="json")
def countries(request):
    region = request.GET["region"]
    countries = (
        request.dbsession.query(models.Country)
        .filter_by(region=region)
        .options(joinedload(models.Country.capital).load_only("name"))
        .order_by(models.Country.name)
    )
    return {"countries": [c.to_dict() for c in countries]}


@view_config(route_name="cities", renderer="json")
def cities(request):
    # TODO: cities should be searchable, doing pagination only now
    country_code = request.matchdict["countrycode"]
    page = int(request.GET.get("page", 1))
    pagesize = int(request.GET.get("pagesize", 10))
    cities = (
        request.dbsession.query(models.City)
        .filter_by(countrycode=country_code)
        .order_by(models.City.name)
    )
    total = cities.count()
    totalpages = int(math.ceil(total / pagesize))
    cities = cities.offset(pagesize * (page - 1)).limit(pagesize)

    return {
        "cities": [c.to_dict() for c in cities],
        "page": page,
        "pagesize": pagesize,
        "totalpages": totalpages,
    }


@view_config(route_name="languages", renderer="json")
def languages(request):
    country_code = request.matchdict["countrycode"]
    languages = (
        request.dbsession.query(models.CountryLanguage)
        .filter_by(countrycode=country_code)
        .order_by(models.CountryLanguage.percentage.desc())
    )
    return {"languages": [l.to_dict() for l in languages]}


@view_config(route_name="city-create", request_method="POST", renderer="json")
def city_create(request):
    # TODO: use a proper serializing/deserializing library instead of this
    params = request.json_body
    countrycode = request.matchdict["countrycode"]
    errors = validate_city_params(params)
    if errors:
        request.response.status_code = 400
        return errors

    country = request.dbsession.query(models.Country).filter_by(code=countrycode).one_or_none()
    if not country:
        request.response.status_code = 400
        return {"countrycode": "no such countrycode"}
    city = models.City(
        name=params["name"],
        district=params["district"],
        population=int(params["population"]),
        countrycode=countrycode,
    )
    request.dbsession.add(city)
    request.dbsession.flush()
    return {"city": city.to_dict()}


@view_config(route_name="city", request_method="PUT", renderer="json")
def city_update(request):
    params = request.json_body
    errors = validate_city_params(params)
    if errors:
        request.response.status_code = 400
        return errors
    city = request.dbsession.query(models.City).get(request.matchdict["id"])
    city.name = params["name"]
    city.district = params["district"]
    city.population = int(params["population"])
    return {}


@view_config(route_name="city", request_method="DELETE", renderer="json")
def city_delete(request):
    city = request.dbsession.query(models.City).get(request.matchdict["id"])
    if not city:
        request.response.status_code = 500
        return {"error": "No city found"}
    request.dbsession.delete(city)
    return {}

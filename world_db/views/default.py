from pyramid.view import view_config
from pyramid.response import Response

from sqlalchemy.exc import DBAPIError

from .. import models


@view_config(route_name='home', renderer='../templates/mytemplate.mako')
def home(request):
    return {}

@view_config(route_name="continents", renderer='json')
def continents(request):
    continents = request.dbsession.query(models.Country.continent).distinct().order_by("continent")
    return {'continents': [c.continent for c in continents]}

@view_config(route_name="regions", renderer='json')
def regions(request):
    continent = request.GET['continent']
    regions = request.dbsession.query(models.Country.region).filter_by(continent=continent).distinct().order_by("region")
    return {'regions': [r.region for r in regions]}


@view_config(route_name="countries", renderer='json')
def countries(request):
    region = request.GET['region']
    countries = request.dbsession.query(models.Country).filter_by(region=region).distinct().order_by("name")
    return {'countries': [c.to_json() for c in countries]}

@view_config(route_name="cities", renderer='json')
def cities(request):
    country_code = request.GET['country_code']
    cities = (request.dbsession.query(models.City)
    .options(sa.orm.joinedload("capital").load_only("name"))
    .filter_by(countrycode=country_code)
    .distinct()
    .order_by("name")
    )
    return {'countries': [c.to_json() for c in cities]}

@view_config(route_name="cities", renderer='json')
def cities(request):
    country_code = request.GET['country_code']
    cities = request.dbsession.query(models.City).filter_by(countrycode=country_code).distinct().order_by("name")
    return {'countries': [{'name': c.name} for c in cities]}
import unittest

from pyramid import testing
from . import models

import transaction


class BaseTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp(settings={"sqlalchemy.url": "sqlite:///:memory:"})
        self.config.include(".models")
        settings = self.config.get_settings()

        from .models import (
            get_engine,
            get_session_factory,
            get_tm_session,
        )

        self.engine = get_engine(settings)
        session_factory = get_session_factory(self.engine)

        self.session = get_tm_session(session_factory, transaction.manager)

    def init_database(self):
        from .models.meta import Base

        Base.metadata.create_all(self.engine)

    def tearDown(self):
        from .models.meta import Base

        testing.tearDown()
        transaction.abort()
        Base.metadata.drop_all(self.engine)


class TestCityDelete(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()
        self.city = models.City(countrycode="POL", name="testcity", district="sss", population=123)
        self.session.add(self.city)
        self.session.flush()

    def test_passing_view(self):
        from .views.default import city_delete

        req = testing.DummyRequest(dbsession=self.session)
        req.matchdict["id"] = self.city.id
        info = city_delete(req)
        assert req.response.status_code == 200
        assert self.session.query(models.City).count() == 0

    def test_no_city(self):
        from .views.default import city_delete

        req = testing.DummyRequest(dbsession=self.session)
        req.matchdict["id"] = -1
        info = city_delete(req)
        assert req.response.status_code == 500


class TestCityCreate(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()
        self.country = models.Country(
            name="testcountry",
            code="AAA",
            continent="cont",
            region="reg",
            surfacearea=123,
            population=123,
            localname="ccc",
            governmentform="asda",
            code2="AA",
        )
        self.session.add(self.country)
        self.session.flush()

    def test_passing_view(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session,
            json_body={"name": "testcity", "district": "aaa", "population": 123},
        )
        req.matchdict["countrycode"] = self.country.code
        info = city_create(req)
        assert req.response.status_code == 200
        assert self.session.query(models.City).filter_by(name="testcity").one() is not None

    def test_validate_countrycode(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session,
            json_body={"name": "testcity", "district": "asd", "population": "123"},
        )
        req.matchdict["countrycode"] = "XXXXX"
        result = city_create(req)
        assert req.response.status_code == 400
        assert result["countrycode"] == "no such countrycode"

    def test_validate_name(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"district": "asd", "population": "123"}
        )
        req.matchdict["countrycode"] = self.country.code
        result = city_create(req)
        assert req.response.status_code == 400
        assert result["name"] == "missing value"

    def test_validate_district(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"name": "asd", "population": "123"}
        )
        req.matchdict["countrycode"] = self.country.code
        result = city_create(req)
        assert req.response.status_code == 400
        assert result["district"] == "missing value"

    def test_validate_population(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"name": "asd", "district": "aaa"}
        )
        req.matchdict["countrycode"] = self.country.code
        result = city_create(req)
        assert req.response.status_code == 400
        assert result["population"] == "missing value"

    def test_validate_population_not_number(self):
        from .views.default import city_create

        req = testing.DummyRequest(
            dbsession=self.session,
            json_body={"name": "asd", "district": "aaa", "population": "asd"},
        )
        req.matchdict["countrycode"] = self.country.code
        result = city_create(req)
        assert req.response.status_code == 400
        assert result["population"] == "must be a number"


class TestCityUpdate(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()
        self.country = models.Country(
            name="testcountry",
            code="AAA",
            continent="cont",
            region="reg",
            surfacearea=123,
            population=123,
            localname="ccc",
            governmentform="asda",
            code2="AA",
        )
        self.city = models.City(countrycode="POL", name="testcity", district="sss", population=123)
        self.session.add(self.country)
        self.session.add(self.city)
        self.session.flush()

    def test_passing_view(self):
        from .views.default import city_update

        req = testing.DummyRequest(
            dbsession=self.session,
            json_body={"name": "testcity", "district": "aaa", "population": 123},
        )
        req.matchdict["id"] = self.city.id
        info = city_update(req)
        assert req.response.status_code == 200

    def test_validate_name(self):
        from .views.default import city_update

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"district": "asd", "population": "123"}
        )
        req.matchdict["id"] = self.city.id
        result = city_update(req)
        assert req.response.status_code == 400
        assert result["name"] == "missing value"

    def test_validate_district(self):
        from .views.default import city_update

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"name": "asd", "population": "123"}
        )
        req.matchdict["id"] = self.city.id
        result = city_update(req)
        assert req.response.status_code == 400
        assert result["district"] == "missing value"

    def test_validate_population(self):
        from .views.default import city_update

        req = testing.DummyRequest(
            dbsession=self.session, json_body={"name": "asd", "district": "aaa"}
        )
        req.matchdict["id"] = self.city.id
        result = city_update(req)
        assert req.response.status_code == 400
        assert result["population"] == "missing value"

    def test_validate_population_not_number(self):
        from .views.default import city_update

        req = testing.DummyRequest(
            dbsession=self.session,
            json_body={"name": "asd", "district": "aaa", "population": "asd"},
        )
        req.matchdict["id"] = self.city.id
        result = city_update(req)
        assert req.response.status_code == 400
        assert result["population"] == "must be a number"


class TestCitiesPaginate(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()
        self.country = models.Country(
            name="testcountry",
            code="AAA",
            continent="cont",
            region="reg",
            surfacearea=123,
            population=123,
            localname="ccc",
            governmentform="asda",
            code2="AA",
        )
        self.session.add(self.country)
        cities = []
        for i in range(20):
            city = models.City(
                countrycode="AAA", name=f"testcity{i}", district="sss", population=123
            )
            self.session.add(city)
            cities.append(city)
        self.session.flush()

    def test_pagination_view(self):
        from .views.default import cities

        req = testing.DummyRequest(dbsession=self.session, GET={"pagesize": 3, "page": 2})
        req.matchdict["countrycode"] = "AAA"
        result = cities(req)
        assert req.response.status_code == 200
        assert len(result["cities"]) == 3
        assert result["page"] == 2
        assert result["totalpages"] == 7

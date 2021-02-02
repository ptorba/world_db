import sqlalchemy as sa
from .meta import Base


class CountryLanguage(Base):
    __tablename__ = 'countrylanguage'
    countrycode = sa.Column(sa.types.String(3), sa.ForeignKey('country.code'), primary_key=True)
    language = sa.Column(sa.types.String, nullable=False)
    isofficial = sa.Column(sa.types.Boolean, nullable=False)
    percentage = sa.Column(sa.types.Float, nullable=False)

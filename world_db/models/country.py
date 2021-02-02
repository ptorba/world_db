import sqlalchemy as sa
from .meta import Base


class Country(Base):
    __tablename__ = 'country'
    code = sa.Column(sa.types.String(3), primary_key=True)
    name = sa.Column(sa.types.String, nullable=False)
    continent = sa.Column(sa.types.String, nullable=False)
    region = sa.Column(sa.types.String, nullable=False)
    surfacearea = sa.Column(sa.types.Float, nullable=False)
    indepyear = sa.Column(sa.types.Integer)
    population = sa.Column(sa.types.Integer, nullable=False)
    lifeexpectancy = sa.Column(sa.types.Float)
    gnp = sa.Column(sa.types.Numeric(10, 2))
    gnpold = sa.Column(sa.types.Numeric(10, 2))
    localname = sa.Column(sa.types.String, nullable=False)
    governmentform = sa.Column(sa.types.String, nullable=False)
    headofstate = sa.Column(sa.types.String)
    capital_id = sa.Column("capital", sa.types.Integer, sa.ForeignKey("city.id"))
    code2 = sa.Column(sa.types.String(2), nullable=False)

    capital = sa.orm.relationship("City", foreign_keys=[capital_id])


    def to_json(self):
        return {
            'code': self.code,
            'name': self.name,
            'continent': self.continent,
            'region': self.region,
            'surfacearea': self.surfacearea,
            'indepyear': self.indepyear,
            'population': self.population,
            'lifeexpectancy': self.lifeexpectancy,
            'gnp': str(self.gnp),
            'gnpold': str(self.gnpold),
            'localname': self.localname,
            'governmentform': self.governmentform,
            'headofstate': self.headofstate,
            'capital': self.capital.name if self.capital else '',
        }
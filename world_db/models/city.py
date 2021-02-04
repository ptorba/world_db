import sqlalchemy as sa
from .meta import Base


class City(Base):
    __tablename__ = "city"
    id = sa.Column(
        sa.types.Integer, sa.Sequence("city_id_seq", start=5000, increment=1), primary_key=True
    )
    name = sa.Column(sa.types.String, nullable=False)
    countrycode = sa.Column(sa.types.String(3), sa.ForeignKey("country.code"), nullable=False)
    district = sa.Column(sa.Text, nullable=False)
    population = sa.Column(sa.Integer, nullable=False)
    country = sa.orm.relationship("Country", backref="cities", foreign_keys=[countrycode])

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "population": self.population,
            "district": self.district,
        }

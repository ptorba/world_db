import sqlalchemy as sa
from .meta import Base


class CountryLanguage(Base):
    __tablename__ = "countrylanguage"
    countrycode = sa.Column(sa.types.String(3), sa.ForeignKey("country.code"), primary_key=True)
    language = sa.Column(sa.types.String, nullable=False, primary_key=True)
    isofficial = sa.Column(sa.types.Boolean, nullable=False)
    percentage = sa.Column(sa.types.Float, nullable=False)

    def to_dict(self):
        return {
            "language": self.language,
            "isofficial": self.isofficial,
            "percentage": self.percentage,
        }

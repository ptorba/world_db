"""init

Revision ID: 9b1701711305
Revises: 
Create Date: 2021-02-01 18:40:13.428066

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9b1701711305'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(op.f('fk_city_countrycode_country'), 'city', 'country', ['countrycode'], ['code'])
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('fk_city_countrycode_country'), 'city', type_='foreignkey')
    # ### end Alembic commands ###

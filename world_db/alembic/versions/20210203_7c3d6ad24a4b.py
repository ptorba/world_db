"""init

Revision ID: 7c3d6ad24a4b
Revises: 
Create Date: 2021-02-03 21:37:54.696598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7c3d6ad24a4b"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute(sa.schema.CreateSequence(sa.Sequence("city_id_seq", start=5000, increment=1)))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###

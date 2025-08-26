"""Set default values for existing is_admin fields

Revision ID: 2df11efcc436
Revises: d6da85b65111
Create Date: 2025-08-26 12:48:30.645774

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2df11efcc436'
down_revision = 'd6da85b65111'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("UPDATE users SET is_admin = FALSE WHERE is_admin IS NULL")



def downgrade():
    pass

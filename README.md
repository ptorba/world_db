World DB
========

Getting Started for development
---------------
- Go into the project directory
- Create a Python virtual environment, if not already created.
    ```
    python3 -m venv env
    ```

- Upgrade packaging tools, if necessary.
    ```
    env/bin/pip install --upgrade pip setuptools
    ```
- Install the project in editable mode with its testing requirements.
    ```
    env/bin/pip install -e ".[testing]"
    ```
- Database

    - Import World database from https://www.postgresql.org/ftp/projects/pgFoundry/dbsamples/
      into your postgres
      ```
      psql -U <username> -d <dbname> < world.sql
      ```
    - Set Postgres connection string in `development.ini`
    - Upgrade database schema to latest revision.
        ```
        env/bin/alembic -c development.ini upgrade head
        ```

- Javascript
    - Build and watch JS files in development mode
        ```
        npm run watch
        ```

- Run project's tests.
    ```
    env/bin/pytest
    ```

- Run project.
    ```
    env/bin/pserve development.ini
    ```

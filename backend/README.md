## Local development

1. Set up local environment

- Enter the frontend folder with `cd .\backend\`
- Create .env file at the project root, the same folder where manage.py is located.
- Add required variables to .env file like the example below:
```
DATABASE_name="ebpm"
DATABASE_USER="postgres"
DATABASE_PASSWORD="postgres"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
```

2. Install dependencies

- Install the dependencies with `pip install requirements.txt`.

3. Migrate database

- Execute the database migration with `python manage.py migrate`.

4. Start project

- Execute the project with `python manage.py runserver`.

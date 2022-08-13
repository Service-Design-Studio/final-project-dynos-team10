# User Authentication Service
This server is the microservice that manages the user authentication across our two applications

## Project setup
### Ruby version
This server uses Ruby version 2.6.6, it is recommended that you use [RVM](https://rvm.io/) to manage your ruby versions

### System dependencies
1. PostgreSQL (recommended v14)
2. Ruby (2.6.6) and Rails (6.1.6)
3. Project Secrets
    - `.env` file
    - `master.key` file to decrypt project secrets
    > If you require these files, please open a GitHub Issue

### Setting up the database
```ruby
# to drop database tables if they already exist, if they don't exist yet (i.e. your first time), do NOT run this
rake db:drop
# to create the tables
rake db:create
# to migrate and setup schema
rake db:migrate
# to seed the database
rake db:seed

# to RESET and SEED
rake db:drop && rake db:create && rake db:migrate && rake db:seed
```

### Running the server locally
```ruby
bin/rails server
```
The server will be running at `http://localhost:8000`.

## Database diagram and schema
# Main App Server
This server is the microservice that manages the main business logic for our application

## Project setup
### Ruby version
This server uses Ruby version 3.1.2, it is recommended that you use [RVM](https://rvm.io/) to manage your ruby versions

### System dependencies
1. PostgreSQL (recommended v14)
2. Ruby (3.1.2) and Rails (7.0.3)
3. Project Secrets
    - `.env` file
    - `master.key` file to decrypt project secrets
    - Google service account credentials JSON file
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
The server will be running at `http://localhost:5000`.
## Testing
We have a unit test suite which can be run by:
```ruby
bundle exec rspec

# for a more verbose logging in the terminal
bundle exec rspec --format documentation
```
It is recommended that you reset and seed the database before running the test suite.

## Database diagram and schema
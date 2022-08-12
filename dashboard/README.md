# Dashboard Client Web Application
After cloning the project for the first time, run the following command to install required npm packages:
> For all following commands in this section, you must be in the "client" directory
```javascript
npm install
// do the following instead if you run into error messages and are using a newer node version (e.g. >v16)
npm install --legacy-peer-deps
```
## Running the application locally for development
Choose one of the following 2 methods to run the application locally for development.
### npm scripts
Run the following script which starts the development server:
```javascript
npm run dev
```
After the development server has started successfully, visit `http://localhost:5173` to visit the application.

### Dockerfile
As the application is intended to deploy via Google's Cloud Run, the application conveniently has a `Dockerfile` to allow containerisation of this application.

If you choose to do build and serve the app with the Dockerfile, do the following steps:
```bash
# you are reminded to be in the "client" directory and docker is installed and running on your machine
docker build -t <tag-name> .
docker run -p 8080:8080 <tag-name>
```
> You **must** specify publish/expose port 8080 of the container as the Dockerfile defines it as such. 

You can always refer to Docker's documentation for more options and guidance.

After the development server has started successfully, visit `http://localhost:8080` to visit the application.

## Testing
We utilise the following tools for testing:
1. `Cypress` as the test runner that includes assertions, mocking and stubbing.
2. `Cucumber` as the spec/test files through Domain-Specific Language (DSL) with the Gherkin syntaxs.

### Important Todos before running tests
The cucumber tests depend on two things for it to run properly:
1. The rails development server started with a cleared, seeded database
```ruby
# assuming you are currently in the "client" directory
cd ..
cd server
rake db:drop
rake db:create
rake db:migrate
rake db:seed
bin/rails server
```
> More information on starting the rails server can be found [here](../server/README.md)
2. This client application started in testing mode, and it is recommended to use the npm script below instead of the Dockerfile
```javascript
npm run dev:test
```
### Running the actual tests
After you have ran the past two todos, you can run either one of the following commands to start cypress.

```javascript
// e2e testing HEADLESS (i.e. within your terminal)
npm run cypress:run

// e2e testing with GUI
npm run cypress:open
```
In general, you should have 2-3 active terminals running each doing the following:
1. Rails local server at port 5000
2. Dashboard local server at port 5173
3. Cypress runner (if you run it with the GUI i.e. `npm run cypress:open`)
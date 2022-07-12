[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7980186&assignment_repo_type=AssignmentRepo)

# Service Design Studio Team 10

## Team Members
- [Joel Tay](https://github.com/Vemrthiss)
- [Tan Kay Wee](https://github.com/kayweeee)
- [Tan Li Hui](https://github.com/t-lihui)
- [Umang Gupta](https://github.com/Usgupta)

## Collaborating
Clone the repository using `git clone`:
```
git clone https://github.com/Service-Design-Studio/final-project-dynos-team10.git
```
### Working on a new feature

When working on a new feature, create a **new branch** first with the following format `<name>-<featurename>` and commands:
```
# Get updated main branch
git checkout main
git pull origin main

# Create new branch
git checkout -b <name>-<featurename>

# Example
git checkout main
git pull origin main
git checkout -b john-test
```

### Commiting and Pushing your changes

Stage your changes:
```
git add .
```

Commit your changes:
```
git commit -m "INSERT COMMIT MESSAGE HERE"

# Example
git commit -m "Implemented the entire app"
```

Push to your branch using `git push` command:
```
git push origin <name>-<featurename>

# Example
git push origin john-test
```

Submit a Pull Request (PR) to the `main` branch using the GitHub website
```
Repo main page > Pull requests > New pull request
```
The `base` branch should be `main` and the `compare` branch should be your branch.

## Frontend/React App
After cloning the project for the first time, run the following command to install required npm packages:
> For all following commands in this section, you must be in the "client" directory
```
npm install
```

### Testing
```javascript
// unit testing
npm run test

// e2e testing HEADLESS
npm run cypress:run

// e2e testing with GUI
npm run cypress:open
```

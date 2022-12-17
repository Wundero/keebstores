# keebstores

NextJS web app to peruse keyboard stores, based on [this list of vendors](https://www.keebtalk.com/t/list-of-keyboard-retailers-shops-stores-vendors/9022)

To run locally, make sure [NodeJS](https://nodejs.org/en/) is installed (I highly recommend using [NVM](https://github.com/nvm-sh/nvm)/[NVM windows](https://github.com/coreybutler/nvm-windows) to manage node versions, since updating/removing NodeJS on its own is a pain) and make sure [Sqlite](https://www.sqlite.org/index.html) is installed. This project requires Node version 16 or greater, and Sqlite version 3 or greater.

Ideally, you load this repository with [Git](https://git-scm.com/), since it is easier to get the code simply by running `git clone https://github.com/Wundero/keebstores`, however downloading as a Zip and extracting it to a folder also works, just know that you cannot contribute if you do so that way.

Once the dependencies are installed, open up a command line terminal in the root folder of the project and run `npm i`. This will install the dependencies of this project. Then, to run, either run `npm run dev` (starts faster but might be more intense on your system since it is actively watching for file changes) or:
1. Run `npm run build`, which can take a few minutes
2. Run `npm run start`, which run the app.

After running the app, navigate to `localhost:3000` in your browser (the terminal should have the URL, the port may be different than 3000 if it is already in use) and behold the keyboard store table.
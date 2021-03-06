### AWS CPR (Create PR) Tool 
node command line tool

#### Installation

1. `git clone` repository
2. `npm install`
3. `npm i -g`
4. run `cpr` in your terminal 
5. Follow the questions in terminal

To check if cpr tool is install in your global modules

`npm ls -g --depth=0`

!NOTE: First-time installation will ask you root set root folder for repositories. In order for tool to work properly, please consider the following folder tree in on your computer:

- root-folder/
   - repository-1
   - repository-2
   - repository-n


#### How to reset configuration

Run `cpr --reset`

This command will remove previous configuration and will run the walkthrough again.

Tip: configuration is stored here

**macOS**: /Users/[YOUR-USERNME]/.config/configstore/cpr.json. 
**Linux**: /home/[YOUR-USERNME]/.config/configstore/cpr.json

Run `rm -rf cpr.json` in order to hard reset cpr tool configuration


## Features in v1.1.0

1. Remote branch autocomplete instead of manual typing
2. PR Title suggestion based on last commit in .git repository
3. Branch suggestions based on CodeCommit Repository default branch value
4. Branch suggestion based on current checked out local HEAD in repository
5. Suggestion to build repository before making PR (works for both: npm and lerna monorepos). Build is optional but defaults to true for each repository.
6. Copy PR urls to clipboard - you'll have all your ulrs and repository names in clipboard ready to get pasted in chat.
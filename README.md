# YNKR

**Note To Self**

Dear Future Self,

Welcome back to your app. It's been a while. Here is a quick refresher:

If you cannot remember what functionality is available, run `compgen` to get a list of available commands.

With regards to `tic-tac-toe`, there will be some latency with the first move. This is because you wanted to learn golang and so you wrote a program to [calculate the next move](https://github.com/younker/tic-tac-toe) served as an AWS Lambda via their API Gateway. I'm cheap and so the lambda app will go to sleep quickly thus incurring startup cost rather frequently.

Scrolling via `ctrl+p`, `ctrl+n`, up and down arrows is available but at this time, you need to get around to other stuff like `clear`, `page up`, `reverse search`, `auto-complete`, etc.

The [HTTP requester](https://github.com/younker/ynkr/blob/master/src/util/http/requester.js) pattern (total overkill for what we need now) is largely unproven. It has some tests and stuff but you wrote that and [then used it once](https://github.com/younker/ynkr/blob/master/src/components/Commands/TicTacToe/index.js#L39-L51), so there are likely bugs there waiting for you (but it was fun to build!).

As for deploys, the app is hosted in s3 and deployed via `npm run deploy`. You set this up to use the `aws` cli which means if you are on a new computer and trying to deploy, it will fail wonderfully and you will need to install the cli, configure it (with the default profile as your personal one) and then make plans to transition this to docker so we do not have to worry about that sort of thing in the future.

Your Friend,

Jason Younker

## TODO
- [ ] bug: if you `tic-tac-toe --player-one bot`, you can click while it's the bots turn
- [ ] allow double-click (select) -> copy. Right now `App`'s `useEffect` steals focus
- [ ] command line:
  - [ ] auto-complete
  - [ ] reverse search
  - [ ] clear
- [ ] hook up ci
- [ ] [dotenv-extended](https://www.npmjs.com/package/dotenv-extended)

## Jest Issue

After the upgrade, I was running into the following error:

> Jest encountered an unexpected token
> Jest failed to parse a file...
>     Details:
>     /Users/jasonyounker/projects/ynkr/node_modules/axios/index.js: 1
>     SyntaxError: Cannot use import statement outside a module
>     4 | } from 'rambda';
>     5 |
> > 6 | import axios from 'axios';

Axios issue [#5158](https://github.com/axios/axios/issues/5185) sent me to issue [#5026](https://github.com/axios/axios/issues/5026) which pointed me to [this SO answer](https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios/74297004#74297004). The result was the `"jest"` section in `package.json`. Since I cannot leave a note there, I am leaving it here.

Note that I could fix it by altering how we execute the tests from `react-scripts test` to `jest --transformIgnorePatterns \"node_modules/(?!@toolz/allow)/\" --env=jsdom"` (this could also go into the jest config file). However, bypassing `react-scripts` means we didn't get helpful ergonomics (eg watch).

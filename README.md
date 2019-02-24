# YNKR

~http://ynkr.org~ Actually, until I update DNS, we are living at `http://ynkr.s3-website.us-east-2.amazonaws.com/`

# Note To Self

Dear Future Self,

Welcome back to your app. It's been a while. Here is a quick refresher:

The app is hosted in s3 and deployed via `npm run deploy`. You set this up to
using the `aws` cli which means if you are on a new computer and trying to
deploy, it will fail wonderfully and you will need to install the cli,
configure it (with the default profile as your personal one) and then make
plans to transition this to docker so we do not have to worry about that sort
of thing in the future.

Your Friend,

Jason Younker

# TODO
- [ ] hook up ci
- [ ] [dotenv-extended](https://www.npmjs.com/package/dotenv-extended)

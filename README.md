<div align="center">
    <h1>Discord OAuth2 Client</h1>
    <p>
    <a href="https://www.npmjs.com/package/discord-oauth2-client"><img src="https://img.shields.io/npm/v/discord-oauth2-client.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-oauth2-client"><img alt="npm" src="https://img.shields.io/npm/dw/discord-oauth2-client"></a>
 <br />
    <a href="https://nodei.co/npm/discord-oauth2-client/"><img src="https://nodei.co/npm/discord-oauth2-client.png?downloads=true&downloadRank=true&stars=true"></a>
    </p>
</div>

## Example Usage
```js
const Strategy = require("discord-oauth2-client").Strategy;
const passport = require("passport");

passport.use(new Strategy({
    clientID: '', // https://discord.com/developers/applications
    clientSecret: '', // https://discord.com/developers/applications
    callbackURL: '/callback',
    scope: ['identify', 'guilds'],
    prompt: 'none'
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
```

## Links

* [Discord Server](https://discord.gg/PwWVm9uX7j)
* [GitHub](https://github.com/apollodevv/discord-oauth2-client)
* [NPM](https://www.npmjs.com/package/discord-oauth2-client)


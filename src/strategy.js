/**
 * discord-oauth2-client dependencies
 */

const OAuth2Strategy = require("passport-oauth2");
    InternalOAuthError = require("passport-oauth2").InternalOAuthError;
    util = require("util");

/**
 * Strategy Options
 * @typedef {Object} StrategyOptions
 * @property {string} [clientID]
 * @property {string} [clientSecret]
 * @property {string} [callbackURL]
 * @property {array} [scope]
 * @property {string} [authorizationURL="https://discord.com/api/oauth2/authorize"]
 * @property {string} [tokenURL="https://discord.com/api/oauth2/token"]
 * @property {string} [scopeSeparator=" "]
 */

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://discord.com/api/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://discord.com/api/oauth2/token';
    options.scopeSeparator = options.scopeSeparator || ' ';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'discord';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherits from OAuth2 Strategy
 */

utils.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Discord.
 *
 * This function constructs a normalized profile.
 * Along with the properties returned from /users/@me, properties returned include:
 *   - `connections`      Connections data if you requested this scope
 *   - `guilds`           Guilds data if you requested this scope
 *   - `fetchedAt`        When the data was fetched as a `Date`
 *   - `accessToken`      The access token used to fetch the (may be useful for refresh)
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */

 Strategy.prototype.userProfile = function(accessToken, done) {
    var self = this;
    this._oauth2.get('https://discord.com/api/users/@me', accessToken, function(err, body, res) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch the user profile.', err))
        }

        try {
            var parsedData = JSON.parse(body);
        }
        catch (e) {
            return done(new Error('Failed to parse the user profile.'));
        }

        var profile = parsedData;
        profile.provider = 'discord';
        profile.accessToken = accessToken;

        self.checkScope('connections', accessToken, function(errx, connections) {
            if (errx) done(errx);
            if (connections) profile.connections = connections;
            self.checkScope('guilds', accessToken, function(erry, guilds) {
                if (erry) done(erry);
                if (guilds) profile.guilds = guilds;

                profile.fetchedAt = new Date();
                return done(null, profile)
            });
        });
    });
};

Strategy.prototype.checkScope = function(scope, accessToken, cb) {
    if (this._scope && this._scope.indexOf(scope) !== -1) {
        this._oauth2.get('https://discord.com/api/users/@me/' + scope, accessToken, function(err, body, res) {
            if (err) return cb(new InternalOAuthError('Failed to fetch user\'s ' + scope, err));
            try {
                var json = JSON.parse(body);
            }
            catch (e) {
                return cb(new Error('Failed to parse user\'s ' + scope));
            }
            cb(null, json);
        });
    } else {
        cb(null, null);
    }
}
/**
 * Options for the authorization.
 * @typedef {Object} authorizationParams
 * @property {any} permissions
 * @property {any} prompt
 */
/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {authorizationParams} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function(options) {
    var params = {};
    if (typeof options.permissions !== 'undefined') {
        params.permissions = options.permissions;
    }
    if (typeof options.prompt !== 'undefined') {
        params.prompt = options.prompt;
    }
    return params;
};

module.exports = Strategy;
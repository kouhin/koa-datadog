const StatsD = require('hot-shots');

module.exports = function(options) {
  const opts = options || {};
  const datadog = opts.dogstatsd || new StatsD();
  const stat = opts.stat || 'node.express.router';
  const tags = opts.tags || [];
  const path = opts.path || false;
  const method = opts.method || false;
  const protocol = opts.protocol || false;
  const response_code = opts.response_code || false;
  const DELIM = opts.delim || '-';
  const REGEX_PIPE = /\|/g;

  /**
   * Checks if str is a regular expression and stringifies it if it is.
   * Returns a string with all instances of the pipe character replaced with
   * the delimiter.
   * @param  {*}       str  The string to check for pipe chars
   * @return {string}       The input string with pipe chars replaced
   */
  function replacePipeChar(str) {
    if (str instanceof RegExp) {
      str = str.toString();
    }
    return str && str.replace(REGEX_PIPE, DELIM);
  }

  function send(ctx, startTime, err) {
    if (!ctx.path) {
      return;
    }
    const statTags = [`route:${replacePipeChar(ctx.path)}`].concat(tags);

    if (method !== false) {
      statTags.push(`method:${ctx.method.toLowerCase()}`);
    }

    if (protocol && ctx.protocol) {
      statTags.push(`protocol:${ctx.protocol}`);
    }

    if (path !== false) {
      statTags.push(`path:${ctx.path}`);
    }

    if (response_code) {
      const status = err ? err.status || 500 : ctx.status || 404;
      statTags.push(`response_code:${status}`);
      datadog.increment(`${stat}.response_code.${status}`, 1, statTags);
      datadog.increment(`${stat}.response_code.all`, 1, statTags);
    }

    datadog.histogram(
      `${stat}.response_time`,
      Date.now() - startTime,
      1,
      statTags
    );
  }

  return async function(ctx, next) {
    const startTime = Date.now();
    try {
      await next();
    } catch (err) {
      send(ctx, startTime, err);
      throw err;
    }
    send(ctx, startTime);
  };
};

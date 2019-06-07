# koa-datadog

Datadog middleware for [Koa](https://koajs.com)

This is a fork of [node-connect-datadog](https://github.com/DataDog/node-connect-datadog) with modifications for Koa.




## Usage

Add middleware immediately before your router.

``` javascript
import koaDatadog from 'koa-datadog';
import Koa from 'koa';

const app = new Koa();
app.use(koaDatadog({}));
```
## Options

All options are optional.

* `dogstatsd` hot-shots client. `default = new require("hot-shots")()`
* `stat` *string* name for the stat. `default = "node.express.router"`
* `tags` *array* of tags to be added to the histogram. `default = []`
* `route`*boolean* include route tag (only koa-router is support). `default = false`
* `path` *boolean* include path tag. `default = false`
* `method` *boolean* include http method tag. `default = false`
* `protocol` *boolean* include protocol tag. `default = false`
* `response_code` *boolean* include http response codes. `default = false`
* `delim` *string* char to replace pipe char with in the route `default = '-'`

## License

View the [LICENSE](https://github.com/AppPress/node-connect-datadog/blob/master/LICENSE) file.


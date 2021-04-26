# Paul's Sliding-Window Rate Limiter

Efficiently rate limit calls using a sliding window algorithm. Stores windows in memory (no redis dependency, like every other rate limiting library out there).

Uses the "Sliding Window" algorithm described in [this article](https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm/).

## Usage

```
npm i pauls-sliding-window-rate-limiter
```

```js
import { RateLimiter } from 'pauls-sliding-window-rate-limiter'

const rl = new RateLimiter({
  limit: 100, // how many hits allowed in the window? default 100
  window: 1e3 // how big is the window? (default 1000ms)
})

if (rl.hit('key')) {
  // within the limit
} else {
  // limit exceeded
}
```

## LICENSE

Copyright Paul Frazee 2021

MIT license
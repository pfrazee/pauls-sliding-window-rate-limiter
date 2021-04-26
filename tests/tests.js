import test from 'ava'
import { RateLimiter } from '../index.js'

test('base api', async t => {
  const limiter = new RateLimiter({
    window: 1e3,
    limit: 100
  })

  // run 200 calls spaced out every 10ms
  // these will all pass because they're within the 100/s limit
  let n = 0
  await new Promise(resolve => {
    let i = setInterval(() => {
      t.truthy(limiter.hit('test'), String(++n))
      if (n === 200) {
        clearInterval(i)
        resolve()
      }
    }, 10)
  })

  // now run 100 calls without proper spacing
  // because of the previous 200 calls, this will hit the limit
  let acc = true
  for (let i = 0; i < 100; i++) {
    acc = acc && limiter.hit('test')
  }
  t.falsy(acc, 'non-spaced hits')

  // wait 1/3 of the window and run one more call
  // this will pass because enough time has past
  await new Promise(r => setTimeout(r, 300))
  t.truthy(limiter.hit('test'), 'one last time')
})

test('multiple counters', async t => {
  const limiter = new RateLimiter({
    window: 1e3,
    limit: 10
  })

  for (let i = 0; i < 10; i++) {
    t.truthy(limiter.hit('test1'))
    t.truthy(limiter.hit('test2'))
    t.truthy(limiter.hit('test3'))
  }
  t.falsy(limiter.hit('test1'))
  t.falsy(limiter.hit('test2'))
  t.falsy(limiter.hit('test3'))
})
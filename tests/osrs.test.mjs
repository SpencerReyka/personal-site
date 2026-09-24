import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  streamScore, rankTogWorlds, isWatched, activeWatchedStars, HOME_WORLD, CONFIDENT_HITS,
} from '../lib/osrs.ts'

// --- Tears of Guthix ---------------------------------------------------------------------

test('stream score rewards early greens, and gggbbb is the best possible', () => {
  assert.equal(streamScore('gggbbb'), 3)
  assert.equal(streamScore('bbbggg'), 12)
  assert.ok(streamScore('gggbbb') < streamScore('gbgbgb'))
  assert.ok(streamScore('gbgbgb') < streamScore('bgbgbg'))

  // Every arrangement of three greens in six slots, so nothing can score outside this range.
  const all = []
  for (let i = 0; i < 64; i += 1) {
    const o = [...Array(6)].map((_, b) => ((i >> b) & 1 ? 'g' : 'b')).join('')
    if (o.split('g').length - 1 === 3) all.push(streamScore(o))
  }
  assert.equal(all.length, 20, 'C(6,3) = 20 possible orders')
  assert.equal(Math.min(...all), 3)
  assert.equal(Math.max(...all), 12)
})

test('ranking puts the best stream order first, not the nearest world', () => {
  const ranked = rankTogWorlds([
    { world_number: 444, hits: 8, stream_order: 'bgbbgg' },   // home, mediocre
    { world_number: 429, hits: 82, stream_order: 'gggbbb' },  // 15 away, optimal
  ])
  assert.equal(ranked[0].world_number, 429,
    'your own world topping the list answers a question nobody asked')
  assert.equal(ranked[0].distance, 15)
})

test('distance breaks ties between equally good orders', () => {
  const ranked = rankTogWorlds([
    { world_number: 500, hits: 40, stream_order: 'gggbbb' },
    { world_number: 450, hits: 40, stream_order: 'gggbbb' },
    { world_number: 300, hits: 40, stream_order: 'gggbbb' },
  ])
  assert.deepEqual(ranked.map((w) => w.world_number), [450, 500, 300])
})

test('hits break a tie only after distance, and low confidence is marked not hidden', () => {
  const ranked = rankTogWorlds([
    { world_number: 445, hits: 1, stream_order: 'gggbbb' },
    { world_number: 443, hits: 99, stream_order: 'gggbbb' },
  ])
  // Both one hop away, so the nearer-equal pair falls through to hits.
  assert.equal(ranked[0].world_number, 443)
  assert.equal(ranked[1].confident, false, 'a single report is flagged')
  assert.equal(ranked[0].confident, true)
  assert.equal(ranked.length, 2, 'low confidence must not remove a world from the list')
  assert.equal(CONFIDENT_HITS, 3)
})

test('home world defaults to 444 and is overridable', () => {
  assert.equal(HOME_WORLD, 444)
  const worlds = [{ world_number: 100, hits: 5, stream_order: 'gggbbb' }]
  assert.equal(rankTogWorlds(worlds)[0].distance, 344)
  assert.equal(rankTogWorlds(worlds, 101)[0].distance, 1)
})

// --- Shooting stars ----------------------------------------------------------------------

test('location matching is loose, because upstream names are free text', () => {
  assert.ok(isWatched('Catherby bank'))
  assert.ok(isWatched('Ardougne Monastery'))
  assert.ok(isWatched('Yanille bank'))
  // The same place under a different name must still match — an exact list would silently stop
  // matching and look like a quiet night.
  assert.ok(isWatched('catherby'))
  assert.ok(isWatched('East Ardougne mine'))
  assert.ok(!isWatched('Rimmington mine'))
  assert.ok(!isWatched('Varrock east bank'))
})

test('expired stars are dropped — showing them is how you hop to nothing', () => {
  const now = 1_000_000
  const active = activeWatchedStars([
    { world: 1, calledLocation: 'Catherby bank', tier: 3, minTime: null, maxTime: now - 60 },
    { world: 2, calledLocation: 'Yanille bank', tier: 5, minTime: null, maxTime: now + 600 },
  ], now)
  assert.equal(active.length, 1)
  assert.equal(active[0].world, 2)
  assert.equal(active[0].secondsLeft, 600)
})

test('soonest to despawn first, and an unknown window sorts last as null', () => {
  const now = 1_000_000
  const active = activeWatchedStars([
    { world: 1, calledLocation: 'Catherby bank', tier: 2, minTime: null, maxTime: now + 900 },
    { world: 2, calledLocation: 'Yanille bank', tier: 4, minTime: null, maxTime: null },
    { world: 3, calledLocation: 'Ardougne Monastery', tier: 9, minTime: null, maxTime: now + 120 },
  ], now)
  assert.deepEqual(active.map((s) => s.world), [3, 1, 2])
  assert.equal(active[2].secondsLeft, null,
    'no window is not the same as despawned, and must not become a made-up number')
})

test('everything outside the three locations is excluded', () => {
  const now = 1_000_000
  const active = activeWatchedStars([
    { world: 1, calledLocation: 'Rimmington mine', tier: 9, minTime: null, maxTime: now + 600 },
    { world: 2, calledLocation: 'Crafting guild', tier: 8, minTime: null, maxTime: now + 600 },
  ], now)
  assert.deepEqual(active, [])
})

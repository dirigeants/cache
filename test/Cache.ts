import ava from 'ava';
import { Cache } from '../src';

const cache = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);
const emptyCache: Cache<string, string> = new Cache();

// firsts

ava('get the first entry of a cache', (test): void => {
	test.deepEqual(cache.first, ['first', 'foo']);
});

ava('get the first entry of an empty cache', (test): void => {
	test.is(emptyCache.first, null);
});

ava('get the first key of a cache', (test): void => {
	test.is(cache.firstKey, 'first');
});

ava('get the first key of an empty cache', (test): void => {
	test.is(emptyCache.firstKey, null);
});

ava('get the first value of a cache', (test): void => {
	test.is(cache.firstValue, 'foo');
});

ava('get the first value of an empty cache', (test): void => {
	test.is(emptyCache.firstValue, null);
});

// lasts

ava('get the last entry of a cache', (test): void => {
	test.deepEqual(cache.last, ['third', 'baz']);
});

ava('get the last entry of an empty cache', (test): void => {
	test.is(emptyCache.last, null);
});

ava('get the last key of a cache', (test): void => {
	test.is(cache.lastKey, 'third');
});

ava('get the last key of an empty cache', (test): void => {
	test.is(emptyCache.lastKey, null);
});

ava('get the last value of a cache', (test): void => {
	test.is(cache.lastValue, 'baz');
});

ava('get the last value of an empty cache', (test): void => {
	test.is(emptyCache.lastValue, null);
});

// Finds

ava('find an entry in a cache', (test) => {
	test.deepEqual(cache.find((val, key) => val === 'bar' && key === 'second'), ['second', 'bar']);
});

ava('find an entry that doesn\'t exist in a cache', (test) => {
	test.is(cache.find(() => false), undefined);
});

ava('find an entry while binding a context', (test) => {
	test.notThrows(() => cache.find((_val, key) => key === 'second', cache));
});

ava('find a key in a cache', (test) => {
	test.deepEqual(cache.findKey((val, key) => val === 'bar' && key === 'second'), 'second');
});

ava('find a key that doesn\'t exist in a cache', (test) => {
	test.is(cache.findKey(() => false), undefined);
});

ava('find a key while binding a context', (test) => {
	test.notThrows(() => cache.findKey((_val, key) => key === 'second', cache));
});

ava('find a value in a cache', (test) => {
	test.deepEqual(cache.findValue((val, key) => val === 'bar' && key === 'second'), 'bar');
});

ava('find a value that doesn\'t exist in a cache', (test) => {
	test.is(cache.findValue(() => false), undefined);
});

ava('find a value while binding a context', (test) => {
	test.notThrows(() => cache.findValue((_val, key) => key === 'second', cache));
});

// equals

ava('2 caches are equal', (test) => {
	const cache2 = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);

	test.true(cache2.equals(cache));
});

ava('2 caches are not equal', (test) => {
	const cache2 = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);

	test.false(cache2.equals(emptyCache));
});

// clone

ava('cloning caches', (test) => {
	test.deepEqual([...cache.clone()], [...cache]);
});

// sweep

ava('sweeping cache', (test) => {
	test.plan(2);

	const sweptCache = new Cache(cache);
	const swept = sweptCache.sweep((val) => val === 'baz');

	// Test if the number returned is indeed 1
	test.is(swept, 1);
	test.deepEqual([...sweptCache], [['first', 'foo'], ['second', 'bar']]);
});

ava('sweeping cache with bind', (test) => {
	const sweptCache = new Cache(cache);

	test.notThrows(() => new Cache(cache).sweep((val) => val === 'baz', sweptCache));
});

// filter

ava('filtering the cache', (test) => {
	test.deepEqual([...cache.filter((val) => val === 'foo')], [['first', 'foo']]);
});

ava('filtering the cache with bind', (test) => {
	test.notThrows(() => cache.filter((val) => val === 'foo', cache));
});

// map

ava('map the cache', (test) => {
	test.deepEqual(cache.map((value) => value), ['foo', 'bar', 'baz']);
});

ava('map the cache with bind', (test) => {
	test.notThrows(() => cache.map((value) => value, cache));
});

// some

ava('find if something in the cache fulfils some condition', (test) => {
	test.true(cache.some(val => val === 'foo'));
});

ava('find if something in the cache does not fulfil some condition', (test) => {
	test.false(cache.some(() => false));
});

ava('find if something in the cache fulfils some condition with bind', (test) => {
	test.notThrows(() => cache.some(val => val === 'foo', cache));
});

// every

ava('find if everything in the cache fulfils some condition', (test) => {
	test.true(cache.every((val) => val.length > 2));
});

ava('find if everything in the cache does not fulfil some condition', (test) => {
	test.false(cache.every(() => false));
});

ava('find if everything in the cache fulfils some condition with bind', (test) => {
	test.notThrows(() => cache.every((val) => val.length > 2, cache));
});

// reduce

ava('reduce the cache to one single value', (test) => {
	test.is(cache.reduce((accumulator, value) => `${accumulator}${value}`, ''), 'foobarbaz');
});

ava('reduce the cache to one single value with bind', (test) => {
	test.notThrows(() => cache.reduce((accumulator, value) => `${accumulator}${value}`, '', cache));
});

// concat

ava('concat two cache instances', (test) => {
	const concat = cache.concat(new Cache([['forth', 'biz'], ['fifth', 'buzz']]));
	test.deepEqual([...concat], [['first', 'foo'], ['second', 'bar'], ['third', 'baz'], ['forth', 'biz'], ['fifth', 'buzz']]);
});

// sort

ava('sort the cache', (test) => {
	test.plan(2);

	// sort is in-place
	const clone = new Cache(cache);
	const sorted = [['second', 'bar'], ['third', 'baz'], ['first', 'foo']];

	test.deepEqual([...clone.sort()], sorted);
	test.deepEqual([...clone], sorted);
});

// sorted

ava('sort the cache into a new one', (test) => {
	test.plan(2);

	// sort is not in-place
	const clone = new Cache(cache);
	const sorted = [['second', 'bar'], ['third', 'baz'], ['first', 'foo']];

	test.deepEqual([...clone.sorted()], sorted);
	test.notDeepEqual([...clone], sorted);
});

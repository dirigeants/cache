import ava from 'ava';
import { Cache } from '../dist';

const cache = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);
const emptyCache: Cache<string, string> = new Cache();

ava('get the first element of the cache', (test): void => {
	test.true(cache.first[0] === 'first' && cache.first[1] === 'foo');
	test.true(emptyCache.first === null);
});

ava('get the first key of the cache', (test): void => {
	test.true(cache.firstKey === 'first');
	test.true(emptyCache.firstKey === null);
});

ava('get the first value of the cache', (test): void => {
	test.true(cache.firstValue === 'foo');
	test.true(emptyCache.firstValue === null);
});

ava('get the last element of the cache', (test): void => {
	test.true(cache.last[0] === 'third' && cache.last[1] === 'baz');
	test.true(emptyCache.last === null);
});

ava('get the last key of the cache', (test): void => {
	test.true(cache.lastKey === 'third');
	test.true(emptyCache.lastKey === null);
});

ava('get the last value of the cache', (test): void => {
	test.true(cache.lastValue === 'baz');
	test.true(emptyCache.lastValue === null);
});

ava('find an element in the cache', (test) => {
	const result = cache.find((val, key) => key === 'second' && val === 'bar');
	const emptyResult = cache.find(() => false);
	test.true(result[0] === 'second' && result[1] === 'bar');
	test.true(emptyResult === undefined);
	test.notThrows(() => cache.find((val, key) => key === 'second' && val === 'bar', cache));
});

ava('find an key in the cache', (test) => {
	const result = cache.findKey(val => val === 'bar');
	const emptyResult = cache.findKey(() => false);
	test.true(result === 'second');
	test.true(emptyResult === undefined);
	test.notThrows(() => cache.findKey(val => val === 'bar', cache));
});

ava('find a value in the cache', (test) => {
	const result = cache.findValue((_val, key) => key === 'second');
	const emptyResult = cache.findValue(() => false);
	test.true(result === 'bar');
	test.true(emptyResult === undefined);
	test.notThrows(() => cache.findValue((_val, key) => key === 'second', cache))
});

ava('seeing if 2 caches are equal', (test) => {
	const cache2 = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);
	test.true(cache.equals(cache2));
	test.false(cache.equals(emptyCache));
});

ava('cloning caches', (test) => {
	const cache2 = cache.clone();
	test.true(cache.equals(cache2));
});

ava('sweeping cache', (test) => {
	const trueSwoopedCache = new Cache([['first', 'foo'], ['second', 'bar']]);
	const swoopedCache = cache.clone();
	const swooped = swoopedCache.sweep((val) => val === 'baz');

	// Test if the size returned is indeed 1
	test.true(swooped === 1);
	test.true(swoopedCache.equals(trueSwoopedCache));
	test.notThrows(() => swoopedCache.sweep((val) => val === 'baz', cache))
});

ava('filtering the cache', (test) => {
	const filteredCache2 = new Cache([['first', 'foo']]);
	const filteredCache = cache.filter((val) => val === 'foo');
	test.true(filteredCache.equals(filteredCache2));
	test.notThrows(() => cache.filter((val) => val === 'foo', cache))
});

ava('map the cache', (test) => {
	const map = cache.map((value) => value);
	test.true(map[0] === 'foo' && map[1] === 'bar' && map[2] === 'baz');
	test.notThrows(() => cache.map((value) => value, cache));
});

ava('find if something in the cache fulfils some condition', (test) => {
	test.true(cache.some(val => val === 'foo'));
	test.false(cache.some(() => false));
	test.notThrows(() => cache.some(val => val === 'foo', cache));
});

ava('find if everything in the cache fulfils some condition', (test) => {
	test.true(cache.every((val) => val.length > 2));
	test.false(cache.every(() => false));
	test.notThrows(() => cache.every(() => true, cache));
});

ava('reduce the cache to one single value', (test) => {
	test.true(cache.reduce((accumulator, value) => `${accumulator}${value}`, '') === 'foobarbaz');
	test.notThrows(() => cache.reduce((accumulator, value) => `${accumulator}${value}`, null, cache));
});

ava('concat two cache instances', (test) => {
	const actualResult = new Cache([['first', 'foo'], ['second', 'bar'], ['third', 'baz'], ['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);
	const result = cache.concat(cache.clone());
	test.true(actualResult.equals(result));
});

ava('sort the cache', (test) => {
	const sortInited = [['first', 'foo'], ['second', 'bar'], ['third', 'baz'], ['first', 'foo'], ['second', 'bar'], ['third', 'baz']].sort()
	const actualResult = new Cache(sortInited as Iterable<readonly[string, string]>);
	const result = cache.sort();
	test.true(actualResult.equals(result));
});

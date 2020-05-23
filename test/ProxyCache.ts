import ava from 'ava';
import { ProxyCache } from '../src';

const cache = new Map([['first', 'foo'], ['second', 'bar'], ['third', 'baz']]);
const proxy = new ProxyCache(cache, ['first', 'second']);
const emptyProxy = new ProxyCache(cache);

// size

ava('get the size of an empty proxy', (test): void => {
	test.is(emptyProxy.size, 0);
});

ava('get the size of a filled proxy', (test): void => {
	test.is(proxy.size, 2);
});

// get

ava('get a non-existing key from the cache', (test): void => {
	test.is(proxy.get('fourth'), undefined);
});

ava('get a non-existing key from the proxy', (test): void => {
	test.is(proxy.get('third'), undefined);
});

ava('get an existing key from the proxy', (test): void => {
	test.is(proxy.get('second'), 'bar');
});

// has

ava('get whether or not a non-existing key from the cache exists', (test): void => {
	test.is(proxy.has('fourth'), false);
});

ava('get whether or not a non-existing key from the proxy exists', (test): void => {
	test.is(proxy.has('third'), false);
});

ava('get whether or not an existing key from the proxy exists', (test): void => {
	test.is(proxy.has('second'), true);
});

// set

ava('set a non-existing key from the cache', (test): void => {
	test.plan(2);

	const clone = proxy.clone();
	test.is(clone.set('fourth').size, 2);
	test.is(clone.get('fourth'), undefined);
});

ava('set a non-existing key from the proxy', (test): void => {
	test.plan(2);

	const clone = proxy.clone();
	test.is(clone.set('third').size, 3);
	test.is(clone.get('third'), 'baz');
});

ava('set an existing key from the proxy', (test): void => {
	test.plan(2);

	const clone = proxy.clone();
	test.is(clone.set('second').size, 2);
	test.is(clone.get('second'), 'bar');
});

// delete

ava('delete a non-existing key from the cache', (test): void => {
	test.plan(3);

	const clone = proxy.clone();
	test.is(clone.delete('fourth'), false);
	test.is(clone.get('fourth'), undefined);
	test.is(clone.size, 2);
});

ava('delete a non-existing key from the proxy', (test): void => {
	test.plan(3);

	const clone = proxy.clone();
	test.is(clone.delete('third'), false);
	test.is(clone.get('third'), undefined);
	test.is(clone.size, 2);
});

ava('delete an existing key from the proxy', (test): void => {
	test.plan(3);

	const clone = proxy.clone();
	test.is(clone.delete('second'), true);
	test.is(clone.get('second'), undefined);
	test.is(clone.size, 1);
});

// clear

ava('clear a proxy', (test): void => {
	test.plan(3);

	const clone = proxy.clone();
	test.is(clone.clear(), clone);
	test.is(clone.get('second'), undefined);
	test.is(clone.size, 0);
});

// Symbol Iterator

ava('spread instance', (test): void => {
	test.deepEqual([...proxy], [['first', 'foo'], ['second', 'bar']]);
});

// entries

ava('spread entries', (test): void => {
	test.deepEqual([...proxy.entries()], [['first', 'foo'], ['second', 'bar']]);
});

// keys

ava('spread keys', (test): void => {
	test.deepEqual([...proxy.keys()], ['first', 'second']);
});

// values

ava('spread values', (test): void => {
	test.deepEqual([...proxy.values()], ['foo', 'bar']);
});

// forEach

ava('for each', (test): void => {
	const output: unknown[][] = [];
	proxy.forEach((...args) => output.push(args));

	test.deepEqual(output, [['foo', 'first', proxy], ['bar', 'second', proxy]]);
});

// @@toStringTag

ava('@@toStringTag', (test): void => {
	test.is(proxy[Symbol.toStringTag], 'Map');
});

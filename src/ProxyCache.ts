import { Cache } from './Cache';

/**
 * The proxy cache structure Project-Blue uses
 */
export class ProxyCache<K, V> implements Map<K, V> {

	#keys: K[];
	#store: Map<K, V>;

	public constructor(store: Map<K, V>, keys?: K[]) {
		if (store instanceof ProxyCache) {
			this.#store = store.#store;
			this.#keys = store.#keys.slice();
		} else {
			this.#store = store;
			this.#keys = typeof keys === 'undefined' ? [] : keys;
		}
	}

	/**
	 * Returns the number of keys in the proxy.
	 */
	public get size(): number {
		return this.#keys.length;
	}

	/**
	 * Returns the string tag of this proxy object.
	 */
	public get [Symbol.toStringTag](): string {
		return 'Map';
	}

	/**
	 * Returns a specified element from a Map object. If the value that is associated to the provided key is an object,
	 * then you will get a reference to that object and any change made to that object will effectively modify it inside
	 * the Map object
	 * @param key The key of the element to return from the {@link Map} object.
	 * @returns The element associated with the specified key, or `undefined` if the key can't be found in the {@link Map} object.
	 */
	public get(key: K): V {
		return this.#keys.includes(key) ? this.#store.get(key) : undefined;
	}

	/**
	 * Returns a boolean indicating whether an element with the specified key exists or not.
	 * @param key The key of the element to test for presence in the proxy and in the {@link Map} object.
	 * @returns Whether or not an element with the specified key exists in the proxy and in the {@link Map} object.
	 */
	public has(key: K): boolean {
		return this.#keys.includes(key) && this.#store.has(key);
	}

	/**
	 * Adds a key to the proxy if it wasn't previously added and exists in the {@link Map} object.
	 * @param key The key of the element to add to the proxy object.
	 * @returns The modified {@link ProxyCache}.
	 */
	public set(key: K): this {
		if (!this.#keys.includes(key) && this.#store.has(key)) this.#keys.push(key);
		return this;
	}

	/**
	 * Removes a key from the proxy.
	 * @param key The key of the element to remove from the proxy object.
	 * @returns Whether or not the key was removed.
	 */
	public delete(key: K): boolean {
		const index = this.#keys.indexOf(key);
		const has = index !== -1;
		if (has) this.#keys.splice(index, 1);
		return has;
	}

	/**
	 * Removes all keys from the proxy.
	 */
	public clear(): this {
		this.#keys = [];
		return this;
	}

	/**
	 * Executes a provided function once per each key/value pair in the {@link Map} object, in insertion order
	 * @param callbackfn Function to execute for each element.
	 * @param thisArg Value to use as this when executing callback.
	 */
	public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: unknown): void {
		const fn = callbackfn.bind(thisArg);
		for (const [key, value] of this.entries()) {
			fn(value, key, this);
		}
	}

	/**
	 * Returns a new Iterator object that contains the [key, value] pairs for each element in the {@link Map} object
	 * contained in the proxy in insertion order.
	 */
	public *[Symbol.iterator](): IterableIterator<[K, V]> {
		yield* this.entries();
	}

	/**
	 * Returns a new Iterator object that contains the [key, value] pairs for each element in the {@link Map} object
	 * contained in the proxy in insertion order.
	 */
	public *entries(): IterableIterator<[K, V]> {
		for (const pair of this.#store.entries()) {
			if (this.#keys.includes(pair[0])) yield pair;
		}
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element in the {@link Map} object contained in the
	 * proxy in insertion order
	 */
	public *keys(): IterableIterator<K> {
		for (const key of this.#store.keys()) {
			if (this.#keys.includes(key)) yield key;
		}
	}

	/**
	 * Returns a new Iterator object that contains the values for each element in the {@link Map} object contained in
	 * the proxy in insertion order
	 */
	public *values(): IterableIterator<V> {
		for (const [key, value] of this.#store.entries()) {
			if (this.#keys.includes(key)) yield value;
		}
	}

	public static get [Symbol.species](): typeof ProxyCache {
		return ProxyCache;
	}

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProxyCache<K, V> extends Cache<K, V> {
	clone(): ProxyCache<K, V>;
}

for (const name of Object.getOwnPropertyNames(Cache.prototype)) {
	if (name === 'constructor') continue;
	Object.defineProperty(ProxyCache.prototype, name, Object.getOwnPropertyDescriptor(Cache.prototype, name));
}

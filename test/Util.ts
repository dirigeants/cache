import ava from 'ava';
import { Cache } from '../dist';

ava('tests can come later', (test): void => {
	test.true(new Cache() instanceof Map);
});

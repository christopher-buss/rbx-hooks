function safeEquals(a: unknown, b: unknown) {
	if (a === 0 && b === 0) return 1 / a === 1 / b;
	else if (a !== a && b !== b) return true;
	else return a === b;
}

const POSSIBLE_VALUES = "0123456789abcdefghijklmnopqrstuvwxyz".split("");

function toBase36(value: number) {
	let result = "";
	let [intPart, decimalPart] = math.modf(value);

	while (intPart > 0) {
		const index = intPart % 36;
		result = POSSIBLE_VALUES[index] + result;
		intPart = math.floor(intPart / 36);
	}

	if (decimalPart > 0) {
		result += ".";
		while (decimalPart > 0) {
			decimalPart *= 36;
			const digit = math.floor(decimalPart);
			result += POSSIBLE_VALUES[digit];
			decimalPart -= digit;
		}
	}

	return result;
}

namespace Utilities {
	export function keys<T extends object, K extends keyof T>(object: T): Array<K> {
		const result = new Array<K>();
		let length = 0;
		for (const [key] of pairs(object)) result[length++] = key as K;
		return result;
	}

	export function objectIs(a: unknown, b: unknown) {
		return a === b ? true : safeEquals(a, b);
	}

	export function stringSlice(str: string, startIndexStr: string | number, lastIndexStr?: string | number) {
		const [strLen, invalidBytePosition] = utf8.len(str);
		assert(
			strLen !== undefined && strLen !== false,
			"string `%*` has an invalid byte at position %*".format(str, tostring(invalidBytePosition)),
		);

		let startIndex = tonumber(startIndexStr);
		assert(typeIs(startIndex, "number"), "startIndexStr should be a number");

		if (startIndex + strLen < 0) startIndex = 1;
		if (startIndex > strLen) return "";

		let lastIndex = strLen + 1;
		if (lastIndexStr !== undefined) lastIndex = tonumber(lastIndexStr) ?? 0 / 0;

		assert(typeIs(lastIndex, "number"), "lastIndexStr should convert to number");
		if (lastIndex > strLen) lastIndex = strLen + 1;

		const startIndexByte = utf8.offset(str, startIndex)!;
		const lastIndexByte = utf8.offset(str, lastIndex)! - 1;
		return str.sub(startIndexByte, lastIndexByte);
	}

	export function getRandomId() {
		return `hooks-${stringSlice(toBase36(math.random()), 2, 11)}`;
	}
}

export = Utilities;

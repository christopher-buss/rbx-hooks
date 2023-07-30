import { useEffect, useRef } from "@rbxts/roact";

interface CurrentValue<T> {
	dependencies: Array<unknown>;
	memoizedValue: T;
}

/**
 * A hook that memoizes a value and cleans it up when the dependencies change.
 * @param createValue The function to create the value.
 * @param cleanupValue The function to clean up the value.
 * @param dependencies The dependencies to check for changes.
 * @returns The memoized value.
 */
export default function useMemoWithCleanup<T>(
	createValue: () => T,
	cleanupValue: (value: T) => void,
	dependencies: Array<unknown>,
) {
	const currentValue = useRef<CurrentValue<T> | undefined>();
	let needsToRecalculate = false;

	if (!currentValue.current) needsToRecalculate = true;
	else {
		let index = 0;
		for (const dependency of dependencies) {
			if (dependency !== currentValue.current.dependencies[index]) {
				needsToRecalculate = true;
				break;
			}

			index += 1;
		}
	}

	if (needsToRecalculate) {
		const currentValueCurrent = currentValue.current;
		if (currentValueCurrent) cleanupValue(currentValueCurrent.memoizedValue);
		currentValue.current = {
			dependencies,
			memoizedValue: createValue(),
		};
	}

	useEffect(
		() => () => {
			const currentValueCurrent = currentValue.current;
			if (currentValueCurrent) {
				cleanupValue(currentValueCurrent.memoizedValue);
				table.clear(currentValueCurrent);
			}

			currentValue.current = undefined;
		},
		[cleanupValue],
	);

	return currentValue.current!.memoizedValue;
}

import { useCallback, useState } from "@rbxts/roact";

/**
 * Creates a quick toggle state.
 * @param initialState The initial state to use
 * @returns A tuple that returns the value and a toggle function.
 */
export function useToggle(initialState = false) {
	const [value, setValue] = useState(initialState);
	const toggleValue = useCallback(() => setValue(!value), [value]);
	return $tuple(value, toggleValue);
}

export default useToggle;

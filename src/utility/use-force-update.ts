import { useReducer } from "@rbxts/roact";

const reducer = (value: number) => (value + 1) % 1_000_000;

/**
 * A hook that creates a function used to force a component to re-render.
 * @returns A function that forces a component to re-render.
 */
export default function useForceUpdate() {
	const [, dispatch] = useReducer(reducer, 0);
	return dispatch;
}

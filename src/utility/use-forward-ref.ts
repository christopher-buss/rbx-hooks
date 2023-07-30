import { useCallback, useImperativeHandle, useRef, Ref } from "@rbxts/roact";

type CleanupFunction = () => void;
type UpdateFunction<T> = ((value: T) => CleanupFunction) | ((value: T) => void);

/**
 * This function creates a ref that will call the given updateFunction whenever the ref is updated.
 *
 * - If the ref is set to a non-nil value, the updateFunction will be called with that value.
 * - If the ref is set to nil, the updateFunction will be called with no arguments.
 * ---
 * - The updateFunction is expected to return a cleanup function, which will be called before the next update.
 * - The updateFunction will be called whenever the ref is updated, even if the ref is set to the same value.
 * - The updateFunction will not be called if the component is unmounted.
 * @param forwardRef
 * @param updateFunction
 * @returns
 */
export function useForwardRef<T>(forwardRef: Ref<T>, updateFunction: UpdateFunction<T>) {
	const value = useRef<T | undefined>(undefined);
	const cleanup = useRef<CleanupFunction | undefined>(undefined);

	const ref = useCallback(
		(instance?: T) => {
			cleanup.current?.();
			cleanup.current = undefined;

			if (instance) {
				value.current = instance;
				cleanup.current = updateFunction(instance) as CleanupFunction;
			}
		},
		[updateFunction],
	);

	useImperativeHandle(forwardRef, () => value.current!);
	return ref;
}

export default useForwardRef;

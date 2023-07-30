import { useEffect, useMemo, useRef } from "@rbxts/roact";
import { objectIs } from "../utilities";
import useSyncExternalStore from "./use-sync-external-store";

type Selector<Snapshot, Selected> = (snapshot: Snapshot) => Selected;
type EqualityFn<Selected> = (left: Selected, right: Selected) => boolean;

interface InstHasValue<Selected> {
	hasValue: true;
	value: Selected;
}

type Inst<Selected> =
	| InstHasValue<Selected>
	| {
			hasValue: false;
			value: undefined;
	  };

/**
 * A polyfill for React 18's `useSyncExternalStore` hook that allows for a selector. Might not work.
 *
 * @param subscribe A function that subscribes to the external store.
 * @param getSnapshot A function that returns the current snapshot of the external store.
 * @param selector A selector function that is used to select a value from the snapshot.
 * @param isEqual A function used to determine if the selected value has changed.
 * @returns The selected value for the current snapshot of the external store.
 */
export function useSyncExternalStoreWithSelector<Snapshot, Selected>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
	selector: Selector<Snapshot, Selected>,
	isEqual?: EqualityFn<Selected>,
) {
	const instRef = useRef<Inst<Selected> | undefined>();
	let inst: Inst<Selected>;

	if (instRef.current === undefined)
		instRef.current = inst = {
			hasValue: false,
			value: undefined,
		};
	else inst = instRef.current;

	const getSelection = useMemo(() => {
		let hasMemo = false;
		let memoizedSnapshot: Snapshot | undefined;
		let memoizedSelection: Selected | undefined;

		function memoizedSelector(nextSnapshot: Snapshot): Selected {
			if (!hasMemo) {
				hasMemo = true;
				memoizedSnapshot = nextSnapshot;

				const nextSelection = selector(nextSnapshot);
				if (isEqual)
					if (inst.hasValue === true) {
						const currentSelection = inst.value;
						if (isEqual(currentSelection, nextSelection)) {
							memoizedSelection = currentSelection;
							return currentSelection;
						}
					}

				memoizedSelection = nextSelection;
				return nextSelection;
			}

			const previousSnapshot = memoizedSnapshot;
			const previousSelection = memoizedSelection as Selected;
			if (objectIs(previousSnapshot, nextSnapshot)) return previousSelection as Selected;

			const nextSelection = selector(nextSnapshot);
			if (isEqual && isEqual(previousSelection, nextSelection)) return previousSelection as Selected;

			memoizedSnapshot = nextSnapshot;
			memoizedSelection = nextSelection;
			return nextSelection;
		}

		function getSnapshotWithSelector(): Selected {
			return memoizedSelector(getSnapshot());
		}

		return getSnapshotWithSelector;
	}, [getSnapshot, selector, isEqual, inst]);

	const value = useSyncExternalStore(subscribe, getSelection);
	useEffect(() => {
		inst.hasValue = true;
		inst.value = value;
	}, [inst, value]);

	return value;
}

export default useSyncExternalStoreWithSelector;

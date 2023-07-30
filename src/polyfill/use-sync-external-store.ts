import { useEffect, useLayoutEffect, useState } from "@rbxts/roact";
import { objectIs } from "../utilities";

interface Inst<Snapshot> {
	value: Snapshot;
	getSnapshot: () => Snapshot;
}

let didWarnUncachedGetSnapshot = false;
function checkIfSnapshotChanged<Snapshot>(inst: Inst<Snapshot>) {
	const latestGetSnapshot = inst.getSnapshot;
	const prevValue = inst.value;

	try {
		const nextValue = latestGetSnapshot();
		return !objectIs(prevValue, nextValue);
	} catch {
		return true;
	}
}

/**
 * A polyfill for React 18's `useSyncExternalStore` hook. Might not work.
 *
 * @see For more info, check out the [issue](https://github.com/reactwg/react-18/discussions/86) on the React 18 Working Group.
 * @param subscribe A function that subscribes to the external store.
 * @param getSnapshot A function that returns the current snapshot of the external store.
 * @returns The current snapshot of the external store.
 */
export function useSyncExternalStore<Snapshot>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
) {
	const value = getSnapshot();

	{
		if (!didWarnUncachedGetSnapshot) {
			const cachedValue = getSnapshot();
			if (!objectIs(value, cachedValue)) {
				warn("The result of getSnapshot should be cached to avoid an infinite loop");
				didWarnUncachedGetSnapshot = true;
			}
		}
	}

	const [{ inst }, forceUpdate] = useState({
		inst: { value, getSnapshot },
	});

	useLayoutEffect(() => {
		inst.value = value;
		inst.getSnapshot = getSnapshot;
		if (checkIfSnapshotChanged(inst)) forceUpdate({ inst });
	}, [getSnapshot, inst, value]);

	useEffect(() => {
		if (checkIfSnapshotChanged(inst)) forceUpdate({ inst });

		function handleStoreChange() {
			if (checkIfSnapshotChanged(inst)) forceUpdate({ inst });
		}

		return subscribe(handleStoreChange);
	}, [inst, subscribe]);

	return value;
}

export default useSyncExternalStore;

import { useLayoutEffect, useState } from "@rbxts/roact";
import { getRandomId } from "../utilities";

/**
 * The `useId` hook generates random id that persists across renders.
 * Hook is usually used to bind input elements to labels. Generated
 * random id is saved to ref and will not change unless component is
 * unmounted.
 *
 * @param staticId A static id to use instead of a generated one.
 */
export function useId(staticId?: string) {
	const [uuid, setUuid] = useState("");
	useLayoutEffect(() => {
		setUuid(getRandomId());
	}, []);

	return staticId ?? uuid;
}

export default useId;

import { TableToString } from "@rbxts/rbx-debug";
import { useEffect, useRef } from "@rbxts/roact";
import { keys } from "../utilities";

interface ChangeObject {
	from: unknown;
	to: unknown;
}

/**
 * A simple hook that checks which prop caused the component to re-render.
 * @param name The name of the component.
 * @param props The props of the component.
 * @param logFunction The function to use to log the changes.
 * @param logEnabled Whether or not to log the changes.
 */
export function useWhyDidYouUpdate(
	name: string,
	props: Record<string, unknown>,
	logFunction = print,
	logEnabled = true,
) {
	const previousProps = useRef<Record<string, unknown>>({});
	useEffect(() => {
		const previous = previousProps.current;
		if (previous) {
			const allKeys = keys({ ...previous, ...props });
			const changesObject: Record<string, ChangeObject> = {};

			for (const key of allKeys)
				if (previous[key] !== props[key])
					changesObject[key] = {
						from: previous[key],
						to: props[key],
					};

			if (logEnabled && next(changesObject)[0] !== undefined)
				logFunction(name + " " + TableToString(changesObject, true));
		}

		previousProps.current = props;
	});
}

export default useWhyDidYouUpdate;

import { TableToString } from "@rbxts/rbx-debug";
import { useEffect, useRef } from "@rbxts/roact";

interface RenderInfo {
	name: string;
	renders: number;
	sinceLastRender: number;
	timestamp: number;
}

/**
 * If you want to monitor and log how a component renders, you can use
 * the `useRenderInfo` hook. This hook records the render count, the
 * time difference between renders, and the current render timestamp.
 * This hook is especially useful for development purposes, as it helps
 * developers understand how a component behaves in terms of rendering,
 * and allows them to improve performance and detect potential problems.
 *
 * @param name The name of the component you are monitoring.
 * @param logFunction The function to use for logging. Defaults to `print`.
 * @param logEnabled Whether or not logging is enabled.
 */
export function useRenderInfo(name = "Unknown", logFunction = print, logEnabled = true): Readonly<RenderInfo> {
	const count = useRef(0);
	const lastRender = useRef<number>();
	const currentTime = os.clock();

	count.current += 1;

	useEffect(() => {
		lastRender.current = os.clock();
	});

	const sinceLastRender = lastRender.current !== undefined ? currentTime - lastRender.current : 0;
	const info = {
		name,
		renders: count.current,
		sinceLastRender,
		timestamp: currentTime,
	};

	if (logEnabled) logFunction(TableToString(info, true));
	return table.freeze(info);
}

export default useRenderInfo;

import { useBinding, useCallback, useEffect, useRef } from "@rbxts/roact";
import { connect, SignalLike } from "../types";

const RunService = game.GetService("RunService");

const FREQUENCY = math.pi / 12;
const PI_DIV_40 = math.pi / 40;
const TAU = math.pi * 2;
const TOTAL_POINTS = 15;
const WHITE_COLOR3 = Color3.fromRGB(255, 255, 255);

interface PatchedRainbowColorSequenceParameters<T extends SignalLike> {
	/**
	 * The event to connect to.
	 *
	 * @default RunService.Heartbeat
	 */
	event: T;

	/**
	 * Whether or not the hook should be in performance mode.
	 * Performance mode disables the effect entirely.
	 *
	 * @default false
	 */
	isPerformanceMode: boolean;

	/**
	 * Whether or not the hook should be visible.
	 *
	 * @default true
	 */
	visible: boolean;
}

/**
 * The parameters for the `useRainbowColorSequence` hook.
 */
type RainbowColorSequenceParameters<T extends SignalLike> = Partial<PatchedRainbowColorSequenceParameters<T>>;

/**
 * A hook that creates a rainbow color sequence.
 * @param parameters The parameters for the hook.
 * @returns The color sequence.
 */
export function useRainbowColorSequence<T extends SignalLike>({
	event,
	isPerformanceMode = false,
	visible = true,
}: RainbowColorSequenceParameters<T>) {
	const realEvent = event ?? RunService.Heartbeat;

	const colorSequenceArray = useRef(new Array<ColorSequenceKeypoint>(TOTAL_POINTS + 1)).current;
	const [colorSequence, setColorSequence] = useBinding(new ColorSequence(WHITE_COLOR3));
	const [increment, setIncrement] = useBinding(0);
	const [phaseShift, setPhaseShift] = useBinding(0);

	const updateValues = useCallback(() => {
		let currentIncrement = increment.getValue();
		if (!isPerformanceMode && currentIncrement % 2 === 0) {
			let currentPhaseShift = phaseShift.getValue();
			for (const index of $range(0, TOTAL_POINTS))
				colorSequenceArray[index] = new ColorSequenceKeypoint(
					index / TOTAL_POINTS,
					Color3.fromRGB(
						127 * math.sin(FREQUENCY * index + currentPhaseShift) + 128,
						127 * math.sin(FREQUENCY * index + 2 * 1.0471975511966 + currentPhaseShift) + 128,
						127 * math.sin(FREQUENCY * index + 4 * 1.0471975511966 + currentPhaseShift) + 128,
					),
				);

			setColorSequence(new ColorSequence(colorSequenceArray));
			table.clear(colorSequenceArray);

			currentPhaseShift += PI_DIV_40;
			if (currentPhaseShift >= TAU) currentPhaseShift = 0;

			setPhaseShift(currentPhaseShift);
			if (currentIncrement >= 1000) currentIncrement = 0;
		}

		setIncrement(currentIncrement + 1);
	}, [colorSequenceArray, increment, isPerformanceMode, phaseShift, setColorSequence, setIncrement, setPhaseShift]);

	const onEventFired = useCallback(() => {
		if (visible) updateValues();
	}, [updateValues, visible]);

	useEffect(() => {
		if (isPerformanceMode) updateValues();
	}, [isPerformanceMode, updateValues]);

	useEffect(() => {
		if (visible) {
			const connection = connect(realEvent, onEventFired);
			return () => connection.Disconnect();
		}
	}, [onEventFired, realEvent, visible]);

	return colorSequence;
}

export default useRainbowColorSequence;

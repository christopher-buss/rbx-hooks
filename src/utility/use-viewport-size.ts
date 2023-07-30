const Workspace = game.GetService("Workspace");
import { useBinding, useEffect } from "@rbxts/roact";

const DEFAULT_SIZE = new Vector2(1920, 1080); // most common size on steam platform survey

/**
 * A hook that gets the current window size.
 * @param onChanged A function to call when the viewport size changes.
 * @returns The current window size in a binding.
 */
export function useViewportSize(onChanged?: (viewportSize: Vector2) => void) {
	const [viewportSize, setViewportSize] = useBinding(Workspace.CurrentCamera?.ViewportSize ?? DEFAULT_SIZE);

	useEffect(() => {
		const currentCamera = Workspace.CurrentCamera;
		if (currentCamera) {
			setViewportSize(currentCamera.ViewportSize);
			onChanged?.(currentCamera.ViewportSize);

			const connection = currentCamera.GetPropertyChangedSignal("ViewportSize").Connect(() => {
				setViewportSize(currentCamera.ViewportSize);
				onChanged?.(currentCamera.ViewportSize);
			});

			return () => connection.Disconnect();
		}
	}, [onChanged, setViewportSize]);

	return viewportSize;
}

export default useViewportSize;

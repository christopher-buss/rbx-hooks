const Workspace = game.GetService("Workspace");
import { useBinding, useEffect } from "@rbxts/roact";

/**
 * Used to get an appropriate stroke thickness for a given screen size.
 * @param pixelThickness The thickness of the stroke.
 * @param relativeWidth This is what pixelThickness is relative to. If you want 2 pixels thick at 1080p, you would put 1920 here.
 * @returns The stroke thickness.
 */
export function useStrokeScale(pixelThickness = 1, relativeWidth = 985) {
	const ratio = pixelThickness / relativeWidth;
	const [thickness, setThickness] = useBinding(0);

	useEffect(() => {
		const currentCamera = Workspace.CurrentCamera;
		if (currentCamera) {
			setThickness(currentCamera.ViewportSize.X * ratio);
			const connection = currentCamera
				.GetPropertyChangedSignal("ViewportSize")
				.Connect(() => setThickness(currentCamera.ViewportSize.X * ratio));

			return () => connection.Disconnect();
		}
	}, [ratio, setThickness]);

	return thickness;
}

export default useStrokeScale;

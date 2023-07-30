const Workspace = game.GetService("Workspace");
import { useEffect, useState } from "@rbxts/roact";

/**
 * A hook that gets the current camera.
 * @param onChanged What to call when the current camera changes.
 * @returns The current camera.
 */
export function useCurrentCamera(onChanged?: (currentCamera: Camera) => void) {
	const [currentCamera, setCurrentCamera] = useState(Workspace.CurrentCamera);

	useEffect(() => {
		if (Workspace.CurrentCamera) {
			setCurrentCamera(Workspace.CurrentCamera);
			onChanged?.(Workspace.CurrentCamera);
		}

		const connection = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			if (Workspace.CurrentCamera) {
				setCurrentCamera(Workspace.CurrentCamera);
				onChanged?.(Workspace.CurrentCamera);
			}
		});

		return () => connection.Disconnect();
	}, [onChanged]);

	return currentCamera!;
}

export default useCurrentCamera;

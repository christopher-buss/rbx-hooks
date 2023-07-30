import { useEffect } from "@rbxts/roact";
import { connect, InferSignalParameters, SignalLike } from "../types";

/**
 * A hook that creates a connection then disconnects it when the returned function in useEffect is called.
 * @param event The event to connect to.
 * @param callback The callback to call when the event fires.
 */
export function useExternalEvent<T extends SignalLike>(
	event: T,
	callback: (...signalArguments: InferSignalParameters<T>) => void,
) {
	useEffect(() => {
		const connection = connect(event, callback);
		return () => connection.Disconnect();
	}, [event, callback]);
}

export default useExternalEvent;

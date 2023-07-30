import { useEffect } from "@rbxts/roact";

interface ConnectionLike {
	Disconnect(): void;
}

interface SignalLike {
	Connect?(cb: Callback): ConnectionLike;
	connect?(cb: Callback): ConnectionLike;
}

type InferSignalParameters<S> = S extends SignalLike
	? Parameters<
			Parameters<
				S["Connect"] extends Callback ? S["Connect"] : S["connect"] extends Callback ? S["connect"] : never
			>
	  >
	: never;

function connect<T extends SignalLike>(event: T, callback: (...signalArguments: InferSignalParameters<T>) => void) {
	if ("Connect" in event) {
		assert(typeIs(event.Connect, "function"), "not a function");
		return event.Connect(callback);
	} else if ("connect" in event) {
		assert(typeIs(event.connect, "function"), "not a function");
		return event.connect(callback);
	} else return { Disconnect() {} };
}

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

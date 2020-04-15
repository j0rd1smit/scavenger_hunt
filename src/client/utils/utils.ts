export const isPresent = <T>(item: T | undefined | null): item is T => item !== undefined && item !== null;

export const getOrDefault = <T>(item: T | undefined | null, defaultValue: T): T => {
    if (!isPresent(item)) {
        return defaultValue;
    }

    return item;
}

export const isIos = (): boolean => {
    const iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    if (!!navigator.platform) {
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) {
                return true;
            }
        }
    }

    return false;
}

export const listenToEventOnlyOnce = <T>(eventName: any): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        const oneTimeListener = (event: T) => {
            try {
                window.removeEventListener(eventName, oneTimeListener);
                resolve(event);
            } catch (e) {
                reject(e);
            }
        }
        window.addEventListener(eventName, oneTimeListener);
    });
}
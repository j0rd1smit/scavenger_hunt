
export const isPresent = <T>(item: T|undefined|null): item is T => item !== undefined && item !== null;

export const getOrDefault = <T>(item: T|undefined|null, defaultValue: T): T => {
    if (!isPresent(item)) {
        return defaultValue;
    }

    return item;
}
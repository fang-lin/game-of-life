export function objectify(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
import {Size} from './Canvas';

export function objectify(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export function getSize(size: Size): Size {
    return [size[0] * pixelRatio, size[1] * pixelRatio];
}

export function updateCanvasSize(prevSize: Size, size: Size, element: HTMLCanvasElement | null): boolean {
    if (element && (prevSize[0] !== size[0] || prevSize[1] !== size[1])) {
        const realSize = getSize(size);
        element.width = realSize[0];
        element.height = realSize[1];
        return true;
    }
    return false;
}

export const pixelRatio = window.devicePixelRatio;

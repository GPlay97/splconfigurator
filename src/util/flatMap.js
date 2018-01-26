export default function flatMap(f, arr) {
    return arr.reduce((x, y) => [...x, ...f(y), ], []);
}
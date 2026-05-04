import {describe, it, expect, beforeEach} from 'vitest';
import {Node, NodePool} from '../Canvas/HashLife';
import {LifeMap} from '../Canvas/LifeMap';
import {Coordinate} from '../Canvas/Canvas';

describe('NodePool', () => {
    let pool: NodePool;

    beforeEach(() => {
        pool = new NodePool();
    });

    describe('leaf nodes', () => {
        it('should create dead and alive leaves', () => {
            const dead = pool.leaf(false);
            const alive = pool.leaf(true);
            expect(dead.alive).toBe(0);
            expect(dead.level).toBe(0);
            expect(dead.population).toBe(0);
            expect(alive.alive).toBe(1);
            expect(alive.level).toBe(0);
            expect(alive.population).toBe(1);
        });

        it('should return same instance for same leaf', () => {
            expect(pool.leaf(true)).toBe(pool.leaf(true));
            expect(pool.leaf(false)).toBe(pool.leaf(false));
        });
    });

    describe('canonical nodes', () => {
        it('should return same node for same children', () => {
            const d = pool.leaf(false);
            const a = pool.leaf(true);
            const n1 = pool.create(a, d, d, d);
            const n2 = pool.create(a, d, d, d);
            expect(n1).toBe(n2);
        });

        it('should return different nodes for different children', () => {
            const d = pool.leaf(false);
            const a = pool.leaf(true);
            const n1 = pool.create(a, d, d, d);
            const n2 = pool.create(d, a, d, d);
            expect(n1).not.toBe(n2);
        });

        it('should compute level correctly', () => {
            const d = pool.leaf(false);
            const l1 = pool.create(d, d, d, d);
            expect(l1.level).toBe(1);
            const l2 = pool.create(l1, l1, l1, l1);
            expect(l2.level).toBe(2);
        });

        it('should compute population correctly', () => {
            const d = pool.leaf(false);
            const a = pool.leaf(true);
            const node = pool.create(a, a, d, a);
            expect(node.population).toBe(3);
        });
    });

    describe('emptyTree', () => {
        it('should create empty trees of various levels', () => {
            for (let level = 0; level <= 5; level++) {
                const tree = pool.emptyTree(level);
                expect(tree.level).toBe(level);
                expect(tree.population).toBe(0);
            }
        });

        it('should return cached instances', () => {
            expect(pool.emptyTree(3)).toBe(pool.emptyTree(3));
        });
    });

    describe('getBit / setBit', () => {
        it('should set and get a cell', () => {
            let tree = pool.emptyTree(3);
            expect(pool.getBit(tree, 0, 0)).toBe(false);
            tree = pool.setBit(tree, 0, 0, true);
            expect(pool.getBit(tree, 0, 0)).toBe(true);
        });

        it('should handle negative coordinates', () => {
            let tree = pool.emptyTree(3);
            tree = pool.setBit(tree, -2, -3, true);
            expect(pool.getBit(tree, -2, -3)).toBe(true);
            expect(pool.getBit(tree, -2, -2)).toBe(false);
        });

        it('should set multiple cells', () => {
            let tree = pool.emptyTree(4);
            tree = pool.setBit(tree, 1, 2, true);
            tree = pool.setBit(tree, -3, 0, true);
            tree = pool.setBit(tree, 0, -1, true);
            expect(pool.getBit(tree, 1, 2)).toBe(true);
            expect(pool.getBit(tree, -3, 0)).toBe(true);
            expect(pool.getBit(tree, 0, -1)).toBe(true);
            expect(pool.getBit(tree, 0, 0)).toBe(false);
        });
    });

    describe('fromCells / collectCells', () => {
        it('should roundtrip cells', () => {
            const cells: [number, number][] = [[0, 0], [1, 1], [-2, 3]];
            const tree = pool.fromCells(cells);
            const collected: [number, number][] = [];
            pool.collectCells(tree, 0, 0, collected);
            const sortedInput = [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            const sortedOutput = collected.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            expect(sortedOutput).toEqual(sortedInput);
        });

        it('should handle empty cells', () => {
            const tree = pool.fromCells([]);
            const collected: [number, number][] = [];
            pool.collectCells(tree, 0, 0, collected);
            expect(collected).toEqual([]);
        });
    });

    describe('expand', () => {
        it('should preserve cells when expanding', () => {
            const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
            let tree = pool.fromCells(cells);
            const levelBefore = tree.level;
            tree = pool.expand(tree);
            expect(tree.level).toBe(levelBefore + 1);
            expect(tree.population).toBe(3);

            const collected: [number, number][] = [];
            pool.collectCells(tree, 0, 0, collected);
            const sorted = collected.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            expect(sorted).toEqual([[0, 0], [0, 1], [1, 0]]);
        });
    });
});

describe('HashLife step', () => {
    let pool: NodePool;

    beforeEach(() => {
        pool = new NodePool();
    });

    /** Helper: run naive LifeMap for n generations and return sorted cells */
    function naiveEvolve(initialCells: Coordinate[], generations: number): Coordinate[] {
        const lifeMap = new LifeMap(initialCells);
        for (let i = 0; i < generations; i++) {
            lifeMap.evolve();
        }
        return lifeMap.getCells().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }

    /** Helper: run HashLife for n generations (single-step) and return sorted cells */
    function hashLifeEvolve(initialCells: [number, number][], generations: number): [number, number][] {
        let tree = pool.fromCells(initialCells);
        for (let i = 0; i < generations; i++) {
            // stepOne returns level n-1, expand twice to ensure enough room
            tree = pool.expand(tree);
            tree = pool.expand(tree);
            tree = pool.stepOne(tree);
        }
        const cells: [number, number][] = [];
        pool.collectCells(tree, 0, 0, cells);
        return cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }

    describe('still lifes', () => {
        it('Block should not change after 1 generation', () => {
            const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
            expect(hashLifeEvolve(block, 1)).toEqual(hashLifeEvolve(block, 0));
        });

        it('Block should not change after 100 generations', () => {
            const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
            const result = hashLifeEvolve(block, 100);
            // Population preserved
            expect(result.length).toBe(4);
            // Shape preserved: a 2×2 block (check relative positions)
            const minX = Math.min(...result.map(c => c[0]));
            const minY = Math.min(...result.map(c => c[1]));
            const normalized = result.map(([x, y]) => [x - minX, y - minY] as [number, number])
                .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            expect(normalized).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
        });
    });

    describe('oscillators', () => {
        it('Blinker should have period 2', () => {
            const blinker: [number, number][] = [[0, -1], [0, 0], [0, 1]];
            const gen0 = hashLifeEvolve(blinker, 0);
            const gen2 = hashLifeEvolve(blinker, 2);
            expect(gen2).toEqual(gen0);
        });

        it('Blinker gen 1 should rotate', () => {
            const blinker: [number, number][] = [[0, -1], [0, 0], [0, 1]];
            const gen1 = hashLifeEvolve(blinker, 1);
            const expected: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
            expect(gen1).toEqual(expected.sort((a, b) => a[0] - b[0] || a[1] - b[1]));
        });
    });

    describe('oracle testing: HashLife vs naive', () => {
        function compareWithNaive(name: string, cells: Coordinate[], generations: number) {
            it(`${name}: ${generations} generations should match naive`, () => {
                const naiveResult = naiveEvolve(cells, generations);
                const hashResult = hashLifeEvolve(cells as [number, number][], generations);
                expect(hashResult).toEqual(naiveResult);
            });
        }

        // Still lifes
        compareWithNaive('Block', [[0, 0], [1, 0], [0, 1], [1, 1]], 10);
        compareWithNaive('Beehive', [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [2, 2]], 10);

        // Oscillators
        compareWithNaive('Blinker 1 gen', [[0, -1], [0, 0], [0, 1]], 1);
        compareWithNaive('Blinker 5 gen', [[0, -1], [0, 0], [0, 1]], 5);
        compareWithNaive('Beacon 10 gen', [[0, 0], [1, 0], [0, 1], [3, 2], [2, 3], [3, 3]], 10);

        // Spaceships
        compareWithNaive('Glider 4 gen', [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]], 4);
        compareWithNaive('Glider 20 gen', [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]], 20);

        // Methuselah
        compareWithNaive('R-pentomino 5 gen', [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], 5);
        compareWithNaive('R-pentomino 20 gen', [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], 20);

        // Random pattern
        compareWithNaive('Random 10 gen', [[0, 0], [3, 1], [-2, 4], [5, -3], [1, 1], [-1, -1]], 10);

        // Empty
        compareWithNaive('Empty', [], 5);

        // Single cell (dies)
        compareWithNaive('Single cell', [[0, 0]], 1);
    });
});

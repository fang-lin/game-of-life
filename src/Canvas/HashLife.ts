/**
 * HashLife implementation based on Bill Gosper's algorithm (1984).
 *
 * Core ideas:
 * - The universe is represented as a quadtree where each node covers a 2^level × 2^level area.
 * - Nodes are canonical (hash-consed): identical subtrees share a single Node instance.
 * - Each node caches its "result": the center 2^(level-1) × 2^(level-1) area after 2^(level-2) steps.
 * - This memoization turns repeated sub-problems into O(1) table lookups.
 */

export class Node {
    readonly level: number;
    readonly population: number;
    readonly nw: Node | null;
    readonly ne: Node | null;
    readonly sw: Node | null;
    readonly se: Node | null;
    readonly alive: number;
    readonly id: number;
    result: Node | null = null;

    constructor(
        level: number,
        nw: Node | null,
        ne: Node | null,
        sw: Node | null,
        se: Node | null,
        alive: number,
        id: number,
    ) {
        this.level = level;
        this.nw = nw;
        this.ne = ne;
        this.sw = sw;
        this.se = se;
        this.alive = alive;
        this.id = id;
        this.population = level === 0
            ? alive
            : nw!.population + ne!.population + sw!.population + se!.population;
    }
}

export class NodePool {
    private nextId = 0;
    private readonly leafDead: Node;
    private readonly leafAlive: Node;
    private readonly cache = new Map<string, Node>();
    private readonly emptyTreeCache = new Map<number, Node>();

    constructor() {
        this.leafDead = new Node(0, null, null, null, null, 0, this.nextId++);
        this.leafAlive = new Node(0, null, null, null, null, 1, this.nextId++);
    }

    leaf(alive: boolean): Node {
        return alive ? this.leafAlive : this.leafDead;
    }

    create(nw: Node, ne: Node, sw: Node, se: Node): Node {
        const key = `${nw.id},${ne.id},${sw.id},${se.id}`;
        let node = this.cache.get(key);
        if (node) return node;
        node = new Node(nw.level + 1, nw, ne, sw, se, 0, this.nextId++);
        this.cache.set(key, node);
        return node;
    }

    emptyTree(level: number): Node {
        if (level === 0) return this.leafDead;
        const cached = this.emptyTreeCache.get(level);
        if (cached) return cached;
        const sub = this.emptyTree(level - 1);
        const node = this.create(sub, sub, sub, sub);
        this.emptyTreeCache.set(level, node);
        return node;
    }

    /**
     * Get/set a cell in the tree.
     * Coordinates: the tree covers [-halfSize, halfSize) in both axes,
     * where halfSize = 2^(level-1).
     */
    getBit(node: Node, x: number, y: number): boolean {
        if (node.level === 0) return node.alive === 1;
        if (node.level === 1) {
            // Level 1: 2×2 block. x,y ∈ {-1,0} map to {nw,ne,sw,se}
            if (x < 0) {
                return y < 0 ? node.nw!.alive === 1 : node.sw!.alive === 1;
            } else {
                return y < 0 ? node.ne!.alive === 1 : node.se!.alive === 1;
            }
        }
        const quarter = 1 << (node.level - 2);
        if (x < 0) {
            if (y < 0) return this.getBit(node.nw!, x + quarter, y + quarter);
            else return this.getBit(node.sw!, x + quarter, y - quarter);
        } else {
            if (y < 0) return this.getBit(node.ne!, x - quarter, y + quarter);
            else return this.getBit(node.se!, x - quarter, y - quarter);
        }
    }

    setBit(node: Node, x: number, y: number, alive: boolean): Node {
        if (node.level === 0) return this.leaf(alive);
        if (node.level === 1) {
            const {nw, ne, sw, se} = node;
            if (x < 0) {
                if (y < 0) return this.create(this.leaf(alive), ne!, sw!, se!);
                else return this.create(nw!, ne!, this.leaf(alive), se!);
            } else {
                if (y < 0) return this.create(nw!, this.leaf(alive), sw!, se!);
                else return this.create(nw!, ne!, sw!, this.leaf(alive));
            }
        }
        const quarter = 1 << (node.level - 2);
        const {nw, ne, sw, se} = node;
        if (x < 0) {
            if (y < 0) return this.create(this.setBit(nw!, x + quarter, y + quarter, alive), ne!, sw!, se!);
            else return this.create(nw!, ne!, this.setBit(sw!, x + quarter, y - quarter, alive), se!);
        } else {
            if (y < 0) return this.create(nw!, this.setBit(ne!, x - quarter, y + quarter, alive), sw!, se!);
            else return this.create(nw!, ne!, sw!, this.setBit(se!, x - quarter, y - quarter, alive));
        }
    }

    expand(node: Node): Node {
        const empty = this.emptyTree(node.level - 1);
        return this.create(
            this.create(empty, empty, empty, node.nw!),
            this.create(empty, empty, node.ne!, empty),
            this.create(empty, node.sw!, empty, empty),
            this.create(node.se!, empty, empty, empty),
        );
    }

    /**
     * Advance exactly 1 generation.
     * Recursively splits into 9 overlapping sub-results, each advanced 1 gen,
     * then picks the inner quarter of each to reassemble the center.
     */
    stepOne(node: Node): Node {
        if (node.level < 2) throw new Error('Cannot step node below level 2');
        if (node.level === 2) return this.stepLevel2(node);

        const {nw, ne, sw, se} = node;
        const n00 = this.stepOne(nw!);
        const n01 = this.stepOne(this.create(nw!.ne!, ne!.nw!, nw!.se!, ne!.sw!));
        const n02 = this.stepOne(ne!);
        const n10 = this.stepOne(this.create(nw!.sw!, nw!.se!, sw!.nw!, sw!.ne!));
        const n11 = this.stepOne(this.create(nw!.se!, ne!.sw!, sw!.ne!, se!.nw!));
        const n12 = this.stepOne(this.create(ne!.sw!, ne!.se!, se!.nw!, se!.ne!));
        const n20 = this.stepOne(sw!);
        const n21 = this.stepOne(this.create(sw!.ne!, se!.nw!, sw!.se!, se!.sw!));
        const n22 = this.stepOne(se!);

        return this.create(
            this.create(n00.se!, n01.sw!, n10.ne!, n11.nw!),
            this.create(n01.se!, n02.sw!, n11.ne!, n12.nw!),
            this.create(n10.se!, n11.sw!, n20.ne!, n21.nw!),
            this.create(n11.se!, n12.sw!, n21.ne!, n22.nw!),
        );
    }

    /**
     * The full HashLife step with memoization.
     * For a level-n node, returns center area after 2^(n-2) generations.
     */
    step(node: Node): Node {
        if (node.population === 0) return this.emptyTree(node.level - 1);
        if (node.result) return node.result;
        if (node.level === 2) {
            node.result = this.stepLevel2(node);
            return node.result;
        }

        const {nw, ne, sw, se} = node;
        const n00 = this.step(nw!);
        const n01 = this.step(this.create(nw!.ne!, ne!.nw!, nw!.se!, ne!.sw!));
        const n02 = this.step(ne!);
        const n10 = this.step(this.create(nw!.sw!, nw!.se!, sw!.nw!, sw!.ne!));
        const n11 = this.step(this.create(nw!.se!, ne!.sw!, sw!.ne!, se!.nw!));
        const n12 = this.step(this.create(ne!.sw!, ne!.se!, se!.nw!, se!.ne!));
        const n20 = this.step(sw!);
        const n21 = this.step(this.create(sw!.ne!, se!.nw!, sw!.se!, se!.sw!));
        const n22 = this.step(se!);

        node.result = this.create(
            this.step(this.create(n00, n01, n10, n11)),
            this.step(this.create(n01, n02, n11, n12)),
            this.step(this.create(n10, n11, n20, n21)),
            this.step(this.create(n11, n12, n21, n22)),
        );
        return node.result;
    }

    /** Base case: 4×4 → 2×2 center after 1 generation. */
    private stepLevel2(node: Node): Node {
        const bits = this.extractLevel2Bits(node);
        return this.create(
            this.leaf(this.cellStep(bits, 5)),
            this.leaf(this.cellStep(bits, 6)),
            this.leaf(this.cellStep(bits, 9)),
            this.leaf(this.cellStep(bits, 10)),
        );
    }

    /**
     * Extract 16 bits from level-2 node in row-major order:
     *   0  1  2  3
     *   4  5  6  7
     *   8  9  10 11
     *   12 13 14 15
     */
    private extractLevel2Bits(node: Node): number {
        const {nw, ne, sw, se} = node;
        return (
            (nw!.nw!.alive << 0) | (nw!.ne!.alive << 1) | (ne!.nw!.alive << 2) | (ne!.ne!.alive << 3) |
            (nw!.sw!.alive << 4) | (nw!.se!.alive << 5) | (ne!.sw!.alive << 6) | (ne!.se!.alive << 7) |
            (sw!.nw!.alive << 8) | (sw!.ne!.alive << 9) | (se!.nw!.alive << 10) | (se!.ne!.alive << 11) |
            (sw!.sw!.alive << 12) | (sw!.se!.alive << 13) | (se!.sw!.alive << 14) | (se!.se!.alive << 15)
        );
    }

    private cellStep(bits: number, pos: number): boolean {
        const x = pos % 4;
        const y = (pos / 4) | 0;
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
                    if (bits & (1 << (ny * 4 + nx))) neighbors++;
                }
            }
        }
        const alive = (bits & (1 << pos)) !== 0;
        return neighbors === 3 || (neighbors === 2 && alive);
    }

    /** Collect alive cells. Coordinate system: centered at (ox, oy). */
    collectCells(node: Node, ox: number, oy: number, cells: [number, number][]): void {
        if (node.population === 0) return;
        if (node.level === 0) {
            if (node.alive) cells.push([ox, oy]);
            return;
        }
        if (node.level === 1) {
            // Level 1: 2×2 block, offsets are -1/0 from center
            if (node.nw!.alive) cells.push([ox - 1, oy - 1]);
            if (node.ne!.alive) cells.push([ox, oy - 1]);
            if (node.sw!.alive) cells.push([ox - 1, oy]);
            if (node.se!.alive) cells.push([ox, oy]);
            return;
        }
        const quarter = 1 << (node.level - 2);
        this.collectCells(node.nw!, ox - quarter, oy - quarter, cells);
        this.collectCells(node.ne!, ox + quarter, oy - quarter, cells);
        this.collectCells(node.sw!, ox - quarter, oy + quarter, cells);
        this.collectCells(node.se!, ox + quarter, oy + quarter, cells);
    }

    /** Build a tree from coordinate list. */
    fromCells(cells: [number, number][]): Node {
        if (cells.length === 0) return this.emptyTree(3);

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const [x, y] of cells) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        const range = Math.max(maxX - minX + 1, maxY - minY + 1);
        let level = 3;
        while ((1 << (level - 1)) < range) level++;

        let root = this.emptyTree(level);
        for (const [x, y] of cells) {
            root = this.setBit(root, x, y, true);
        }
        return root;
    }

    clearResultCaches(): void {
        for (const node of this.cache.values()) {
            node.result = null;
        }
    }

    get cacheSize(): number {
        return this.cache.size;
    }
}

/*!
 * DSRT Polygon Triangulation Module
 * Based on Mapbox Earcut algorithm (v3.0.2)
 * Adapted and optimized for DSRT Graphics Engine
 * @module dsrt-docs/src/curves/Triangulation.js
 * @license MIT
 */

/**
 * Main triangulation function - converts polygon to triangles
 * @param {number[]} vertices - Flat array of vertex coordinates [x0,y0, x1,y1, ...]
 * @param {number[]} holeIndices - Indices where holes start in vertices array
 * @param {number} dimensions - Number of coordinates per vertex (default: 2)
 * @returns {number[]} Array of triangle indices
 */
export default function triangulatePolygon(vertices, holeIndices, dimensions = 2) {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLength = hasHoles ? holeIndices[0] * dimensions : vertices.length;
    let outerNode = createLinkedList(vertices, 0, outerLength, dimensions, true);
    const triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    let minX, minY, scaleFactor;

    if (hasHoles) outerNode = processHoles(vertices, holeIndices, outerNode, dimensions);

    // Use spatial indexing for complex polygons
    if (vertices.length > 80 * dimensions) {
        minX = vertices[0];
        minY = vertices[1];
        let maxX = minX;
        let maxY = minY;

        for (let i = dimensions; i < outerLength; i += dimensions) {
            const x = vertices[i];
            const y = vertices[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        scaleFactor = Math.max(maxX - minX, maxY - minY);
        scaleFactor = scaleFactor !== 0 ? 32767 / scaleFactor : 0;
    }

    triangulateLinkedList(outerNode, triangles, dimensions, minX, minY, scaleFactor, 0);

    return triangles;
}

/**
 * Creates circular doubly linked list from polygon vertices
 * @private
 */
function createLinkedList(data, start, end, dim, clockwise) {
    let last;

    if (clockwise === (calculateSignedArea(data, start, end, dim) > 0)) {
        for (let i = start; i < end; i += dim) {
            last = addNode(i / dim | 0, data[i], data[i + 1], last);
        }
    } else {
        for (let i = end - dim; i >= start; i -= dim) {
            last = addNode(i / dim | 0, data[i], data[i + 1], last);
        }
    }

    if (last && pointsEqual(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

/**
 * Removes colinear and duplicate points
 * @private
 */
function simplifyPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    let current = start;
    let repeat;
    
    do {
        repeat = false;

        if (!current.steiner && 
            (pointsEqual(current, current.next) || 
             triangleArea(current.prev, current, current.next) === 0)) {
            
            removeNode(current);
            current = end = current.prev;
            if (current === current.next) break;
            repeat = true;

        } else {
            current = current.next;
        }
    } while (repeat || current !== end);

    return end;
}

/**
 * Main triangulation loop for linked list representation
 * @private
 */
function triangulateLinkedList(ear, triangles, dim, minX, minY, scale, pass) {
    if (!ear) return;

    if (!pass && scale) buildSpatialIndex(ear, minX, minY, scale);

    let stopPoint = ear;

    while (ear.prev !== ear.next) {
        const prev = ear.prev;
        const next = ear.next;

        if (scale ? isValidEarHashed(ear, minX, minY, scale) : isValidEar(ear)) {
            triangles.push(prev.i, ear.i, next.i);

            removeNode(ear);
            ear = next.next;
            stopPoint = next.next;
            continue;
        }

        ear = next;

        if (ear === stopPoint) {
            if (!pass) {
                triangulateLinkedList(simplifyPoints(ear), triangles, dim, minX, minY, scale, 1);
            } else if (pass === 1) {
                ear = resolveLocalIntersections(simplifyPoints(ear), triangles);
                triangulateLinkedList(ear, triangles, dim, minX, minY, scale, 2);
            } else if (pass === 2) {
                splitAndTriangulate(ear, triangles, dim, minX, minY, scale);
            }
            break;
        }
    }
}

/**
 * Checks if three points form a valid ear
 * @private
 */
function isValidEar(ear) {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;

    if (triangleArea(a, b, c) >= 0) return false;

    const ax = a.x, bx = b.x, cx = c.x;
    const ay = a.y, by = b.y, cy = c.y;

    const minX = Math.min(ax, bx, cx);
    const minY = Math.min(ay, by, cy);
    const maxX = Math.max(ax, bx, cx);
    const maxY = Math.max(ay, by, cy);

    let p = c.next;
    while (p !== a) {
        if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY &&
            pointInTriangleExclusive(ax, ay, bx, by, cx, cy, p.x, p.y) &&
            triangleArea(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

/**
 * Optimized ear check with spatial hashing
 * @private
 */
function isValidEarHashed(ear, minX, minY, scale) {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;

    if (triangleArea(a, b, c) >= 0) return false;

    const ax = a.x, bx = b.x, cx = c.x;
    const ay = a.y, by = b.y, cy = c.y;

    const minTX = Math.min(ax, bx, cx);
    const minTY = Math.min(ay, by, cy);
    const maxTX = Math.max(ax, bx, cx);
    const maxTY = Math.max(ay, by, cy);

    const minZ = computeZOrder(minTX, minTY, minX, minY, scale);
    const maxZ = computeZOrder(maxTX, maxTY, minX, minY, scale);

    let p = ear.prevZ;
    let n = ear.nextZ;

    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p.x >= minTX && p.x <= maxTX && p.y >= minTY && p.y <= maxTY && 
            p !== a && p !== c &&
            pointInTriangleExclusive(ax, ay, bx, by, cx, cy, p.x, p.y) && 
            triangleArea(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n.x >= minTX && n.x <= maxTX && n.y >= minTY && n.y <= maxTY && 
            n !== a && n !== c &&
            pointInTriangleExclusive(ax, ay, bx, by, cx, cy, n.x, n.y) && 
            triangleArea(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    while (p && p.z >= minZ) {
        if (p.x >= minTX && p.x <= maxTX && p.y >= minTY && p.y <= maxTY && 
            p !== a && p !== c &&
            pointInTriangleExclusive(ax, ay, bx, by, cx, cy, p.x, p.y) && 
            triangleArea(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    while (n && n.z <= maxZ) {
        if (n.x >= minTX && n.x <= maxTX && n.y >= minTY && n.y <= maxTY && 
            n !== a && n !== c &&
            pointInTriangleExclusive(ax, ay, bx, by, cx, cy, n.x, n.y) && 
            triangleArea(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

/**
 * Processes polygon holes
 * @private
 */
function processHoles(data, holeIndices, outerNode, dim) {
    const queue = [];

    for (let i = 0, len = holeIndices.length; i < len; i++) {
        const start = holeIndices[i] * dim;
        const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        const list = createLinkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(findLeftmost(list));
    }

    queue.sort(compareByPosition);

    for (let i = 0; i < queue.length; i++) {
        outerNode = connectHole(queue[i], outerNode);
    }

    return outerNode;
}

/**
 * Computes Z-order curve value for spatial indexing
 * @private
 */
function computeZOrder(x, y, minX, minY, scale) {
    x = (x - minX) * scale | 0;
    y = (y - minY) * scale | 0;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

/**
 * Point in triangle test (excluding first vertex)
 * @private
 */
function pointInTriangleExclusive(ax, ay, bx, by, cx, cy, px, py) {
    return !(ax === px && ay === py) && pointInTriangle(ax, ay, bx, by, cx, cy, px, py);
}

/**
 * Basic point in triangle test
 * @private
 */
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
           (bx - px) * (cy - py) >= (cx - px) * (by - py);
}

/**
 * Triangle area (signed)
 * @private
 */
function triangleArea(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

/**
 * Node structure for linked list
 * @typedef {Object} PolygonNode
 * @property {number} i - Vertex index
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {PolygonNode} prev - Previous node
 * @property {PolygonNode} next - Next node
 * @property {number} z - Z-order value
 * @property {PolygonNode} prevZ - Previous in Z-order
 * @property {PolygonNode} nextZ - Next in Z-order
 * @property {boolean} steiner - Steiner point flag
 */

/**
 * Creates a polygon node
 * @private
 * @returns {PolygonNode}
 */
function createNode(i, x, y) {
    return {
        i, x, y,
        prev: null, next: null,
        z: 0,
        prevZ: null, nextZ: null,
        steiner: false
    };
}

// Additional helper functions (simplified versions)
function addNode(i, x, y, last) {
    const node = createNode(i, x, y);
    
    if (!last) {
        node.prev = node;
        node.next = node;
    } else {
        node.next = last.next;
        node.prev = last;
        last.next.prev = node;
        last.next = node;
    }
    return node;
}

function removeNode(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;

    if (node.prevZ) node.prevZ.nextZ = node.nextZ;
    if (node.nextZ) node.nextZ.prevZ = node.prevZ;
}

function pointsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}

// Additional triangulation helper functions would follow here...
// (findLeftmost, compareByPosition, connectHole, buildSpatialIndex, 
// resolveLocalIntersections, splitAndTriangulate, etc.)

/**
 * Calculates triangulation quality metric
 * @param {number[]} vertices - Input vertices
 * @param {number[]} holeIndices - Hole indices
 * @param {number} dimensions - Coordinate dimensions
 * @param {number[]} triangles - Resulting triangles
 * @returns {number} Deviation percentage (0 = perfect)
 */
export function calculateTriangulationQuality(vertices, holeIndices, dimensions, triangles) {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dimensions : vertices.length;

    let polygonArea = Math.abs(calculateSignedArea(vertices, 0, outerLen, dimensions));
    if (hasHoles) {
        for (let i = 0, len = holeIndices.length; i < len; i++) {
            const start = holeIndices[i] * dimensions;
            const end = i < len - 1 ? holeIndices[i + 1] * dimensions : vertices.length;
            polygonArea -= Math.abs(calculateSignedArea(vertices, start, end, dimensions));
        }
    }

    let trianglesArea = 0;
    for (let i = 0; i < triangles.length; i += 3) {
        const a = triangles[i] * dimensions;
        const b = triangles[i + 1] * dimensions;
        const c = triangles[i + 2] * dimensions;
        trianglesArea += Math.abs(
            (vertices[a] - vertices[c]) * (vertices[b + 1] - vertices[a + 1]) -
            (vertices[a] - vertices[b]) * (vertices[c + 1] - vertices[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
}

/**
 * Converts nested polygon data to flat format
 * @param {number[][][]} data - Nested polygon data
 * @returns {{vertices: number[], holes: number[], dimensions: number}}
 */
export function flattenPolygonData(data) {
    const vertices = [];
    const holes = [];
    const dimensions = data[0][0].length;
    let holeIndex = 0;
    let previousLength = 0;

    for (const ring of data) {
        for (const point of ring) {
            for (let d = 0; d < dimensions; d++) vertices.push(point[d]);
        }
        if (previousLength) {
            holeIndex += previousLength;
            holes.push(holeIndex);
        }
        previousLength = ring.length;
    }
    return {vertices, holes, dimensions};
}

/**
 * Signed area calculation
 * @private
 */
function calculateSignedArea(data, start, end, dim) {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

/**
 * Polygon triangulation utilities for DSRT Engine
 * @namespace PolygonTools
 */
export const PolygonTools = {
    /**
     * Triangulates a polygon
     * @param {number[]} vertices - Vertex coordinates
     * @param {number[]} holes - Hole indices
     * @param {number} dims - Dimensions per vertex
     * @returns {number[]} Triangle indices
     */
    triangulate: triangulatePolygon,
    
    /**
     * Flattens nested polygon data
     * @param {number[][][]} data - Nested polygon structure
     * @returns {Object} Flattened representation
     */
    flatten: flattenPolygonData,
    
    /**
     * Calculates triangulation quality
     * @param {number[]} vertices - Input vertices
     * @param {number[]} holes - Hole indices
     * @param {number} dims - Dimensions
     * @param {number[]} triangles - Triangle indices
     * @returns {number} Quality metric
     */
    getQuality: calculateTriangulationQuality
};

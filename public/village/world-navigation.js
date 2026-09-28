function inside(x, y, points) {
 let hit = false;
 for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
  const a = points[i], b = points[j];
  if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) hit = !hit;
 }
 return hit;
}
function nearEdge(x, y, a, b, radius) {
 const dx = b.x - a.x, dy = b.y - a.y;
 const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy)));
 return Math.hypot(x - a.x - t * dx, y - a.y - t * dy) < radius;
}

export function createNavigation(layout) {
 const { bounds, obstacles, circle } = layout;
 function blocked(x, y, radius = 18) {
  if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return true;
  if (circle && Math.hypot(x - circle.x, y - circle.y) > circle.r - radius) return true;
  return obstacles.some(o => (x - o.x) ** 2 + (y - o.y) ** 2 < (o.r + radius) ** 2 &&
   (inside(x, y, o.points) || o.points.some((a, i) => nearEdge(x, y, a, o.points[(i + 1) % o.points.length], radius))));
 }
 function clearLine(a, b) {
  const steps = Math.ceil(Math.hypot(a.x - b.x, a.y - b.y) / 8);
  for (let i = 1; i <= steps; i++) if (blocked(a.x + (b.x - a.x) * i / steps, a.y + (b.y - a.y) * i / steps)) return false;
  return true;
 }
 const waypoints = obstacles.flatMap(o => {
  const count = o.kind === 'house' ? 8 : 16;
  return Array.from({ length: count }, (_, i) => ({ x: o.x + Math.cos(i * Math.PI * 2 / count) * (o.r + 26), y: o.y + Math.sin(i * Math.PI * 2 / count) * (o.r + 26) }));
 }).filter(p => !blocked(p.x, p.y));
 const visibleDistance = (a, b) => clearLine(a, b) ? Math.hypot(a.x - b.x, a.y - b.y) : Infinity;
 const connections = waypoints.map(a => waypoints.map(b => visibleDistance(a, b)));
 function routeTo(a, b) {
  if (blocked(b.x, b.y)) return [];
  if (clearLine(a, b)) return [b];
  const nodes = [a, b, ...waypoints], cost = nodes.map(() => Infinity), previous = [], visited = new Set();
  const start = nodes.map(p => visibleDistance(a, p)), end = nodes.map(p => visibleDistance(b, p));
  cost[0] = 0;
  for (let k = 0; k < nodes.length; k++) {
   let u = -1;
   for (let i = 0; i < nodes.length; i++) if (!visited.has(i) && (u < 0 || cost[i] < cost[u])) u = i;
   if (u < 0 || cost[u] === Infinity) break;
   if (u === 1) {
    const path = [];
    for (let v = 1; v !== 0; v = previous[v]) path.unshift(nodes[v]);
    return path;
   }
   visited.add(u);
   for (let v = 0; v < nodes.length; v++) if (!visited.has(v)) {
    const distance = u === 0 ? start[v] : v === 1 ? end[u] : connections[u - 2][v - 2];
    const next = cost[u] + distance;
    if (next < cost[v]) { cost[v] = next; previous[v] = u; }
   }
  }
  return [];
 }
 return { ...layout, blocked, routeTo };
}

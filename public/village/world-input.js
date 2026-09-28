import { createControls } from './roam-state.js';

export function bindInput(canvas, joystick, { active, move, point, rotate, zoom, action, layout }) {
 const controls = createControls(layout);
 const keyCode = event => /^[a-z]$/i.test(event.key) ? `Key${event.key.toUpperCase()}` : event.code;
 let running = false, pointer = null, stick = null;
 function releaseStick() {
  controls.touch(0, 0); stick = null;
  joystick.style.setProperty('--jx', '0px'); joystick.style.setProperty('--jy', '0px');
 }
 function clear() { controls.clear(); running = false; pointer = null; releaseStick(); }
 window.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select')) return;
  if (event.code === 'Escape') { event.preventDefault(); action('escape'); return; }
  if (!active()) return;
  if (event.code === 'KeyE') { action('enter'); return; }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') running = true;
  if (controls.press(keyCode(event))) { event.preventDefault(); move(); }
 });
 window.addEventListener('keyup', event => { controls.release(keyCode(event)); if (event.code.startsWith('Shift')) running = false; });
 canvas.addEventListener('pointerdown', event => {
  if (!active() || pointer || event.button !== 0) return;
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, last: event.clientX, dragged: false };
  canvas.setPointerCapture(event.pointerId);
 });
 canvas.addEventListener('pointermove', event => {
  if (pointer?.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 6) pointer.dragged = true;
  if (pointer.dragged) rotate(event.clientX - pointer.last);
  pointer.last = event.clientX;
 });
 canvas.addEventListener('pointerup', event => {
  if (pointer?.id !== event.pointerId) return;
  if (!pointer.dragged) point(event.clientX, event.clientY);
  pointer = null;
 });
 canvas.addEventListener('pointercancel', () => { pointer = null; });
 canvas.addEventListener('lostpointercapture', () => { pointer = null; });
 canvas.addEventListener('wheel', event => { if (active()) { event.preventDefault(); zoom(event.deltaY); } }, { passive: false });
 function drag(event) {
  if (stick !== event.pointerId) return;
  const r = joystick.getBoundingClientRect(), x = event.clientX - r.left - r.width / 2, y = event.clientY - r.top - r.height / 2;
  const distance = Math.hypot(x, y), factor = Math.min(1, 32 / (distance || 1));
  controls.touch(distance < 6 ? 0 : x * factor / 32, distance < 6 ? 0 : y * factor / 32);
  joystick.style.setProperty('--jx', `${x * factor}px`); joystick.style.setProperty('--jy', `${y * factor}px`); move();
 }
 joystick.addEventListener('pointerdown', event => {
  if (!active() || stick !== null) return;
  event.preventDefault(); stick = event.pointerId; joystick.setPointerCapture(stick); drag(event);
 });
 joystick.addEventListener('pointermove', drag);
 for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) joystick.addEventListener(type, event => { if (event.pointerId === stick) releaseStick(); });
 window.addEventListener('blur', clear);
 return { axes: controls.axes, running: () => running, clear, setLayout: controls.setLayout };
}

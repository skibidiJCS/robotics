const directions={ArrowLeft:-1,KeyA:-1,KeyQ:-1,ArrowRight:1,KeyD:1};
export function createMovement(){
 const held=new Map();let order=0,touch=0;
 return {
  press(code){if(!(code in directions))return false;if(!held.has(code))held.set(code,{direction:directions[code],order:++order});return true;},
  release(code){if(!(code in directions))return false;held.delete(code);return true;},
  touch(value){touch=Math.sign(value);},
  direction(){if(touch)return touch;let last=null;for(const key of held.values())if(!last||key.order>last.order)last=key;return last?.direction||0;},
  clear(){held.clear();touch=0;}
 };
}

import { CapabilityEngine } from "../core/capability-engine.js";
import { SensorManager } from "../sensors/sensor-manager.js";
import { StorageManager } from "../storage/storage-manager.js";
const storage=new StorageManager(); const capabilities=CapabilityEngine.detect(); const sensors=new SensorManager();
if(document.querySelector("#status")) document.querySelector("#status").textContent="Core online — "+JSON.stringify(capabilities);
if(document.querySelector("#sensors")) document.querySelector("#sensors").textContent=JSON.stringify(sensors.status(),null,2);
if(document.querySelector("#history")) document.querySelector("#history").textContent=JSON.stringify(storage.history(),null,2);
if(document.querySelector("#alerts")) document.querySelector("#alerts").textContent=JSON.stringify(storage.alerts(),null,2);
const c=document.querySelector("#radar"); if(c){const ctx=c.getContext("2d");let a=0;function draw(){ctx.clearRect(0,0,c.width,c.height);const x=c.width/2,y=c.height/2,r=Math.min(x,y)-20;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle="#285766";ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.strokeStyle="#8de8ff";ctx.stroke();a+=.02;requestAnimationFrame(draw)}draw()}
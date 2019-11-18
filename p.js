//<![CDATA[
var points;
var savetext = "";
var line, isDown;
var pointerr;
var canvas;
var hm = new jsscompress.Hauffman();
function sv() {
var blob = new Blob([hm.compress(savetext)], {type: "text/plain;charset=utf-8"});
saveAs(blob, "image.npeg");
}
  window.onload=function(){
canvas = new fabric.Canvas('c', { selection: false });
canvas.on('mouse:down', function(o){
isDown = true;
var pointer = canvas.getPointer(o.e);
savetext+="line:("+pointer.x+","+pointer.y+")";
points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
line = new fabric.Line(points, {
  strokeWidth: 5,
  fill: 'red',
  stroke: 'red',
  originX: 'center',
  originY: 'center'
});
canvas.add(line);
});
canvas.on('mouse:move', function(o){
if (!isDown) return;
pointerr = canvas.getPointer(o.e);
line.set({ x2: pointerr.x, y2: pointerr.y });
canvas.renderAll();
});

canvas.on('mouse:up', function(o){
isDown = false;
savetext+="("+pointerr.x+","+pointerr.y+")\n";
});
document.getElementById('save-file').addEventListener('change',function() {
var fr = new FileReader();
fr.onload = function() {
var txt = hm.decompress(this.result).split("");
var tok="";
var vrin=false;
var rs = ["","","",""];
var rsno = 0;
for (x in txt) {
if(txt[x]!=":"){
tok+=txt[x];
}else{
  if(tok=="line"){
    tok="";
  }
}
if(txt[x]=="\n"){
  savetext+="line:("+rs[0]+","+rs[1]+")("+rs[3]+","+rs[4]+")";
  points = [ JSON.parse(rs[0]), JSON.parse(rs[1]), JSON.parse(rs[2]), JSON.parse(rs[3]) ];
  line = new fabric.Line(points, {
    strokeWidth: 5,
    fill: 'red',
    stroke: 'red',
    originX: 'center',
    originY: 'center'
  });
  canvas.add(line);
tok="";
txt[x]="";
vrin=false;
rsno=0;
rs = ["","","",""];
}
if (vrin) {
if(txt[x]=="," || txt[x]=="("){
  rsno++;
  txt[x]="";
}
if(txt[x]==")"){
  txt[x]="";
}
rs[rsno]+=txt[x];
}
if(txt[x]=="("){
vrin=true;
}
if(txt[x]==" "){
tok="";
}
console.log(rs);
}
}
fr.readAsText(this.files[0]);
});
  }
//]]>

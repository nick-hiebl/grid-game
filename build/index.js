"use strict";(()=>{var ue=Object.defineProperty;var de=(o,t,e)=>t in o?ue(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var lt=(o,t,e)=>(de(o,typeof t!="symbol"?t+"":t,e),e);var ht=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),F=1280,ct=720,U=F,G=ct,_=3;var n=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new n(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new n(t.x+e.x,t.y+e.y)}static diff(t,e){return new n(t.x-e.x,t.y-e.y)}static scale(t,e){return new n(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,s=t.y-e.y;return i*i+s*s}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new n(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var p=(o,t,e)=>Math.min(e,Math.max(o,t)),T=o=>o>0?1:o===0?0:-1;var h=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return n.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return n.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=p(this.position.x,t.x1,t.x2),i=p(this.position.y,t.y1,t.y2);return this.intersectsVector(new n(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},c=class{constructor(t,e,i,s){this.x1=t,this.y1=e,this.x2=i,this.y2=s}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new n((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=p(t.position.x,this.x1,this.x2),i=p(t.position.y,this.y1,this.y2),s=new n(e,i),r=n.diff(t.position,s),a=r.magnitude||1;if(a>=t.radius){let l=n.diff(t.position,this.midpoint),d=this.width/2-Math.abs(l.x),f=this.height/2-Math.abs(l.y);return d<f?new n((d+t.radius)*T(l.x),0):new n(0,(f+t.radius)*T(l.y))}return n.scale(r,(t.radius-a)/a)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new c(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,s){return new c(t,e,t+i,e+s)}static centerForm(t,e,i,s){return new c(t-i,e-s,t+i,e+s)}static aroundPoint(t,e,i){return new c(t.x-e,t.y-i,t.x+e,t.y+i)}};var Yt=.4,Jt=.25,C=7/9*G,B="#00ff62c8",ut="#0096ffc8",dt=[[new h(new n(0,0),.33)],[new h(new n(0,0),.33)],[new h(new n(0,.4),.33),new h(new n(0,-.4),.33)],[new h(new n(-.42,.4),.33),new h(new n(.42,.4),.33),new h(new n(0,-.4),.33)],[new h(new n(.4,.4),.33),new h(new n(.4,-.4),.33),new h(new n(-.4,.4),.33),new h(new n(-.4,-.4),.33)],[new h(new n(0,.3),.28),new h(new n(.64,.3),.28),new h(new n(-.64,.3),.28),new h(new n(-.32,-.3),.28),new h(new n(.32,-.3),.28)],[new h(new n(0,.6),.28),new h(new n(.64,.6),.28),new h(new n(-.64,.6),.28),new h(new n(-.32,0),.28),new h(new n(.32,0),.28),new h(new n(0,-.6),.28)],[new h(new n(0,0),.28),new h(new n(.64,0),.28),new h(new n(-.64,0),.28),new h(new n(-.32,-.6),.28),new h(new n(.32,-.6),.28),new h(new n(-.32,.6),.28),new h(new n(.32,.6),.28)],[new h(new n(0,.6),.28),new h(new n(.64,.6),.28),new h(new n(-.64,.6),.28),new h(new n(-.32,0),.28),new h(new n(.32,0),.28),new h(new n(0,-.6),.28),new h(new n(.64,-.6),.28),new h(new n(-.64,-.6),.28)]],Zt=[[c.centerForm(0,0,.33,.33)],[c.centerForm(0,0,.33,.33)],[c.centerForm(0,-.4,.33,.33),c.centerForm(0,.4,.33,.33)],[c.centerForm(0,-.4,.33,.33),c.centerForm(-.4,.4,.33,.33),c.centerForm(.4,.4,.33,.33)],[c.centerForm(-.4,-.4,.33,.33),c.centerForm(.4,-.4,.33,.33),c.centerForm(-.4,.4,.33,.33),c.centerForm(.4,.4,.33,.33)]];var me="0",J=(o,t)=>o.toString(16).padStart(t,me);var u=Symbol("ctx"),Z=Symbol("canvas"),$=class{constructor(t){this[Z]=t;let e=t.getContext("2d");if(!e)throw Error("Unable to get 2d context");e.imageSmoothingEnabled=!1,this[u]=e,this[u].fillStyle="black",this[u].strokeStyle="black",this.width=this[Z].width,this.height=this[Z].height}fillRect(t,e,i,s){this[u].fillRect(t,e,i,s)}clear(){this[u].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,s){this[u].strokeRect(t,e,i,s)}strokeRectInset(t,e,i,s,r){this.strokeRect(t+r,e+r,i-r*2,s-r*2)}fillEllipse(t,e,i,s){this[u].beginPath(),this[u].ellipse(t,e,i,s,0,0,2*Math.PI),this[u].fill()}strokeEllipse(t,e,i,s){this[u].beginPath(),this[u].ellipse(t,e,i,s,0,0,2*Math.PI),this[u].stroke()}drawLine(t,e,i,s){this[u].beginPath(),this[u].moveTo(t,e),this[u].lineTo(i,s),this[u].stroke()}drawQuadratic(t,e,i,s,r,a){this[u].beginPath(),this[u].moveTo(t,e),this[u].quadraticCurveTo(r,a,i,s),this[u].stroke()}scale(t,e){this[u].scale(t,e)}translate(t,e){this[u].translate(t,e)}setColor(t){t!==this[u].fillStyle&&(this[u].fillStyle=t,this[u].strokeStyle=t)}setLineWidth(t){this[u].lineWidth=t}get lineWidth(){return this[u].lineWidth}setLineDash(t){this[u].setLineDash(t)}setColorRGB(t,e,i,s=255){let r=`#${J(t,2)}${J(e,2)}${J(i,2)}${J(s,2)}`;this.setColor(r)}setColorHSLA(t,e,i,s=1){let r=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${s})`;this.setColor(r)}saveTransform(){this[u].save()}restoreTransform(){this[u].restore()}drawImage(t,e,i,s,r,a,l,d,f){let I;if(t instanceof $)I=t[Z];else if(t instanceof Image){if(!t.complete)return;I=t}else throw Error("Drawing something unmanageable");this[u].drawImage(I,e,i,s,r,a,l,d,f)}static fromId(t){let e=document.getElementById(t);if(!e||!(e instanceof HTMLCanvasElement))throw new Error(`Could not find canvas with id: "${t}"`);return new $(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new $(i)}},P=$;Z,u;var x=Symbol("real-canvas");function pe(){let o=document.getElementById("canvas");if(!(o instanceof HTMLCanvasElement))throw new Error("Could not find canvas");return o.width=F,o.height=ct,o}var Nt=class{constructor(){let t=new P(pe());if(!(t instanceof P))throw Error("No canvas found!");this[x]=t,this.background=P.fromScratch(1280*3,720*3),this.behindGroundCanvas=P.fromScratch(1280*3,720*3),this.staticWorldCanvas=P.fromScratch(1280*3,720*3),this.dynamicWorldCanvas=P.fromScratch(1280*3,720*3),this.uiCanvas=P.fromScratch(F,ct),this.camera=new n(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[x].drawImage(this.background,this.camera.x,this.camera.y,1280,720,0,0,this[x].width,this[x].height),this[x].drawImage(this.behindGroundCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[x].width,this[x].height),this[x].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[x].width,this[x].height),this[x].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[x].width,this[x].height),this[x].drawImage(this.uiCanvas,0,0,U,G,0,0,this[x].width,this[x].height)}static getInstance(){return this.instance?this.instance:new Nt}},Q=Nt;x,Q.instance=null;var Ht={},fe=(o,t)=>`${o}-${t}`,ge=(o,t)=>{let e=Math.max(o,t),i=.7,s=.5,r=Math.floor(C/(e+i+s)),a=Math.floor(r*s),l=C-r*e-a,d=l+a+o*r,f=l+a+t*r,I=Math.max((f-d)/2,0),D=Math.max((d-f)/2,0),k=[[D,D+a]],v=D+a;for(let w=0;w<t;w++)k.push([v,v+r]),v+=r;k.push([v,v+l]);let y=[[I,I+l]],g=I+l;for(let w=0;w<o;w++)y.push([g,g+r]),g+=r;y.push([g,g+a]);let at=[];for(let[w,b]of y){let M=[];for(let[he,ce]of k)M.push(new c(he,w,ce,b));at.push(M)}return at},we=(o,t)=>{let e=fe(o,t);return e in Ht||(Ht[e]=ge(o,t)),Ht[e]},$t=(o,t)=>{let e=we(o,t);return(i,s)=>e[i==="end"?o+1:i+1][s==="end"?t+1:s+1]};var mt=.4,q=class{constructor(t,e,i,s){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=s,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=$t(e,i);for(let r=0;r<e;r++){let a=[];for(let l=0;l<i;l++)a.push(null),this.elements.push({row:r,col:l,shape:this.positionGetter(r,l).inset(_),isHovered:!1});this.state.push(a)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new n(0,G*t),i=new n((U-C)/2,(G-C)/2);return n.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?B:ut),e.fillRect(0,0,C,C),e.setColor("#222222"),e.fillRect(C/4,C,C/2,C),e.setLineWidth(_*8),e.setLineDash([]),e.strokeRectInset(0,0,C,C,-_*4),e.setColor("#ffffff64"),e.setLineWidth(_),e.strokeRectInset(0,0,C,C,_/2);for(let s of this.elements){s.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),s.shape.stroke(e,_/2);let r=this.state[s.row][s.col],a=s.shape.midpoint;r?(e.setColor("white"),e.fillEllipse(a.x,a.y,s.shape.width*mt,s.shape.width*mt)):r===!1&&(e.setColor("#ffffff64"),e.setLineDash([_*2,_*2]),e.strokeEllipse(a.x,a.y,s.shape.width*mt,s.shape.width*mt))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/Yt:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/Jt),this.openCloseStatus=p(this.openCloseStatus,0,1),e){let i=n.diff(e.mousePosition,this.uiPosition());for(let s of this.elements)s.isHovered=s.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=n.diff(t.position,this.uiPosition());for(let s of this.elements)if(s.isHovered=s.shape.intersectsPoint(i),s.isHovered){let r=this.state[s.row][s.col];e=!0;let a=null;t.isRightClick()?r===!1?a=null:a=!1:r===!0?a=null:a=!0,this.state[s.row][s.col]=a}}e&&this.onStateChange()}};var pt=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},K=class{constructor(){this.isValid=!1}validate(t){}draw(t){}};var ft=class extends K{constructor(t,e){super(),this.row=t,this.column=e}},gt=class extends ft{constructor(t,e,i){super(t,e),this.mustBeOn=i,this.isValid=!i}validate(t){let e=t[this.row][this.column];this.isValid=!!e==!!this.mustBeOn}draw(t,e){this.isValid?t.setColor("white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height),r=new n(i.x2-s*.15,i.y1+s*.15);this.mustBeOn?t.fillEllipse(r.x,r.y,s*.1,s*.1):(t.setLineWidth(s*.05),t.strokeEllipse(r.x,r.y,s*.075,s*.075))}},wt=class extends ft{constructor(t,e,i){super(t,e),this.desiredCount=i,this.isValid=i===0,this.isCellColoured=!1}*iterateArea(t){for(let e=Math.max(this.row-1,0);e<=Math.min(this.row+1,t.length-1);e++)for(let i=Math.max(this.column-1,0);i<=Math.min(this.column+1,t[e].length-1);i++)yield[e,i]}validate(t){let e=0;for(let[i,s]of this.iterateArea(t))t[i][s]&&e++;this.isValid=e===this.desiredCount,this.isCellColoured=!!t[this.row][this.column]}draw(t,e){this.isValid?t.setColor(this.isCellColoured?B:"white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height)*.25,r=i.midpoint;for(let a of dt[this.desiredCount]){let l=n.add(r,n.scale(a.position,s));this.desiredCount===0?(t.setLineWidth(a.radius*s*.5),t.strokeEllipse(l.x,l.y,a.radius*s*.75,a.radius*s*.75)):t.fillEllipse(l.x,l.y,a.radius*s,a.radius*s)}}};var Qt=o=>new n(-o.y,o.x),yt=class extends K{constructor(t,e){super(),this.isRow=t,this.index=e,this.isValid=!1}getRelevantRow(t){return this.isRow?t[this.index]:t.map(e=>e[this.index])}validateRow(t){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(t){let e=this.getRelevantRow(t);this.isValid=this.validateRow(e)}drawInCell(){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(t,e){if(this.isValid?t.setColor("white"):t.setColor("red"),this.isRow){let i=e(this.index,"end");this.drawInCell(t,i.midpoint,i.width/2,!0)}else{let i=e(-1,this.index);this.drawInCell(t,i.midpoint,i.height/2,!1)}}},tt=class extends yt{constructor(t,e,i){super(t,e),this.count=i,this.isValid=i===0}validateRow(t){return t.reduce((i,s)=>s?i+1:i,0)===this.count}drawInCell(t,e,i,s){let r=s?a=>new h(Qt(a.position),a.radius):a=>a;for(let a of dt[this.count]){a=r(a);let l=n.add(e,n.scale(a.position,i));this.count===0?(t.setLineWidth(a.radius*i*.5),t.strokeEllipse(l.x,l.y,a.radius*i*.75,a.radius*i*.75)):t.fillEllipse(l.x,l.y,a.radius*i,a.radius*i)}}},X=class extends tt{validateRow(t){let[e]=t.reduce(([i,s],r)=>r&&!s?[i+1,!0]:[i,!!r],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,s){let r=a=>s?Qt(a):a;for(let a of Zt[this.count]){let l=n.add(e,n.scale(r(a.midpoint),i)),d=a.width*i;this.drawSquare(t,l,d)}}},et=class extends X{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,s],r)=>!r&&s?[i+1,!1]:[i,!!r],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},it=class extends yt{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,s){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let r=n.add(e,n.scale(s?new n(-.5,0):new n(0,.5),i));t.fillEllipse(r.x,r.y,.22*i,.22*i);let a=n.add(e,n.diff(e,r)),l=i*.22;t.drawLine(a.x-l,a.y-l,a.x+l,a.y+l),t.drawLine(a.x-l,a.y+l,a.x+l,a.y-l)}};var O=class{constructor(){this.validationItems=[]}addForcedCellValidator(t,e,i){return this.validationItems.push(new gt(t,e,i)),this}addCountAreaValidator(t,e,i){return this.validationItems.push(new wt(t,e,i)),this}addEdgeValidators(t,e,i=tt){t.forEach((s,r)=>{typeof s=="number"&&this.validationItems.push(new i(e,r,s))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,X),this}addRowGroups(t){return this.addEdgeValidators(t,!0,X),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,et),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,et),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new it(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new it(!0,i))})}create(){return new pt(this.validationItems)}};var te=(o,t)=>{let{rows:e,cols:i}=t,s=new O;return t.columnCounts&&s.addColumnCounts(t.columnCounts),t.rowCounts&&s.addRowCounts(t.rowCounts),t.columnGroups&&s.addColumnGroups(t.columnGroups),t.rowGroups&&s.addRowGroups(t.rowGroups),t.columnBlankGroups&&s.addColumnBlankGroups(t.columnBlankGroups),t.rowBlankGroups&&s.addRowBlankGroups(t.rowBlankGroups),t.columnNoTriple&&s.addColumnNoTriple(t.columnNoTriple),t.rowNoTriple&&s.addRowNoTriple(t.rowNoTriple),t.forcedCells&&t.forcedCells.forEach(r=>{s.addForcedCellValidator(r.row,r.col,r.on)}),t.countAreas&&t.forcedCells.forEach(r=>{s.addCountAreaValidator(r.row,r.col,r.count)}),new q(o,e,i,s.create())};var ee={1:{rows:1,cols:1,columnCounts:[1],rowCounts:[1]},2:{rows:2,cols:1,columnCounts:[2],rowCounts:[1,1]},3:{rows:2,cols:2,columnCounts:[2,1],rowCounts:[1,2]},4:{rows:3,cols:3,columnCounts:[1,3,2],rowCounts:[1,2,3]},5:{rows:3,cols:3,columnCounts:[2,3,1],rowCounts:[2,3,1]},6:{rows:3,cols:4,columnCounts:[2,1,3,2],rowCounts:[3,4,1]},7:{rows:4,cols:4,columnCounts:[2,4,2,1],rowCounts:[4,1,1,3]},8:{rows:5,cols:5,columnCounts:[2,4,2,3,5],rowCounts:[1,3,5,5,2]}};function ye(o){return o==="4"?new O().addRowCounts([4,3,null]).addColumnGroups([1,null,null,2]).create():(console.error("Cannot find puzzle with id",o),new O().create())}function Ee(o){if(o in ee)return te(o,ee[o]);let t=ye(o);if(o==="4")return new q(o,3,4,t);console.error("Cannot find puzzle with id",o)}var Ft=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return Ee(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},Et=new Ft;var st=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},xt=class extends st{constructor(e){super();this.exitTrigger=e}isExitEvent(){return!0}},j=class extends st{constructor(e){super();this.puzzleId=e}isOpenPuzzleEvent(){return!0}},Ct=class extends st{constructor(e){super();this.puzzleId=e}isClosePuzzleEvent(){return!0}};var Y=class{constructor(t){this.id=t}onStart(t){}update(t,e,i){}draw(t){}};var xe=!1,S=class extends Y{constructor(e,i,s,r=[]){super(e);this.position=i,this.triggerArea=s,this.prerequisites=r,this.prereqsActive=r.length===0,this.prereqEntities=[],this.isEnabled=!1,this.isAreaActive=!1,this.connectionPoint=this.position,this.outputPoint=this.position}onStart(e){this.findPrerequisites(e)}findPrerequisites(e){return this.prereqEntities.length===this.prerequisites.length?this.prereqEntities:(this.prereqEntities=e.interactibles.filter(i=>this.prerequisites.includes(i.id)),this.prereqEntities)}update(e,i,s){var r;this.prereqsActive=this.findPrerequisites().every(a=>a.isEnabled),this.isAreaActive=!!(this.prereqsActive&&((r=this.triggerArea)==null?void 0:r.intersectsPoint(e.position)))}draw(e){var s;let i=e.dynamicWorldCanvas;xe&&(i.setColorRGB(255,255,255),i.setLineWidth(.1),i.setLineDash([.2,.2]),(s=this.triggerArea)==null||s.stroke(i)),e.behindGroundCanvas.setLineWidth(.2);for(let r of this.prereqEntities){e.behindGroundCanvas.setColor(r.isEnabled?"white":"black");let a=n.manhattanDist(r.outputPoint,this.connectionPoint),l=n.lerp(r.outputPoint,this.connectionPoint,.5),d=n.add(l,new n(0,a*.3));e.behindGroundCanvas.drawQuadratic(r.outputPoint.x,r.outputPoint.y,this.connectionPoint.x,this.connectionPoint.y,d.x,d.y)}}onInteract(){}};var vt=class extends S{constructor(e,i,s,r,a,l){super(e,i,s,r);this.puzzleId=a,this.puzzle=Et.getPuzzle(a),this.connectionPoint=n.add(i,new n(0,1.2)),this.outputPoint=n.add(i,new n(l.isFlipped?-1:1,-1.15)),this.config=l}draw(e){super.draw(e);let i=e.dynamicWorldCanvas,s=1,r=1/10;i.setColorRGB(0,0,0),i.fillRect(this.position.x-s/2,this.position.y+s,s,1),i.setLineWidth(r),this.isAreaActive&&(i.setColorRGB(255,255,255,128),i.strokeRectInset(this.position.x,this.position.y,0,0,-s-r*1.5)),i.setColorRGB(0,0,0),i.strokeRectInset(this.position.x,this.position.y,0,0,-s-r/2);let a=this.config.isFlipped?-1:1;i.fillRect(this.position.x+a*(s-r)-2*r,this.position.y-s-4*r,4*r,4*r),this.puzzle.hasBeenSolvedEver&&(this.isEnabled=!0,i.setColor("white"),i.fillRect(this.position.x+a*(s-r)-r,this.position.y-s-3*r,r*2,r*2)),this.prereqsActive&&(i.setColor(this.puzzle.isSolved?B:ut),i.fillRect(this.position.x-s,this.position.y-s,s*2,s*2));let l=new n(this.position.x-s,this.position.y-s);i.translate(l.x,l.y),i.setColor("white");let d=this.puzzle.state,f=s*2/(3*Math.max(d.length,d[0].length)+1),I=f*(3*d[0].length+1),D=f*(3*d.length+1),k=Math.max(0,(I-D)/2),v=Math.max(0,(D-I)/2);for(let y=0;y<d.length;y++)for(let g=0;g<d[y].length;g++)d[y][g]&&i.fillRect(v+f*(3*g+1),k+f*(3*y+1),f*2,f*2);i.translate(-l.x,-l.y)}onInteract(){return new j(this.puzzleId)}};var rt=new Image;rt.src="./img/tileset.png";var L=new Image;L.src="./img/entity-set.png";var It=class extends S{constructor(t,e,i,s){super(t,e,i,s)}update(t,e,i){this.isEnabled?this.isAreaActive=!1:super.update(t,e,i)}draw(t){super.draw(t);let e=t.dynamicWorldCanvas,i=1/10;this.isAreaActive&&(e.setColorRGB(255,255,255,128),e.setLineWidth(i),e.setLineDash([]),e.strokeRectInset(this.position.x-i*3,this.position.y-i*4,i*6,i*8,-i*1.5)),e.drawImage(L,this.isEnabled?80:40,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}onInteract(){this.isEnabled=!0}};var bt=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return n.diff(t.position,new n(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var Ce=Symbol("Up"),ve=Symbol("Down"),Ie=Symbol("Left"),be=Symbol("Right"),Le=Symbol("Jump"),Pe=Symbol("Interact"),Re=Symbol("Escape"),m={Down:ve,Escape:Re,Interact:Pe,Jump:Le,Left:Ie,Right:be,Up:Ce};var ie={" ":m.Jump,escape:m.Escape,esc:m.Escape,Escape:m.Escape,Esc:m.Escape,w:m.Up,a:m.Left,s:m.Down,d:m.Right,e:m.Interact},W=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[m.Right]-+!!this.keyMap[m.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new W({})}},Lt=class{constructor(){}isForKey(t){return!1}isClick(){return!1}},Ut=class extends Lt{constructor(e){super();this.input=e}isForKey(e){return e===this.input}},Pt=class extends Lt{constructor(e,i){super();this.position=e,this.isRight=i}isClick(){return!0}isRightClick(){return this.isRight}},Rt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new n(0,0),this.canvas=document.getElementById("canvas")}init(){let t=i=>{this.listener&&this.listener(new Ut(i))};document.addEventListener("keydown",i=>{if(i.repeat)return;let s=ie[i.key];!s||(this.isButtonDown[s]=!0,t(s))}),document.addEventListener("keyup",i=>{let s=ie[i.key];!s||(this.isButtonDown[s]=!1)}),document.addEventListener("mousemove",i=>{this.mousePosition=this.toCanvasPosition(i)}),document.addEventListener("click",i=>{this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new Pt(this.mousePosition,!1))}),document.addEventListener("contextmenu",i=>{i.preventDefault(),this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new Pt(this.mousePosition,!0))});let e=(i,s)=>{let r=document.getElementById(i);!r||(r.addEventListener("touchstart",a=>{a.preventDefault(),this.isButtonDown[s]=!0,t(s)}),r.addEventListener("touchcancel",a=>{a.preventDefault(),this.isButtonDown[s]=!1}),r.addEventListener("touchend",a=>{a.preventDefault(),this.isButtonDown[s]=!1}))};e("left",m.Left),e("right",m.Right),e("jump",m.Jump),e("down",m.Down),e("escape",m.Escape),e("interact",m.Interact)}toCanvasPosition(t){return n.scale(new n(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*U/F)}getInputState(){return new W(this.isButtonDown,this.mousePosition)}};var St=1280/32,_t=class{constructor(t,e,i,s,r,a,l,d,f){this.key=t,this.levelGrid=s,this.objects=r,this.player=a,this.exitTriggers=l,this.interactibles=d,this.entities=f,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t,this.interactibles.forEach(e=>e.onStart(this)),this.entities.forEach(e=>e.onStart(this))}addWithoutDuplicate(t){this.objects.find(({rect:e})=>e===t.rect)||this.objects.push(t)}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){var i;this.player.update(t,this.isPlayerActive()?e:W.empty(),this),this.interactibles.forEach(s=>{s.update(this.player,t,this)}),(i=this.interactingWith)!=null&&i.isAreaActive||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.entities.forEach(s=>{s.update(this.player,t,this)}),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new Ct(this.interactingWith.id))}onInput(t){if(this.isPlayerActive()&&this.player.onInput(t),t.isForKey(m.Interact)){let e=this.interactibles.find(i=>i.isAreaActive);if(e){let i=e.onInteract();i&&i instanceof j&&(this.interactingWith=e,this.emitEvent(i))}}else t.isForKey(m.Escape)&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new xt(t))}clampCamera(t){let e=new n(p(t.x,this.player.position.x-32+1,this.player.position.x-1),p(t.y,this.player.position.y-18+1,this.player.position.y-1));return new n(p(e.x,0,this.width-32),p(e.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new n(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(n.lerp(this.camera,this.getNaiveCamera(n.add(this.player.position,new n(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(St,St),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(t.background.setColor("#6400c8"),t.background.fillRect(0,0,t.background.width,t.background.height),this.withSetupCanvas(t.staticWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i=0;i<this.height;i++)for(let s=0;s<this.width;s++){let r=this.levelGrid[i][s];r&&e.drawImage(rt,(r-1)*10,0,10,10,s,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),this.withSetupCanvas(t.behindGroundCanvas,()=>{t.behindGroundCanvas.clear(),this.interactibles.forEach(i=>{i.draw(t)}),this.entities.forEach(i=>{i.draw(t)})}),this.player.draw(e)}),t.setCamera(new n(Math.floor(this.camera.x*St),Math.floor(this.camera.y*St)))}};var N={isSolid:o=>o===1,isGrounding:o=>o===2||N.isSolid(o)};var qt=class{constructor(){this.grid=[],this.shortGrid=[]}innerGet(t,e,i,s){return t in s||(s[t]=[]),e in s[t]||(s[t][e]=c.widthForm(e,t,1,i?.2:1)),s[t][e]}get(t,e,i=!1){return this.innerGet(t,e,i,i?this.shortGrid:this.grid)}},se=new qt;var ot=.8,Kt=16,Xt=Kt/.3,Se=2*Xt,Ae=1.8*Xt,_e=4,ne=.6,ae=4*_e/ne,Te=ae,re=2*ae/ne,De=.1;function Me(o){return!!o}var Tt=class{constructor(t){this.position=t,this.collider=new h(t,ot),this.velocity=new n(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.contactingAnyLedge=!1,this.inAirFor=1}onInput(t){t.isForKey(m.Jump)&&(this.wantsToJump=!0)}collideWithBlock(t,e,i){let s=!this.isDropping&&t===2&&this.velocity.y>=0&&this.position.y<e.y1,r=this.collider.intersectsRectangle(e);if(r&&t===2&&(this.contactingAnyLedge=!0,this.velocity.y<0&&this.position.y>=e.y1&&(this.isDropping=!0)),N.isSolid(t)||s){if(r){this.isColliding=!0;let a=e.uncollideCircle(this.collider);this.velocity.add(n.scale(a,1/i)),a.x>0&&a.y===0?this.velocity.x=Math.max(0,this.velocity.x):a.x<0&&a.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),a.y>0&&a.x===0?this.velocity.y=Math.max(0,this.velocity.y):a.y<0&&a.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(a)}return this.collider.intersectsRectangle(e)}}update(t,e,i){let s=(w,b)=>{var M;return(M=i.levelGrid[Math.floor(b)])==null?void 0:M[Math.floor(w)]},r=(w,b)=>{let M=s(w,b);if(M)return{type:s(w,b),rect:se.get(Math.floor(b),Math.floor(w),M===2)}},a=e.getHorizontalAxis(),l=new n(a*Xt,0);e.isPressed(m.Down)&&(this.isDropping=!0);let d=this.position.y+this.collider.radius,f=s(this.position.x,d),I=this.isDropping?N.isSolid(f):N.isGrounding(f),D=s(this.position.x,this.position.y),k=I&&d===Math.floor(d);if(this.isGrounded=k||i.objects.some(({type:w,rect:b})=>(this.isDropping?N.isSolid(w):N.isGrounding(w))&&this.collider.isKissingBelow(b)),this.isGrounded)this.inAirFor=0,T(a)?T(a)!==T(this.velocity.x)&&(l.x+=-Ae*T(this.velocity.x)):l.x+=-Math.min(Math.abs(this.velocity.x/t),Se)*T(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,D===3){let w=this.velocity.y>0?0:1.1;l.y-=re*w}else l.y+=re;this.inAirFor<De&&this.wantsToJump&&(this.velocity.y=-Te),this.velocity.add(n.scale(l,t)),this.velocity.x=p(this.velocity.x,-Kt,Kt);let v=n.scale(this.velocity,t);v.x=p(v.x,-ot,ot),v.y=p(v.y,-ot,ot),this.position.add(v),this.isColliding=!1;let{x:y,y:g}=this.position,at=[r(y,g),r(y,g+1),r(y,g-1),r(y-1,g),r(y+1,g),r(y-1,g-1),r(y+1,g-1),r(y-1,g+1),r(y+1,g+1)].filter(Me);this.contactingAnyLedge=!1,at.concat(i.objects).forEach(({type:w,rect:b})=>{this.collideWithBlock(w,b,t)}),this.wantsToJump=!1,this.isDropping=this.isDropping&&this.contactingAnyLedge}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var Dt=class{constructor(t,e,i,s){this.key=t,this.iid=e,this.width=i,this.height=s,this.levelGrid=[],this.objects=[],this.playerPosition=new n(16,9),this.exitTriggers=[],this.interactibles=[],this.entities=[],this.worldPosition=new n(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}addEntities(t){return this.entities=this.entities.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new _t(this.key,this.width,this.height,this.levelGrid,this.objects,new Tt(this.playerPosition),this.exitTriggers,this.interactibles,this.entities)}};var Ve=.2,Mt=class extends S{constructor(e,i,s,r=4){super(e,i,void 0,s);this.connectionPoint=n.add(i,new n(0,-1.8)),this.headCollider=c.centerForm(this.position.x,this.position.y-1.8,.6,.4),this.doorCollider=c.widthForm(this.position.x-.5,this.position.y-2,1,r),this.fullHeight=r}onStart(e){super.onStart(e),e.addWithoutDuplicate({type:1,rect:this.headCollider}),e.addWithoutDuplicate({type:1,rect:this.doorCollider})}update(e,i,s){super.update(e,i,s);let r=i/Ve*(this.prereqsActive?-1:1);this.doorCollider.y2=p(this.doorCollider.y2+r,this.doorCollider.y1,this.doorCollider.y1+this.fullHeight)}draw(e){super.draw(e);let i=e.dynamicWorldCanvas,s=this.doorCollider.height;s>0&&(i.setColor("black"),i.fillRect(this.position.x-.5,this.position.y-2,1,s),i.drawImage(L,120,Math.max(40-10*s,20)-10,40,Math.min(10*s,20),this.position.x-2,this.position.y-2+Math.max(s-2,0),4,Math.min(s,2))),i.drawImage(L,this.prereqsActive?140:128,0,12,6,this.position.x-6/10,this.position.y-2,12/10,6/10)}};var ze=.3,Vt=class extends S{constructor(e,i,s,r=4,a={}){super(e,i,void 0,s);this.connectionPoint=n.add(i,new n((a.isFlipped?1:-1)*(r/2-.9),.3)),this.hasLeft=r>4||!a.isFlipped,this.hasRight=r>4||!!a.isFlipped,this.hasLedge=!!a.hasLedge,this.leftHead=c.widthForm(this.position.x-r/2,this.position.y,1.2,.8),this.rightHead=c.widthForm(this.position.x+r/2-1.2,this.position.y,1.2,.8),this.leftDoor=c.widthForm(this.position.x-r/2,this.position.y,this.hasRight?r/2:r,.6),this.rightDoor=c.widthForm(this.position.x-(this.hasLeft?0:r/2),this.position.y,this.hasLeft?r/2:r,.6),this.ledge=c.widthForm(this.position.x-r/2,this.position.y,r,.2),this.fullWidth=r/2,this.doorWidth=this.hasLeft&&this.hasRight?r/2:r}onStart(e){super.onStart(e),this.hasLeft&&(e.addWithoutDuplicate({type:1,rect:this.leftHead}),e.addWithoutDuplicate({type:1,rect:this.leftDoor})),this.hasRight&&(e.addWithoutDuplicate({type:1,rect:this.rightHead}),e.addWithoutDuplicate({type:1,rect:this.rightDoor})),this.hasLedge&&e.addWithoutDuplicate({type:2,rect:this.ledge})}update(e,i,s){super.update(e,i,s);let r=i/ze*(this.prereqsActive?-1:1);this.leftDoor.x2=p(this.leftDoor.x2+r,this.leftDoor.x1,this.leftDoor.x1+this.doorWidth),this.rightDoor.x1=p(this.rightDoor.x1-r,this.rightDoor.x2-this.doorWidth,this.rightDoor.x2)}draw(e){super.draw(e);let i=e.dynamicWorldCanvas;if(this.hasLedge)for(let s=-this.ledge.x1;s<this.ledge.x2;s++)i.drawImage(rt,10,0,10,10,s,this.ledge.y1,1,1);if(this.hasLeft){let s=this.leftDoor.width;s>0&&(i.setColor("black"),this.leftDoor.draw(i),i.drawImage(L,160+Math.max(40-10*s,20)-10,10,Math.min(10*s,20),10,Math.max(this.leftDoor.x1,this.leftDoor.x2-2),this.position.y,Math.min(s,2),1)),i.drawImage(L,this.prereqsActive?180:160,0,12,8,this.leftHead.x1,this.leftHead.y1,this.leftHead.width,this.leftHead.height)}if(this.hasRight){let s=this.rightDoor.width;s>0&&(i.setColor("black"),this.rightDoor.draw(i),i.drawImage(L,170,30,Math.min(10*s,20),10,this.rightDoor.x1,this.position.y,Math.min(s,2),1)),i.drawImage(L,this.prereqsActive?188:168,20,12,8,this.rightHead.x1,this.rightHead.y1,this.rightHead.width,this.rightHead.height)}}};var ke=.5,zt=class extends Y{constructor(e,i,s,r={}){super(e);this.coverArea=i,this.triggerArea=s,this.coverIsTrigger=!!r.coverIsTrigger,this.canReCover=!!r.canReCover,this.isUncovered=!1,this.revealState=0}isPlayerTriggering(e){return this.triggerArea.intersectsPoint(e.position)||this.coverIsTrigger&&this.coverArea.intersectsPoint(e.position)}isOpen(e){return this.canReCover?this.isPlayerTriggering(e):this.isUncovered?!0:(this.isUncovered=this.isPlayerTriggering(e),this.isUncovered)}onStart(e){super.onStart(e)}update(e,i,s){super.update(e,i,s);let r=this.isOpen(e);this.revealState=p(this.revealState+(r?1:-1)*(i/ke),0,1)}draw(e){if(super.draw(e),this.revealState<1){let i=e.dynamicWorldCanvas;i.setColorRGB(0,0,0,Math.floor(255*(1-this.revealState*this.revealState))),this.coverArea.draw(i)}}};var Ge="./data/world.json";function Oe(o){return fetch(o).then(t=>t.json())}function z(o,t,e="__identifier"){return o.find(i=>i[e]===t)}function le(o,t){return z(o.layerInstances,t)}function H(o){return Math.floor(o/10)}function We(o){return H(o[0])+1}function kt(o){var e;return(((e=z(o.fieldInstances,"prerequisites"))==null?void 0:e.__value)||[]).map(i=>i.entityIid)}function Ne(o){let t=o.iid,e=z(o.fieldInstances,"key");e||console.warn("Puzzle with no key in:",level.identifier);let i=new n(o.__grid[0]+2,o.__grid[1]+2),s={isFlipped:z(o.fieldInstances,"isFlipped").__value};return new vt(t,i,c.aroundPoint(i,2,2),kt(o),e.__value,s)}function He(o){let t=o.iid;t||console.warn("Switch with no key in:",level.identifier);let e=new n(o.__grid[0]+2,o.__grid[1]+2);return new It(t,e,c.aroundPoint(e,2,2),kt(o))}function Fe(o){let t=o.iid;t||console.warn("Door with no key in:",level.identifier);let e=new n(o.__grid[0]+2,o.__grid[1]+2);return new Mt(t,e,kt(o),o.height/10)}function Ue(o){let t=o.iid;t||console.warn("Trapdoor with no key in:",level.identifier);let e=new n(...o.__grid),i={isFlipped:z(o.fieldInstances,"isFlipped").__value,hasLedge:z(o.fieldInstances,"hasLedge").__value};return new Vt(t,e,kt(o),o.width/10,i)}function Be(o,t){let e=o.iid;e||console.warn("CoverEntity with no key in:",level.identifier);let i=z(o.fieldInstances,"triggerArea").__value.entityIid,s=z(t,i,"iid");return new zt(e,c.widthForm(...o.__grid,o.width/10,o.height/10),c.widthForm(...s.__grid,s.width/10,s.height/10))}function qe(o){let t=new Dt(o.identifier,o.iid,H(o.pxWid),H(o.pxHei));t.makeGridSpace();let e=le(o,"Solid");for(let a of e.gridTiles){let l=H(a.px[0]),d=H(a.px[1]),f=We(a.src);t.setCell(d,l,f)}let i=!1,r=le(o,"EntityLayer").entityInstances;return r.forEach(a=>{switch(a.__identifier){case"Util":break;case"PlayerStart":t.setPlayerPos(new n(a.__grid[0],a.__grid[1])),i=!0;break;case"PuzzleScreen":t.addInteractibles([Ne(a)]);break;case"Switch":t.addInteractibles([He(a)]);break;case"Door":t.addInteractibles([Fe(a)]);break;case"Trapdoor":t.addInteractibles([Ue(a)]);break;case"CoverEntity":t.addEntities([Be(a,r)]);break;default:console.warn("Processing unknown entity type:",a.__identifier)}}),i||console.warn(`Level ${o.identifier} is missing a PlayerStart`),t.setWorldPosition(new n(H(o.worldX),H(o.worldY))),t}function Ke(o,t){let e=t[o.iid];for(let i of o.__neighbours){let s=i.levelIid,r=t[s],a=n.diff(r.worldPosition,e.worldPosition),l=c.widthForm(a.x,a.y,r.width,r.height);e.addExits([new bt(l,r.key,l)])}return e.create()}var nt=class{static start(){return Oe(Ge).then(t=>{nt.data=t;let e={};t.levels.forEach(i=>{let s=qe(i);e[s.iid]=s,e[s.key]=s}),t.levels.forEach(i=>{let s=Ke(i,e);nt.levelMap[s.key]=s})}).then(()=>{})}static getLevel(t){return nt.levelMap[t]}},A=nt;lt(A,"hasLoaded",!1),lt(A,"data",null),lt(A,"levelMap",{});var Gt=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=A.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||A.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Ot=class{constructor(){this.levelManager=new Gt,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=Et,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){var e;if(t.isExitEvent()){let i=t.exitTrigger;this.startLevel(this.levelManager.getLevel(i.key,i))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&((e=this.currentPuzzle)==null||e.close())}update(t,e){var i;this.currentLevel.update(t,e),(i=this.currentPuzzle)==null||i.update(t,e)}onInput(t){var e;this.currentLevel.onInput(t),(e=this.currentPuzzle)==null||e.onInput(t)}draw(t){var e;this.currentLevel.draw(t),(e=this.currentPuzzle)==null||e.draw(t)}};var Wt=class{constructor(){this.playMode=new Ot,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var Xe=1/20,jt=class{constructor(){this.screenManager=Q.getInstance(),this.gameModeManager=new Wt,this.inputManager=new Rt(t=>this.onInput(t))}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,Xe);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},je=()=>{A.start().then(()=>{let t=new jt;t.start(),window.app=t}),!ht&&!location.href.includes("localhost")&&Array.from(document.getElementsByTagName("p")).forEach(t=>t.classList.add("visible")),ht||document.getElementById("mobile-controls").remove(),ht&&(document.getElementById("canvas").classList.add("fit-screen"),document.getElementById("mobile-controls").classList.remove("hidden"))};window.onload=()=>{je()};})();
//# sourceMappingURL=index.js.map

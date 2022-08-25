(()=>{var ne=Object.defineProperty;var he=(o,t,e)=>t in o?ne(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var V=(o,t,e)=>(he(o,typeof t!="symbol"?t+"":t,e),e);var ot=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),W=1280,rt=720,H=W,b=rt,R=3;var r=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new r(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new r(t.x+e.x,t.y+e.y)}static diff(t,e){return new r(t.x-e.x,t.y-e.y)}static scale(t,e){return new r(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,s=t.y-e.y;return i*i+s*s}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new r(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var y=(o,t,e)=>Math.min(e,Math.max(o,t)),T=o=>o>0?1:o===0?0:-1;var a=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return r.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return r.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=y(this.position.x,t.x1,t.x2),i=y(this.position.y,t.y1,t.y2);return this.intersectsVector(new r(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},d=class{constructor(t,e,i,s){this.x1=t,this.y1=e,this.x2=i,this.y2=s}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new r((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=y(t.position.x,this.x1,this.x2),i=y(t.position.y,this.y1,this.y2),s=new r(e,i),h=r.diff(t.position,s),n=h.magnitude||1;if(n>=t.radius){let l=r.diff(t.position,this.midpoint),p=this.width/2-Math.abs(l.x),g=this.height/2-Math.abs(l.y);return p<g?new r((p+t.radius)*T(l.x),0):new r(0,(g+t.radius)*T(l.y))}return r.scale(h,(t.radius-n)/n)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new d(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,s){return new d(t,e,t+i,e+s)}static centerForm(t,e,i,s){return new d(t-i,e-s,t+i,e+s)}static aroundPoint(t,e,i){return new d(t.x-e,t.y-i,t.x+e,t.y+i)}};var Ft=.4,qt=.25,E=7/9*b,U="#00ff62c8",nt="#0096ffc8",ht=[[new a(new r(0,0),.33)],[new a(new r(0,0),.33)],[new a(new r(0,.4),.33),new a(new r(0,-.4),.33)],[new a(new r(-.42,.4),.33),new a(new r(.42,.4),.33),new a(new r(0,-.4),.33)],[new a(new r(.4,.4),.33),new a(new r(.4,-.4),.33),new a(new r(-.4,.4),.33),new a(new r(-.4,-.4),.33)],[new a(new r(0,.3),.28),new a(new r(.64,.3),.28),new a(new r(-.64,.3),.28),new a(new r(-.32,-.3),.28),new a(new r(.32,-.3),.28)],[new a(new r(0,.6),.28),new a(new r(.64,.6),.28),new a(new r(-.64,.6),.28),new a(new r(-.32,0),.28),new a(new r(.32,0),.28),new a(new r(0,-.6),.28)],[new a(new r(0,0),.28),new a(new r(.64,0),.28),new a(new r(-.64,0),.28),new a(new r(-.32,-.6),.28),new a(new r(.32,-.6),.28),new a(new r(-.32,.6),.28),new a(new r(.32,.6),.28)],[new a(new r(0,.6),.28),new a(new r(.64,.6),.28),new a(new r(-.64,.6),.28),new a(new r(-.32,0),.28),new a(new r(.32,0),.28),new a(new r(0,-.6),.28),new a(new r(.64,-.6),.28),new a(new r(-.64,-.6),.28)]],Xt=[[d.centerForm(0,0,.33,.33)],[d.centerForm(0,0,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(0,.4,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)],[d.centerForm(-.4,-.4,.33,.33),d.centerForm(.4,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)]];var le="0",K=(o,t)=>o.toString(16).padStart(t,le);var c=Symbol("ctx"),lt=Symbol("canvas"),P=class{constructor(t){if(!(t instanceof HTMLCanvasElement))throw Error("Invalid canvas provided!");this[lt]=t;let e=t.getContext("2d");if(e.imageSmoothingEnabled=!1,!e)throw Error("Unable to get 2d context");this[c]=e,this[c].fillStyle="black",this[c].strokeStyle="black",this.width=this[lt].width,this.height=this[lt].height}fillRect(t,e,i,s){this[c].fillRect(t,e,i,s)}clear(){this[c].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,s){this[c].strokeRect(t,e,i,s)}strokeRectInset(t,e,i,s,h){this.strokeRect(t+h,e+h,i-h*2,s-h*2)}fillEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].fill()}strokeEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].stroke()}drawLine(t,e,i,s){this[c].beginPath(),this[c].moveTo(t,e),this[c].lineTo(i,s),this[c].stroke()}drawQuadratic(t,e,i,s,h,n){this[c].beginPath(),this[c].moveTo(t,e),this[c].quadraticCurveTo(h,n,i,s),this[c].stroke()}scale(t,e){this[c].scale(t,e)}translate(t,e){this[c].translate(t,e)}setColor(t){t!==this[c].fillStyle&&(this[c].fillStyle=t,this[c].strokeStyle=t)}setLineWidth(t){this[c].lineWidth=t}get lineWidth(){return this[c].lineWidth}setLineDash(t){this[c].setLineDash(t)}setColorRGB(t,e,i,s=255){let h=`#${K(t,2)}${K(e,2)}${K(i,2)}${K(s,2)}`;this.setColor(h)}setColorHSLA(t,e,i,s=1){let h=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${s})`;this.setColor(h)}saveTransform(){this[c].save()}restoreTransform(){this[c].restore()}drawImage(t,e,i,s,h,n,l,p,g){let A;if(t instanceof P)A=t[lt];else if(t instanceof Image){if(!t.complete)return;A=t}else throw Error("Drawing something unmanageable");this[c].drawImage(A,e,i,s,h,n,l,p,g)}static fromId(t){let e=document.getElementById(t);return new P(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new P(i)}};var C=Symbol("real-canvas");function ae(){let o=document.getElementById("canvas");return o.setAttribute("width",W),o.setAttribute("height",rt),o}var zt=class{constructor(){let t=new P(ae());if(!(t instanceof P))throw Error("No canvas found!");this[C]=t,this.background=P.fromScratch(1280*3,720*3),this.behindGroundCanvas=P.fromScratch(1280*3,720*3),this.staticWorldCanvas=P.fromScratch(1280*3,720*3),this.dynamicWorldCanvas=P.fromScratch(1280*3,720*3),this.uiCanvas=P.fromScratch(W,rt),this.camera=new r(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[C].drawImage(this.background,this.camera.x,this.camera.y,1280,720,0,0,this[C].width,this[C].height),this[C].drawImage(this.behindGroundCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[C].width,this[C].height),this[C].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[C].width,this[C].height),this[C].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[C].width,this[C].height),this[C].drawImage(this.uiCanvas,0,0,H,b,0,0,this[C].width,this[C].height)}static getInstance(){return this.instance?this.instance:new zt}},J=zt;V(J,"instance",null);var kt={},ce=(o,t)=>`${o}-${t}`,de=(o,t)=>{let e=Math.max(o,t),i=.7,s=.5,h=Math.floor(E/(e+i+s)),n=Math.floor(h*s),l=E-h*e-n,p=l+n+o*h,g=l+n+t*h,A=Math.max((g-p)/2,0),z=Math.max((p-g)/2,0),k=[[z,z+n]],w=z+n;for(let f=0;f<t;f++)k.push([w,w+h]),w+=h;k.push([w,w+l]);let m=[[A,A+l]],I=A+l;for(let f=0;f<o;f++)m.push([I,I+h]),I+=h;m.push([I,I+n]);let st=[];for(let[f,_]of m){let j=[];for(let[oe,re]of k)j.push(new d(oe,f,re,_));st.push(j)}return st},ue=(o,t)=>{let e=ce(o,t);return e in kt||(kt[e]=de(o,t)),kt[e]},Yt=(o,t)=>{let e=ue(o,t);return(i,s)=>e[i==="end"?o+1:i+1][s==="end"?t+1:s+1]};var at=.4,B=class{constructor(t,e,i,s){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=s,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=Yt(e,i);for(let h=0;h<e;h++){let n=[];for(let l=0;l<i;l++)n.push(null),this.elements.push({row:h,col:l,shape:this.positionGetter(h,l).inset(R),isHovered:!1});this.state.push(n)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new r(0,b*t),i=new r((H-E)/2,(b-E)/2);return r.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?U:nt),e.fillRect(0,0,E,E),e.setColor("#222222"),e.fillRect(E/4,E,E/2,E),e.setLineWidth(R*8),e.setLineDash([]),e.strokeRectInset(0,0,E,E,-R*4),e.setColor("#ffffff64"),e.setLineWidth(R),e.strokeRectInset(0,0,E,E,R/2);for(let s of this.elements){s.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),s.shape.stroke(e,R/2);let h=this.state[s.row][s.col],n=s.shape.midpoint;h?(e.setColor("white"),e.fillEllipse(n.x,n.y,s.shape.width*at,s.shape.width*at)):h===!1&&(e.setColor("#ffffff64"),e.setLineDash([R*2,R*2]),e.strokeEllipse(n.x,n.y,s.shape.width*at,s.shape.width*at))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/Ft:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/qt),this.openCloseStatus=y(this.openCloseStatus,0,1),e){let i=r.diff(e.mousePosition,this.uiPosition());for(let s of this.elements)s.isHovered=s.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=r.diff(t.position,this.uiPosition());for(let s of this.elements)if(s.isHovered=s.shape.intersectsPoint(i),s.isHovered){let h=this.state[s.row][s.col];e=!0;let n=null;t.isRightClick()?h===!1?n=null:n=!1:h===!0?n=null:n=!0,this.state[s.row][s.col]=n}}e&&this.onStateChange()}};var ct=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},F=class{constructor(){this.isValid=!1}validate(t){}draw(t){}};var dt=class extends F{constructor(t,e){super(),this.row=t,this.column=e}},ut=class extends dt{constructor(t,e,i){super(t,e),this.mustBeOn=i,this.isValid=!i}validate(t){let e=t[this.row][this.column];this.isValid=!!e==!!this.mustBeOn}draw(t,e){this.isValid?t.setColor("white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height),h=new r(i.x2-s*.15,i.y1+s*.15);this.mustBeOn?t.fillEllipse(h.x,h.y,s*.1,s*.1):(t.setLineWidth(s*.05),t.strokeEllipse(h.x,h.y,s*.075,s*.075))}},pt=class extends dt{constructor(t,e,i){super(t,e),this.desiredCount=i,this.isValid=i===0,this.isCellColoured=!1}*iterateArea(t){for(let e=Math.max(this.row-1,0);e<=Math.min(this.row+1,t.length-1);e++)for(let i=Math.max(this.column-1,0);i<=Math.min(this.column+1,t[e].length-1);i++)yield[e,i]}validate(t){let e=0;for(let[i,s]of this.iterateArea(t))t[i][s]&&e++;this.isValid=e===this.desiredCount,this.isCellColoured=!!t[this.row][this.column]}draw(t,e){this.isValid?t.setColor(this.isCellColoured?U:"white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height)*.25,h=i.midpoint;for(let n of ht[this.desiredCount]){let l=r.add(h,r.scale(n.position,s));this.desiredCount===0?(t.setLineWidth(n.radius*s*.5),t.strokeEllipse(l.x,l.y,n.radius*s*.75,n.radius*s*.75)):t.fillEllipse(l.x,l.y,n.radius*s,n.radius*s)}}};var jt=o=>new r(-o.y,o.x),ft=class extends F{constructor(t,e){super(),this.isRow=t,this.index=e,this.isValid=!1}getRelevantRow(t){return this.isRow?t[this.index]:t.map(e=>e[this.index])}validateRow(t){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(t){let e=this.getRelevantRow(t);this.isValid=this.validateRow(e)}drawInCell(){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(t,e){if(this.isValid?t.setColor("white"):t.setColor("red"),this.isRow){let i=e(this.index,"end");this.drawInCell(t,i.midpoint,i.width/2,!0)}else{let i=e(-1,this.index);this.drawInCell(t,i.midpoint,i.height/2,!1)}}},Z=class extends ft{constructor(t,e,i){super(t,e),this.count=i,this.isValid=i===0}validateRow(t){return t.reduce((i,s)=>s?i+1:i,0)===this.count}drawInCell(t,e,i,s){let h=s?n=>new a(jt(n.position),n.radius):n=>n;for(let n of ht[this.count]){n=h(n);let l=r.add(e,r.scale(n.position,i));this.count===0?(t.setLineWidth(n.radius*i*.5),t.strokeEllipse(l.x,l.y,n.radius*i*.75,n.radius*i*.75)):t.fillEllipse(l.x,l.y,n.radius*i,n.radius*i)}}},q=class extends Z{validateRow(t){let[e]=t.reduce(([i,s],h)=>h&&!s?[i+1,!0]:[i,!!h],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,s){let h=n=>s?jt(n):n;for(let n of Xt[this.count]){let l=r.add(e,r.scale(h(n.midpoint),i)),p=n.width*i;this.drawSquare(t,l,p)}}},$=class extends q{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,s],h)=>!h&&s?[i+1,!1]:[i,!!h],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},Q=class extends ft{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,s){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let h=r.add(e,r.scale(s?new r(-.5,0):new r(0,.5),i));t.fillEllipse(h.x,h.y,.22*i,.22*i);let n=r.add(e,r.diff(e,h)),l=i*.22;t.drawLine(n.x-l,n.y-l,n.x+l,n.y+l),t.drawLine(n.x-l,n.y+l,n.x+l,n.y-l)}};var G=class{constructor(){this.validationItems=[]}addForcedCellValidator(t,e,i){return this.validationItems.push(new ut(t,e,i)),this}addCountAreaValidator(t,e,i){return this.validationItems.push(new pt(t,e,i)),this}addEdgeValidators(t,e,i=Z){t.forEach((s,h)=>{typeof s=="number"&&this.validationItems.push(new i(e,h,s))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,q),this}addRowGroups(t){return this.addEdgeValidators(t,!0,q),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,$),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,$),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new Q(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new Q(!0,i))})}create(){return new ct(this.validationItems)}};var Kt=(o,t)=>{let{rows:e,cols:i}=t,s=new G;return t.columnCounts&&s.addColumnCounts(t.columnCounts),t.rowCounts&&s.addRowCounts(t.rowCounts),t.columnGroups&&s.addColumnGroups(t.columnGroups),t.rowGroups&&s.addRowGroups(t.rowGroups),t.columnBlankGroups&&s.addColumnBlankGroups(t.columnBlankGroups),t.rowBlankGroups&&s.addRowBlankGroups(t.rowBlankGroups),t.columnNoTriple&&s.addColumnNoTriple(t.columnNoTriple),t.rowNoTriple&&s.addRowNoTriple(t.rowNoTriple),t.forcedCells&&t.forcedCells.forEach(h=>{s.addForcedCellValidator(h.row,h.col,h.on)}),t.countAreas&&t.forcedCells.forEach(h=>{s.addCountAreaValidator(h.row,h.col,h.count)}),new B(o,e,i,s.create())};var Jt={1:{rows:1,cols:1,columnCounts:[1],rowCounts:[1]},2:{rows:2,cols:1,columnCounts:[2],rowCounts:[1,1]},3:{rows:2,cols:2,columnCounts:[2,1],rowCounts:[1,2]},4:{rows:3,cols:3,columnCounts:[1,3,2],rowCounts:[1,2,3]},5:{rows:3,cols:3,columnCounts:[2,3,1],rowCounts:[2,3,1]},6:{rows:3,cols:4,columnCounts:[2,1,3,2],rowCounts:[3,4,1]},7:{rows:4,cols:4,columnCounts:[2,4,2,1],rowCounts:[4,1,1,3]},8:{rows:5,cols:5,columnCounts:[2,4,2,3,5],rowCounts:[1,3,5,5,2]}};function pe(o){return o==="4"?new G().addRowCounts([4,3,null]).addColumnGroups([1,null,null,2]).create():(console.error("Cannot find puzzle with id",o),new G().create())}function fe(o){if(o in Jt)return Kt(o,Jt[o]);let t=pe(o);if(o==="4")return new B(o,3,4,t);console.error("Cannot find puzzle with id",o)}var bt=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return fe(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},mt=new bt;var tt=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},wt=class extends tt{constructor(t){super(),this.exitTrigger=t}isExitEvent(){return!0}},X=class extends tt{constructor(t){super(),this.puzzleId=t}isOpenPuzzleEvent(){return!0}},xt=class extends tt{constructor(t){super(),this.puzzleId=t}isClosePuzzleEvent(){return!0}};var me=!1,M=class{constructor(t,e,i,s=[]){this.id=t,this.position=e,this.triggerArea=i,this.prerequisites=s,this.prereqsActive=s.length===0,this.prereqEntities=[],this.isEnabled=!1,this.isAreaActive=!1,this.connectionPoint=this.position,this.outputPoint=this.position}onStart(t){this.findPrerequisites(t)}findPrerequisites(t){return this.prereqEntities.length===this.prerequisites.length?this.prereqEntities:(this.prereqEntities=t.interactibles.filter(e=>this.prerequisites.includes(e.id)),this.prereqEntities)}update(t,e,i){this.prereqsActive=this.findPrerequisites().every(s=>s.isEnabled),this.isAreaActive=this.prereqsActive&&this.triggerArea.intersectsPoint(t.position)}draw(t,e){me&&(t.setColorRGB(255,255,255),t.setLineWidth(.1),t.setLineDash([.2,.2]),this.triggerArea.stroke(t)),e.behindGroundCanvas.setLineWidth(.2);for(let i of this.prereqEntities){e.behindGroundCanvas.setColor(i.isEnabled?"white":"black");let s=r.manhattanDist(i.outputPoint,this.connectionPoint),h=r.lerp(i.outputPoint,this.connectionPoint,.5),n=r.add(h,new r(0,s*.3));e.behindGroundCanvas.drawQuadratic(i.outputPoint.x,i.outputPoint.y,this.connectionPoint.x,this.connectionPoint.y,n.x,n.y)}}onInteract(){}};var yt=class extends M{constructor(t,e,i,s,h,n){super(t,e,i,s),this.puzzleId=h,this.puzzle=mt.getPuzzle(h),this.connectionPoint=r.add(e,new r(0,1.2)),this.outputPoint=r.add(e,new r(n.isFlipped?-1:1,-1.15)),this.config=n}draw(t,e){super.draw(t,e);let i=1,s=1/10;t.setColorRGB(0,0,0),t.fillRect(this.position.x-i/2,this.position.y+i,i,1),t.setLineWidth(s),this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s*1.5)),t.setColorRGB(0,0,0),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s/2);let h=this.config.isFlipped?-1:1;t.fillRect(this.position.x+h*(i-s)-2*s,this.position.y-i-4*s,4*s,4*s),this.puzzle.hasBeenSolvedEver&&(this.isEnabled=!0,t.setColor("white"),t.fillRect(this.position.x+h*(i-s)-s,this.position.y-i-3*s,s*2,s*2)),this.prereqsActive&&(t.setColor(this.puzzle.isSolved?U:nt),t.fillRect(this.position.x-i,this.position.y-i,i*2,i*2));let n=new r(this.position.x-i,this.position.y-i);t.translate(n.x,n.y),t.setColor("white");let l=this.puzzle.state,p=i*2/(3*Math.max(l.length,l[0].length)+1),g=p*(3*l[0].length+1),A=p*(3*l.length+1),z=Math.max(0,(g-A)/2),k=Math.max(0,(A-g)/2);for(let w=0;w<l.length;w++)for(let m=0;m<l[w].length;m++)l[w][m]&&t.fillRect(k+p*(3*m+1),z+p*(3*w+1),p*2,p*2);t.translate(-n.x,-n.y)}onInteract(){return new X(this.puzzleId)}};var Gt=new Image;Gt.src="./img/tileset.png";var Y=new Image;Y.src="./img/entity-set.png";var Et=class extends M{constructor(t,e,i,s){super(t,e,i,s)}update(...t){this.isEnabled?this.isAreaActive=!1:super.update(...t)}draw(t,e){super.draw(t,e);let i=1/10;this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.setLineWidth(i),t.setLineDash([]),t.strokeRectInset(this.position.x-i*3,this.position.y-i*4,i*6,i*8,-i*1.5)),t.drawImage(Y,this.isEnabled?80:40,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}onInteract(){this.isEnabled=!0}};var Ct=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return r.diff(t.position,new r(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var we=Symbol("Up"),xe=Symbol("Down"),ye=Symbol("Left"),Ee=Symbol("Right"),Ce=Symbol("Jump"),ge=Symbol("Interact"),Ie=Symbol("Escape"),u={Down:xe,Escape:Ie,Interact:ge,Jump:Ce,Left:ye,Right:Ee,Up:we};var Zt={" ":u.Jump,escape:u.Escape,esc:u.Escape,Escape:u.Escape,Esc:u.Escape,w:u.Up,a:u.Left,s:u.Down,d:u.Right,e:u.Interact},N=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[u.Right]-+!!this.keyMap[u.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new N({})}},gt=class{constructor(){}isForKey(){return!1}isClick(){return!1}},Nt=class extends gt{constructor(t){super(),this.input=t}isForKey(t){return t===this.input}},It=class extends gt{constructor(t,e){super(),this.position=t,this.isRight=e}isClick(){return!0}isRightClick(){return this.isRight}},Lt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new r(0,0),this.canvas=document.getElementById("canvas")}init(){let t=i=>{this.listener&&this.listener(new Nt(i))};document.addEventListener("keydown",i=>{if(i.repeat)return;let s=Zt[i.key];!s||(this.isButtonDown[s]=!0,t(s))}),document.addEventListener("keyup",i=>{let s=Zt[i.key];!s||(this.isButtonDown[s]=!1)}),document.addEventListener("mousemove",i=>{this.mousePosition=this.toCanvasPosition(i)}),document.addEventListener("click",i=>{this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new It(this.mousePosition,!1))}),document.addEventListener("contextmenu",i=>{i.preventDefault(),this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new It(this.mousePosition,!0))});let e=(i,s)=>{let h=document.getElementById(i);!h||(h.addEventListener("touchstart",n=>{n.preventDefault(),this.isButtonDown[s]=!0,t(s)}),h.addEventListener("touchcancel",n=>{n.preventDefault(),this.isButtonDown[s]=!1}),h.addEventListener("touchend",n=>{n.preventDefault(),this.isButtonDown[s]=!1}))};e("left",u.Left),e("right",u.Right),e("jump",u.Jump),e("down",u.Down),e("escape",u.Escape),e("interact",u.Interact)}toCanvasPosition(t){return r.scale(new r(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*H/W)}getInputState(){return new N(this.isButtonDown,this.mousePosition)}};var Pt=1280/32,At=class{constructor(t,e,i,s,h,n,l,p){this.key=t,this.levelGrid=s,this.objects=h,this.player=n,this.exitTriggers=l,this.interactibles=p,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t,this.interactibles.forEach(e=>e.onStart(this))}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){this.player.update(t,this.isPlayerActive()?e:N.empty(),this),this.interactibles.forEach(i=>{i.update(this.player,t,this)}),this.interactingWith?.isAreaActive||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new xt(this.interactingWith.id))}onInput(t){if(this.isPlayerActive()&&this.player.onInput(t),t.input===u.Interact){let e=this.interactibles.find(i=>i.isAreaActive);if(e){let i=e.onInteract();i&&i instanceof X&&(this.interactingWith=e,this.emitEvent(i))}}else t.input===u.Escape&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new wt(t))}clampCamera(t){return new r(y(t.x,0,this.width-32),y(t.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new r(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(r.lerp(this.camera,this.getNaiveCamera(r.add(this.player.position,new r(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(Pt,Pt),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(t.background.setColor("#6400c8"),t.background.fillRect(0,0,t.background.width,t.background.height),this.withSetupCanvas(t.staticWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i=0;i<this.height;i++)for(let s=0;s<this.width;s++){let h=this.levelGrid[i][s];h&&e.drawImage(Gt,(h-1)*10,0,10,10,s,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i of this.objects)i.draw(e);this.withSetupCanvas(t.behindGroundCanvas,()=>{t.behindGroundCanvas.clear(),this.interactibles.forEach(i=>{i.draw(e,t)})}),this.player.draw(e)}),t.setCamera(new r(Math.floor(this.camera.x*Pt),Math.floor(this.camera.y*Pt)))}};var L={SOLID:1,LEDGE:2,VENT:3,LADDER:4,isSolid:o=>o===L.SOLID,isGrounding:o=>o===L.SOLID||o===L.LEDGE};var Vt=class{constructor(){this.grid=[],this.shortGrid=[]}innerGet(t,e,i,s){return t in s||(s[t]=[]),e in s[t]||(s[t][e]=d.widthForm(e,t,1,i?.2:1)),s[t][e]}get(t,e,i=!1){return this.innerGet(t,e,i,i?this.shortGrid:this.grid)}},Qt=new Vt;var et=.8,Wt=16,Ht=Wt/.3,Le=2*Ht,Pe=1.8*Ht,Ae=4,ee=.6,ie=4*Ae/ee,ve=ie,te=2*ie/ee,Se=.1,vt=class{constructor(t){this.position=t,this.collider=new a(t,et),this.velocity=new r(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.inAirFor=1}onInput(t){t.isForKey(u.Jump)&&(this.wantsToJump=!0)}collideWithBlock(t,e,i){let s=!this.isDropping&&t===L.LEDGE&&this.velocity.y>=0&&this.position.y<e.y1,h=this.collider.intersectsRectangle(e);if(h&&t===L.LEDGE&&(this.contactingAnyLedge=!0,this.velocity.y<0&&this.position.y>=e.y1&&(this.isDropping=!0)),L.isSolid(t)||s){if(h){this.isColliding=!0;let n=e.uncollideCircle(this.collider);this.velocity.add(r.scale(n,1/i)),n.x>0&&n.y===0?this.velocity.x=Math.max(0,this.velocity.x):n.x<0&&n.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),n.y>0&&n.x===0?this.velocity.y=Math.max(0,this.velocity.y):n.y<0&&n.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(n)}return this.collider.intersectsRectangle(e)}}update(t,e,i){let s=(f,_)=>i.levelGrid[Math.floor(_)]?.[Math.floor(f)],h=(f,_)=>{let j=s(f,_);if(j)return{type:s(f,_),rect:Qt.get(Math.floor(_),Math.floor(f),j===L.LEDGE)}},n=e.getHorizontalAxis(),l=new r(n*Ht,0);e.isPressed(u.Down)&&(this.isDropping=!0);let p=this.position.y+this.collider.radius,g=s(this.position.x,p),A=this.isDropping?L.isSolid(g):L.isGrounding(g),z=s(this.position.x,this.position.y),k=A&&p===Math.floor(p);if(this.isGrounded=k||i.objects.some(f=>this.collider.isKissingBelow(f)),this.isGrounded)this.inAirFor=0,T(n)?T(n)!==T(this.velocity.x)&&(l.x+=-Pe*T(this.velocity.x)):l.x+=-Math.min(Math.abs(this.velocity.x/t),Le)*T(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,z===L.VENT){let f=this.velocity.y>0?.75:1.1;l.y-=te*f}else l.y+=te;this.inAirFor<Se&&this.wantsToJump&&(this.velocity.y=-ve),this.velocity.add(r.scale(l,t)),this.velocity.x=y(this.velocity.x,-Wt,Wt);let w=r.scale(this.velocity,t);w.x=y(w.x,-et,et),w.y=y(w.y,-et,et),this.position.add(w),this.isColliding=!1;let{x:m,y:I}=this.position,st=[h(m,I),h(m,I+1),h(m,I-1),h(m-1,I),h(m+1,I),h(m-1,I-1),h(m+1,I-1),h(m-1,I+1),h(m+1,I+1)].filter(f=>!!f);this.contactingAnyLedge=!1,st.concat(i.objects.map(f=>({type:L.SOLID,rect:f}))).forEach(({type:f,rect:_})=>{this.collideWithBlock(f,_,t)}),this.wantsToJump=!1,this.isDropping=this.isDropping&&this.contactingAnyLedge}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var St=class{constructor(t,e,i,s){this.key=t,this.iid=e,this.width=i,this.height=s,this.levelGrid=[],this.objects=[],this.playerPosition=new r(16,9),this.exitTriggers=[],this.interactibles=[],this.worldPosition=new r(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new At(this.key,this.width,this.height,this.levelGrid,this.objects,new vt(this.playerPosition),this.exitTriggers,this.interactibles)}};var _e={intersectsPoint:()=>!1,stroke:()=>null},Re=.2,_t=class extends M{constructor(t,e,i,s=4){super(t,e,_e,i),this.closedness=i.length===0?0:1,this.connectionPoint=r.add(e,new r(0,-1.8)),this.headCollider=d.centerForm(this.position.x,this.position.y-1.8,.6,.4),this.doorCollider=d.widthForm(this.position.x-.5,this.position.y-2,1,s),this.fullHeight=s}update(t,e,i){super.update(...arguments);let s=e/Re*(this.prereqsActive?-1:1);this.doorCollider.y2=y(this.doorCollider.y2+s,this.doorCollider.y1,this.doorCollider.y1+this.fullHeight),t.collideWithBlock(L.SOLID,this.headCollider,e),this.doorCollider.y2>this.headCollider.y2&&t.collideWithBlock(L.SOLID,this.doorCollider,e)}draw(t,e){super.draw(t,e);let i=this.doorCollider.height;i>0&&(t.setColor("black"),t.fillRect(this.position.x-.5,this.position.y-2,1,i),t.setColor("white"),t.fillRect(this.position.x-.5,this.position.y-2+Math.max(0,i-1/10),1,1/10),t.drawImage(Y,120,Math.max(40-10*i,20),40,Math.min(10*i,20)-.1,this.position.x-2,this.position.y-2+Math.max(i-2,0),4,Math.min(i,2)-.01)),t.drawImage(Y,this.prereqsActive?140:128,0,12,6,this.position.x-6/10,this.position.y-2,12/10,6/10)}};var Te="./data/world.json";function De(o){return fetch(o).then(t=>t.json())}function Rt(o,t,e="__identifier"){return o.find(i=>i[e]===t)}function se(o,t){return Rt(o.layerInstances,t)}function O(o){return Math.floor(o/10)}function Me(o){return O(o[0])+1}function Ut(o){return(Rt(o.fieldInstances,"prerequisites")?.__value||[]).map(e=>e.entityIid)}function ze(o){let t=o.iid,e=Rt(o.fieldInstances,"key");e||console.warn("Puzzle with no key in:",level.identifier);let i=new r(o.__grid[0]+2,o.__grid[1]+2),s={isFlipped:Rt(o.fieldInstances,"isFlipped").__value};return new yt(t,i,d.aroundPoint(i,2,2),Ut(o),e.__value,s)}function ke(o){let t=o.iid;t||console.warn("Switch with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new Et(t,e,d.aroundPoint(e,2,2),Ut(o))}function be(o){let t=o.iid;t||console.warn("Door with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new _t(t,e,Ut(o),o.height/10)}function Ge(o){let t=new St(o.identifier,o.iid,O(o.pxWid),O(o.pxHei));t.makeGridSpace();let e=se(o,"Solid");for(let n of e.gridTiles){let l=O(n.px[0]),p=O(n.px[1]),g=Me(n.src);t.setCell(p,l,g)}let i=!1;return se(o,"EntityLayer").entityInstances.forEach(n=>{switch(n.__identifier){case"PlayerStart":t.setPlayerPos(new r(n.__grid[0],n.__grid[1])),i=!0;break;case"PuzzleScreen":t.addInteractibles([ze(n)]);break;case"Switch":t.addInteractibles([ke(n)]);break;case"Door":t.addInteractibles([be(n)]);break;default:console.warn("Processing unknown entity type:",n.__identifier)}}),i||console.warn(`Level ${o.identifier} is missing a PlayerStart`),t.setWorldPosition(new r(O(o.worldX),O(o.worldY))),t}function Ne(o,t){let e=t[o.iid];for(let i of o.__neighbours){let s=i.levelIid,h=t[s],n=r.diff(h.worldPosition,e.worldPosition),l=d.widthForm(n.x,n.y,h.width,h.height);e.addExits([new Ct(l,h.key,l)])}return e.create()}var it=class{static start(){return De(Te).then(t=>{it.data=t;let e={};t.levels.forEach(i=>{let s=Ge(i);e[s.iid]=s,e[s.key]=s}),t.levels.forEach(i=>{let s=Ne(i,e);it.levelMap[s.key]=s})}).then(()=>{})}static getLevel(t){return it.levelMap[t]}},S=it;V(S,"hasLoaded",!1),V(S,"data",null),V(S,"levelMap",{});var Tt=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=S.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||S.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Dt=class{constructor(){this.levelManager=new Tt,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=mt,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){if(t.isExitEvent()){let e=t.exitTrigger;this.startLevel(this.levelManager.getLevel(e.key,e))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&this.currentPuzzle?.close()}update(t,e){this.currentLevel.update(t,e),this.currentPuzzle?.update(t,e)}onInput(t){this.currentLevel.onInput(t),this.currentPuzzle?.onInput(t)}draw(t){this.currentLevel.draw(t),this.currentPuzzle?.draw(t)}};var Mt=class{constructor(){this.playMode=new Dt,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var Oe=1/20,Bt=class{constructor(){this.screenManager=J.getInstance(),this.gameModeManager=new Mt,this.inputManager=new Lt(t=>this.onInput(t))}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,Oe);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},Ve=()=>{S.start().then(()=>{let t=new Bt;t.start(),window.app=t}),!ot&&!location.href.includes("localhost")&&Array.from(document.getElementsByTagName("p")).forEach(t=>t.classList.add("visible")),ot||document.getElementById("mobile-controls").remove(),ot&&(document.getElementById("canvas").classList.add("fit-screen"),document.getElementById("mobile-controls").classList.remove("hidden"))};window.onload=()=>{Ve()};})();
//# sourceMappingURL=index.js.map

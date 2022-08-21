(()=>{var ie=Object.defineProperty;var se=(o,t,e)=>t in o?ie(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var O=(o,t,e)=>(se(o,typeof t!="symbol"?t+"":t,e),e);var r=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new r(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new r(t.x+e.x,t.y+e.y)}static diff(t,e){return new r(t.x-e.x,t.y-e.y)}static scale(t,e){return new r(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,s=t.y-e.y;return i*i+s*s}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new r(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var g=(o,t,e)=>Math.min(e,Math.max(o,t)),D=o=>o>0?1:o===0?0:-1;var l=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return r.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return r.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=g(this.position.x,t.x1,t.x2),i=g(this.position.y,t.y1,t.y2);return this.intersectsVector(new r(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},d=class{constructor(t,e,i,s){this.x1=t,this.y1=e,this.x2=i,this.y2=s}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new r((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=g(t.position.x,this.x1,this.x2),i=g(t.position.y,this.y1,this.y2),s=new r(e,i),n=r.diff(t.position,s),h=n.magnitude||1;if(h>=t.radius){let a=r.diff(t.position,this.midpoint),u=this.width/2-Math.abs(a.x),x=this.height/2-Math.abs(a.y);return u<x?new r((u+t.radius)*D(a.x),0):new r(0,(x+t.radius)*D(a.y))}return r.scale(n,(t.radius-h)/h)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new d(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,s){return new d(t,e,t+i,e+s)}static centerForm(t,e,i,s){return new d(t-i,e-s,t+i,e+s)}static aroundPoint(t,e,i){return new d(t.x-e,t.y-i,t.x+e,t.y+i)}};var Ft=.4,qt=.25,m=7/9*720,W="#00ff62c8",rt="#0096ffc8",nt=[[new l(new r(0,0),.33)],[new l(new r(0,0),.33)],[new l(new r(0,.4),.33),new l(new r(0,-.4),.33)],[new l(new r(-.42,.4),.33),new l(new r(.42,.4),.33),new l(new r(0,-.4),.33)],[new l(new r(.4,.4),.33),new l(new r(.4,-.4),.33),new l(new r(-.4,.4),.33),new l(new r(-.4,-.4),.33)],[new l(new r(0,.3),.28),new l(new r(.64,.3),.28),new l(new r(-.64,.3),.28),new l(new r(-.32,-.3),.28),new l(new r(.32,-.3),.28)],[new l(new r(0,.6),.28),new l(new r(.64,.6),.28),new l(new r(-.64,.6),.28),new l(new r(-.32,0),.28),new l(new r(.32,0),.28),new l(new r(0,-.6),.28)],[new l(new r(0,0),.28),new l(new r(.64,0),.28),new l(new r(-.64,0),.28),new l(new r(-.32,-.6),.28),new l(new r(.32,-.6),.28),new l(new r(-.32,.6),.28),new l(new r(.32,.6),.28)],[new l(new r(0,.6),.28),new l(new r(.64,.6),.28),new l(new r(-.64,.6),.28),new l(new r(-.32,0),.28),new l(new r(.32,0),.28),new l(new r(0,-.6),.28),new l(new r(.64,-.6),.28),new l(new r(-.64,-.6),.28)]],Bt=[[d.centerForm(0,0,.33,.33)],[d.centerForm(0,0,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(0,.4,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)],[d.centerForm(-.4,-.4,.33,.33),d.centerForm(.4,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)]];var oe="0",Y=(o,t)=>o.toString(16).padStart(t,oe);var c=Symbol("ctx"),ht=Symbol("canvas"),C=class{constructor(t){if(!(t instanceof HTMLCanvasElement))throw Error("Invalid canvas provided!");this[ht]=t;let e=t.getContext("2d");if(e.imageSmoothingEnabled=!1,!e)throw Error("Unable to get 2d context");this[c]=e,this[c].fillStyle="black",this[c].strokeStyle="black",this.width=this[ht].width,this.height=this[ht].height}fillRect(t,e,i,s){this[c].fillRect(t,e,i,s)}clear(){this[c].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,s){this[c].strokeRect(t,e,i,s)}strokeRectInset(t,e,i,s,n){this.strokeRect(t+n,e+n,i-n*2,s-n*2)}fillEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].fill()}strokeEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].stroke()}drawLine(t,e,i,s){this[c].beginPath(),this[c].moveTo(t,e),this[c].lineTo(i,s),this[c].stroke()}drawQuadratic(t,e,i,s,n,h){this[c].beginPath(),this[c].moveTo(t,e),this[c].quadraticCurveTo(n,h,i,s),this[c].stroke()}scale(t,e){this[c].scale(t,e)}translate(t,e){this[c].translate(t,e)}setColor(t){t!==this[c].fillStyle&&(this[c].fillStyle=t,this[c].strokeStyle=t)}setLineWidth(t){this[c].lineWidth=t}get lineWidth(){return this[c].lineWidth}setLineDash(t){this[c].setLineDash(t)}setColorRGB(t,e,i,s=255){let n=`#${Y(t,2)}${Y(e,2)}${Y(i,2)}${Y(s,2)}`;this.setColor(n)}setColorHSLA(t,e,i,s=1){let n=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${s})`;this.setColor(n)}saveTransform(){this[c].save()}restoreTransform(){this[c].restore()}drawImage(t,e,i,s,n,h,a,u,x){let T;if(t instanceof C)T=t[ht];else if(t instanceof Image){if(!t.complete)return;T=t}else throw Error("Drawing something unmanageable");this[c].drawImage(T,e,i,s,n,h,a,u,x)}static fromId(t){let e=document.getElementById(t);return new C(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new C(i)}};var w=Symbol("real-canvas");function re(){let o=document.getElementById("canvas");return o.setAttribute("width",1280),o.setAttribute("height",720),o}var zt=class{constructor(){let t=new C(re());if(!(t instanceof C))throw Error("No canvas found!");this[w]=t,this.background=C.fromScratch(1280*2,720*2),this.behindGroundCanvas=C.fromScratch(1280*2,720*2),this.staticWorldCanvas=C.fromScratch(1280*2,720*2),this.dynamicWorldCanvas=C.fromScratch(1280*2,720*2),this.uiCanvas=C.fromScratch(1280,720),this.camera=new r(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[w].drawImage(this.background,this.camera.x,this.camera.y,1280,720,0,0,this[w].width,this[w].height),this[w].drawImage(this.behindGroundCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[w].width,this[w].height),this[w].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[w].width,this[w].height),this[w].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[w].width,this[w].height),this[w].drawImage(this.uiCanvas,0,0,1280,720,0,0,this[w].width,this[w].height)}static getInstance(){return this.instance?this.instance:new zt}},j=zt;O(j,"instance",null);var Mt={},ne=(o,t)=>`${o}-${t}`,he=(o,t)=>{let e=Math.max(o,t),i=.7,s=.5,n=Math.floor(m/(e+i+s)),h=Math.floor(n*s),a=m-n*e-h,u=a+h+o*n,x=a+h+t*n,T=Math.max((x-u)/2,0),B=Math.max((u-x)/2,0),X=[[B,B+h]],L=B+h;for(let v=0;v<t;v++)X.push([L,L+n]),L+=n;X.push([L,L+a]);let I=[[T,T+a]],y=T+a;for(let v=0;v<o;v++)I.push([y,y+n]),y+=n;I.push([y,y+h]);let it=[];for(let[v,f]of I){let E=[];for(let[st,ot]of X)E.push(new d(st,v,ot,f));it.push(E)}return it},ae=(o,t)=>{let e=ne(o,t);return e in Mt||(Mt[e]=he(o,t)),Mt[e]},Yt=(o,t)=>{let e=ae(o,t);return(i,s)=>e[i==="end"?o+1:i+1][s==="end"?t+1:s+1]};var lt=.4,N=class{constructor(t,e,i,s){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=s,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=Yt(e,i);for(let n=0;n<e;n++){let h=[];for(let a=0;a<i;a++)h.push(null),this.elements.push({row:n,col:a,shape:this.positionGetter(n,a).inset(3),isHovered:!1});this.state.push(h)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new r(0,720*t),i=new r((1280-m)/2,(720-m)/2);return r.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?W:rt),e.fillRect(0,0,m,m),e.setColor("#222222"),e.fillRect(m/4,m,m/2,m),e.setLineWidth(3*8),e.setLineDash([]),e.strokeRectInset(0,0,m,m,-3*4),e.setColor("#ffffff64"),e.setLineWidth(3),e.strokeRectInset(0,0,m,m,3/2);for(let s of this.elements){s.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),s.shape.stroke(e,3/2);let n=this.state[s.row][s.col],h=s.shape.midpoint;n?(e.setColor("white"),e.fillEllipse(h.x,h.y,s.shape.width*lt,s.shape.width*lt)):n===!1&&(e.setColor("#ffffff64"),e.setLineDash([3*2,3*2]),e.strokeEllipse(h.x,h.y,s.shape.width*lt,s.shape.width*lt))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/Ft:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/qt),this.openCloseStatus=g(this.openCloseStatus,0,1),e){let i=r.diff(e.mousePosition,this.uiPosition());for(let s of this.elements)s.isHovered=s.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=r.diff(t.position,this.uiPosition());for(let s of this.elements)if(s.isHovered=s.shape.intersectsPoint(i),s.isHovered){let n=this.state[s.row][s.col];e=!0;let h=null;t.isRightClick()?n===!1?h=null:h=!1:n===!0?h=null:h=!0,this.state[s.row][s.col]=h}}e&&this.onStateChange()}};var ct=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},H=class{constructor(){this.isValid=!1}validate(t){}draw(t){}};var dt=class extends H{constructor(t,e){super(),this.row=t,this.column=e}},ut=class extends dt{constructor(t,e,i){super(t,e),this.mustBeOn=i,this.isValid=!i}validate(t){let e=t[this.row][this.column];this.isValid=!!e==!!this.mustBeOn}draw(t,e){this.isValid?t.setColor("white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height),n=new r(i.x2-s*.15,i.y1+s*.15);this.mustBeOn?t.fillEllipse(n.x,n.y,s*.1,s*.1):(t.setLineWidth(s*.05),t.strokeEllipse(n.x,n.y,s*.075,s*.075))}},pt=class extends dt{constructor(t,e,i){super(t,e),this.desiredCount=i,this.isValid=i===0,this.isCellColoured=!1}validate(t){let e=0;for(let i=Math.max(this.row-1,0);i<=Math.min(this.row+1,t.length-1);i++)for(let s=Math.max(this.column-1,0);s<=Math.min(this.column+1,t[i].length-1);s++)t[i][s]&&e++;this.isValid=e===this.desiredCount,this.isCellColoured=!!t[this.row][this.column]}draw(t,e){this.isValid?t.setColor(this.isCellColoured?W:"white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height)*.25,n=i.midpoint;for(let h of nt[this.desiredCount]){let a=r.add(n,r.scale(h.position,s));this.desiredCount===0?(t.setLineWidth(h.radius*s*.5),t.strokeEllipse(a.x,a.y,h.radius*s*.75,h.radius*s*.75)):t.fillEllipse(a.x,a.y,h.radius*s,h.radius*s)}}};var jt=o=>new r(-o.y,o.x),ft=class extends H{constructor(t,e){super(),this.isRow=t,this.index=e,this.isValid=!1}getRelevantRow(t){return this.isRow?t[this.index]:t.map(e=>e[this.index])}validateRow(t){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(t){let e=this.getRelevantRow(t);this.isValid=this.validateRow(e)}drawInCell(){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(t,e){if(this.isValid?t.setColor("white"):t.setColor("red"),this.isRow){let i=e(this.index,"end");this.drawInCell(t,i.midpoint,i.width/2,!0)}else{let i=e(-1,this.index);this.drawInCell(t,i.midpoint,i.height/2,!1)}}},Z=class extends ft{constructor(t,e,i){super(t,e),this.count=i,this.isValid=i===0}validateRow(t){return t.reduce((i,s)=>s?i+1:i,0)===this.count}drawInCell(t,e,i,s){let n=s?h=>new l(jt(h.position),h.radius):h=>h;for(let h of nt[this.count]){h=n(h);let a=r.add(e,r.scale(h.position,i));this.count===0?(t.setLineWidth(h.radius*i*.5),t.strokeEllipse(a.x,a.y,h.radius*i*.75,h.radius*i*.75)):t.fillEllipse(a.x,a.y,h.radius*i,h.radius*i)}}},U=class extends Z{validateRow(t){let[e]=t.reduce(([i,s],n)=>n&&!s?[i+1,!0]:[i,!!n],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,s){let n=h=>s?jt(h):h;for(let h of Bt[this.count]){let a=r.add(e,r.scale(n(h.midpoint),i)),u=h.width*i;this.drawSquare(t,a,u)}}},J=class extends U{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,s],n)=>!n&&s?[i+1,!1]:[i,!!n],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},$=class extends ft{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,s){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let n=r.add(e,r.scale(s?new r(-.5,0):new r(0,.5),i));t.fillEllipse(n.x,n.y,.22*i,.22*i);let h=r.add(e,r.diff(e,n)),a=i*.22;t.drawLine(h.x-a,h.y-a,h.x+a,h.y+a),t.drawLine(h.x-a,h.y+a,h.x+a,h.y-a)}};var b=class{constructor(){this.validationItems=[]}addForcedCellValidator(t,e,i){return this.validationItems.push(new ut(t,e,i)),this}addCountAreaValidator(t,e,i){return this.validationItems.push(new pt(t,e,i)),this}addEdgeValidators(t,e,i=Z){t.forEach((s,n)=>{typeof s=="number"&&this.validationItems.push(new i(e,n,s))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,U),this}addRowGroups(t){return this.addEdgeValidators(t,!0,U),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,J),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,J),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!0,i))})}create(){return new ct(this.validationItems)}};function le(o){return o==="1"?new b().addColumnCounts([1,3,1]).addRowCounts([2,2,1]).create():o==="2"?new b().addColumnCounts([4,3,2,1]).addRowCounts([1,2,3,4]).create():o==="3"?new b().addColumnCounts([1,1,1]).addRowCounts([1,1,1]).create():o==="4"?new b().addRowCounts([4,3,null]).addColumnGroups([1,null,null,2]).create():(console.error("Cannot find puzzle with id",o),new b().create())}function ce(o){let t=le(o);if(o==="1")return new N(o,3,3,t);if(o==="2")return new N(o,4,4,t);if(o==="3")return new N(o,3,3,t);if(o==="4")return new N(o,3,4,t);console.error("Cannot find puzzle with id",o)}var bt=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return ce(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},mt=new bt;var Q=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},wt=class extends Q{constructor(t){super(),this.exitTrigger=t}isExitEvent(){return!0}},F=class extends Q{constructor(t){super(),this.puzzleId=t}isOpenPuzzleEvent(){return!0}},xt=class extends Q{constructor(t){super(),this.puzzleId=t}isClosePuzzleEvent(){return!0}};var de=!1,q=class{constructor(t,e,i,s=[]){this.id=t,this.position=e,this.triggerArea=i,this.prerequisites=s,this.prereqsActive=s.length===0,this.prereqEntities=[],this.isEnabled=!1,this.isAreaActive=!1,this.connectionPoint=this.position}onStart(t){this.findPrerequisites(t)}findPrerequisites(t){return this.prereqEntities.length===this.prerequisites.length?this.prereqEntities:(this.prereqEntities=t.interactibles.filter(e=>this.prerequisites.includes(e.id)),this.prereqEntities)}update(t,e,i){this.prereqsActive=this.findPrerequisites().every(s=>s.isEnabled),this.isAreaActive=this.prereqsActive&&this.triggerArea.intersectsPoint(t)}draw(t,e){de&&(t.setColorRGB(255,255,255),t.setLineWidth(.1),t.setLineDash([.2,.2]),this.triggerArea.stroke(t)),e.behindGroundCanvas.setLineWidth(.2);for(let i of this.prereqEntities){e.behindGroundCanvas.setColor(i.isEnabled?"white":"black");let s=r.manhattanDist(i.connectionPoint,this.connectionPoint),n=r.lerp(i.connectionPoint,this.connectionPoint,.5),h=r.add(n,new r(0,s*.3));e.behindGroundCanvas.drawQuadratic(i.connectionPoint.x,i.connectionPoint.y,this.connectionPoint.x,this.connectionPoint.y,h.x,h.y)}}onInteract(){}};var yt=class extends q{constructor(t,e,i,s){super(t,e,i,s),this.puzzle=mt.getPuzzle(this.id),this.connectionPoint=r.add(e,new r(0,1.2))}draw(t,e){super.draw(t,e);let i=1,s=1/10;t.setColorRGB(0,0,0),t.fillRect(this.position.x-i/2,this.position.y+i,i,2),t.setLineWidth(s),this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s*1.5)),t.setColorRGB(0,0,0),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s/2),t.fillRect(this.position.x+i-3*s,this.position.y-i-4*s,4*s,4*s),this.puzzle.hasBeenSolvedEver&&(this.isEnabled=!0,t.setColor("white"),t.fillRect(this.position.x+i-2*s,this.position.y-i-3*s,s*2,s*2)),this.prereqsActive&&(t.setColor(this.puzzle.isSolved?W:rt),t.fillRect(this.position.x-i,this.position.y-i,i*2,i*2));let n=new r(this.position.x-i,this.position.y-i);t.translate(n.x,n.y),t.setColor("white");let h=this.puzzle.state,a=s;for(let u=0;u<h.length;u++)for(let x=0;x<h[u].length;x++)h[u][x]&&t.fillRect(a+x*2*(i-a)/h[u].length,a+u*2*(i-a)/h.length,s*2,s*2);t.translate(-n.x,-n.y)}onInteract(){return new F(this.id)}};var Nt=new Image;Nt.src="./img/tileset.png";var kt=new Image;kt.src="./img/entity-set.png";var Et=class extends q{constructor(t,e,i){super(t,e,i)}update(...t){this.isEnabled?this.isAreaActive=!1:super.update(...t)}draw(t,e){super.draw(t,e);let i=1/10;this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x-i*3,this.position.y-i*4,i*6,i*8,-i*1.5)),t.drawImage(kt,this.isEnabled?80:40,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}onInteract(){this.isEnabled=!0}};var gt=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return r.diff(t.position,new r(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var ue=Symbol("Up"),pe=Symbol("Down"),fe=Symbol("Left"),me=Symbol("Right"),we=Symbol("Jump"),xe=Symbol("Interact"),ye=Symbol("Escape"),p={Down:pe,Escape:ye,Interact:xe,Jump:we,Left:fe,Right:me,Up:ue};var Kt={" ":p.Jump,escape:p.Escape,esc:p.Escape,Escape:p.Escape,Esc:p.Escape,w:p.Up,a:p.Left,s:p.Down,d:p.Right,e:p.Interact},k=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[p.Right]-+!!this.keyMap[p.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new k({})}},Ct=class{constructor(){}isForKey(){return!1}isClick(){return!1}},Gt=class extends Ct{constructor(t){super(),this.input=t}isForKey(t){return t===this.input}},It=class extends Ct{constructor(t,e){super(),this.position=t,this.isRight=e}isClick(){return!0}isRightClick(){return this.isRight}},Lt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new r(0,0),this.canvas=document.getElementById("canvas")}init(){document.addEventListener("keydown",t=>{if(t.repeat)return;let e=Kt[t.key];!e||(this.isButtonDown[e]=!0,this.listener&&this.listener(new Gt(e)))}),document.addEventListener("keyup",t=>{let e=Kt[t.key];!e||(this.isButtonDown[e]=!1)}),document.addEventListener("mousemove",t=>{this.mousePosition=this.toCanvasPosition(t)}),document.addEventListener("click",t=>{this.mousePosition=this.toCanvasPosition(t),this.listener&&this.listener(new It(this.mousePosition,!1))}),document.addEventListener("contextmenu",t=>{t.preventDefault(),this.mousePosition=this.toCanvasPosition(t),this.listener&&this.listener(new It(this.mousePosition,!0))})}toCanvasPosition(t){return r.scale(new r(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*1280/1280)}getInputState(){return new k(this.isButtonDown,this.mousePosition)}};var At=1280/32,vt=class{constructor(t,e,i,s,n,h,a,u){this.key=t,this.levelGrid=s,this.objects=n,this.player=h,this.exitTriggers=a,this.interactibles=u,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t,this.interactibles.forEach(e=>e.onStart(this))}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){this.player.update(t,this.isPlayerActive()?e:k.empty(),this),this.interactibles.forEach(i=>{i.update(this.player.position,t,this)}),this.interactingWith?.isAreaActive||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new xt(this.interactingWith.id))}onInput(t){if(this.isPlayerActive()&&this.player.onInput(t),t.input===p.Interact){let e=this.interactibles.find(i=>i.isAreaActive);if(e){let i=e.onInteract();i&&i instanceof F&&(this.interactingWith=e,this.emitEvent(i))}}else t.input===p.Escape&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new wt(t))}clampCamera(t){return new r(g(t.x,0,this.width-32),g(t.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new r(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(r.lerp(this.camera,this.getNaiveCamera(r.add(this.player.position,new r(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(At,At),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(t.background.setColor("#6400c8"),t.background.fillRect(0,0,t.background.width,t.background.height),this.withSetupCanvas(t.staticWorldCanvas,e=>{e.setColor("red");for(let i of this.objects)i.draw(e);e.setColor("black");for(let i=0;i<this.height;i++)for(let s=0;s<this.width;s++){let n=this.levelGrid[i][s];n&&e.drawImage(Nt,(n-1)*10,0,10,10,s,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),this.withSetupCanvas(t.behindGroundCanvas,()=>{t.behindGroundCanvas.clear(),this.interactibles.forEach(i=>{i.draw(e,t)})}),this.player.draw(e)}),t.setCamera(new r(Math.floor(this.camera.x*At),Math.floor(this.camera.y*At)))}};var _={SOLID:1,LEDGE:2,VENT:3,LADDER:4,isSolid:o=>o===_.SOLID,isGrounding:o=>o===_.SOLID||o===_.LEDGE};var Vt=class{constructor(){this.grid=[]}get(t,e){return t in this.grid||(this.grid[t]=[]),e in this.grid[t]||(this.grid[t][e]=d.widthForm(e,t,1,1)),this.grid[t][e]}},Jt=new Vt;var tt=.8,Wt=16,Ht=Wt/.3,Ee=2*Ht,ge=1.8*Ht,Ce=4,Qt=.6,te=4*Ce/Qt,Ie=te,$t=2*te/Qt,Le=.1,Pt=class{constructor(t){this.position=t,this.collider=new l(t,tt),this.velocity=new r(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.inAirFor=1}onInput(t){t.isForKey(p.Jump)&&(this.wantsToJump=!0)}update(t,e,i){let s=(f,E)=>i.levelGrid[Math.floor(E)]?.[Math.floor(f)],n=(f,E)=>{if(s(f,E))return{type:s(f,E),rect:Jt.get(Math.floor(E),Math.floor(f))}},h=e.getHorizontalAxis(),a=new r(h*Ht,0);e.isPressed(p.Down)&&(this.isDropping=!0);let u=this.position.y+this.collider.radius,x=s(this.position.x,u),T=this.isDropping?_.isSolid(x):_.isGrounding(x),B=s(this.position.x,this.position.y),X=T&&u===Math.floor(u);if(this.isGrounded=X||i.objects.some(f=>this.collider.isKissingBelow(f)),this.isGrounded)this.inAirFor=0,D(h)?D(h)!==D(this.velocity.x)&&(a.x+=-ge*D(this.velocity.x)):a.x+=-Math.min(Math.abs(this.velocity.x/t),Ee)*D(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,B===_.VENT){let f=this.velocity.y>0?.75:1.1;a.y-=$t*f}else a.y+=$t;this.inAirFor<Le&&this.wantsToJump&&(this.velocity.y=-Ie),this.velocity.add(r.scale(a,t)),this.velocity.x=g(this.velocity.x,-Wt,Wt);let L=r.scale(this.velocity,t);L.x=g(L.x,-tt,tt),L.y=g(L.y,-tt,tt),this.position.add(L),this.isColliding=!1;let{x:I,y}=this.position,it=[n(I,y),n(I,y+1),n(I,y-1),n(I-1,y),n(I+1,y),n(I-1,y-1),n(I+1,y-1),n(I-1,y+1),n(I+1,y+1)].filter(f=>!!f),v=!1;it.forEach(({type:f,rect:E})=>{let st=!this.isDropping&&f===_.LEDGE&&this.velocity.y>=0&&this.position.y<E.y1,ot=this.collider.intersectsRectangle(E);if(ot&&f===_.LEDGE&&(v=!0,this.velocity.y<0&&this.position.y>=E.y1&&(this.isDropping=!0)),_.isSolid(f)||st){if(ot){this.isColliding=!0;let P=E.uncollideCircle(this.collider);this.velocity.add(r.scale(P,1/t)),P.x>0&&P.y===0?this.velocity.x=Math.max(0,this.velocity.x):P.x<0&&P.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),P.y>0&&P.x===0?this.velocity.y=Math.max(0,this.velocity.y):P.y<0&&P.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(P)}return this.collider.intersectsRectangle(E)}}),this.wantsToJump=!1,this.isDropping=this.isDropping&&v}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var St=class{constructor(t,e,i,s){this.key=t,this.iid=e,this.width=i,this.height=s,this.levelGrid=[],this.objects=[],this.playerPosition=new r(16,9),this.exitTriggers=[],this.interactibles=[],this.worldPosition=new r(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new vt(this.key,this.width,this.height,this.levelGrid,this.objects,new Pt(this.playerPosition),this.exitTriggers,this.interactibles)}};var Ae="./data/world.json";function ve(o){return fetch(o).then(t=>t.json())}function _t(o,t){return o.find(e=>e.__identifier===t)}function ee(o,t){return _t(o.layerInstances,t)}function G(o){return Math.floor(o/10)}function Pe(o){return G(o[0])+1}function Se(o){let t=_t(o.fieldInstances,"key");t||console.warn("Puzzle with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2),i=_t(o.fieldInstances,"prerequisites")?.__value||[];return new yt(t.__value,e,d.aroundPoint(e,2,2),i)}function _e(o){let t=_t(o.fieldInstances,"id");t||console.warn("Switch with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new Et(t.__value,e,d.aroundPoint(e,2,2))}function Re(o){let t=new St(o.identifier,o.iid,G(o.pxWid),G(o.pxHei));t.makeGridSpace();let e=ee(o,"Solid");for(let n of e.gridTiles){let h=G(n.px[0]),a=G(n.px[1]),u=Pe(n.src);t.setCell(a,h,u)}let i=!1;return ee(o,"EntityLayer").entityInstances.forEach(n=>{switch(n.__identifier){case"PlayerStart":t.setPlayerPos(new r(n.__grid[0],n.__grid[1])),i=!0;break;case"PuzzleScreen":t.addInteractibles([Se(n)]);break;case"Switch":t.addInteractibles([_e(n)]);break;default:console.warn("Processing unknown entity type:",n.__identifier)}}),i||console.warn(`Level ${o.identifier} is missing a PlayerStart`),t.setWorldPosition(new r(G(o.worldX),G(o.worldY))),t}function Te(o,t){let e=t[o.iid];for(let i of o.__neighbours){let s=i.levelIid,n=t[s],h=r.diff(n.worldPosition,e.worldPosition),a=d.widthForm(h.x,h.y,n.width,n.height);e.addExits([new gt(a,n.key,a)])}return e.create()}var et=class{static start(){return ve(Ae).then(t=>{et.data=t;let e={};t.levels.forEach(i=>{let s=Re(i);e[s.iid]=s,e[s.key]=s}),t.levels.forEach(i=>{let s=Te(i,e);et.levelMap[s.key]=s})}).then(()=>{})}static getLevel(t){return et.levelMap[t]}},R=et;O(R,"hasLoaded",!1),O(R,"data",null),O(R,"levelMap",{});var Rt=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=R.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||R.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Tt=class{constructor(){this.levelManager=new Rt,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=mt,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){if(t.isExitEvent()){let e=t.exitTrigger;this.startLevel(this.levelManager.getLevel(e.key,e))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&this.currentPuzzle?.close()}update(t,e){this.currentLevel.update(t,e),this.currentPuzzle?.update(t,e)}onInput(t){this.currentLevel.onInput(t),this.currentPuzzle?.onInput(t)}draw(t){this.currentLevel.draw(t),this.currentPuzzle?.draw(t)}};var Dt=class{constructor(){this.playMode=new Tt,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var De=1/20,Ut=class{constructor(){this.screenManager=j.getInstance(),this.gameModeManager=new Dt,this.inputManager=new Lt(t=>this.onInput(t))}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,De);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},ze=()=>{R.start().then(()=>{let t=new Ut;t.start(),window.app=t}),location.href.includes("localhost")||Array.from(document.getElementsByTagName("p")).forEach(t=>t.classList.add("visible"))};window.onload=()=>{ze()};})();
//# sourceMappingURL=index.js.map

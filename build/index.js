(()=>{var oe=Object.defineProperty;var re=(o,t,e)=>t in o?oe(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var W=(o,t,e)=>(re(o,typeof t!="symbol"?t+"":t,e),e);var ot=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),H=1280,rt=720,U=H,O=rt,D=3;var r=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new r(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new r(t.x+e.x,t.y+e.y)}static diff(t,e){return new r(t.x-e.x,t.y-e.y)}static scale(t,e){return new r(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,s=t.y-e.y;return i*i+s*s}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new r(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var x=(o,t,e)=>Math.min(e,Math.max(o,t)),T=o=>o>0?1:o===0?0:-1;var l=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return r.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return r.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=x(this.position.x,t.x1,t.x2),i=x(this.position.y,t.y1,t.y2);return this.intersectsVector(new r(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},d=class{constructor(t,e,i,s){this.x1=t,this.y1=e,this.x2=i,this.y2=s}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new r((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=x(t.position.x,this.x1,this.x2),i=x(t.position.y,this.y1,this.y2),s=new r(e,i),n=r.diff(t.position,s),h=n.magnitude||1;if(h>=t.radius){let a=r.diff(t.position,this.midpoint),f=this.width/2-Math.abs(a.x),L=this.height/2-Math.abs(a.y);return f<L?new r((f+t.radius)*T(a.x),0):new r(0,(L+t.radius)*T(a.y))}return r.scale(n,(t.radius-h)/h)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new d(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,s){return new d(t,e,t+i,e+s)}static centerForm(t,e,i,s){return new d(t-i,e-s,t+i,e+s)}static aroundPoint(t,e,i){return new d(t.x-e,t.y-i,t.x+e,t.y+i)}};var Ft=.4,qt=.25,y=7/9*O,B="#00ff62c8",nt="#0096ffc8",ht=[[new l(new r(0,0),.33)],[new l(new r(0,0),.33)],[new l(new r(0,.4),.33),new l(new r(0,-.4),.33)],[new l(new r(-.42,.4),.33),new l(new r(.42,.4),.33),new l(new r(0,-.4),.33)],[new l(new r(.4,.4),.33),new l(new r(.4,-.4),.33),new l(new r(-.4,.4),.33),new l(new r(-.4,-.4),.33)],[new l(new r(0,.3),.28),new l(new r(.64,.3),.28),new l(new r(-.64,.3),.28),new l(new r(-.32,-.3),.28),new l(new r(.32,-.3),.28)],[new l(new r(0,.6),.28),new l(new r(.64,.6),.28),new l(new r(-.64,.6),.28),new l(new r(-.32,0),.28),new l(new r(.32,0),.28),new l(new r(0,-.6),.28)],[new l(new r(0,0),.28),new l(new r(.64,0),.28),new l(new r(-.64,0),.28),new l(new r(-.32,-.6),.28),new l(new r(.32,-.6),.28),new l(new r(-.32,.6),.28),new l(new r(.32,.6),.28)],[new l(new r(0,.6),.28),new l(new r(.64,.6),.28),new l(new r(-.64,.6),.28),new l(new r(-.32,0),.28),new l(new r(.32,0),.28),new l(new r(0,-.6),.28),new l(new r(.64,-.6),.28),new l(new r(-.64,-.6),.28)]],Xt=[[d.centerForm(0,0,.33,.33)],[d.centerForm(0,0,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(0,.4,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)],[d.centerForm(-.4,-.4,.33,.33),d.centerForm(.4,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)]];var ne="0",j=(o,t)=>o.toString(16).padStart(t,ne);var c=Symbol("ctx"),at=Symbol("canvas"),C=class{constructor(t){if(!(t instanceof HTMLCanvasElement))throw Error("Invalid canvas provided!");this[at]=t;let e=t.getContext("2d");if(e.imageSmoothingEnabled=!1,!e)throw Error("Unable to get 2d context");this[c]=e,this[c].fillStyle="black",this[c].strokeStyle="black",this.width=this[at].width,this.height=this[at].height}fillRect(t,e,i,s){this[c].fillRect(t,e,i,s)}clear(){this[c].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,s){this[c].strokeRect(t,e,i,s)}strokeRectInset(t,e,i,s,n){this.strokeRect(t+n,e+n,i-n*2,s-n*2)}fillEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].fill()}strokeEllipse(t,e,i,s){this[c].beginPath(),this[c].ellipse(t,e,i,s,0,0,2*Math.PI),this[c].stroke()}drawLine(t,e,i,s){this[c].beginPath(),this[c].moveTo(t,e),this[c].lineTo(i,s),this[c].stroke()}drawQuadratic(t,e,i,s,n,h){this[c].beginPath(),this[c].moveTo(t,e),this[c].quadraticCurveTo(n,h,i,s),this[c].stroke()}scale(t,e){this[c].scale(t,e)}translate(t,e){this[c].translate(t,e)}setColor(t){t!==this[c].fillStyle&&(this[c].fillStyle=t,this[c].strokeStyle=t)}setLineWidth(t){this[c].lineWidth=t}get lineWidth(){return this[c].lineWidth}setLineDash(t){this[c].setLineDash(t)}setColorRGB(t,e,i,s=255){let n=`#${j(t,2)}${j(e,2)}${j(i,2)}${j(s,2)}`;this.setColor(n)}setColorHSLA(t,e,i,s=1){let n=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${s})`;this.setColor(n)}saveTransform(){this[c].save()}restoreTransform(){this[c].restore()}drawImage(t,e,i,s,n,h,a,f,L){let P;if(t instanceof C)P=t[at];else if(t instanceof Image){if(!t.complete)return;P=t}else throw Error("Drawing something unmanageable");this[c].drawImage(P,e,i,s,n,h,a,f,L)}static fromId(t){let e=document.getElementById(t);return new C(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new C(i)}};var E=Symbol("real-canvas");function he(){let o=document.getElementById("canvas");return o.setAttribute("width",H),o.setAttribute("height",rt),o}var zt=class{constructor(){let t=new C(he());if(!(t instanceof C))throw Error("No canvas found!");this[E]=t,this.background=C.fromScratch(1280*2,720*2),this.behindGroundCanvas=C.fromScratch(1280*2,720*2),this.staticWorldCanvas=C.fromScratch(1280*2,720*2),this.dynamicWorldCanvas=C.fromScratch(1280*2,720*2),this.uiCanvas=C.fromScratch(H,rt),this.camera=new r(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[E].drawImage(this.background,this.camera.x,this.camera.y,1280,720,0,0,this[E].width,this[E].height),this[E].drawImage(this.behindGroundCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[E].width,this[E].height),this[E].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[E].width,this[E].height),this[E].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[E].width,this[E].height),this[E].drawImage(this.uiCanvas,0,0,U,O,0,0,this[E].width,this[E].height)}static getInstance(){return this.instance?this.instance:new zt}},K=zt;W(K,"instance",null);var bt={},ae=(o,t)=>`${o}-${t}`,le=(o,t)=>{let e=Math.max(o,t),i=.7,s=.5,n=Math.floor(y/(e+i+s)),h=Math.floor(n*s),a=y-n*e-h,f=a+h+o*n,L=a+h+t*n,P=Math.max((L-f)/2,0),k=Math.max((f-L)/2,0),A=[[k,k+h]],w=k+h;for(let p=0;p<t;p++)A.push([w,w+n]),w+=n;A.push([w,w+a]);let v=[[P,P+a]],g=P+a;for(let p=0;p<o;p++)v.push([g,g+n]),g+=n;v.push([g,g+h]);let st=[];for(let[p,R]of v){let Mt=[];for(let[ie,se]of A)Mt.push(new d(ie,p,se,R));st.push(Mt)}return st},ce=(o,t)=>{let e=ae(o,t);return e in bt||(bt[e]=le(o,t)),bt[e]},Yt=(o,t)=>{let e=ce(o,t);return(i,s)=>e[i==="end"?o+1:i+1][s==="end"?t+1:s+1]};var lt=.4,N=class{constructor(t,e,i,s){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=s,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=Yt(e,i);for(let n=0;n<e;n++){let h=[];for(let a=0;a<i;a++)h.push(null),this.elements.push({row:n,col:a,shape:this.positionGetter(n,a).inset(D),isHovered:!1});this.state.push(h)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new r(0,O*t),i=new r((U-y)/2,(O-y)/2);return r.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?B:nt),e.fillRect(0,0,y,y),e.setColor("#222222"),e.fillRect(y/4,y,y/2,y),e.setLineWidth(D*8),e.setLineDash([]),e.strokeRectInset(0,0,y,y,-D*4),e.setColor("#ffffff64"),e.setLineWidth(D),e.strokeRectInset(0,0,y,y,D/2);for(let s of this.elements){s.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),s.shape.stroke(e,D/2);let n=this.state[s.row][s.col],h=s.shape.midpoint;n?(e.setColor("white"),e.fillEllipse(h.x,h.y,s.shape.width*lt,s.shape.width*lt)):n===!1&&(e.setColor("#ffffff64"),e.setLineDash([D*2,D*2]),e.strokeEllipse(h.x,h.y,s.shape.width*lt,s.shape.width*lt))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/Ft:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/qt),this.openCloseStatus=x(this.openCloseStatus,0,1),e){let i=r.diff(e.mousePosition,this.uiPosition());for(let s of this.elements)s.isHovered=s.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=r.diff(t.position,this.uiPosition());for(let s of this.elements)if(s.isHovered=s.shape.intersectsPoint(i),s.isHovered){let n=this.state[s.row][s.col];e=!0;let h=null;t.isRightClick()?n===!1?h=null:h=!1:n===!0?h=null:h=!0,this.state[s.row][s.col]=h}}e&&this.onStateChange()}};var ct=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},F=class{constructor(){this.isValid=!1}validate(t){}draw(t){}};var dt=class extends F{constructor(t,e){super(),this.row=t,this.column=e}},ut=class extends dt{constructor(t,e,i){super(t,e),this.mustBeOn=i,this.isValid=!i}validate(t){let e=t[this.row][this.column];this.isValid=!!e==!!this.mustBeOn}draw(t,e){this.isValid?t.setColor("white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height),n=new r(i.x2-s*.15,i.y1+s*.15);this.mustBeOn?t.fillEllipse(n.x,n.y,s*.1,s*.1):(t.setLineWidth(s*.05),t.strokeEllipse(n.x,n.y,s*.075,s*.075))}},pt=class extends dt{constructor(t,e,i){super(t,e),this.desiredCount=i,this.isValid=i===0,this.isCellColoured=!1}*iterateArea(t){for(let e=Math.max(this.row-1,0);e<=Math.min(this.row+1,t.length-1);e++)for(let i=Math.max(this.column-1,0);i<=Math.min(this.column+1,t[e].length-1);i++)yield[e,i]}validate(t){let e=0;for(let[i,s]of this.iterateArea(t))t[i][s]&&e++;this.isValid=e===this.desiredCount,this.isCellColoured=!!t[this.row][this.column]}draw(t,e){this.isValid?t.setColor(this.isCellColoured?B:"white"):t.setColor("red");let i=e(this.row,this.column),s=Math.min(i.width,i.height)*.25,n=i.midpoint;for(let h of ht[this.desiredCount]){let a=r.add(n,r.scale(h.position,s));this.desiredCount===0?(t.setLineWidth(h.radius*s*.5),t.strokeEllipse(a.x,a.y,h.radius*s*.75,h.radius*s*.75)):t.fillEllipse(a.x,a.y,h.radius*s,h.radius*s)}}};var jt=o=>new r(-o.y,o.x),ft=class extends F{constructor(t,e){super(),this.isRow=t,this.index=e,this.isValid=!1}getRelevantRow(t){return this.isRow?t[this.index]:t.map(e=>e[this.index])}validateRow(t){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(t){let e=this.getRelevantRow(t);this.isValid=this.validateRow(e)}drawInCell(){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(t,e){if(this.isValid?t.setColor("white"):t.setColor("red"),this.isRow){let i=e(this.index,"end");this.drawInCell(t,i.midpoint,i.width/2,!0)}else{let i=e(-1,this.index);this.drawInCell(t,i.midpoint,i.height/2,!1)}}},J=class extends ft{constructor(t,e,i){super(t,e),this.count=i,this.isValid=i===0}validateRow(t){return t.reduce((i,s)=>s?i+1:i,0)===this.count}drawInCell(t,e,i,s){let n=s?h=>new l(jt(h.position),h.radius):h=>h;for(let h of ht[this.count]){h=n(h);let a=r.add(e,r.scale(h.position,i));this.count===0?(t.setLineWidth(h.radius*i*.5),t.strokeEllipse(a.x,a.y,h.radius*i*.75,h.radius*i*.75)):t.fillEllipse(a.x,a.y,h.radius*i,h.radius*i)}}},q=class extends J{validateRow(t){let[e]=t.reduce(([i,s],n)=>n&&!s?[i+1,!0]:[i,!!n],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,s){let n=h=>s?jt(h):h;for(let h of Xt[this.count]){let a=r.add(e,r.scale(n(h.midpoint),i)),f=h.width*i;this.drawSquare(t,a,f)}}},Z=class extends q{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,s],n)=>!n&&s?[i+1,!1]:[i,!!n],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},$=class extends ft{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,s){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let n=r.add(e,r.scale(s?new r(-.5,0):new r(0,.5),i));t.fillEllipse(n.x,n.y,.22*i,.22*i);let h=r.add(e,r.diff(e,n)),a=i*.22;t.drawLine(h.x-a,h.y-a,h.x+a,h.y+a),t.drawLine(h.x-a,h.y+a,h.x+a,h.y-a)}};var z=class{constructor(){this.validationItems=[]}addForcedCellValidator(t,e,i){return this.validationItems.push(new ut(t,e,i)),this}addCountAreaValidator(t,e,i){return this.validationItems.push(new pt(t,e,i)),this}addEdgeValidators(t,e,i=J){t.forEach((s,n)=>{typeof s=="number"&&this.validationItems.push(new i(e,n,s))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,q),this}addRowGroups(t){return this.addEdgeValidators(t,!0,q),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,Z),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,Z),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!0,i))})}create(){return new ct(this.validationItems)}};function de(o){return o==="1"?new z().addColumnCounts([1]).addRowCounts([1]).create():o==="2"?new z().addColumnCounts([4,3,2,1]).addRowCounts([1,2,3,4]).create():o==="3"?new z().addColumnCounts([1,1,1]).addRowCounts([1,1,1]).create():o==="4"?new z().addRowCounts([4,3,null]).addColumnGroups([1,null,null,2]).create():(console.error("Cannot find puzzle with id",o),new z().create())}function ue(o){let t=de(o);if(o==="1")return new N(o,1,1,t);if(o==="2")return new N(o,4,4,t);if(o==="3")return new N(o,3,3,t);if(o==="4")return new N(o,3,4,t);console.error("Cannot find puzzle with id",o)}var kt=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return ue(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},mt=new kt;var Q=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},wt=class extends Q{constructor(t){super(),this.exitTrigger=t}isExitEvent(){return!0}},X=class extends Q{constructor(t){super(),this.puzzleId=t}isOpenPuzzleEvent(){return!0}},xt=class extends Q{constructor(t){super(),this.puzzleId=t}isClosePuzzleEvent(){return!0}};var pe=!1,b=class{constructor(t,e,i,s=[]){this.id=t,this.position=e,this.triggerArea=i,this.prerequisites=s,this.prereqsActive=s.length===0,this.prereqEntities=[],this.isEnabled=!1,this.isAreaActive=!1,this.connectionPoint=this.position}onStart(t){this.findPrerequisites(t)}findPrerequisites(t){return this.prereqEntities.length===this.prerequisites.length?this.prereqEntities:(this.prereqEntities=t.interactibles.filter(e=>this.prerequisites.includes(e.id)),this.prereqEntities)}update(t,e,i){this.prereqsActive=this.findPrerequisites().every(s=>s.isEnabled),this.isAreaActive=this.prereqsActive&&this.triggerArea.intersectsPoint(t.position)}draw(t,e){pe&&(t.setColorRGB(255,255,255),t.setLineWidth(.1),t.setLineDash([.2,.2]),this.triggerArea.stroke(t)),e.behindGroundCanvas.setLineWidth(.2);for(let i of this.prereqEntities){e.behindGroundCanvas.setColor(i.isEnabled?"white":"black");let s=r.manhattanDist(i.connectionPoint,this.connectionPoint),n=r.lerp(i.connectionPoint,this.connectionPoint,.5),h=r.add(n,new r(0,s*.3));e.behindGroundCanvas.drawQuadratic(i.connectionPoint.x,i.connectionPoint.y,this.connectionPoint.x,this.connectionPoint.y,h.x,h.y)}}onInteract(){}};var yt=class extends b{constructor(t,e,i,s){super(t,e,i,s),this.puzzle=mt.getPuzzle(this.id),this.connectionPoint=r.add(e,new r(0,1.2))}draw(t,e){super.draw(t,e);let i=1,s=1/10;t.setColorRGB(0,0,0),t.fillRect(this.position.x-i/2,this.position.y+i,i,2),t.setLineWidth(s),this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s*1.5)),t.setColorRGB(0,0,0),t.strokeRectInset(this.position.x,this.position.y,0,0,-i-s/2),t.fillRect(this.position.x+i-3*s,this.position.y-i-4*s,4*s,4*s),this.puzzle.hasBeenSolvedEver&&(this.isEnabled=!0,t.setColor("white"),t.fillRect(this.position.x+i-2*s,this.position.y-i-3*s,s*2,s*2)),this.prereqsActive&&(t.setColor(this.puzzle.isSolved?B:nt),t.fillRect(this.position.x-i,this.position.y-i,i*2,i*2));let n=new r(this.position.x-i,this.position.y-i);t.translate(n.x,n.y),t.setColor("white");let h=this.puzzle.state,a=i*2/(3*Math.max(h.length,h[0].length)+1),f=a*(3*h[0].length+1),L=a*(3*h.length+1),P=Math.max(0,(f-L)/2),k=Math.max(0,(L-f)/2);for(let A=0;A<h.length;A++)for(let w=0;w<h[A].length;w++)h[A][w]&&t.fillRect(k+a*(3*w+1),P+a*(3*A+1),a*2,a*2);t.translate(-n.x,-n.y)}onInteract(){return new X(this.id)}};var Ot=new Image;Ot.src="./img/tileset.png";var Y=new Image;Y.src="./img/entity-set.png";var Et=class extends b{constructor(t,e,i,s){super(t,e,i,s)}update(...t){this.isEnabled?this.isAreaActive=!1:super.update(...t)}draw(t,e){super.draw(t,e);let i=1/10;this.isAreaActive&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x-i*3,this.position.y-i*4,i*6,i*8,-i*1.5)),t.drawImage(Y,this.isEnabled?80:40,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}onInteract(){this.isEnabled=!0}};var gt=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return r.diff(t.position,new r(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var fe=Symbol("Up"),me=Symbol("Down"),we=Symbol("Left"),xe=Symbol("Right"),ye=Symbol("Jump"),Ee=Symbol("Interact"),ge=Symbol("Escape"),u={Down:me,Escape:ge,Interact:Ee,Jump:ye,Left:we,Right:xe,Up:fe};var Kt={" ":u.Jump,escape:u.Escape,esc:u.Escape,Escape:u.Escape,Esc:u.Escape,w:u.Up,a:u.Left,s:u.Down,d:u.Right,e:u.Interact},G=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[u.Right]-+!!this.keyMap[u.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new G({})}},Ct=class{constructor(){}isForKey(){return!1}isClick(){return!1}},Nt=class extends Ct{constructor(t){super(),this.input=t}isForKey(t){return t===this.input}},It=class extends Ct{constructor(t,e){super(),this.position=t,this.isRight=e}isClick(){return!0}isRightClick(){return this.isRight}},Lt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new r(0,0),this.canvas=document.getElementById("canvas")}init(){let t=i=>{this.listener&&this.listener(new Nt(i))};document.addEventListener("keydown",i=>{if(i.repeat)return;let s=Kt[i.key];!s||(this.isButtonDown[s]=!0,t(s))}),document.addEventListener("keyup",i=>{let s=Kt[i.key];!s||(this.isButtonDown[s]=!1)}),document.addEventListener("mousemove",i=>{this.mousePosition=this.toCanvasPosition(i)}),document.addEventListener("click",i=>{this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new It(this.mousePosition,!1))}),document.addEventListener("contextmenu",i=>{i.preventDefault(),this.mousePosition=this.toCanvasPosition(i),this.listener&&this.listener(new It(this.mousePosition,!0))});let e=(i,s)=>{let n=document.getElementById(i);!n||(n.addEventListener("touchstart",h=>{h.preventDefault(),this.isButtonDown[s]=!0,t(s)}),n.addEventListener("touchcancel",h=>{h.preventDefault(),this.isButtonDown[s]=!1}),n.addEventListener("touchend",h=>{h.preventDefault(),this.isButtonDown[s]=!1}))};e("left",u.Left),e("right",u.Right),e("jump",u.Jump),e("down",u.Down),e("escape",u.Escape),e("interact",u.Interact)}toCanvasPosition(t){return r.scale(new r(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*U/H)}getInputState(){return new G(this.isButtonDown,this.mousePosition)}};var vt=1280/32,Pt=class{constructor(t,e,i,s,n,h,a,f){this.key=t,this.levelGrid=s,this.objects=n,this.player=h,this.exitTriggers=a,this.interactibles=f,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t,this.interactibles.forEach(e=>e.onStart(this))}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){this.player.update(t,this.isPlayerActive()?e:G.empty(),this),this.interactibles.forEach(i=>{i.update(this.player,t,this)}),this.interactingWith?.isAreaActive||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new xt(this.interactingWith.id))}onInput(t){if(this.isPlayerActive()&&this.player.onInput(t),t.input===u.Interact){let e=this.interactibles.find(i=>i.isAreaActive);if(e){let i=e.onInteract();i&&i instanceof X&&(this.interactingWith=e,this.emitEvent(i))}}else t.input===u.Escape&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new wt(t))}clampCamera(t){return new r(x(t.x,0,this.width-32),x(t.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new r(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(r.lerp(this.camera,this.getNaiveCamera(r.add(this.player.position,new r(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(vt,vt),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(t.background.setColor("#6400c8"),t.background.fillRect(0,0,t.background.width,t.background.height),this.withSetupCanvas(t.staticWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i=0;i<this.height;i++)for(let s=0;s<this.width;s++){let n=this.levelGrid[i][s];n&&e.drawImage(Ot,(n-1)*10,0,10,10,s,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i of this.objects)i.draw(e);this.withSetupCanvas(t.behindGroundCanvas,()=>{t.behindGroundCanvas.clear(),this.interactibles.forEach(i=>{i.draw(e,t)})}),this.player.draw(e)}),t.setCamera(new r(Math.floor(this.camera.x*vt),Math.floor(this.camera.y*vt)))}};var I={SOLID:1,LEDGE:2,VENT:3,LADDER:4,isSolid:o=>o===I.SOLID,isGrounding:o=>o===I.SOLID||o===I.LEDGE};var Vt=class{constructor(){this.grid=[]}get(t,e){return t in this.grid||(this.grid[t]=[]),e in this.grid[t]||(this.grid[t][e]=d.widthForm(e,t,1,1)),this.grid[t][e]}},Zt=new Vt;var tt=.8,Wt=16,Ht=Wt/.3,Ce=2*Ht,Ie=1.8*Ht,Le=4,Qt=.6,te=4*Le/Qt,ve=te,$t=2*te/Qt,Pe=.1,At=class{constructor(t){this.position=t,this.collider=new l(t,tt),this.velocity=new r(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.inAirFor=1}onInput(t){t.isForKey(u.Jump)&&(this.wantsToJump=!0)}collideWithBlock(t,e,i){let s=!this.isDropping&&t===I.LEDGE&&this.velocity.y>=0&&this.position.y<e.y1,n=this.collider.intersectsRectangle(e);if(n&&t===I.LEDGE&&(this.contactingAnyLedge=!0,this.velocity.y<0&&this.position.y>=e.y1&&(this.isDropping=!0)),I.isSolid(t)||s){if(n){this.isColliding=!0;let h=e.uncollideCircle(this.collider);this.velocity.add(r.scale(h,1/i)),h.x>0&&h.y===0?this.velocity.x=Math.max(0,this.velocity.x):h.x<0&&h.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),h.y>0&&h.x===0?this.velocity.y=Math.max(0,this.velocity.y):h.y<0&&h.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(h)}return this.collider.intersectsRectangle(e)}}update(t,e,i){let s=(p,R)=>i.levelGrid[Math.floor(R)]?.[Math.floor(p)],n=(p,R)=>{if(s(p,R))return{type:s(p,R),rect:Zt.get(Math.floor(R),Math.floor(p))}},h=e.getHorizontalAxis(),a=new r(h*Ht,0);e.isPressed(u.Down)&&(this.isDropping=!0);let f=this.position.y+this.collider.radius,L=s(this.position.x,f),P=this.isDropping?I.isSolid(L):I.isGrounding(L),k=s(this.position.x,this.position.y),A=P&&f===Math.floor(f);if(this.isGrounded=A||i.objects.some(p=>this.collider.isKissingBelow(p)),this.isGrounded)this.inAirFor=0,T(h)?T(h)!==T(this.velocity.x)&&(a.x+=-Ie*T(this.velocity.x)):a.x+=-Math.min(Math.abs(this.velocity.x/t),Ce)*T(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,k===I.VENT){let p=this.velocity.y>0?.75:1.1;a.y-=$t*p}else a.y+=$t;this.inAirFor<Pe&&this.wantsToJump&&(this.velocity.y=-ve),this.velocity.add(r.scale(a,t)),this.velocity.x=x(this.velocity.x,-Wt,Wt);let w=r.scale(this.velocity,t);w.x=x(w.x,-tt,tt),w.y=x(w.y,-tt,tt),this.position.add(w),this.isColliding=!1;let{x:v,y:g}=this.position,st=[n(v,g),n(v,g+1),n(v,g-1),n(v-1,g),n(v+1,g),n(v-1,g-1),n(v+1,g-1),n(v-1,g+1),n(v+1,g+1)].filter(p=>!!p);this.contactingAnyLedge=!1,st.concat(i.objects.map(p=>({type:I.SOLID,rect:p}))).forEach(({type:p,rect:R})=>{this.collideWithBlock(p,R,t)}),this.wantsToJump=!1,this.isDropping=this.isDropping&&this.contactingAnyLedge}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var _t=class{constructor(t,e,i,s){this.key=t,this.iid=e,this.width=i,this.height=s,this.levelGrid=[],this.objects=[],this.playerPosition=new r(16,9),this.exitTriggers=[],this.interactibles=[],this.worldPosition=new r(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new Pt(this.key,this.width,this.height,this.levelGrid,this.objects,new At(this.playerPosition),this.exitTriggers,this.interactibles)}};var Ae={intersectsPoint:()=>!1,stroke:()=>null},_e=1,St=class extends b{constructor(t,e,i){super(t,e,Ae,i),this.closedness=i.length===0?0:1,this.connectionPoint=r.add(e,new r(0,-1.8)),this.headCollider=d.centerForm(this.position.x,this.position.y-1.8,.6,.4),this.doorCollider=d.widthForm(this.position.x-.5,this.position.y-2,1,4)}update(t,e,i){super.update(...arguments);let s=e/_e*(this.prereqsActive?-1:1);this.doorCollider.y2=x(this.doorCollider.y2+s,this.doorCollider.y1,this.doorCollider.y1+4),t.collideWithBlock(I.SOLID,this.headCollider,e),t.collideWithBlock(I.SOLID,this.doorCollider,e)}draw(t,e){super.draw(t,e);let i=this.doorCollider.height;if(i>0){let s=Math.floor(10*i)/10,n=i-s;t.drawImage(Y,0,40+(40-10*s),10*4,10*s,this.position.x-2,this.position.y-2+n,4,s)}t.drawImage(Y,this.isEnabled?160:120,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}};var Se="./data/world.json";function Re(o){return fetch(o).then(t=>t.json())}function it(o,t){return o.find(e=>e.__identifier===t)}function ee(o,t){return it(o.layerInstances,t)}function V(o){return Math.floor(o/10)}function De(o){return V(o[0])+1}function Ut(o){return it(o.fieldInstances,"prerequisites")?.__value||[]}function Te(o){let t=it(o.fieldInstances,"key");t||console.warn("Puzzle with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new yt(t.__value,e,d.aroundPoint(e,2,2),Ut(o))}function Me(o){let t=it(o.fieldInstances,"id");t||console.warn("Switch with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new Et(t.__value,e,d.aroundPoint(e,2,2),Ut(o))}function ze(o){let t=it(o.fieldInstances,"id");t||console.warn("Door with no key in:",level.identifier);let e=new r(o.__grid[0]+2,o.__grid[1]+2);return new St(t.__value,e,Ut(o))}function be(o){let t=new _t(o.identifier,o.iid,V(o.pxWid),V(o.pxHei));t.makeGridSpace();let e=ee(o,"Solid");for(let n of e.gridTiles){let h=V(n.px[0]),a=V(n.px[1]),f=De(n.src);t.setCell(a,h,f)}let i=!1;return ee(o,"EntityLayer").entityInstances.forEach(n=>{switch(n.__identifier){case"PlayerStart":t.setPlayerPos(new r(n.__grid[0],n.__grid[1])),i=!0;break;case"PuzzleScreen":t.addInteractibles([Te(n)]);break;case"Switch":t.addInteractibles([Me(n)]);break;case"Door":t.addInteractibles([ze(n)]);break;default:console.warn("Processing unknown entity type:",n.__identifier)}}),i||console.warn(`Level ${o.identifier} is missing a PlayerStart`),t.setWorldPosition(new r(V(o.worldX),V(o.worldY))),t}function ke(o,t){let e=t[o.iid];for(let i of o.__neighbours){let s=i.levelIid,n=t[s],h=r.diff(n.worldPosition,e.worldPosition),a=d.widthForm(h.x,h.y,n.width,n.height);e.addExits([new gt(a,n.key,a)])}return e.create()}var et=class{static start(){return Re(Se).then(t=>{et.data=t;let e={};t.levels.forEach(i=>{let s=be(i);e[s.iid]=s,e[s.key]=s}),t.levels.forEach(i=>{let s=ke(i,e);et.levelMap[s.key]=s})}).then(()=>{})}static getLevel(t){return et.levelMap[t]}},S=et;W(S,"hasLoaded",!1),W(S,"data",null),W(S,"levelMap",{});var Rt=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=S.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||S.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Dt=class{constructor(){this.levelManager=new Rt,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=mt,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){if(t.isExitEvent()){let e=t.exitTrigger;this.startLevel(this.levelManager.getLevel(e.key,e))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&this.currentPuzzle?.close()}update(t,e){this.currentLevel.update(t,e),this.currentPuzzle?.update(t,e)}onInput(t){this.currentLevel.onInput(t),this.currentPuzzle?.onInput(t)}draw(t){this.currentLevel.draw(t),this.currentPuzzle?.draw(t)}};var Tt=class{constructor(){this.playMode=new Dt,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var Oe=1/20,Bt=class{constructor(){this.screenManager=K.getInstance(),this.gameModeManager=new Tt,this.inputManager=new Lt(t=>this.onInput(t))}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,Oe);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},Ne=()=>{S.start().then(()=>{let t=new Bt;t.start(),window.app=t}),!ot&&!location.href.includes("localhost")&&Array.from(document.getElementsByTagName("p")).forEach(t=>t.classList.add("visible")),ot||document.getElementById("mobile-controls").remove(),ot&&(document.getElementById("canvas").classList.add("fit-screen"),document.getElementById("mobile-controls").classList.remove("hidden"))};window.onload=()=>{Ne()};})();
//# sourceMappingURL=index.js.map

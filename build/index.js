"use strict";(()=>{var nt=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),H=1280,at=720,F=H,G=at,D=3;var f=(o,t,e)=>Math.min(e,Math.max(o,t)),T=o=>o>0?1:o===0?0:-1;var n=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new n(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new n(t.x+e.x,t.y+e.y)}static diff(t,e){return new n(t.x-e.x,t.y-e.y)}static scale(t,e){return new n(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,r=t.y-e.y;return i*i+r*r}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new n(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var h=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return n.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return n.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=f(this.position.x,t.x1,t.x2),i=f(this.position.y,t.y1,t.y2);return this.intersectsVector(new n(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},u=class{constructor(t,e,i,r){this.x1=t,this.y1=e,this.x2=i,this.y2=r}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new n((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=f(t.position.x,this.x1,this.x2),i=f(t.position.y,this.y1,this.y2),r=new n(e,i),s=n.diff(t.position,r),a=s.magnitude||1;if(a>=t.radius){let l=n.diff(t.position,this.midpoint),c=this.width/2-Math.abs(l.x),p=this.height/2-Math.abs(l.y);return c<p?new n((c+t.radius)*T(l.x),0):new n(0,(p+t.radius)*T(l.y))}return n.scale(s,(t.radius-a)/a)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new u(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,r){return new u(t,e,t+i,e+r)}static centerForm(t,e,i,r){return new u(t-i,e-r,t+i,e+r)}static aroundPoint(t,e,i){return new u(t.x-e,t.y-i,t.x+e,t.y+i)}};var j=new Image;j.src="./img/tileset.png";var L=new Image;L.src="./img/entity-set.png";var O={isSolid:o=>o===1,isGrounding:o=>o===2||O.isSolid(o)};var U=class{constructor(t){this.id=t}onStart(t){}update(t,e,i){}draw(t){}};var de=!1,P=class extends U{constructor(e,i,r,s=[]){super(e);this.position=i,this.triggerArea=r,this.prerequisites=s,this.prereqsActive=s.length===0,this.prereqEntities=[],this.isEnabled=!1,this.isAreaActive=!1,this.connectionPoint=this.position,this.outputPoint=this.position}onStart(e){this.findPrerequisites(e)}findPrerequisites(e){return this.prereqEntities.length===this.prerequisites.length?this.prereqEntities:(this.prereqEntities=e.interactibles.filter(i=>this.prerequisites.includes(i.id)),this.prereqEntities)}update(e,i,r){var s;this.prereqsActive=this.prereqEntities.every(a=>a.isEnabled),this.isAreaActive=!!(this.prereqsActive&&((s=this.triggerArea)==null?void 0:s.intersectsPoint(e.position)))}draw(e){var r;let i=e.dynamicWorldCanvas;de&&(i.setColorRGB(255,255,255),i.setLineWidth(.1),i.setLineDash([.2,.2]),(r=this.triggerArea)==null||r.stroke(i)),e.behindGroundCanvas.setLineWidth(.2);for(let s of this.prereqEntities){e.behindGroundCanvas.setColor(s.isEnabled?"white":"black");let a=n.manhattanDist(s.outputPoint,this.connectionPoint),l=n.lerp(s.outputPoint,this.connectionPoint,.5),c=n.add(l,new n(0,a*.3));e.behindGroundCanvas.drawQuadratic(s.outputPoint.x,s.outputPoint.y,this.connectionPoint.x,this.connectionPoint.y,c.x,c.y)}}onInteract(){}};var me=.2,lt=class extends P{constructor(e,i,r,s=4){super(e,i,void 0,r);this.connectionPoint=n.add(i,new n(0,-1.8)),this.headCollider=u.centerForm(this.position.x,this.position.y-1.8,.6,.4),this.doorCollider=u.widthForm(this.position.x-.5,this.position.y-2,1,s),this.fullHeight=s}onStart(e){super.onStart(e),e.addWithoutDuplicate({type:1,rect:this.headCollider}),e.addWithoutDuplicate({type:1,rect:this.doorCollider})}update(e,i,r){super.update(e,i,r);let s=i/me*(this.prereqsActive?-1:1);this.doorCollider.y2=f(this.doorCollider.y2+s,this.doorCollider.y1,this.doorCollider.y1+this.fullHeight)}draw(e){super.draw(e);let i=e.dynamicWorldCanvas,r=this.doorCollider.height;r>0&&(i.setColor("black"),i.fillRect(this.position.x-.5,this.position.y-2,1,r),i.drawImage(L,120,Math.max(40-10*r,20)-10,40,Math.min(10*r,20),this.position.x-2,this.position.y-2+Math.max(r-2,0),4,Math.min(r,2))),i.drawImage(L,this.prereqsActive?140:128,0,12,6,this.position.x-6/10,this.position.y-2,12/10,6/10)}};var $t=.4,Zt=.25,E=7/9*G,B="#00ff62c8",ct="#0096ffc8",ht=[[new h(new n(0,0),.33)],[new h(new n(0,0),.33)],[new h(new n(0,.4),.33),new h(new n(0,-.4),.33)],[new h(new n(-.42,.4),.33),new h(new n(.42,.4),.33),new h(new n(0,-.4),.33)],[new h(new n(.4,.4),.33),new h(new n(.4,-.4),.33),new h(new n(-.4,.4),.33),new h(new n(-.4,-.4),.33)],[new h(new n(0,.3),.28),new h(new n(.64,.3),.28),new h(new n(-.64,.3),.28),new h(new n(-.32,-.3),.28),new h(new n(.32,-.3),.28)],[new h(new n(0,.6),.28),new h(new n(.64,.6),.28),new h(new n(-.64,.6),.28),new h(new n(-.32,0),.28),new h(new n(.32,0),.28),new h(new n(0,-.6),.28)],[new h(new n(0,0),.28),new h(new n(.64,0),.28),new h(new n(-.64,0),.28),new h(new n(-.32,-.6),.28),new h(new n(.32,-.6),.28),new h(new n(-.32,.6),.28),new h(new n(.32,.6),.28)],[new h(new n(0,.6),.28),new h(new n(.64,.6),.28),new h(new n(-.64,.6),.28),new h(new n(-.32,0),.28),new h(new n(.32,0),.28),new h(new n(0,-.6),.28),new h(new n(.64,-.6),.28),new h(new n(-.64,-.6),.28)]],Qt=[[u.centerForm(0,0,.33,.33)],[u.centerForm(0,0,.33,.33)],[u.centerForm(0,-.4,.33,.33),u.centerForm(0,.4,.33,.33)],[u.centerForm(0,-.4,.33,.33),u.centerForm(-.4,.4,.33,.33),u.centerForm(.4,.4,.33,.33)],[u.centerForm(-.4,-.4,.33,.33),u.centerForm(.4,-.4,.33,.33),u.centerForm(-.4,.4,.33,.33),u.centerForm(.4,.4,.33,.33)]];var Nt={},pe=(o,t)=>`${o}-${t}`,fe=(o,t)=>{let e=Math.max(o,t),i=.7,r=.5,s=Math.floor(E/(e+i+r)),a=Math.floor(s*r),l=E-s*e-a,c=l+a+o*s,p=l+a+t*s,x=Math.max((p-c)/2,0),z=Math.max((c-p)/2,0),k=[[z,z+a]],C=z+a;for(let w=0;w<t;w++)k.push([C,C+s]),C+=s;k.push([C,C+l]);let b=[[x,x+l]],g=x+l;for(let w=0;w<o;w++)b.push([g,g+s]),g+=s;b.push([g,g+a]);let ot=[];for(let[w,I]of b){let M=[];for(let[he,ue]of k)M.push(new u(he,w,ue,I));ot.push(M)}return ot},ge=(o,t)=>{let e=pe(o,t);return e in Nt||(Nt[e]=fe(o,t)),Nt[e]},te=(o,t)=>{let e=ge(o,t);return(i,r)=>e[i==="end"?o+1:i+1][r==="end"?t+1:r+1]};var ut=.4,dt=class{constructor(t,e,i,r){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=r,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=te(e,i);for(let s=0;s<e;s++){let a=[];for(let l=0;l<i;l++)a.push(null),this.elements.push({row:s,col:l,shape:this.positionGetter(s,l).inset(D),isHovered:!1});this.state.push(a)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new n(0,G*t),i=new n((F-E)/2,(G-E)/2);return n.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?B:ct),e.fillRect(0,0,E,E),e.setColor("#222222"),e.fillRect(E/4,E,E/2,E),e.setLineWidth(D*8),e.setLineDash([]),e.strokeRectInset(0,0,E,E,-D*4),e.setColor("#ffffff64"),e.setLineWidth(D),e.strokeRectInset(0,0,E,E,D/2);for(let r of this.elements){r.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),r.shape.stroke(e,D/2);let s=this.state[r.row][r.col],a=r.shape.midpoint;s?(e.setColor("white"),e.fillEllipse(a.x,a.y,r.shape.width*ut,r.shape.width*ut)):s===!1&&(e.setColor("#ffffff64"),e.setLineDash([D*2,D*2]),e.strokeEllipse(a.x,a.y,r.shape.width*ut,r.shape.width*ut))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/$t:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/Zt),this.openCloseStatus=f(this.openCloseStatus,0,1),e){let i=n.diff(e.mousePosition,this.uiPosition());for(let r of this.elements)r.isHovered=r.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=t,r=n.diff(i.position,this.uiPosition());for(let s of this.elements)if(s.isHovered=s.shape.intersectsPoint(r),s.isHovered){let a=this.state[s.row][s.col];e=!0;let l=null;i.isRightClick()?a===!1?l=null:l=!1:a===!0?l=null:l=!0,this.state[s.row][s.col]=l}}e&&this.onStateChange()}};var mt=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},q=class{constructor(){this.isValid=!1}validate(t){}draw(t,...e){}};var pt=class extends q{constructor(e,i){super();this.row=e,this.column=i}},ft=class extends pt{constructor(e,i,r){super(e,i);this.mustBeOn=r,this.isValid=!r}validate(e){let i=e[this.row][this.column];this.isValid=!!i==!!this.mustBeOn}draw(e,i){this.isValid?e.setColor("white"):e.setColor("red");let r=i(this.row,this.column),s=Math.min(r.width,r.height),a=new n(r.x2-s*.15,r.y1+s*.15);this.mustBeOn?e.fillEllipse(a.x,a.y,s*.1,s*.1):(e.setLineWidth(s*.05),e.strokeEllipse(a.x,a.y,s*.075,s*.075))}},gt=class extends pt{constructor(e,i,r){super(e,i);this.desiredCount=r,this.isValid=r===0,this.isCellColoured=!1}*iterateArea(e){for(let i=Math.max(this.row-1,0);i<=Math.min(this.row+1,e.length-1);i++)for(let r=Math.max(this.column-1,0);r<=Math.min(this.column+1,e[i].length-1);r++)yield[i,r]}validate(e){let i=0;for(let[r,s]of this.iterateArea(e))e[r][s]&&i++;this.isValid=i===this.desiredCount,this.isCellColoured=!!e[this.row][this.column]}draw(e,i){this.isValid?e.setColor(this.isCellColoured?B:"white"):e.setColor("red");let r=i(this.row,this.column),s=Math.min(r.width,r.height)*.25,a=r.midpoint;for(let l of ht[this.desiredCount]){let c=n.add(a,n.scale(l.position,s));this.desiredCount===0?(e.setLineWidth(l.radius*s*.5),e.strokeEllipse(c.x,c.y,l.radius*s*.75,l.radius*s*.75)):e.fillEllipse(c.x,c.y,l.radius*s,l.radius*s)}}};var ee=o=>new n(-o.y,o.x),wt=class extends q{constructor(e,i){super();this.isRow=e,this.index=i,this.isValid=!1}getRelevantRow(e){return this.isRow?e[this.index]:e.map(i=>i[this.index])}validateRow(e){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(e){let i=this.getRelevantRow(e);this.isValid=this.validateRow(i)}drawInCell(e,i,r,s){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(e,i){if(this.isValid?e.setColor("white"):e.setColor("red"),this.isRow){let r=i(this.index,"end");this.drawInCell(e,r.midpoint,r.width/2,!0)}else{let r=i(-1,this.index);this.drawInCell(e,r.midpoint,r.height/2,!1)}}},Y=class extends wt{constructor(e,i,r){super(e,i);this.count=r,this.isValid=r===0}validateRow(e){return e.reduce((r,s)=>s?r+1:r,0)===this.count}drawInCell(e,i,r,s){let a=s?l=>new h(ee(l.position),l.radius):l=>l;for(let l of ht[this.count]){l=a(l);let c=n.add(i,n.scale(l.position,r));this.count===0?(e.setLineWidth(l.radius*r*.5),e.strokeEllipse(c.x,c.y,l.radius*r*.75,l.radius*r*.75)):e.fillEllipse(c.x,c.y,l.radius*r,l.radius*r)}}},K=class extends Y{validateRow(t){let[e]=t.reduce(([i,r],s)=>s&&!r?[i+1,!0]:[i,!!s],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,r){let s=a=>r?ee(a):a;for(let a of Qt[this.count]){let l=n.add(e,n.scale(s(a.midpoint),i)),c=a.width*i;this.drawSquare(t,l,c)}}},J=class extends K{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,r],s)=>!s&&r?[i+1,!1]:[i,!!s],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},$=class extends wt{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,r){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let s=n.add(e,n.scale(r?new n(-.5,0):new n(0,.5),i));t.fillEllipse(s.x,s.y,.22*i,.22*i);let a=n.add(e,n.diff(e,s)),l=i*.22;t.drawLine(a.x-l,a.y-l,a.x+l,a.y+l),t.drawLine(a.x-l,a.y+l,a.x+l,a.y-l)}};var bt=class{constructor(){this.validationItems=[]}addForcedCellValidator(t,e,i){return this.validationItems.push(new ft(t,e,i)),this}addCountAreaValidator(t,e,i){return this.validationItems.push(new gt(t,e,i)),this}addEdgeValidators(t,e,i=Y){t.forEach((r,s)=>{typeof r=="number"&&this.validationItems.push(new i(e,s,r))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,K),this}addRowGroups(t){return this.addEdgeValidators(t,!0,K),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,J),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,J),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new $(!0,i))})}create(){return new mt(this.validationItems)}};var ie=(o,t)=>{let{rows:e,cols:i}=t,r=new bt;return t.columnCounts&&r.addColumnCounts(t.columnCounts),t.rowCounts&&r.addRowCounts(t.rowCounts),t.columnGroups&&r.addColumnGroups(t.columnGroups),t.rowGroups&&r.addRowGroups(t.rowGroups),t.columnBlankGroups&&r.addColumnBlankGroups(t.columnBlankGroups),t.rowBlankGroups&&r.addRowBlankGroups(t.rowBlankGroups),t.columnNoTriple&&r.addColumnNoTriple(t.columnNoTriple),t.rowNoTriple&&r.addRowNoTriple(t.rowNoTriple),t.forcedCells&&t.forcedCells.forEach(s=>{r.addForcedCellValidator(s.row,s.col,s.on)}),t.countAreas&&t.countAreas.forEach(s=>{r.addCountAreaValidator(s.row,s.col,s.count)}),new dt(o,e,i,r.create())};var re={"intro-1":{rows:1,cols:1,columnCounts:[1],rowCounts:[1]},"intro-2":{rows:2,cols:1,columnCounts:[2],rowCounts:[1,1]},"intro-3":{rows:2,cols:2,columnCounts:[2,1],rowCounts:[1,2]},"intro-side":{rows:3,cols:3,columnCounts:[1,3,2],rowCounts:[1,2,3]},"intro-secret":{rows:7,cols:7,columnCounts:[5,4,7,6,2,3,1],rowCounts:[1,5,6,3,7,4,2]},"hall-1":{rows:3,cols:3,columnCounts:[2,3,1],rowCounts:[2,3,1]},"hall-2":{rows:3,cols:3,columnCounts:[3,2,3],rowCounts:[3,2,3]},"hall-3":{rows:3,cols:4,columnCounts:[2,1,3,2],rowCounts:[3,4,1]},"hall-4":{rows:4,cols:4,columnCounts:[2,4,2,1],rowCounts:[4,1,1,3]},"hall-5":{rows:4,cols:4,columnCounts:[3,2,4,1],rowCounts:[2,4,1,3]},"hall-6":{rows:5,cols:5,columnCounts:[2,4,2,3,5],rowCounts:[1,3,5,5,2]}};function we(o){if(o in re)return ie(o,re[o]);throw new Error(`Cannot find puzzle with id: ${o}`)}var Ht=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return we(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},yt=new Ht;var Z=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},vt=class extends Z{constructor(e){super();this.exitTrigger=e}isExitEvent(){return!0}},X=class extends Z{constructor(e){super();this.puzzleId=e}isOpenPuzzleEvent(){return!0}},Et=class extends Z{constructor(e){super();this.puzzleId=e}isClosePuzzleEvent(){return!0}};var Ct=class extends P{constructor(e,i,r,s,a,l){super(e,i,r,s);this.puzzleId=a,this.puzzle=yt.getPuzzle(a),this.connectionPoint=n.add(i,new n(0,1.2)),this.outputPoint=n.add(i,new n(l.isFlipped?-1:1,-1.15)),this.config=l}draw(e){super.draw(e);let i=e.dynamicWorldCanvas,r=1,s=1/10;i.setColorRGB(0,0,0),i.fillRect(this.position.x-r/2,this.position.y+r,r,1),i.setLineWidth(s),this.isAreaActive&&(i.setColorRGB(255,255,255,128),i.strokeRectInset(this.position.x,this.position.y,0,0,-r-s*1.5)),i.setColorRGB(0,0,0),i.strokeRectInset(this.position.x,this.position.y,0,0,-r-s/2);let a=this.config.isFlipped?-1:1;i.fillRect(this.position.x+a*(r-s)-2*s,this.position.y-r-4*s,4*s,4*s),this.puzzle.hasBeenSolvedEver&&(this.isEnabled=!0,i.setColor("white"),i.fillRect(this.position.x+a*(r-s)-s,this.position.y-r-3*s,s*2,s*2)),this.prereqsActive&&(i.setColor(this.puzzle.isSolved?B:ct),i.fillRect(this.position.x-r,this.position.y-r,r*2,r*2));let l=new n(this.position.x-r,this.position.y-r);i.translate(l.x,l.y),i.setColor("white");let c=this.puzzle.state,p=r*2/(3*Math.max(c.length,c[0].length)+1),x=p*(3*c[0].length+1),z=p*(3*c.length+1),k=Math.max(0,(x-z)/2),C=Math.max(0,(z-x)/2);for(let b=0;b<c.length;b++)for(let g=0;g<c[b].length;g++)c[b][g]&&i.fillRect(C+p*(3*g+1),k+p*(3*b+1),p*2,p*2);i.translate(-l.x,-l.y)}onInteract(){return new X(this.puzzleId)}};var xt=class extends P{constructor(t,e,i,r){super(t,e,i,r)}update(t,e,i){this.isEnabled?this.isAreaActive=!1:super.update(t,e,i)}draw(t){super.draw(t);let e=t.dynamicWorldCanvas,i=1/10;this.isAreaActive&&(e.setColorRGB(255,255,255,128),e.setLineWidth(i),e.setLineDash([]),e.strokeRectInset(this.position.x-i*3,this.position.y-i*4,i*6,i*8,-i*1.5)),e.drawImage(L,this.isEnabled?80:40,0,10*4,10*4,this.position.x-2,this.position.y-2,4,4)}onInteract(){this.isEnabled=!0}};var be=.3,It=class extends P{constructor(e,i,r,s=4,a={}){super(e,i,void 0,r);this.connectionPoint=n.add(i,new n((a.isFlipped?1:-1)*(s/2-.9),.3)),this.hasLeft=s>4||!a.isFlipped,this.hasRight=s>4||!!a.isFlipped,this.hasLedge=!!a.hasLedge,this.leftHead=u.widthForm(this.position.x-s/2,this.position.y,1.2,.8),this.rightHead=u.widthForm(this.position.x+s/2-1.2,this.position.y,1.2,.8),this.leftDoor=u.widthForm(this.position.x-s/2,this.position.y,this.hasRight?s/2:s,.6),this.rightDoor=u.widthForm(this.position.x-(this.hasLeft?0:s/2),this.position.y,this.hasLeft?s/2:s,.6),this.ledge=u.widthForm(this.position.x-s/2,this.position.y,s,.2),this.fullWidth=s/2,this.doorWidth=this.hasLeft&&this.hasRight?s/2:s}onStart(e){super.onStart(e),this.hasLeft&&(e.addWithoutDuplicate({type:1,rect:this.leftHead}),e.addWithoutDuplicate({type:1,rect:this.leftDoor})),this.hasRight&&(e.addWithoutDuplicate({type:1,rect:this.rightHead}),e.addWithoutDuplicate({type:1,rect:this.rightDoor})),this.hasLedge&&e.addWithoutDuplicate({type:2,rect:this.ledge})}update(e,i,r){super.update(e,i,r);let s=i/be*(this.prereqsActive?-1:1);this.leftDoor.x2=f(this.leftDoor.x2+s,this.leftDoor.x1,this.leftDoor.x1+this.doorWidth),this.rightDoor.x1=f(this.rightDoor.x1-s,this.rightDoor.x2-this.doorWidth,this.rightDoor.x2)}draw(e){super.draw(e);let i=e.dynamicWorldCanvas;if(this.hasLedge)for(let r=-this.ledge.x1;r<this.ledge.x2;r++)i.drawImage(j,10,0,10,10,r,this.ledge.y1,1,1);if(this.hasLeft){let r=this.leftDoor.width;r>0&&(i.setColor("black"),this.leftDoor.draw(i),i.drawImage(L,160+Math.max(40-10*r,20)-10,10,Math.min(10*r,20),10,Math.max(this.leftDoor.x1,this.leftDoor.x2-2),this.position.y,Math.min(r,2),1)),i.drawImage(L,this.prereqsActive?180:160,0,12,8,this.leftHead.x1,this.leftHead.y1,this.leftHead.width,this.leftHead.height)}if(this.hasRight){let r=this.rightDoor.width;r>0&&(i.setColor("black"),this.rightDoor.draw(i),i.drawImage(L,170,30,Math.min(10*r,20),10,this.rightDoor.x1,this.position.y,Math.min(r,2),1)),i.drawImage(L,this.prereqsActive?188:168,20,12,8,this.rightHead.x1,this.rightHead.y1,this.rightHead.width,this.rightHead.height)}}};var ye="0",Lt=(o,t)=>o.toString(16).padStart(t,ye),Q=(o,t,e,i=255)=>`#${Lt(o,2)}${Lt(t,2)}${Lt(e,2)}${Lt(i,2)}`;var ve=1,Pt=class extends U{constructor(e,i,r,s={}){super(e);this.coverArea=i,this.triggerArea=r,this.coverIsTrigger=!!s.coverIsTrigger,this.canReCover=!!s.canReCover,this.isUncovered=!1,this.revealState=0}isPlayerTriggering(e){return this.triggerArea.intersectsPoint(e.position)||this.coverIsTrigger&&this.coverArea.intersectsPoint(e.position)}isOpen(e){return this.canReCover?this.isPlayerTriggering(e):this.isUncovered?!0:(this.isUncovered=this.isPlayerTriggering(e),this.isUncovered)}onStart(e){super.onStart(e)}update(e,i,r){super.update(e,i,r);let s=this.isOpen(e);this.revealState=f(this.revealState+(s?1:-1)*(i/ve),0,1),this.lastPlayerPos=e.position}draw(e){if(super.draw(e),this.revealState===1)return;let i=e.dynamicWorldCanvas;if(this.revealState===0)i.setColor("black");else{let r=this.coverArea.width+this.coverArea.height,s=r*.2,a=this.lastPlayerPos?n.lerp(this.lastPlayerPos,this.coverArea.midpoint,this.revealState):this.coverArea.midpoint,l=(r+s)*this.revealState,c=i.createRadialGradient(a.x,a.y,Math.max(0,l-s),a.x,a.y,l);c.addColorStop(0,Q(0,0,0,0)),c.addColorStop(1,Q(0,0,0,255)),i.setColor(c)}this.coverArea.draw(i)}};var St=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return n.diff(t.position,new n(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var Ee=Symbol("Up"),Ce=Symbol("Down"),xe=Symbol("Left"),Ie=Symbol("Right"),Le=Symbol("Jump"),Pe=Symbol("Interact"),Se=Symbol("Escape"),m={Down:Ce,Escape:Se,Interact:Pe,Jump:Le,Left:xe,Right:Ie,Up:Ee};var se={" ":m.Jump,escape:m.Escape,esc:m.Escape,Escape:m.Escape,Esc:m.Escape,w:m.Up,a:m.Left,s:m.Down,d:m.Right,e:m.Interact},W=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[m.Right]-+!!this.keyMap[m.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new W({},new n(0,0))}},Rt=class{constructor(){}isForKey(t){return!1}isClick(){return!1}},Ft=class extends Rt{constructor(e){super();this.input=e}isForKey(e){return e===this.input}},_t=class extends Rt{constructor(e,i){super();this.position=e,this.isRight=i}isClick(){return!0}isRightClick(){return this.isRight}},Dt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new n(0,0),this.canvas=document.getElementById("canvas")}init(){let t=i=>{this.listener&&this.listener(new Ft(i))};document.addEventListener("keydown",i=>{if(i.repeat)return;let r=se[i.key];!r||(this.isButtonDown[r]=!0,t(r))}),document.addEventListener("keyup",i=>{let r=se[i.key];!r||(this.isButtonDown[r]=!1)}),document.addEventListener("mousemove",i=>{this.mousePosition=this.toCanvasPosition(i)}),document.addEventListener("mousedown",i=>{var r,s;this.mousePosition=this.toCanvasPosition(i),i.button===0?(r=this.listener)==null||r.call(this,new _t(this.mousePosition,!1)):i.button===2&&((s=this.listener)==null||s.call(this,new _t(this.mousePosition,!0)))}),document.addEventListener("contextmenu",i=>{i.preventDefault()});let e=(i,r)=>{let s=document.getElementById(i);!s||(s.addEventListener("touchstart",a=>{a.preventDefault(),this.isButtonDown[r]=!0,t(r)}),s.addEventListener("touchcancel",a=>{a.preventDefault(),this.isButtonDown[r]=!1}),s.addEventListener("touchend",a=>{a.preventDefault(),this.isButtonDown[r]=!1}))};e("left",m.Left),e("right",m.Right),e("jump",m.Jump),e("down",m.Down),e("escape",m.Escape),e("interact",m.Interact)}toCanvasPosition(t){return n.scale(new n(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*F/H)}getInputState(){return new W(this.isButtonDown,this.mousePosition)}};var Tt=1280/32,zt=class{constructor(t,e,i,r,s,a,l,c,p){this.key=t,this.levelGrid=r,this.objects=s,this.player=a,this.exitTriggers=l,this.interactibles=c,this.entities=p,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t,this.interactibles.forEach(e=>e.onStart(this)),this.entities.forEach(e=>e.onStart(this))}addWithoutDuplicate(t){this.objects.find(({rect:e})=>e===t.rect)||this.objects.push(t)}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){var i;this.player.update(t,this.isPlayerActive()?e:W.empty(),this),this.interactibles.forEach(r=>{r.update(this.player,t,this)}),(i=this.interactingWith)!=null&&i.isAreaActive||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.entities.forEach(r=>{r.update(this.player,t,this)}),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new Et(this.interactingWith.id))}onInput(t){if(this.isPlayerActive()&&this.player.onInput(t),t.isForKey(m.Interact)){let e=this.interactibles.find(i=>i.isAreaActive);if(e){let i=e.onInteract();i&&i instanceof X&&(this.interactingWith=e,this.emitEvent(i))}}else t.isForKey(m.Escape)&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new vt(t))}clampCamera(t){let e=new n(f(t.x,this.player.position.x-32+1,this.player.position.x-1),f(t.y,this.player.position.y-18+1,this.player.position.y-1));return new n(f(e.x,0,this.width-32),f(e.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new n(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(n.lerp(this.camera,this.getNaiveCamera(n.add(this.player.position,new n(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(Tt,Tt),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(t.background.setColor("#6400c8"),t.background.fillRect(0,0,t.background.width,t.background.height),this.withSetupCanvas(t.staticWorldCanvas,e=>{e.clear(),e.setColor("black");for(let i=0;i<this.height;i++)for(let r=0;r<this.width;r++){let s=this.levelGrid[i][r];s&&e.drawImage(j,(s-1)*10,0,10,10,r,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),this.withSetupCanvas(t.behindGroundCanvas,()=>{t.behindGroundCanvas.clear(),this.interactibles.forEach(i=>{i.draw(t)}),this.player.draw(e),this.entities.forEach(i=>{i.draw(t)})})}),t.setCamera(new n(Math.floor(this.camera.x*Tt),Math.floor(this.camera.y*Tt)))}};var Bt=class{constructor(){this.grid=[],this.shortGrid=[]}innerGet(t,e,i,r){return t in r||(r[t]=[]),e in r[t]||(r[t][e]=u.widthForm(e,t,1,i?.2:1)),r[t][e]}get(t,e,i=!1){return this.innerGet(t,e,i,i?this.shortGrid:this.grid)}},oe=new Bt;var tt=.8,qt=16,Kt=qt/.3,Re=2*Kt,_e=1.8*Kt,De=4,ae=.6,le=4*De/ae,Te=le,ne=2*le/ae,Ae=.1;function ze(o){return!!o}var Mt=class{constructor(t){this.position=t,this.collider=new h(t,tt),this.velocity=new n(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.contactingAnyLedge=!1,this.inAirFor=1}onInput(t){t.isForKey(m.Jump)&&(this.wantsToJump=!0)}collideWithBlock(t,e,i){let r=!this.isDropping&&t===2&&this.velocity.y>=0&&this.position.y<e.y1,s=this.collider.intersectsRectangle(e);if(s&&t===2&&(this.contactingAnyLedge=!0,this.velocity.y<0&&this.position.y>=e.y1&&(this.isDropping=!0)),O.isSolid(t)||r){if(s){this.isColliding=!0;let a=e.uncollideCircle(this.collider);this.velocity.add(n.scale(a,1/i)),a.x>0&&a.y===0?this.velocity.x=Math.max(0,this.velocity.x):a.x<0&&a.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),a.y>0&&a.x===0?this.velocity.y=Math.max(0,this.velocity.y):a.y<0&&a.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(a)}return this.collider.intersectsRectangle(e)}}update(t,e,i){let r=(w,I)=>{var M;return(M=i.levelGrid[Math.floor(I)])==null?void 0:M[Math.floor(w)]},s=(w,I)=>{let M=r(w,I);if(M)return{type:r(w,I),rect:oe.get(Math.floor(I),Math.floor(w),M===2)}},a=e.getHorizontalAxis(),l=new n(a*Kt,0);e.isPressed(m.Down)&&(this.isDropping=!0);let c=this.position.y+this.collider.radius,p=r(this.position.x,c),x=this.isDropping?O.isSolid(p):O.isGrounding(p),z=r(this.position.x,this.position.y),k=x&&c===Math.floor(c);if(this.isGrounded=k||i.objects.some(({type:w,rect:I})=>(this.isDropping?O.isSolid(w):O.isGrounding(w))&&this.collider.isKissingBelow(I)),this.isGrounded)this.inAirFor=0,T(a)?T(a)!==T(this.velocity.x)&&(l.x+=-_e*T(this.velocity.x)):l.x+=-Math.min(Math.abs(this.velocity.x/t),Re)*T(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,z===3){let w=this.velocity.y>0?0:1.1;l.y-=ne*w}else l.y+=ne;this.inAirFor<Ae&&this.wantsToJump&&(this.wantsToJump=!1,this.velocity.y=-Te),this.velocity.add(n.scale(l,t)),this.velocity.x=f(this.velocity.x,-qt,qt);let C=n.scale(this.velocity,t);C.x=f(C.x,-tt,tt),C.y=f(C.y,-tt,tt),this.position.add(C),this.isColliding=!1;let{x:b,y:g}=this.position,ot=[s(b,g),s(b,g+1),s(b,g-1),s(b-1,g),s(b+1,g),s(b-1,g-1),s(b+1,g-1),s(b-1,g+1),s(b+1,g+1)].filter(ze);this.contactingAnyLedge=!1,ot.concat(i.objects).forEach(({type:w,rect:I})=>{this.collideWithBlock(w,I,t)}),this.isDropping=this.isDropping&&this.contactingAnyLedge}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var Vt=class{constructor(t,e,i,r){this.key=t,this.iid=e,this.width=i,this.height=r,this.levelGrid=[],this.objects=[],this.playerPosition=new n(16,9),this.exitTriggers=[],this.interactibles=[],this.entities=[],this.worldPosition=new n(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}addEntities(t){return this.entities=this.entities.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new zt(this.key,this.width,this.height,this.levelGrid,this.objects,new Mt(this.playerPosition),this.exitTriggers,this.interactibles,this.entities)}};var Me="./data/world.json";function Ve(o){return fetch(o).then(t=>t.json())}function A(o,t){return o.find(e=>e.__identifier===t)}function ke(o,t){return o.find(e=>e.iid===t)}function ce(o,t){return A(o.layerInstances,t)}function N(o){return Math.floor(o/10)}function Ge(o){return N(o[0])+1}function kt(o){var e;return(((e=A(o.fieldInstances,"prerequisites"))==null?void 0:e.__value)||[]).map(i=>i.entityIid)}function Oe(o){var s,a;let t=o.iid,e=(s=A(o.fieldInstances,"key"))==null?void 0:s.__value;e||console.warn("Puzzle with no key!");let i=new n(o.__grid[0]+2,o.__grid[1]+2),r={isFlipped:(a=A(o.fieldInstances,"isFlipped"))==null?void 0:a.__value};return new Ct(t,i,u.aroundPoint(i,2,2),kt(o),e,r)}function We(o){let t=o.iid;t||console.warn("Switch with no key!");let e=new n(o.__grid[0]+2,o.__grid[1]+2);return new xt(t,e,u.aroundPoint(e,2,2),kt(o))}function Ne(o){let t=o.iid;t||console.warn("Door with no key!");let e=new n(o.__grid[0]+2,o.__grid[1]+2);return new lt(t,e,kt(o),o.height/10)}function He(o){var r,s;let t=o.iid;t||console.warn("Trapdoor with no key!");let e=new n(...o.__grid),i={isFlipped:(r=A(o.fieldInstances,"isFlipped"))==null?void 0:r.__value,hasLedge:(s=A(o.fieldInstances,"hasLedge"))==null?void 0:s.__value};return new It(t,e,kt(o),o.width/10,i)}function Fe(o,t){var a,l,c,p;let e=o.iid;e||console.warn("CoverEntity with no key!");let i=(l=(a=A(o.fieldInstances,"triggerArea"))==null?void 0:a.__value)==null?void 0:l.entityIid,r=ke(t,i)||o,s={coverIsTrigger:(c=A(o.fieldInstances,"coverIsTrigger"))==null?void 0:c.__value,canReCover:(p=A(o.fieldInstances,"canReCover"))==null?void 0:p.__value};return new Pt(e,u.widthForm(...o.__grid,o.width/10,o.height/10),u.widthForm(...r.__grid,r.width/10,r.height/10),s)}function Ue(o){let t=new Vt(o.identifier,o.iid,N(o.pxWid),N(o.pxHei));t.makeGridSpace();let e=ce(o,"Solid");for(let a of e.gridTiles){let l=N(a.px[0]),c=N(a.px[1]),p=Ge(a.src);t.setCell(c,l,p)}let i=!1,s=ce(o,"EntityLayer").entityInstances;return s.forEach(a=>{switch(a.__identifier){case"Util":break;case"PlayerStart":t.setPlayerPos(new n(a.__grid[0],a.__grid[1])),i=!0;break;case"PuzzleScreen":t.addInteractibles([Oe(a)]);break;case"Switch":t.addInteractibles([We(a)]);break;case"Door":t.addInteractibles([Ne(a)]);break;case"Trapdoor":t.addInteractibles([He(a)]);break;case"CoverEntity":t.addEntities([Fe(a,s)]);break;default:console.warn("Processing unknown entity type:",a.__identifier)}}),i||console.warn(`Level ${o.identifier} is missing a PlayerStart`),t.setWorldPosition(new n(N(o.worldX),N(o.worldY))),t}function Be(o,t){let e=t[o.iid];for(let i of o.__neighbours){let r=i.levelIid,s=t[r],a=n.diff(s.worldPosition,e.worldPosition),l=u.widthForm(a.x,a.y,s.width,s.height);e.addExits([new St(l,s.key,l)])}return e.create()}var et=class{static start(){return Ve(Me).then(t=>{et.data=t;let e={};t.levels.forEach(i=>{let r=Ue(i);e[r.iid]=r,e[r.key]=r}),t.levels.forEach(i=>{let r=Be(i,e);et.levelMap[r.key]=r})}).then(()=>{})}static getLevel(t){return et.levelMap[t]}},R=et;R.hasLoaded=!1,R.data=null,R.levelMap={};var Gt=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=R.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||R.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Ot=class{constructor(){this.levelManager=new Gt,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=yt,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){var e;if(t.isExitEvent()){let i=t.exitTrigger;this.startLevel(this.levelManager.getLevel(i.key,i))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&((e=this.currentPuzzle)==null||e.close())}update(t,e){var i,r;(i=this.currentLevel)==null||i.update(t,e),(r=this.currentPuzzle)==null||r.update(t,e)}onInput(t){var e,i;(e=this.currentLevel)==null||e.onInput(t),(i=this.currentPuzzle)==null||i.onInput(t)}draw(t){var e,i;(e=this.currentLevel)==null||e.draw(t),(i=this.currentPuzzle)==null||i.draw(t)}};var Wt=class{constructor(){this.playMode=new Ot,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var d=Symbol("ctx"),it=Symbol("canvas"),rt=class{constructor(t){this[it]=t;let e=t.getContext("2d");if(!e)throw Error("Unable to get 2d context");e.imageSmoothingEnabled=!1,this[d]=e,this[d].fillStyle="black",this[d].strokeStyle="black",this.width=this[it].width,this.height=this[it].height}fillRect(t,e,i,r){this[d].fillRect(t,e,i,r)}clear(){this[d].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,r){this[d].strokeRect(t,e,i,r)}strokeRectInset(t,e,i,r,s){this.strokeRect(t+s,e+s,i-s*2,r-s*2)}fillEllipse(t,e,i,r){this[d].beginPath(),this[d].ellipse(t,e,i,r,0,0,2*Math.PI),this[d].fill()}strokeEllipse(t,e,i,r){this[d].beginPath(),this[d].ellipse(t,e,i,r,0,0,2*Math.PI),this[d].stroke()}drawLine(t,e,i,r){this[d].beginPath(),this[d].moveTo(t,e),this[d].lineTo(i,r),this[d].stroke()}drawQuadratic(t,e,i,r,s,a){this[d].beginPath(),this[d].moveTo(t,e),this[d].quadraticCurveTo(s,a,i,r),this[d].stroke()}scale(t,e){this[d].scale(t,e)}translate(t,e){this[d].translate(t,e)}setLineWidth(t){this[d].lineWidth=t}get lineWidth(){return this[d].lineWidth}setLineDash(t){this[d].setLineDash(t)}setColor(t){t!==this[d].fillStyle&&(this[d].fillStyle=t,this[d].strokeStyle=t)}setColorRGB(t,e,i,r=255){this.setColor(Q(t,e,i,r))}setColorHSLA(t,e,i,r=1){let s=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${r})`;this.setColor(s)}createGradient(t,e,i,r){return this[d].createLinearGradient(t,e,i,r)}createRadialGradient(t,e,i,r,s,a){return this[d].createRadialGradient(t,e,i,r,s,a)}saveTransform(){this[d].save()}restoreTransform(){this[d].restore()}drawImage(t,e,i,r,s,a,l,c,p){let x;if(t instanceof rt)x=t[it];else if(t instanceof Image){if(!t.complete)return;x=t}else throw Error("Drawing something unmanageable");this[d].drawImage(x,e,i,r,s,a,l,c,p)}static fromId(t){let e=document.getElementById(t);if(!e||!(e instanceof HTMLCanvasElement))throw new Error(`Could not find canvas with id: "${t}"`);return new rt(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new rt(i)}},_=rt;it,d;var v=Symbol("real-canvas");function qe(){let o=document.getElementById("canvas");if(!(o instanceof HTMLCanvasElement))throw new Error("Could not find canvas");return o.width=H,o.height=at,o}var Xt=class{constructor(){let t=new _(qe());if(!(t instanceof _))throw Error("No canvas found!");this[v]=t,this.background=_.fromScratch(1280*3,720*3),this.behindGroundCanvas=_.fromScratch(1280*3,720*3),this.staticWorldCanvas=_.fromScratch(1280*3,720*3),this.dynamicWorldCanvas=_.fromScratch(1280*3,720*3),this.uiCanvas=_.fromScratch(H,at),this.camera=new n(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[v].drawImage(this.background,this.camera.x,this.camera.y,1280,720,0,0,this[v].width,this[v].height),this[v].drawImage(this.behindGroundCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[v].width,this[v].height),this[v].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[v].width,this[v].height),this[v].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[v].width,this[v].height),this[v].drawImage(this.uiCanvas,0,0,F,G,0,0,this[v].width,this[v].height)}static getInstance(){return this.instance?this.instance:new Xt}},st=Xt;v,st.instance=null;var Ke=1/20,Yt=class{constructor(){this.screenManager=st.getInstance(),this.gameModeManager=new Wt,this.inputManager=new Dt(t=>this.onInput(t)),this.lastFrameTime=performance.now()}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,Ke);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}};function jt(o){let t=document.getElementById(o);return t||console.warn(`Can't find element with id: ${o}`),t}var Xe=()=>{var t,e,i;R.start().then(()=>{let r=new Yt;r.start(),window.app=r}),!nt&&!location.href.includes("localhost")&&Array.from(document.getElementsByTagName("p")).forEach(r=>r.classList.add("visible")),nt||(t=jt("mobile-controls"))==null||t.remove(),nt&&((e=jt("canvas"))==null||e.classList.add("fit-screen"),(i=jt("mobile-controls"))==null||i.classList.remove("hidden"))};window.onload=()=>{Xe()};})();
//# sourceMappingURL=index.js.map

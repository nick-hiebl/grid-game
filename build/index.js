(()=>{var Zt=Object.defineProperty;var Jt=(s,t,e)=>t in s?Zt(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var k=(s,t,e)=>(Jt(s,typeof t!="symbol"?t+"":t,e),e);var x=(s,t,e)=>Math.min(e,Math.max(s,t)),A=s=>s>0?1:s===0?0:-1;var o=class{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new o(this.x,this.y)}get magnitude(){return Math.hypot(this.x,this.y)}static add(t,e){return new o(t.x+e.x,t.y+e.y)}static diff(t,e){return new o(t.x-e.x,t.y-e.y)}static scale(t,e){return new o(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,r=t.y-e.y;return i*i+r*r}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new o(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var l=class{constructor(t,e){this.position=t,this.radius=e}intersectsCircle(t){let e=this.radius+t.radius;return o.sqrDist(this.position,t.position)<e*e}intersectsVector(t){return o.sqrDist(this.position,t)<this.radius*this.radius}intersectsRectangle(t){let e=x(this.position.x,t.x1,t.x2),i=x(this.position.y,t.y1,t.y2);return this.intersectsVector(new o(e,i))}isKissingBelow(t){return this.position.y+this.radius===t.y1&&t.x1<=this.position.x&&this.position.x<=t.x2}draw(t){t.fillEllipse(this.position.x,this.position.y,this.radius,this.radius)}},d=class{constructor(t,e,i,r){this.x1=t,this.y1=e,this.x2=i,this.y2=r}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new o((this.x1+this.x2)/2,(this.y1+this.y2)/2)}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=x(t.position.x,this.x1,this.x2),i=x(t.position.y,this.y1,this.y2),r=new o(e,i),n=o.diff(t.position,r),a=n.magnitude||1;if(a>=t.radius){let h=o.diff(t.position,this.midpoint),u=this.width/2-Math.abs(h.x),I=this.height/2-Math.abs(h.y);return u<I?new o((u+t.radius)*A(h.x),0):new o(0,(I+t.radius)*A(h.y))}return o.scale(n,(t.radius-a)/a)}draw(t){t.fillRect(this.x1,this.y1,this.width,this.height)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new d(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,r){return new d(t,e,t+i,e+r)}static centerForm(t,e,i,r){return new d(t-i,e-r,t+i,e+r)}static aroundPoint(t,e,i){return new d(t.x-e,t.y-i,t.x+e,t.y+i)}};var $=class{constructor(t,e,i){this.collider=t,this.key=e,this.nextLevelCollider=i||t}hasEntered(t){return this.collider.intersectsPoint(t.position)}translatePlayerToNext(t){return o.diff(t.position,new o(this.nextLevelCollider.x1,this.nextLevelCollider.y1))}};var Kt=Symbol("Up"),$t=Symbol("Down"),qt=Symbol("Left"),Qt=Symbol("Right"),te=Symbol("Jump"),ee=Symbol("Interact"),ie=Symbol("Escape"),p={Down:$t,Escape:ie,Interact:ee,Jump:te,Left:qt,Right:Qt,Up:Kt};var Nt={" ":p.Jump,escape:p.Escape,esc:p.Escape,Escape:p.Escape,Esc:p.Escape,w:p.Up,a:p.Left,s:p.Down,d:p.Right,e:p.Interact},M=class{constructor(t,e){this.keyMap=t,this.mousePosition=e}getHorizontalAxis(){return+!!this.keyMap[p.Right]-+!!this.keyMap[p.Left]}isPressed(t){return!!this.keyMap[t]}static empty(){return new M({})}},q=class{constructor(){}isForKey(){return!1}isClick(){return!1}},Lt=class extends q{constructor(t){super(),this.input=t}isForKey(t){return t===this.input}},Q=class extends q{constructor(t,e){super(),this.position=t,this.isRight=e}isClick(){return!0}isRightClick(){return this.isRight}},tt=class{constructor(t){this.isMouseDown=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new o(0,0),this.canvas=document.getElementById("canvas")}init(){document.addEventListener("keydown",t=>{if(t.repeat)return;let e=Nt[t.key];!e||(this.isButtonDown[e]=!0,this.listener&&this.listener(new Lt(e)))}),document.addEventListener("keyup",t=>{let e=Nt[t.key];!e||(this.isButtonDown[e]=!1)}),document.addEventListener("mousemove",t=>{this.mousePosition=this.toCanvasPosition(t)}),document.addEventListener("click",t=>{this.mousePosition=this.toCanvasPosition(t),this.listener&&this.listener(new Q(this.mousePosition,!1))}),document.addEventListener("contextmenu",t=>{t.preventDefault(),this.mousePosition=this.toCanvasPosition(t),this.listener&&this.listener(new Q(this.mousePosition,!0))})}toCanvasPosition(t){return o.scale(new o(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.canvas.width/this.canvas.clientWidth*1280/1280)}getInputState(){return new M(this.isButtonDown,this.mousePosition)}};var U=class{constructor(){}isExitEvent(){return!1}isOpenPuzzleEvent(){return!1}isClosePuzzleEvent(){return!1}},it=class extends U{constructor(t){super(),this.exitTrigger=t}isExitEvent(){return!0}},st=class extends U{constructor(t){super(),this.puzzleId=t}isOpenPuzzleEvent(){return!0}},ot=class extends U{constructor(t){super(),this.puzzleId=t}isClosePuzzleEvent(){return!0}};var rt=1280/32,kt=new Image;kt.src="./img/tileset.png";var nt=class{constructor(t,e,i,r,n,a,h,u){this.key=t,this.levelGrid=r,this.objects=n,this.player=a,this.exitTriggers=h,this.interactibles=u,this.width=e,this.height=i,this.camera=this.getIdealCamera(),this.interactingWith=void 0,this.drawnStatic=!1,this.playModeManager=void 0}start(t){this.drawnStatic=!1,this.interactingWith=void 0,this.playModeManager=t}emitEvent(t){this.playModeManager&&this.playModeManager.onLevelEvent(t)}feedPlayerInfo(t,e){e.key!==this.key&&console.error("Exit key mis-match");let i=e.translatePlayerToNext(t);this.player.position.x=i.x,this.player.position.y=i.y,this.player.velocity=t.velocity.copy(),this.camera=this.getIdealCamera()}update(t,e){this.player.update(t,this.isPlayerActive()?e:M.empty(),this),this.interactibles.forEach(i=>{i.update(this.player.position,t)}),this.interactingWith?.isTriggered||(this.closeCurrentPuzzle(),this.interactingWith=void 0),this.updateCamera(t),this.updateExits()}isPlayerActive(){return!this.interactingWith}closeCurrentPuzzle(){this.interactingWith&&this.emitEvent(new ot(this.interactingWith.id))}onInput(t){this.isPlayerActive()&&this.player.onInput(t),t.input===p.Interact?(this.interactingWith=this.interactibles.find(e=>e.isTriggered),this.interactingWith&&this.emitEvent(new st(this.interactingWith.id))):t.input===p.Escape&&(this.closeCurrentPuzzle(),this.interactingWith=void 0)}updateExits(){let t=this.exitTriggers.find(e=>e.hasEntered(this.player));t&&this.emitEvent(new it(t))}clampCamera(t){return new o(x(t.x,0,this.width-32),x(t.y,0,this.height-18))}getNaiveCamera(t=this.player.position){return new o(t.x-32/2,t.y-18/2)}getIdealCamera(t=this.player.position){return this.clampCamera(this.getNaiveCamera(t))}updateCamera(t){this.camera=this.clampCamera(o.lerp(this.camera,this.getNaiveCamera(o.add(this.player.position,new o(this.player.velocity.x*.3,0))),t*2))}withSetupCanvas(t,e){t.saveTransform(),t.scale(rt,rt),e(t),t.restoreTransform()}draw(t){this.drawnStatic||(this.withSetupCanvas(t.staticWorldCanvas,e=>{e.setColor("#6400c8"),e.fillRect(0,0,e.width,e.height),e.setColor("red");for(let i of this.objects)i.draw(e);e.setColor("black");for(let i=0;i<this.height;i++)for(let r=0;r<this.width;r++){let n=this.levelGrid[i][r];n&&e.drawImage(kt,(n-1)*10,0,10,10,r,i,1,1)}}),this.drawnStatic=!0),this.withSetupCanvas(t.dynamicWorldCanvas,e=>{e.clear(),this.interactibles.forEach(i=>{i.draw(e)}),this.player.draw(e)}),t.setCamera(new o(Math.floor(this.camera.x*rt),Math.floor(this.camera.y*rt)))}};var v={SOLID:1,LEDGE:2,VENT:3,LADDER:4,isSolid:s=>s===v.SOLID,isGrounding:s=>s===v.SOLID||s===v.LEDGE};var vt=class{constructor(){this.grid=[]}get(t,e){return t in this.grid||(this.grid[t]=[]),e in this.grid[t]||(this.grid[t][e]=d.widthForm(e,t,1,1)),this.grid[t][e]}},Gt=new vt;var F=.8,Pt=16,Rt=Pt/.3,se=2*Rt,oe=1.8*Rt,re=4,Ht=.6,bt=4*re/Ht,ne=bt,Ot=2*bt/Ht,ae=.1,at=class{constructor(t){this.position=t,this.collider=new l(t,F),this.velocity=new o(0,0),this.isColliding=!1,this.isGrounded=!1,this.isDropping=!1,this.wantsToJump=!1,this.inAirFor=1}onInput(t){t.isForKey(p.Jump)&&(this.wantsToJump=!0)}update(t,e,i){let r=(m,y)=>i.levelGrid[Math.floor(y)]?.[Math.floor(m)],n=(m,y)=>{if(r(m,y))return{type:r(m,y),rect:Gt.get(Math.floor(y),Math.floor(m))}},a=e.getHorizontalAxis(),h=new o(a*Rt,0);e.isPressed(p.Down)&&(this.isDropping=!0);let u=this.position.y+this.collider.radius,I=r(this.position.x,u),_=this.isDropping?v.isSolid(I):v.isGrounding(I),H=r(this.position.x,this.position.y),b=_&&u===Math.floor(u);if(this.isGrounded=b||i.objects.some(m=>this.collider.isKissingBelow(m)),this.isGrounded)this.inAirFor=0,A(a)?A(a)!==A(this.velocity.x)&&(h.x+=-oe*A(this.velocity.x)):h.x+=-Math.min(Math.abs(this.velocity.x/t),se)*A(this.velocity.x),this.velocity.y=0;else if(this.inAirFor+=t,H===v.VENT){let m=this.velocity.y>0?.75:1.1;h.y-=Ot*m}else h.y+=Ot;this.inAirFor<ae&&this.wantsToJump&&(this.velocity.y=-ne),this.velocity.add(o.scale(h,t)),this.velocity.x=x(this.velocity.x,-Pt,Pt);let C=o.scale(this.velocity,t);C.x=x(C.x,-F,F),C.y=x(C.y,-F,F),this.position.add(C),this.isColliding=!1;let{x:g,y:w}=this.position,Z=[n(g,w),n(g,w+1),n(g,w-1),n(g-1,w),n(g+1,w),n(g-1,w-1),n(g+1,w-1),n(g-1,w+1),n(g+1,w+1)].filter(m=>!!m),L=!1;Z.forEach(({type:m,rect:y})=>{let J=!this.isDropping&&m===v.LEDGE&&this.velocity.y>=0&&this.position.y<y.y1,K=this.collider.intersectsRectangle(y);if(K&&m===v.LEDGE&&(L=!0,this.velocity.y<0&&this.position.y>=y.y1&&(this.isDropping=!0)),v.isSolid(m)||J){if(K){this.isColliding=!0;let S=y.uncollideCircle(this.collider);this.velocity.add(o.scale(S,1/t)),S.x>0&&S.y===0?this.velocity.x=Math.max(0,this.velocity.x):S.x<0&&S.y===0&&(this.velocity.x=Math.min(0,this.velocity.x)),S.y>0&&S.x===0?this.velocity.y=Math.max(0,this.velocity.y):S.y<0&&S.x===0&&(this.velocity.y=Math.min(0,this.velocity.y)),this.position.add(S)}return this.collider.intersectsRectangle(y)}}),this.wantsToJump=!1,this.isDropping=this.isDropping&&L}draw(t){t.setColor("yellow"),this.collider.draw(t)}};var ht=class{constructor(t,e,i,r){this.key=t,this.iid=e,this.width=i,this.height=r,this.levelGrid=[],this.objects=[],this.playerPosition=new o(16,9),this.exitTriggers=[],this.interactibles=[],this.worldPosition=new o(0,0)}addObjects(t){return this.objects=this.objects.concat(t),this}addExits(t){return this.exitTriggers=this.exitTriggers.concat(t),this}addInteractibles(t){return this.interactibles=this.interactibles.concat(t),this}setPlayerPos(t){return this.playerPosition=t,this}setLevelGrid(t){this.levelGrid=t}makeGridSpace(){this.levelGrid=[];for(let t=0;t<this.height;t++)this.levelGrid.push([])}setWorldPosition(t){this.worldPosition=t}setCell(t,e,i){this.levelGrid[t][e]=i}create(){return new nt(this.key,this.width,this.height,this.levelGrid,this.objects,new at(this.playerPosition),this.exitTriggers,this.interactibles)}};var Vt=.4,Ut=.25,f=7/9*720,lt="#00ff62c8",ct="#0096ffc8";var he="0",X=(s,t)=>s.toString(16).padStart(t,he);var c=Symbol("ctx"),dt=Symbol("canvas"),E=class{constructor(t){if(!(t instanceof HTMLCanvasElement))throw Error("Invalid canvas provided!");this[dt]=t;let e=t.getContext("2d");if(e.imageSmoothingEnabled=!1,!e)throw Error("Unable to get 2d context");this[c]=e,this[c].fillStyle="black",this[c].strokeStyle="black",this.width=this[dt].width,this.height=this[dt].height}fillRect(t,e,i,r){this[c].fillRect(t,e,i,r)}clear(){this[c].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,r){this[c].strokeRect(t,e,i,r)}strokeRectInset(t,e,i,r,n){this.strokeRect(t+n,e+n,i-n*2,r-n*2)}fillEllipse(t,e,i,r){this[c].beginPath(),this[c].ellipse(t,e,i,r,0,0,2*Math.PI),this[c].fill()}strokeEllipse(t,e,i,r){this[c].beginPath(),this[c].ellipse(t,e,i,r,0,0,2*Math.PI),this[c].stroke()}drawLine(t,e,i,r){this[c].beginPath(),this[c].moveTo(t,e),this[c].lineTo(i,r),this[c].stroke()}scale(t,e){this[c].scale(t,e)}translate(t,e){this[c].translate(t,e)}setColor(t){t!==this[c].fillStyle&&(this[c].fillStyle=t,this[c].strokeStyle=t)}setLineWidth(t){this[c].lineWidth=t}get lineWidth(){return this[c].lineWidth}setLineDash(t){this[c].setLineDash(t)}setColorRGB(t,e,i,r=255){let n=`#${X(t,2)}${X(e,2)}${X(i,2)}${X(r,2)}`;this.setColor(n)}setColorHSLA(t,e,i,r=1){let n=`hsla(${t},${Math.floor(e*100)}%,${Math.floor(i*100)}%,${r})`;this.setColor(n)}saveTransform(){this[c].save()}restoreTransform(){this[c].restore()}drawImage(t,e,i,r,n,a,h,u,I){let _;if(t instanceof E)_=t[dt];else if(t instanceof Image)_=t;else throw Error("Drawing something unmanageable");this[c].drawImage(_,e,i,r,n,a,h,u,I)}static fromId(t){let e=document.getElementById(t);return new E(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new E(i)}};var P=Symbol("real-canvas");function le(){let s=document.getElementById("canvas");return s.setAttribute("width",1280),s.setAttribute("height",720),s}var _t=class{constructor(){let t=new E(le());if(!(t instanceof E))throw Error("No canvas found!");this[P]=t,this.staticWorldCanvas=E.fromScratch(1280*2,720*2),this.dynamicWorldCanvas=E.fromScratch(1280*2,720*2),this.uiCanvas=E.fromScratch(1280,720),this.camera=new o(0,0)}setCamera(t){this.camera=t}drawToScreen(){this[P].drawImage(this.staticWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[P].width,this[P].height),this[P].drawImage(this.dynamicWorldCanvas,this.camera.x,this.camera.y,1280,720,0,0,this[P].width,this[P].height),this[P].drawImage(this.uiCanvas,0,0,1280,720,0,0,this[P].width,this[P].height)}static getInstance(){return this.instance?this.instance:new _t}},B=_t;k(B,"instance",null);var At={},ce=(s,t)=>`${s}-${t}`,de=(s,t)=>{let e=Math.max(s,t),i=.7,r=.5,n=Math.floor(f/(e+i+r)),a=Math.floor(n*r),h=f-n*e-a,u=h+a+s*n,I=h+a+t*n,_=Math.max((I-u)/2,0),H=Math.max((u-I)/2,0),b=[[H,H+a]],C=H+a;for(let L=0;L<t;L++)b.push([C,C+n]),C+=n;b.push([C,C+h]);let g=[[_,_+h]],w=_+h;for(let L=0;L<s;L++)g.push([w,w+n]),w+=n;g.push([w,w+a]);let Z=[];for(let[L,m]of g){let y=[];for(let[J,K]of b)y.push(new d(J,L,K,m));Z.push(y)}return Z},ue=(s,t)=>{let e=ce(s,t);return e in At||(At[e]=de(s,t)),At[e]},Xt=(s,t)=>{let e=ue(s,t);return(i,r)=>e[i==="end"?s+1:i+1][r==="end"?t+1:r+1]};var pt=.4,N=class{constructor(t,e,i,r){this.id=t,this.openCloseStatus=0,this.isOpen=!1,this.rows=e,this.cols=i,this.state=[],this.elements=[],this.validator=r,this.isSolved=!1,this.hasBeenSolvedEver=!1,this.positionGetter=Xt(e,i);for(let n=0;n<e;n++){let a=[];for(let h=0;h<i;h++)a.push(null),this.elements.push({row:n,col:h,shape:this.positionGetter(n,h).inset(3),isHovered:!1});this.state.push(a)}}open(){this.isOpen||(this.isOpen=!0,this.openCloseStatus=0)}close(){this.isOpen=!1}uiPosition(){let t=Math.pow(1-this.openCloseStatus,2),e=new o(0,720*t),i=new o((1280-f)/2,(720-f)/2);return o.add(e,i)}draw(t){let e=t.uiCanvas;if(e.clear(),this.openCloseStatus===0)return;let i=this.uiPosition();e.translate(i.x,i.y),e.setColor(this.isSolved?lt:ct),e.fillRect(0,0,f,f),e.setColor("#222222"),e.fillRect(f/4,f,f/2,f),e.setLineWidth(3*8),e.setLineDash([]),e.strokeRectInset(0,0,f,f,-3*4);let r=3*8;this.isSolved&&(e.setColor("white"),e.fillRect(f-r*6,-r,r*2,r)),this.hasBeenSolvedEver&&(e.setColor("yellow"),e.fillRect(f-r*3,-r,r*2,r)),e.setColor("#ffffff64"),e.setLineWidth(3),e.strokeRectInset(0,0,f,f,3/2);for(let n of this.elements){n.isHovered?e.setColor("white"):e.setColor("#ffffff64"),e.setLineDash([]),n.shape.stroke(e,3/2);let a=this.state[n.row][n.col],h=n.shape.midpoint;a?(e.setColor("white"),e.fillEllipse(h.x,h.y,n.shape.width*pt,n.shape.width*pt)):a===!1&&(e.setColor("#ffffff64"),e.setLineDash([3*2,3*2]),e.strokeEllipse(h.x,h.y,n.shape.width*pt,n.shape.width*pt))}this.validator.draw(e,this.positionGetter),e.translate(-i.x,-i.y)}update(t,e){if(this.isOpen&&this.openCloseStatus<1?this.openCloseStatus+=t/Vt:!this.isOpen&&this.openCloseStatus>0&&(this.openCloseStatus-=t/Ut),this.openCloseStatus=x(this.openCloseStatus,0,1),e){let i=o.diff(e.mousePosition,this.uiPosition());for(let r of this.elements)r.isHovered=r.shape.intersectsPoint(i)}}onStateChange(){this.isSolved=this.validator.isValid(this.state),this.isSolved&&(this.hasBeenSolvedEver=!0)}onInput(t){let e=!1;if(t.isClick()){let i=o.diff(t.position,this.uiPosition());for(let r of this.elements)if(r.isHovered=r.shape.intersectsPoint(i),r.isHovered){let n=this.state[r.row][r.col];e=!0;let a=null;t.isRightClick()?n===!1?a=null:a=!1:n===!0?a=null:a=!0,this.state[r.row][r.col]=a}}e&&this.onStateChange()}};var Tt=class{constructor(t){this.validationItems=t}isValid(t){return this.validationItems.forEach(e=>{e.validate(t)}),this.validationItems.every(e=>e.isValid)}draw(t,...e){this.validationItems.forEach(i=>{i.draw(t,...e)})}},Dt=class{constructor(){this.isValid=!1}validate(t){}draw(t){}},pe=[[new l(new o(0,0),.33)],[new l(new o(0,0),.33)],[new l(new o(0,.4),.33),new l(new o(0,-.4),.33)],[new l(new o(-.42,.4),.33),new l(new o(.42,.4),.33),new l(new o(0,-.4),.33)],[new l(new o(.4,.4),.33),new l(new o(.4,-.4),.33),new l(new o(-.4,.4),.33),new l(new o(-.4,-.4),.33)],[new l(new o(0,.3),.28),new l(new o(.64,.3),.28),new l(new o(-.64,.3),.28),new l(new o(-.32,-.3),.28),new l(new o(.32,-.3),.28)],[new l(new o(0,.6),.28),new l(new o(.64,.6),.28),new l(new o(-.64,.6),.28),new l(new o(-.32,0),.28),new l(new o(.32,0),.28),new l(new o(0,-.6),.28)],[new l(new o(0,0),.28),new l(new o(.64,0),.28),new l(new o(-.64,0),.28),new l(new o(-.32,-.6),.28),new l(new o(.32,-.6),.28),new l(new o(-.32,.6),.28),new l(new o(.32,.6),.28)],[new l(new o(0,.6),.28),new l(new o(.64,.6),.28),new l(new o(-.64,.6),.28),new l(new o(-.32,0),.28),new l(new o(.32,0),.28),new l(new o(0,-.6),.28),new l(new o(.64,-.6),.28),new l(new o(-.64,-.6),.28)]],fe=[[d.centerForm(0,0,.33,.33)],[d.centerForm(0,0,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(0,.4,.33,.33)],[d.centerForm(0,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)],[d.centerForm(-.4,-.4,.33,.33),d.centerForm(.4,-.4,.33,.33),d.centerForm(-.4,.4,.33,.33),d.centerForm(.4,.4,.33,.33)]],Bt=s=>new o(-s.y,s.x),ft=class extends Dt{constructor(t,e){super(),this.isRow=t,this.index=e,this.isValid=!1}getRelevantRow(t){return this.isRow?t[this.index]:t.map(e=>e[this.index])}validateRow(t){throw new TypeError("Cannot validate as a generic EdgeValidationItem")}validate(t){let e=this.getRelevantRow(t);this.isValid=this.validateRow(e)}drawInCell(t,e,i,r){throw new TypeError("Cannot draw a generic EdgeValidationItem")}draw(t,e){if(this.isValid?t.setColor("white"):t.setColor("red"),this.isRow){let i=e(this.index,"end");this.drawInCell(t,i.midpoint,i.width/2,!0)}else{let i=e(-1,this.index);this.drawInCell(t,i.midpoint,i.height/2,!1)}}},mt=class extends ft{constructor(t,e,i){super(t,e),this.count=i,this.isValid=i===0}validateRow(t){return t.reduce((i,r)=>r?i+1:i,0)===this.count}drawInCell(t,e,i,r){let n=r?a=>new l(Bt(a.position),a.radius):a=>a;for(let a of pe[this.count]){a=n(a);let h=o.add(e,o.scale(a.position,i));this.count===0?(t.setLineWidth(a.radius*i*.5),t.strokeEllipse(h.x,h.y,a.radius*i*.75,a.radius*i*.75)):t.fillEllipse(h.x,h.y,a.radius*i,a.radius*i)}}},Y=class extends mt{validateRow(t){let[e]=t.reduce(([i,r],n)=>n&&!r?[i+1,!0]:[i,!!n],[0,!1]);return e===this.count}drawSquare(t,e,i){t.fillRect(e.x-i/2,e.y-i/2,i,i)}drawInCell(t,e,i,r){let n=a=>r?Bt(a):a;for(let a of fe[this.count]){let h=o.add(e,o.scale(n(a.midpoint),i)),u=a.width*i;this.drawSquare(t,h,u)}}},wt=class extends Y{constructor(t,e,i){super(t,e,i),this.isValid=i===1}validateRow(t){let[e]=t.reduce(([i,r],n)=>!n&&r?[i+1,!1]:[i,!!n],[0,!0]);return e===this.count}drawSquare(t,e,i){t.setLineDash([]),t.setLineWidth(i*.25),t.strokeRectInset(e.x,e.y,0,0,-i*.4)}},yt=class extends ft{constructor(t,e){super(t,e),this.isValid=!0}validateRow(t){let e=0;for(let i of t)if(i?e+=1:e=0,e>=3)return!1;return!0}drawInCell(t,e,i,r){t.setLineWidth(i*.1),t.setLineDash([]),t.fillEllipse(e.x,e.y,.22*i,.22*i);let n=o.add(e,o.scale(r?new o(-.5,0):new o(0,.5),i));t.fillEllipse(n.x,n.y,.22*i,.22*i);let a=o.add(e,o.diff(e,n)),h=i*.22;t.drawLine(a.x-h,a.y-h,a.x+h,a.y+h),t.drawLine(a.x-h,a.y+h,a.x+h,a.y-h)}},D=class{constructor(){this.validationItems=[]}addEdgeValidators(t,e,i=mt){t.forEach((r,n)=>{typeof r=="number"&&this.validationItems.push(new i(e,n,r))})}addColumnCounts(t){return this.addEdgeValidators(t,!1),this}addRowCounts(t){return this.addEdgeValidators(t,!0),this}addColumnGroups(t){return this.addEdgeValidators(t,!1,Y),this}addRowGroups(t){return this.addEdgeValidators(t,!0,Y),this}addColumnBlankGroups(t){return this.addEdgeValidators(t,!1,wt),this}addRowBlankGroups(t){return this.addEdgeValidators(t,!0,wt),this}addColumnNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new yt(!1,i))})}addRowNoTriple(t){t.forEach((e,i)=>{!e||this.validationItems.push(new yt(!0,i))})}create(){return new Tt(this.validationItems)}};function me(s){return s==="1"?new D().addColumnCounts([1,3,1]).addRowCounts([2,2,1]).create():s==="2"?new D().addColumnCounts([4,3,2,1]).addRowCounts([1,2,3,4]).create():s==="3"?new D().addColumnCounts([1,1,1]).addRowCounts([1,1,1]).create():s==="4"?new D().addRowCounts([4,3,null]).addColumnGroups([1,null,null,2]).create():(console.error("Cannot find puzzle with id",s),new D().create())}function we(s){let t=me(s);if(s==="1")return new N(s,3,3,t);if(s==="2")return new N(s,4,4,t);if(s==="3")return new N(s,3,3,t);if(s==="4")return new N(s,3,4,t);console.error("Cannot find puzzle with id",s)}var Mt=class{constructor(){this.puzzleMap={}}loadPuzzle(t){return we(t)}getPuzzle(t){if(t in this.puzzleMap)return this.puzzleMap[t];let e=this.loadPuzzle(t);return this.puzzleMap[t]=e,e}},xt=new Mt;var gt=class{constructor(t,e,i){this.id=t,this.position=e,this.area=i,this.isTriggered=!1,this.puzzle=xt.getPuzzle(this.id)}update(t,e){this.isTriggered=this.area.intersectsPoint(t)}draw(t){let e=1,i=1/10;t.setColorRGB(0,0,0),t.fillRect(this.position.x-e/2,this.position.y+e,e,2),t.setLineWidth(i),this.isTriggered&&(t.setColorRGB(255,255,255,128),t.strokeRectInset(this.position.x,this.position.y,0,0,-e-i*1.5)),t.setColorRGB(0,0,0),t.strokeRectInset(this.position.x,this.position.y,0,0,-e-i/2),this.puzzle.isSolved&&(t.setColor("white"),t.fillRect(this.position.x+e-6*i,this.position.y-e-1*i,i*2,i*1)),this.puzzle.hasBeenSolvedEver&&(t.setColor("yellow"),t.fillRect(this.position.x+e-3*i,this.position.y-e-1*i,i*2,i*1)),t.setColor(this.puzzle.isSolved?lt:ct),t.fillRect(this.position.x-e,this.position.y-e,e*2,e*2);let r=new o(this.position.x-e,this.position.y-e);t.translate(r.x,r.y),t.setColor("white");let n=this.puzzle.state,a=i;for(let h=0;h<n.length;h++)for(let u=0;u<n[h].length;u++)n[h][u]&&t.fillRect(a+u*2*(e-a)/n[h].length,a+h*2*(e-a)/n.length,i*2,i*2);t.translate(-r.x,-r.y)}};var ye="./data/world.json";function xe(s){return fetch(s).then(t=>t.json())}function jt(s,t){return s.find(e=>e.__identifier===t)}function Yt(s,t){return jt(s.layerInstances,t)}function W(s){return Math.floor(s/10)}function ge(s){return W(s[0])+1}function Ee(s){let t=new ht(s.identifier,s.iid,W(s.pxWid),W(s.pxHei));t.makeGridSpace();let e=Yt(s,"Solid");for(let n of e.gridTiles){let a=W(n.px[0]),h=W(n.px[1]),u=ge(n.src);t.setCell(h,a,u)}let i=!1;return Yt(s,"EntityLayer").entityInstances.forEach(n=>{switch(n.__identifier){case"PlayerStart":t.setPlayerPos(new o(n.__grid[0],n.__grid[1])),i=!0;break;case"PuzzleScreen":let a=jt(n.fieldInstances,"key");a||console.warn("Puzzle with no key in:",s.identifier);let h=new o(n.__grid[0]+2,n.__grid[1]+2);t.addInteractibles([new gt(a.__value,h,d.aroundPoint(h,2,2))]);break;default:console.warn("Processing unknown entity type:",n.__identifier)}}),i||console.warn(`Level ${s.identifier} is missing a PlayerStart`),t.setWorldPosition(new o(W(s.worldX),W(s.worldY))),t}function Ce(s,t){let e=t[s.iid];for(let i of s.__neighbours){let r=i.levelIid,n=t[r],a=o.diff(n.worldPosition,e.worldPosition),h=d.widthForm(a.x,a.y,n.width,n.height);e.addExits([new $(h,n.key,h)])}return e.create()}var j=class{static start(){return xe(ye).then(t=>{j.data=t;let e={};t.levels.forEach(i=>{let r=Ee(i);e[r.iid]=r,e[r.key]=r}),t.levels.forEach(i=>{let r=Ce(i,e);j.levelMap[r.key]=r})}).then(()=>{})}static getLevel(t){return j.levelMap[t]}},R=j;k(R,"hasLoaded",!1),k(R,"data",null),k(R,"levelMap",{});var Et=class{constructor(){let t="Level_0";this.levelMap={},this.currentLevel=R.getLevel(t),this.levelMap[t]=this.currentLevel}getInitialLevel(){return this.currentLevel}getLevel(t,e){let i=this.levelMap[t]||R.getLevel(t);return i.feedPlayerInfo(this.currentLevel.player,e),this.currentLevel=i,this.levelMap[t]=i,i}};var Ct=class{constructor(){this.levelManager=new Et,this.startLevel(this.levelManager.getInitialLevel()),this.puzzleManager=xt,this.currentPuzzle=void 0}startLevel(t){this.currentLevel=t,t.start(this)}onLevelEvent(t){if(t.isExitEvent()){let e=t.exitTrigger;this.startLevel(this.levelManager.getLevel(e.key,e))}else t.isOpenPuzzleEvent()?(this.currentPuzzle=this.puzzleManager.getPuzzle(t.puzzleId),this.currentPuzzle.open()):t.isClosePuzzleEvent()&&this.currentPuzzle?.close()}update(t,e){this.currentLevel.update(t,e),this.currentPuzzle?.update(t,e)}onInput(t){this.currentLevel.onInput(t),this.currentPuzzle?.onInput(t)}draw(t){this.currentLevel.draw(t),this.currentPuzzle?.draw(t)}};var It=class{constructor(){this.playMode=new Ct,this.currentMode=this.playMode}update(t,e){this.currentMode.update(t,e)}onInput(t){this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}};var Ie=1/20,zt=class{constructor(){this.screenManager=B.getInstance(),this.gameModeManager=new It,this.inputManager=new tt(t=>this.onInput(t))}start(){this.inputManager.init(),this.lastFrameTime=performance.now(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,Ie);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},Le=()=>{R.start().then(()=>{let t=new zt;t.start(),window.app=t}),location.href.includes("localhost")||Array.from(document.getElementsByTagName("p")).forEach(t=>t.classList.add("visible"))};window.onload=()=>{Le()};})();

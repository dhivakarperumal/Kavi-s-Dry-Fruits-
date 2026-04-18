import{R as e,r as t,g as r,a as n}from"./vendor-react-1YIB3dF-.js";var o={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},i=e.createContext&&e.createContext(o),a=["attr","size","title"];function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},c.apply(this,arguments)}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach(function(t){f(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function f(e,t,r){var n;return(t="symbol"==typeof(n=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t);if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?n:n+"")in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(t){return t&&t.map((t,r)=>e.createElement(t.tag,l({key:r},t.attr),p(t.child)))}function d(t){return r=>e.createElement(y,c({attr:l({},t.attr)},r),p(t.child))}function y(t){var r=r=>{var n,{attr:o,size:i,title:u}=t,f=s(t,a),p=i||r.size||"1em";return r.className&&(n=r.className),t.className&&(n=(n?n+" ":"")+t.className),e.createElement("svg",c({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,o,f,{className:n,style:l(l({color:t.color||r.color},r.style),t.style),height:p,width:p,xmlns:"http://www.w3.org/2000/svg"}),u&&e.createElement("title",null,u),t.children)};return void 0!==i?e.createElement(i.Consumer,null,e=>r(e)):r(o)}let m,h,b,g={data:""},v=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,w=/\/\*[^]*?\*\/|  +/g,O=/\n+/g,T=(e,t)=>{let r="",n="",o="";for(let i in e){let a=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+a+";":n+="f"==i[1]?T(a,i):i+"{"+T(a,"k"==i[1]?"":t)+"}":"object"==typeof a?n+=T(a,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=a&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=T.p?T.p(i,a):i+":"+a+";")}return r+(t&&o?t+"{"+o+"}":o)+n},E={},j=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+j(e[r]);return t}return e};function x(e){let t=this||{},r=e.call?e(t.p):e;return((e,t,r,n,o)=>{let i=j(e),a=E[i]||(E[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!E[a]){let t=i!==e?e:(e=>{let t,r,n=[{}];for(;t=v.exec(e.replace(w,""));)t[4]?n.shift():t[3]?(r=t[3].replace(O," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(O," ").trim();return n[0]})(e);E[a]=T(o?{["@keyframes "+a]:t}:t,r?"":"."+a)}let s=r&&E.g?E.g:null;return r&&(E.g=E[a]),c=E[a],u=t,l=n,(f=s)?u.data=u.data.replace(f,c):-1===u.data.indexOf(c)&&(u.data=l?c+u.data:u.data+c),a;var c,u,l,f})(r.unshift?r.raw?((e,t,r)=>e.reduce((e,n,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":T(e,""):!1===e?"":e}return e+n+(null==i?"":i)},""))(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,(n=t.target,"object"==typeof window?((n?n.querySelector("#_goober"):window._goober)||Object.assign((n||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:n||g),t.g,t.o,t.k);var n}x.bind({g:1});let C=x.bind({k:1});function A(e,t){let r=this||{};return function(){let t=arguments;return function n(o,i){let a=Object.assign({},o),s=a.className||n.className;r.p=Object.assign({theme:h&&h()},a),r.o=/ *go\d+/.test(s),a.className=x.apply(r,t)+(s?" "+s:"");let c=e;return e[0]&&(c=a.as||e,delete a.as),b&&c[0]&&b(a),m(c,a)}}}var S=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,P=(()=>{let e=0;return()=>(++e).toString()})(),k=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),I=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return I(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(e=>e.id===n||void 0===n?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},N=[],L={toasts:[],pausedAt:void 0},D=e=>{L=I(L,e),N.forEach(e=>{e(L)})},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},_=e=>(t,r)=>{let n=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||P()}))(t,e,r);return D({type:2,toast:n}),n.id},R=(e,t)=>_("blank")(e,t);R.error=_("error"),R.success=_("success"),R.loading=_("loading"),R.custom=_("custom"),R.dismiss=e=>{D({type:3,toastId:e})},R.remove=e=>D({type:4,toastId:e}),R.promise=(e,t,r)=>{let n=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?S(t.success,e):void 0;return o?R.success(o,{id:n,...r,...null==r?void 0:r.success}):R.dismiss(n),e}).catch(e=>{let o=t.error?S(t.error,e):void 0;o?R.error(o,{id:n,...r,...null==r?void 0:r.error}):R.dismiss(n)}),e};var $,z,H,q,F=(e,t)=>{D({type:1,toast:{id:e,height:t}})},B=()=>{D({type:5,time:Date.now()})},U=new Map,Y=e=>{let{toasts:r,pausedAt:n}=((e={})=>{let[r,n]=t.useState(L),o=t.useRef(L);t.useEffect(()=>(o.current!==L&&n(L),N.push(n),()=>{let e=N.indexOf(n);e>-1&&N.splice(e,1)}),[]);let i=r.toasts.map(t=>{var r,n,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||M[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:i}})(e);t.useEffect(()=>{if(n)return;let e=Date.now(),t=r.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(!(r<0))return setTimeout(()=>R.dismiss(t.id),r);t.visible&&R.dismiss(t.id)});return()=>{t.forEach(e=>e&&clearTimeout(e))}},[r,n]);let o=t.useCallback(()=>{n&&D({type:6,time:Date.now()})},[n]),i=t.useCallback((e,t)=>{let{reverseOrder:n=!1,gutter:o=8,defaultPosition:i}=t||{},a=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),s=a.findIndex(t=>t.id===e.id),c=a.filter((e,t)=>t<s&&e.visible).length;return a.filter(e=>e.visible).slice(...n?[c+1]:[0,c]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return t.useEffect(()=>{r.forEach(e=>{if(e.dismissed)((e,t=1e3)=>{if(U.has(e))return;let r=setTimeout(()=>{U.delete(e),D({type:4,toastId:e})},t);U.set(e,r)})(e.id,e.removeDelay);else{let t=U.get(e.id);t&&(clearTimeout(t),U.delete(e.id))}})},[r]),{toasts:r,handlers:{updateHeight:F,startPause:B,endPause:o,calculateOffset:i}}},W=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,K=C`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=C`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,G=A("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=C`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,J=A("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Z} 1s linear infinite;
`,Q=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,X=C`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ee=A("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,te=A("div")`
  position: absolute;
`,re=A("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ne=C`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,oe=A("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ne} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ie=({toast:e})=>{let{icon:r,type:n,iconTheme:o}=e;return void 0!==r?"string"==typeof r?t.createElement(oe,null,r):r:"blank"===n?null:t.createElement(re,null,t.createElement(J,{...o}),"loading"!==n&&t.createElement(te,null,"error"===n?t.createElement(G,{...o}):t.createElement(ee,{...o})))},ae=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,se=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,ce=A("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ue=A("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,le=t.memo(({toast:e,position:r,style:n,children:o})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[n,o]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ae(r),se(r)];return{animation:t?`${C(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${C(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||r||"top-center",e.visible):{opacity:0},a=t.createElement(ie,{toast:e}),s=t.createElement(ue,{...e.ariaProps},S(e.message,e));return t.createElement(ce,{className:e.className,style:{...i,...n,...e.style}},"function"==typeof o?o({icon:a,message:s}):t.createElement(t.Fragment,null,a,s))});$=t.createElement,T.p=z,m=$,h=H,b=q;var fe,pe,de,ye,me,he=({id:e,className:r,style:n,onHeightUpdate:o,children:i})=>{let a=t.useCallback(t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;o(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return t.createElement("div",{ref:a,className:r,style:n},i)},be=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ge=({reverseOrder:e,position:r="top-center",toastOptions:n,gutter:o,children:i,containerStyle:a,containerClassName:s})=>{let{toasts:c,handlers:u}=Y(n);return t.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:s,onMouseEnter:u.startPause,onMouseLeave:u.endPause},c.map(n=>{let a=n.position||r,s=((e,t)=>{let r=e.includes("top"),n=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...n,...o}})(a,u.calculateOffset(n,{reverseOrder:e,gutter:o,defaultPosition:r}));return t.createElement(he,{id:n.id,key:n.id,onHeightUpdate:u.updateHeight,className:n.visible?be:"",style:s},"custom"===n.type?S(n.message,n):i?i(n):t.createElement(le,{toast:n,position:a}))}))},ve=R,we={exports:{}};function Oe(){if(pe)return fe;pe=1;return fe="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}function Te(){if(ye)return de;ye=1;var e=Oe();function t(){}function r(){}return r.resetWarningCache=t,de=function(){function n(t,r,n,o,i,a){if(a!==e){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function o(){return n}n.isRequired=n;var i={array:n,bigint:n,bool:n,func:n,number:n,object:n,string:n,symbol:n,any:n,arrayOf:o,element:n,elementType:n,instanceOf:o,node:n,objectOf:o,oneOf:o,oneOfType:o,shape:o,exact:o,checkPropTypes:r,resetWarningCache:t};return i.PropTypes=i,i}}function Ee(){return me||(me=1,we.exports=Te()()),we.exports}const je=r(Ee());var xe,Ce;const Ae=r(function(){if(Ce)return xe;Ce=1;var e,t=n(),r=(e=t)&&"object"==typeof e&&"default"in e?e.default:e;function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var i=!("undefined"==typeof window||!window.document||!window.document.createElement);return xe=function(e,n,a){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof n)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==a&&"function"!=typeof a)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(s){if("function"!=typeof s)throw new Error("Expected WrappedComponent to be a React component.");var c,u=[];function l(){c=e(u.map(function(e){return e.props})),f.canUseDOM?n(c):a&&(c=a(c))}var f=function(e){var t,n;function o(){return e.apply(this,arguments)||this}n=e,(t=o).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,o.peek=function(){return c},o.rewind=function(){if(o.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=c;return c=void 0,u=[],e};var i=o.prototype;return i.UNSAFE_componentWillMount=function(){u.push(this),l()},i.componentDidUpdate=function(){l()},i.componentWillUnmount=function(){var e=u.indexOf(this);u.splice(e,1),l()},i.render=function(){return r.createElement(s,this.props)},o}(t.PureComponent);return o(f,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(s)+")"),o(f,"canUseDOM",i),f}}}());var Se,Pe;const ke=r(function(){if(Pe)return Se;Pe=1;var e="undefined"!=typeof Element,t="function"==typeof Map,r="function"==typeof Set,n="function"==typeof ArrayBuffer&&!!ArrayBuffer.isView;function o(i,a){if(i===a)return!0;if(i&&a&&"object"==typeof i&&"object"==typeof a){if(i.constructor!==a.constructor)return!1;var s,c,u,l;if(Array.isArray(i)){if((s=i.length)!=a.length)return!1;for(c=s;0!==c--;)if(!o(i[c],a[c]))return!1;return!0}if(t&&i instanceof Map&&a instanceof Map){if(i.size!==a.size)return!1;for(l=i.entries();!(c=l.next()).done;)if(!a.has(c.value[0]))return!1;for(l=i.entries();!(c=l.next()).done;)if(!o(c.value[1],a.get(c.value[0])))return!1;return!0}if(r&&i instanceof Set&&a instanceof Set){if(i.size!==a.size)return!1;for(l=i.entries();!(c=l.next()).done;)if(!a.has(c.value[0]))return!1;return!0}if(n&&ArrayBuffer.isView(i)&&ArrayBuffer.isView(a)){if((s=i.length)!=a.length)return!1;for(c=s;0!==c--;)if(i[c]!==a[c])return!1;return!0}if(i.constructor===RegExp)return i.source===a.source&&i.flags===a.flags;if(i.valueOf!==Object.prototype.valueOf&&"function"==typeof i.valueOf&&"function"==typeof a.valueOf)return i.valueOf()===a.valueOf();if(i.toString!==Object.prototype.toString&&"function"==typeof i.toString&&"function"==typeof a.toString)return i.toString()===a.toString();if((s=(u=Object.keys(i)).length)!==Object.keys(a).length)return!1;for(c=s;0!==c--;)if(!Object.prototype.hasOwnProperty.call(a,u[c]))return!1;if(e&&i instanceof Element)return!1;for(c=s;0!==c--;)if(("_owner"!==u[c]&&"__v"!==u[c]&&"__o"!==u[c]||!i.$$typeof)&&!o(i[u[c]],a[u[c]]))return!1;return!0}return i!=i&&a!=a}return Se=function(e,t){try{return o(e,t)}catch(r){if((r.message||"").match(/stack|recursion/i))return!1;throw r}}}());
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var Ie,Ne;const Le=r(function(){if(Ne)return Ie;Ne=1;var e=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable;return Ie=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(o){return!1}}()?Object.assign:function(n,o){for(var i,a,s=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(n),c=1;c<arguments.length;c++){for(var u in i=Object(arguments[c]))t.call(i,u)&&(s[u]=i[u]);if(e){a=e(i);for(var l=0;l<a.length;l++)r.call(i,a[l])&&(s[a[l]]=i[a[l]])}}return s}}());var De="bodyAttributes",Me="htmlAttributes",_e="titleAttributes",Re={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"};Object.keys(Re).map(function(e){return Re[e]});var $e,ze,He,qe,Fe="charset",Be="cssText",Ue="href",Ye="http-equiv",We="innerHTML",Ke="itemprop",Ve="name",Ge="property",Ze="rel",Je="src",Qe="target",Xe={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},et="defaultTitle",tt="defer",rt="encodeSpecialCharacters",nt="onChangeClientState",ot="titleTemplate",it=Object.keys(Xe).reduce(function(e,t){return e[Xe[t]]=t,e},{}),at=[Re.NOSCRIPT,Re.SCRIPT,Re.STYLE],st="data-react-helmet",ct="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ut=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),lt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},ft=function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r},pt=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},dt=function(e){var t=gt(e,Re.TITLE),r=gt(e,ot);if(r&&t)return r.replace(/%s/g,function(){return Array.isArray(t)?t.join(""):t});var n=gt(e,et);return t||n||void 0},yt=function(e){return gt(e,nt)||function(){}},mt=function(e,t){return t.filter(function(t){return void 0!==t[e]}).map(function(t){return t[e]}).reduce(function(e,t){return lt({},e,t)},{})},ht=function(e,t){return t.filter(function(e){return void 0!==e[Re.BASE]}).map(function(e){return e[Re.BASE]}).reverse().reduce(function(t,r){if(!t.length)for(var n=Object.keys(r),o=0;o<n.length;o++){var i=n[o].toLowerCase();if(-1!==e.indexOf(i)&&r[i])return t.concat(r)}return t},[])},bt=function(e,t,r){var n={};return r.filter(function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&Et("Helmet: "+e+' should be of type "Array". Instead found type "'+ct(t[e])+'"'),!1)}).map(function(t){return t[e]}).reverse().reduce(function(e,r){var o={};r.filter(function(e){for(var r=void 0,i=Object.keys(e),a=0;a<i.length;a++){var s=i[a],c=s.toLowerCase();-1===t.indexOf(c)||r===Ze&&"canonical"===e[r].toLowerCase()||c===Ze&&"stylesheet"===e[c].toLowerCase()||(r=c),-1===t.indexOf(s)||s!==We&&s!==Be&&s!==Ke||(r=s)}if(!r||!e[r])return!1;var u=e[r].toLowerCase();return n[r]||(n[r]={}),o[r]||(o[r]={}),!n[r][u]&&(o[r][u]=!0,!0)}).reverse().forEach(function(t){return e.push(t)});for(var i=Object.keys(o),a=0;a<i.length;a++){var s=i[a],c=Le({},n[s],o[s]);n[s]=c}return e},[]).reverse()},gt=function(e,t){for(var r=e.length-1;r>=0;r--){var n=e[r];if(n.hasOwnProperty(t))return n[t]}return null},vt=($e=Date.now(),function(e){var t=Date.now();t-$e>16?($e=t,e(t)):setTimeout(function(){vt(e)},0)}),wt=function(e){return clearTimeout(e)},Ot="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||vt:global.requestAnimationFrame||vt,Tt="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||wt:global.cancelAnimationFrame||wt,Et=function(e){return console&&"function"==typeof console.warn&&void 0},jt=null,xt=function(e,t){var r=e.baseTag,n=e.bodyAttributes,o=e.htmlAttributes,i=e.linkTags,a=e.metaTags,s=e.noscriptTags,c=e.onChangeClientState,u=e.scriptTags,l=e.styleTags,f=e.title,p=e.titleAttributes;St(Re.BODY,n),St(Re.HTML,o),At(f,p);var d={baseTag:Pt(Re.BASE,r),linkTags:Pt(Re.LINK,i),metaTags:Pt(Re.META,a),noscriptTags:Pt(Re.NOSCRIPT,s),scriptTags:Pt(Re.SCRIPT,u),styleTags:Pt(Re.STYLE,l)},y={},m={};Object.keys(d).forEach(function(e){var t=d[e],r=t.newTags,n=t.oldTags;r.length&&(y[e]=r),n.length&&(m[e]=d[e].oldTags)}),t&&t(),c(e,y,m)},Ct=function(e){return Array.isArray(e)?e.join(""):e},At=function(e,t){void 0!==e&&document.title!==e&&(document.title=Ct(e)),St(Re.TITLE,t)},St=function(e,t){var r=document.getElementsByTagName(e)[0];if(r){for(var n=r.getAttribute(st),o=n?n.split(","):[],i=[].concat(o),a=Object.keys(t),s=0;s<a.length;s++){var c=a[s],u=t[c]||"";r.getAttribute(c)!==u&&r.setAttribute(c,u),-1===o.indexOf(c)&&o.push(c);var l=i.indexOf(c);-1!==l&&i.splice(l,1)}for(var f=i.length-1;f>=0;f--)r.removeAttribute(i[f]);o.length===i.length?r.removeAttribute(st):r.getAttribute(st)!==a.join(",")&&r.setAttribute(st,a.join(","))}},Pt=function(e,t){var r=document.head||document.querySelector(Re.HEAD),n=r.querySelectorAll(e+"["+st+"]"),o=Array.prototype.slice.call(n),i=[],a=void 0;return t&&t.length&&t.forEach(function(t){var r=document.createElement(e);for(var n in t)if(t.hasOwnProperty(n))if(n===We)r.innerHTML=t.innerHTML;else if(n===Be)r.styleSheet?r.styleSheet.cssText=t.cssText:r.appendChild(document.createTextNode(t.cssText));else{var s=void 0===t[n]?"":t[n];r.setAttribute(n,s)}r.setAttribute(st,"true"),o.some(function(e,t){return a=t,r.isEqualNode(e)})?o.splice(a,1):i.push(r)}),o.forEach(function(e){return e.parentNode.removeChild(e)}),i.forEach(function(e){return r.appendChild(e)}),{oldTags:o,newTags:i}},kt=function(e){return Object.keys(e).reduce(function(t,r){var n=void 0!==e[r]?r+'="'+e[r]+'"':""+r;return t?t+" "+n:n},"")},It=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce(function(t,r){return t[Xe[r]||r]=e[r],t},t)},Nt=function(t,r,n){switch(t){case Re.TITLE:return{toComponent:function(){return t=r.title,n=r.titleAttributes,(o={key:t})[st]=!0,i=It(n,o),[e.createElement(Re.TITLE,i,t)];var t,n,o,i},toString:function(){return function(e,t,r,n){var o=kt(r),i=Ct(t);return o?"<"+e+" "+st+'="true" '+o+">"+pt(i,n)+"</"+e+">":"<"+e+" "+st+'="true">'+pt(i,n)+"</"+e+">"}(t,r.title,r.titleAttributes,n)}};case De:case Me:return{toComponent:function(){return It(r)},toString:function(){return kt(r)}};default:return{toComponent:function(){return function(t,r){return r.map(function(r,n){var o,i=((o={key:n})[st]=!0,o);return Object.keys(r).forEach(function(e){var t=Xe[e]||e;if(t===We||t===Be){var n=r.innerHTML||r.cssText;i.dangerouslySetInnerHTML={__html:n}}else i[t]=r[e]}),e.createElement(t,i)})}(t,r)},toString:function(){return function(e,t,r){return t.reduce(function(t,n){var o=Object.keys(n).filter(function(e){return!(e===We||e===Be)}).reduce(function(e,t){var o=void 0===n[t]?t:t+'="'+pt(n[t],r)+'"';return e?e+" "+o:o},""),i=n.innerHTML||n.cssText||"",a=-1===at.indexOf(e);return t+"<"+e+" "+st+'="true" '+o+(a?"/>":">"+i+"</"+e+">")},"")}(t,r,n)}}}},Lt=function(e){var t=e.baseTag,r=e.bodyAttributes,n=e.encode,o=e.htmlAttributes,i=e.linkTags,a=e.metaTags,s=e.noscriptTags,c=e.scriptTags,u=e.styleTags,l=e.title,f=void 0===l?"":l,p=e.titleAttributes;return{base:Nt(Re.BASE,t,n),bodyAttributes:Nt(De,r,n),htmlAttributes:Nt(Me,o,n),link:Nt(Re.LINK,i,n),meta:Nt(Re.META,a,n),noscript:Nt(Re.NOSCRIPT,s,n),script:Nt(Re.SCRIPT,c,n),style:Nt(Re.STYLE,u,n),title:Nt(Re.TITLE,{title:f,titleAttributes:p},n)}},Dt=Ae(function(e){return{baseTag:ht([Ue,Qe],e),bodyAttributes:mt(De,e),defer:gt(e,tt),encode:gt(e,rt),htmlAttributes:mt(Me,e),linkTags:bt(Re.LINK,[Ze,Ue],e),metaTags:bt(Re.META,[Ve,Fe,Ye,Ge,Ke],e),noscriptTags:bt(Re.NOSCRIPT,[We],e),onChangeClientState:yt(e),scriptTags:bt(Re.SCRIPT,[Je,We],e),styleTags:bt(Re.STYLE,[Be],e),title:dt(e),titleAttributes:mt(_e,e)}},function(e){jt&&Tt(jt),e.defer?jt=Ot(function(){xt(e,function(){jt=null})}):(xt(e),jt=null)},Lt)(function(){return null}),Mt=(ze=Dt,qe=He=function(t){function r(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,t.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,t),r.prototype.shouldComponentUpdate=function(e){return!ke(this.props,e)},r.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case Re.SCRIPT:case Re.NOSCRIPT:return{innerHTML:t};case Re.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},r.prototype.flattenArrayTypeChildren=function(e){var t,r=e.child,n=e.arrayTypeChildren,o=e.newChildProps,i=e.nestedChildren;return lt({},n,((t={})[r.type]=[].concat(n[r.type]||[],[lt({},o,this.mapNestedChildrenToProps(r,i))]),t))},r.prototype.mapObjectTypeChildren=function(e){var t,r,n=e.child,o=e.newProps,i=e.newChildProps,a=e.nestedChildren;switch(n.type){case Re.TITLE:return lt({},o,((t={})[n.type]=a,t.titleAttributes=lt({},i),t));case Re.BODY:return lt({},o,{bodyAttributes:lt({},i)});case Re.HTML:return lt({},o,{htmlAttributes:lt({},i)})}return lt({},o,((r={})[n.type]=lt({},i),r))},r.prototype.mapArrayTypeChildrenToProps=function(e,t){var r=lt({},t);return Object.keys(e).forEach(function(t){var n;r=lt({},r,((n={})[t]=e[t],n))}),r},r.prototype.warnOnInvalidChildren=function(e,t){return!0},r.prototype.mapChildrenToProps=function(t,r){var n=this,o={};return e.Children.forEach(t,function(e){if(e&&e.props){var t=e.props,i=t.children,a=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce(function(t,r){return t[it[r]||r]=e[r],t},t)}(ft(t,["children"]));switch(n.warnOnInvalidChildren(e,i),e.type){case Re.LINK:case Re.META:case Re.NOSCRIPT:case Re.SCRIPT:case Re.STYLE:o=n.flattenArrayTypeChildren({child:e,arrayTypeChildren:o,newChildProps:a,nestedChildren:i});break;default:r=n.mapObjectTypeChildren({child:e,newProps:r,newChildProps:a,nestedChildren:i})}}}),r=this.mapArrayTypeChildrenToProps(o,r)},r.prototype.render=function(){var t=this.props,r=t.children,n=ft(t,["children"]),o=lt({},n);return r&&(o=this.mapChildrenToProps(r,o)),e.createElement(ze,o)},ut(r,null,[{key:"canUseDOM",set:function(e){ze.canUseDOM=e}}]),r}(e.Component),He.propTypes={base:je.object,bodyAttributes:je.object,children:je.oneOfType([je.arrayOf(je.node),je.node]),defaultTitle:je.string,defer:je.bool,encodeSpecialCharacters:je.bool,htmlAttributes:je.object,link:je.arrayOf(je.object),meta:je.arrayOf(je.object),noscript:je.arrayOf(je.object),onChangeClientState:je.func,script:je.arrayOf(je.object),style:je.arrayOf(je.object),title:je.string,titleAttributes:je.object,titleTemplate:je.string},He.defaultProps={defer:!0,encodeSpecialCharacters:!0},He.peek=ze.peek,He.rewind=function(){var e=ze.rewind();return e||(e=Lt({baseTag:[],bodyAttributes:{},htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},qe);Mt.renderStatic=Mt.rewind;export{d as G,Mt as H,ge as O,ve as V,R as c};

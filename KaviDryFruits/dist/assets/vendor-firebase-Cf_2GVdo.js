var e={};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},n={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const t=e[i],s=i+1<e.length,o=s?e[i+1]:0,a=i+2<e.length,c=a?e[i+2]:0,u=t>>2,h=(3&t)<<4|o>>4;let l=(15&o)<<2|c>>6,d=63&c;a||(d=64,s||(l=64)),r.push(n[u],n[h],n[l],n[d])}return r.join("")},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=((7&i)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<e.length;){const t=n[e.charAt(s++)],o=s<e.length?n[e.charAt(s)]:0;++s;const a=s<e.length?n[e.charAt(s)]:64;++s;const c=s<e.length?n[e.charAt(s)]:64;if(++s,null==t||null==o||null==a||null==c)throw new r;const u=t<<2|o>>4;if(i.push(u),64!==a){const e=o<<4&240|a>>2;if(i.push(e),64!==c){const e=a<<6&192|c;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class r extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const i=function(e){return function(e){const r=t(e);return n.encodeByteArray(r,!0)}(e).replace(/\./g,"")},s=function(e){try{return n.decodeString(e,!0)}catch(t){}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function o(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a=()=>{try{return o().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const t=e.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&s(e[1]);return t&&JSON.parse(t)})()}catch(t){return}},c=e=>{var t,n;return null===(n=null===(t=a())||void 0===t?void 0:t.emulatorHosts)||void 0===n?void 0:n[e]},u=e=>{const t=c(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},h=()=>{var e;return null===(e=a())||void 0===e?void 0:e.config},l=e=>{var t;return null===(t=a())||void 0===t?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class d{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch(t){return!1}}async function p(e){return(await fetch(e,{credentials:"include"})).ok}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);return[i(JSON.stringify({alg:"none",type:"JWT"})),i(JSON.stringify(o)),""].join(".")}const m={};let y=!1;function v(e,t){if("undefined"==typeof window||"undefined"==typeof document||!f(window.location.host)||m[e]===t||m[e]||y)return;function n(e){return`__firebase__banner__${e}`}m[e]=t;const r="__firebase__banner",i=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(m))m[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function s(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{y=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),h=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=s();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(h,u),t.append(h,o,c,n),document.body.appendChild(t)}i?(o.innerText="Preview backend disconnected.",h.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(h.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function b(){var e;const t=null===(e=a())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}function I(){return!b()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function _(){return!b()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function T(){try{return"object"==typeof indexedDB}catch(e){return!1}}class E extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,E.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,S.prototype.create)}}class S{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?function(e,t){return e.replace(C,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new E(r,o,n)}}const C=/\{\$([^}]+)}/g;function A(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(k(n)&&k(s)){if(!A(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function k(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}class N{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=x),void 0===r.error&&(r.error=x),void 0===r.complete&&(r.complete=x);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function x(){}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(e){return e&&e._delegate?e._delegate:e}class O{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new d;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),r=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:P})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=P){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=P){return this.instances.has(e)}getOptions(e=P){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(i)&&s.resolve(r)}return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===P?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(i){}var r;return n||null}normalizeInstanceIdentifier(e=P){return this.component?this.component.multipleInstances?e:P:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class M{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new L(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var V,F;(F=V||(V={}))[F.DEBUG=0]="DEBUG",F[F.VERBOSE=1]="VERBOSE",F[F.INFO=2]="INFO",F[F.WARN=3]="WARN",F[F.ERROR=4]="ERROR",F[F.SILENT=5]="SILENT";const U={debug:V.DEBUG,verbose:V.VERBOSE,info:V.INFO,warn:V.WARN,error:V.ERROR,silent:V.SILENT},j=V.INFO,B={[V.DEBUG]:"log",[V.VERBOSE]:"log",[V.INFO]:"info",[V.WARN]:"warn",[V.ERROR]:"error"},q=(e,t,...n)=>{if(t<e.logLevel)return;(new Date).toISOString();if(!B[t])throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class z{constructor(e){this.name=e,this._logLevel=j,this._logHandler=q,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in V))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?U[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,V.DEBUG,...e),this._logHandler(this,V.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,V.VERBOSE,...e),this._logHandler(this,V.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,V.INFO,...e),this._logHandler(this,V.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,V.WARN,...e),this._logHandler(this,V.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,V.ERROR,...e),this._logHandler(this,V.ERROR,...e)}}let $,K;const G=new WeakMap,H=new WeakMap,W=new WeakMap,Q=new WeakMap,X=new WeakMap;let J={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return H.get(e);if("objectStoreNames"===t)return e.objectStoreNames||W.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ee(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function Y(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(K||(K=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(te(this),t),ee(G.get(this))}:function(...t){return ee(e.apply(te(this),t))}:function(t,...n){const r=e.call(te(this),t,...n);return W.set(r,t.sort?t.sort():[t]),ee(r)}}function Z(e){return"function"==typeof e?Y(e):(e instanceof IDBTransaction&&function(e){if(H.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});H.set(e,t)}(e),t=e,($||($=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,J):e);var t}function ee(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(ee(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&G.set(t,e)}).catch(()=>{}),X.set(t,e),t}(e);if(Q.has(e))return Q.get(e);const t=Z(e);return t!==e&&(Q.set(e,t),X.set(t,e)),t}const te=e=>X.get(e);const ne=["get","getKey","getAll","getAllKeys","count"],re=["put","add","delete","clear"],ie=new Map;function se(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ie.get(t))return ie.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=re.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!ne.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return ie.set(t,s),s}J=(e=>({...e,get:(t,n,r)=>se(t,n)||e.get(t,n,r),has:(t,n)=>!!se(t,n)||e.has(t,n)}))(J);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class oe{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const ae="@firebase/app",ce="0.13.2",ue=new z("@firebase/app"),he="@firebase/app-compat",le="@firebase/analytics-compat",de="@firebase/analytics",fe="@firebase/app-check-compat",pe="@firebase/app-check",ge="@firebase/auth",me="@firebase/auth-compat",ye="@firebase/database",ve="@firebase/data-connect",we="@firebase/database-compat",be="@firebase/functions",Ie="@firebase/functions-compat",_e="@firebase/installations",Te="@firebase/installations-compat",Ee="@firebase/messaging",Se="@firebase/messaging-compat",Ce="@firebase/performance",Ae="@firebase/performance-compat",ke="@firebase/remote-config",De="@firebase/remote-config-compat",Ne="@firebase/storage",xe="@firebase/storage-compat",Re="@firebase/firestore",Oe="@firebase/ai",Pe="@firebase/firestore-compat",Le="firebase",Me="[DEFAULT]",Ve={[ae]:"fire-core",[he]:"fire-core-compat",[de]:"fire-analytics",[le]:"fire-analytics-compat",[pe]:"fire-app-check",[fe]:"fire-app-check-compat",[ge]:"fire-auth",[me]:"fire-auth-compat",[ye]:"fire-rtdb",[ve]:"fire-data-connect",[we]:"fire-rtdb-compat",[be]:"fire-fn",[Ie]:"fire-fn-compat",[_e]:"fire-iid",[Te]:"fire-iid-compat",[Ee]:"fire-fcm",[Se]:"fire-fcm-compat",[Ce]:"fire-perf",[Ae]:"fire-perf-compat",[ke]:"fire-rc",[De]:"fire-rc-compat",[Ne]:"fire-gcs",[xe]:"fire-gcs-compat",[Re]:"fire-fst",[Pe]:"fire-fst-compat",[Oe]:"fire-vertex","fire-js":"fire-js",[Le]:"fire-js-all"},Fe=new Map,Ue=new Map,je=new Map;function Be(e,t){try{e.container.addComponent(t)}catch(n){ue.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function qe(e){const t=e.name;if(je.has(t))return ue.debug(`There were multiple attempts to register component ${t}.`),!1;je.set(t,e);for(const n of Fe.values())Be(n,e);for(const n of Ue.values())Be(n,e);return!0}function ze(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function $e(e){return null!=e&&void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke=new S("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ge{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new O("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ke.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He="11.10.0";function We(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r=Object.assign({name:Me,automaticDataCollectionEnabled:!0},t),i=r.name;if("string"!=typeof i||!i)throw Ke.create("bad-app-name",{appName:String(i)});if(n||(n=h()),!n)throw Ke.create("no-options");const s=Fe.get(i);if(s){if(A(n,s.options)&&A(r,s.config))return s;throw Ke.create("duplicate-app",{appName:i})}const o=new M(i);for(const c of je.values())o.addComponent(c);const a=new Ge(n,r,o);return Fe.set(i,a),a}function Qe(e=Me){const t=Fe.get(e);if(!t&&e===Me&&h())return We();if(!t)throw Ke.create("no-app",{appName:e});return t}function Xe(e,t,n){var r;let i=null!==(r=Ve[e])&&void 0!==r?r:e;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const e=[`Unable to register library "${i}" with version "${t}":`];return s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ue.warn(e.join(" "))}qe(new O(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="firebase-heartbeat-store";let Ye=null;function Ze(){return Ye||(Ye=function(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=ee(o);return r&&o.addEventListener("upgradeneeded",e=>{r(ee(o.result),e.oldVersion,e.newVersion,ee(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Je)}catch(n){}}}).catch(e=>{throw Ke.create("idb-open",{originalErrorMessage:e.message})})),Ye}async function et(e,t){try{const n=(await Ze()).transaction(Je,"readwrite"),r=n.objectStore(Je);await r.put(t,tt(e)),await n.done}catch(n){if(n instanceof E)ue.warn(n.message);else{const e=Ke.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});ue.warn(e.message)}}}function tt(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new it(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=rt();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ue.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=rt(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),st(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),st(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return ue.warn(t),""}}}function rt(){return(new Date).toISOString().substring(0,10)}class it{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!T()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await Ze()).transaction(Je),n=await t.objectStore(Je).get(tt(e));return await t.done,n}catch(t){if(t instanceof E)ue.warn(t.message);else{const e=Ke.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});ue.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return et(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return et(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function st(e){return i(JSON.stringify({version:2,heartbeats:e})).length}var ot;ot="",qe(new O("platform-logger",e=>new oe(e),"PRIVATE")),qe(new O("heartbeat",e=>new nt(e),"PRIVATE")),Xe(ae,ce,ot),Xe(ae,ce,"esm2017"),Xe("fire-js","");function at(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}function ct(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Xe("firebase","11.10.0","app"),"function"==typeof SuppressedError&&SuppressedError;const ut=ct,ht=new S("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),lt=new z("@firebase/auth");function dt(e,...t){lt.logLevel<=V.ERROR&&lt.error(`Auth (${He}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(e,...t){throw yt(e,...t)}function pt(e,...t){return yt(e,...t)}function gt(e,t,n){const r=Object.assign(Object.assign({},ut()),{[t]:n});return new S("auth","Firebase",r).create(t,{appName:e.name})}function mt(e){return gt(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function yt(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return ht.create(e,...t)}function vt(e,t,...n){if(!e)throw yt(t,...n)}function wt(e){const t="INTERNAL ASSERTION FAILED: "+e;throw dt(t),new Error(t)}function bt(e,t){e||wt(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function _t(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==_t()&&"https:"!==_t()&&!function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()&&!("connection"in navigator)||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Et{constructor(e,t){this.shortDelay=e,this.longDelay=t,bt(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(w())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return Tt()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function St(e,t){bt(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void wt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void wt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void wt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const At={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},kt=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Dt=new Et(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nt(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function xt(e,t,n,r,i={}){return Rt(e,i,async()=>{let i={},s={};r&&("GET"===t?s=r:i={body:JSON.stringify(r)});const o=D(Object.assign({key:e.config.apiKey},s)).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c=Object.assign({method:t,headers:a},i);return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&f(e.emulatorConfig.host)&&(c.credentials="include"),Ct.fetch()(await Pt(e,e.config.apiHost,n,o),c)})}async function Rt(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},At),t);try{const t=new Mt(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw Vt(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw Vt(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw Vt(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw Vt(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw gt(e,a,o);ft(e,a)}}catch(i){if(i instanceof E)throw i;ft(e,"network-request-failed",{message:String(i)})}}async function Ot(e,t,n,r,i={}){const s=await xt(e,t,n,r,i);return"mfaPendingCredential"in s&&ft(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function Pt(e,t,n,r){const i=`${t}${n}?${r}`,s=e,o=s.config.emulator?St(e.config,i):`${e.config.apiScheme}://${i}`;if(kt.includes(n)&&(await s._persistenceManagerAvailable,"COOKIE"===s._getPersistenceType())){return s._getPersistence()._getFinalTarget(o).toString()}return o}function Lt(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Mt{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(pt(this.auth,"network-request-failed")),Dt.get())})}}function Vt(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=pt(e,t,r);return i.customData._tokenResponse=n,i}function Ft(e){return void 0!==e&&void 0!==e.enterprise}class Ut{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Lt(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function jt(e,t){return xt(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function qt(e){return 1e3*Number(e)}function zt(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return dt("JWT malformed, contained fewer than 3 sections"),null;try{const e=s(n);return e?JSON.parse(e):(dt("Failed to decode base64 JWT payload"),null)}catch(i){return dt("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function $t(e){const t=zt(e);return vt(t,"internal-error"),vt(void 0!==t.exp,"internal-error"),vt(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kt(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof E&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class Gt{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Bt(this.lastLoginAt),this.creationTime=Bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wt(e){var t;const n=e.auth,r=await e.getIdToken(),i=await Kt(e,jt(n,{idToken:r}));vt(null==i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null===(t=s.providerUserInfo)||void 0===t?void 0:t.length)?Qt(s.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter(e=>!u.some(t=>t.providerId===e.providerId)),...u]);var c,u;const h=e.isAnonymous,l=!(e.email&&s.passwordHash||(null==a?void 0:a.length)),d=!!h&&l,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Ht(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(e,f)}function Qt(e){return e.map(e=>{var{providerId:t}=e,n=at(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Xt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){vt(e.idToken,"internal-error"),vt(void 0!==e.idToken,"internal-error"),vt(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):$t(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){vt(0!==e.length,"internal-error");const t=$t(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(vt(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await async function(e,t){const n=await Rt(e,{},async()=>{const n=D({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,s=await Pt(e,r,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&f(e.emulatorConfig.host)&&(a.credentials="include"),Ct.fetch()(s,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new Xt;return n&&(vt("string"==typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(vt("string"==typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(vt("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Xt,this.toJSON())}_performRefresh(){return wt("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(e,t){vt("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Yt{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=at(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Gt(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ht(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Kt(this,this.stsTokenManager.getToken(this.auth,e));return vt(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=R(e),r=await n.getIdToken(t),i=zt(r);vt(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s="object"==typeof i.firebase?i.firebase:void 0,o=null==s?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Bt(qt(i.auth_time)),issuedAtTime:Bt(qt(i.iat)),expirationTime:Bt(qt(i.exp)),signInProvider:o||null,signInSecondFactor:(null==s?void 0:s.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=R(e);await Wt(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(vt(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Yt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){vt(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Wt(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if($e(this.auth.app))return Promise.reject(mt(this.auth));const e=await this.getIdToken();return await Kt(this,
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){return xt(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,s,o,a,c,u;const h=null!==(n=t.displayName)&&void 0!==n?n:void 0,l=null!==(r=t.email)&&void 0!==r?r:void 0,d=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,f=null!==(s=t.photoURL)&&void 0!==s?s:void 0,p=null!==(o=t.tenantId)&&void 0!==o?o:void 0,g=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,m=null!==(c=t.createdAt)&&void 0!==c?c:void 0,y=null!==(u=t.lastLoginAt)&&void 0!==u?u:void 0,{uid:v,emailVerified:w,isAnonymous:b,providerData:I,stsTokenManager:_}=t;vt(v&&_,e,"internal-error");const T=Xt.fromJSON(this.name,_);vt("string"==typeof v,e,"internal-error"),Jt(h,e.name),Jt(l,e.name),vt("boolean"==typeof w,e,"internal-error"),vt("boolean"==typeof b,e,"internal-error"),Jt(d,e.name),Jt(f,e.name),Jt(p,e.name),Jt(g,e.name),Jt(m,e.name),Jt(y,e.name);const E=new Yt({uid:v,auth:e,email:l,emailVerified:w,displayName:h,isAnonymous:b,photoURL:f,phoneNumber:d,tenantId:p,stsTokenManager:T,createdAt:m,lastLoginAt:y});return I&&Array.isArray(I)&&(E.providerData=I.map(e=>Object.assign({},e))),g&&(E._redirectEventId=g),E}static async _fromIdTokenResponse(e,t,n=!1){const r=new Xt;r.updateFromServerResponse(t);const i=new Yt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Wt(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];vt(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?Qt(r.providerUserInfo):[],s=!(r.email&&r.passwordHash||(null==i?void 0:i.length)),o=new Xt;o.updateFromIdToken(n);const a=new Yt({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Ht(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==i?void 0:i.length))};return Object.assign(a,c),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt=new Map;function en(e){bt(e instanceof Function,"Expected a class definition");let t=Zt.get(e);return t?(bt(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Zt.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}tn.type="NONE";const nn=tn;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rn(e,t,n){return`firebase:${e}:${t}:${n}`}class sn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=rn(this.userKey,r.apiKey,i),this.fullPersistenceKey=rn("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await jt(this.auth,{idToken:e}).catch(()=>{});return t?Yt._fromGetAccountInfoResponse(this.auth,t,e):null}return Yt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new sn(en(nn),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||en(nn);const s=rn(n,e.config.apiKey,e.name);let o=null;for(const u of t)try{const t=await u._get(s);if(t){let n;if("string"==typeof t){const r=await jt(e,{idToken:t}).catch(()=>{});if(!r)break;n=await Yt._fromGetAccountInfoResponse(e,r,t)}else n=Yt._fromJSON(e,t);u!==i&&(o=n),i=u;break}}catch(c){}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch(c){}})),new sn(i,e,n)):new sn(i,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(hn(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(an(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(dn(t))return"Blackberry";if(fn(t))return"Webos";if(cn(t))return"Safari";if((t.includes("chrome/")||un(t))&&!t.includes("edge/"))return"Chrome";if(ln(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function an(e=w()){return/firefox\//i.test(e)}function cn(e=w()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function un(e=w()){return/crios\//i.test(e)}function hn(e=w()){return/iemobile/i.test(e)}function ln(e=w()){return/android/i.test(e)}function dn(e=w()){return/blackberry/i.test(e)}function fn(e=w()){return/webos/i.test(e)}function pn(e=w()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function gn(){return function(){const e=w();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function mn(e=w()){return pn(e)||ln(e)||fn(e)||dn(e)||/windows phone/i.test(e)||hn(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yn(e,t=[]){let n;switch(e){case"Browser":n=on(w());break;case"Worker":n=`${on(w())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${He}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e){var t,n,r,i;const s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=s.minPasswordLength)&&void 0!==t?t:6,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),void 0!==s.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),void 0!==s.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),void 0!==s.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),void 0!==s.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(r=null===(n=e.allowedNonAlphanumericCharacters)||void 0===n?void 0:n.join(""))&&void 0!==r?r:"",this.forceUpgradeOnSignin=null!==(i=e.forceUpgradeOnSignin)&&void 0!==i&&i,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,i,s,o;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=null===(t=a.meetsMinPasswordLength)||void 0===t||t),a.isValid&&(a.isValid=null===(n=a.meetsMaxPasswordLength)||void 0===n||n),a.isValid&&(a.isValid=null===(r=a.containsLowercaseLetter)||void 0===r||r),a.isValid&&(a.isValid=null===(i=a.containsUppercaseLetter)||void 0===i||i),a.isValid&&(a.isValid=null===(s=a.containsNumericCharacter)||void 0===s||s),a.isValid&&(a.isValid=null===(o=a.containsNonAlphanumericCharacter)||void 0===o||o),a}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new _n(this),this.idTokenSubscription=new _n(this),this.beforeStateQueue=new vn(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ht,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=en(t)),this._initializationPromise=this.queue(async()=>{var n,r,i;if(!this._deleted&&(this.persistenceManager=await sn.create(this,e),null===(n=this._resolvePersistenceManagerAvailable)||void 0===n||n.call(this),!this._deleted)){if(null===(r=this._popupRedirectResolver)||void 0===r?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(s){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(i=this.currentUser)||void 0===i?void 0:i.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await jt(this,{idToken:e}),n=await Yt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if($e(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,s=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==s||!(null==o?void 0:o.user)||(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return vt(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Wt(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if($e(this.app))return Promise.reject(mt(this));const t=e?R(e):null;return t&&vt(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&vt(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return $e(this.app)?Promise.reject(mt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return $e(this.app)?Promise.reject(mt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(en(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return xt(e,"GET","/v2/passwordPolicy",Nt(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new wn(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new S("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return xt(e,"POST","/v2/accounts:revokeToken",Nt(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&en(e)||this._popupRedirectResolver;vt(t,this,"argument-error"),this.redirectPersistenceManager=await sn.create(this,[en(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(vt(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"==typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return vt(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=yn(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if($e(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){lt.logLevel<=V.WARN&&lt.warn(`Auth (${He}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function In(e){return R(e)}class _n{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new N(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return vt(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function En(e){return Tn.loadJS(e)}class Sn{constructor(){this.enterprise=new Cn}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Cn{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const An="NO_RECAPTCHA";class kn{constructor(e){this.type="recaptcha-enterprise",this.auth=In(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{(async function(e,t){return xt(e,"GET","/v2/recaptchaConfig",Nt(e,t))})(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new Ut(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})}function r(t,n,r){const i=window.grecaptcha;Ft(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(An)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new Sn).execute("siteKey",{action:"verify"})}return new Promise((e,i)=>{n(this.auth).then(n=>{if(!t&&Ft(window.grecaptcha))r(n,e,i);else{if("undefined"==typeof window)return void i(new Error("RecaptchaVerifier is only supported in browser"));let t=Tn.recaptchaEnterpriseScript;0!==t.length&&(t+=n),En(t).then(()=>{r(n,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}}async function Dn(e,t,n,r=!1,i=!1){const s=new kn(e);let o;if(i)o=An;else try{o=await s.verify(n)}catch(c){o=await s.verify(n,!0)}const a=Object.assign({},t);return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}function Nn(e,t,n){const r=In(e);vt(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const i=xn(t),{host:s,port:o}=function(e){const t=xn(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:Rn(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:Rn(t)}}}(t),a=null===o?"":`:${o}`,c={url:`${i}//${s}${a}/`},u=Object.freeze({host:s,port:o,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:!1})});if(!r._canInitEmulator)return vt(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void vt(A(c,r.config.emulator)&&A(u,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=c,r.emulatorConfig=u,r.settings.appVerificationDisabledForTesting=!0,f(s)?(p(`${i}//${s}${a}`),v("Auth",!0)):function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&console.info;"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */()}function xn(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function Rn(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class On{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return wt("not implemented")}_getIdTokenResponse(e){return wt("not implemented")}_linkToIdToken(e,t){return wt("not implemented")}_getReauthenticationResolver(e){return wt("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pn(e,t){return Ot(e,"POST","/v1/accounts:signInWithIdp",Nt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln extends On{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ln(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ft("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=at(t,["providerId","signInMethod"]);if(!n||!r)return null;const s=new Ln(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){return Pn(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Pn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Pn(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=D(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends Mn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn extends Vn{constructor(){super("facebook.com")}static credential(e){return Ln._fromParams({providerId:Fn.PROVIDER_ID,signInMethod:Fn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Fn.credentialFromTaggedObject(e)}static credentialFromError(e){return Fn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Fn.credential(e.oauthAccessToken)}catch(t){return null}}}Fn.FACEBOOK_SIGN_IN_METHOD="facebook.com",Fn.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Un extends Vn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ln._fromParams({providerId:Un.PROVIDER_ID,signInMethod:Un.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Un.credentialFromTaggedObject(e)}static credentialFromError(e){return Un.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Un.credential(t,n)}catch(r){return null}}}Un.GOOGLE_SIGN_IN_METHOD="google.com",Un.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jn extends Vn{constructor(){super("github.com")}static credential(e){return Ln._fromParams({providerId:jn.PROVIDER_ID,signInMethod:jn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return jn.credentialFromTaggedObject(e)}static credentialFromError(e){return jn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return jn.credential(e.oauthAccessToken)}catch(t){return null}}}jn.GITHUB_SIGN_IN_METHOD="github.com",jn.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bn extends Vn{constructor(){super("twitter.com")}static credential(e,t){return Ln._fromParams({providerId:Bn.PROVIDER_ID,signInMethod:Bn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Bn.credentialFromTaggedObject(e)}static credentialFromError(e){return Bn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Bn.credential(t,n)}catch(r){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function qn(e,t){return Ot(e,"POST","/v1/accounts:signUp",Nt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Bn.TWITTER_SIGN_IN_METHOD="twitter.com",Bn.PROVIDER_ID="twitter.com";class zn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await Yt._fromIdTokenResponse(e,n,r),s=$n(n);return new zn({user:i,providerId:s,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=$n(n);return new zn({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function $n(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn extends E{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Kn.prototype),this.customData={appName:e.name,tenantId:null!==(i=e.tenantId)&&void 0!==i?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Kn(e,t,n,r)}}function Gn(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Kn._fromErrorAndOperation(e,n,t,r);throw n})}async function Hn(e,t,n){if($e(e.app))return Promise.reject(mt(e));const r=In(e),i=async function(e,t,n,r){var i;if(null===(i=e._getRecaptchaConfig())||void 0===i?void 0:i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Dn(e,t,n,"getOobCode"===n);return r(e,i)}return r(e,t).catch(async i=>{if("auth/missing-recaptcha-token"===i.code){const i=await Dn(e,t,n,"getOobCode"===n);return r(e,i)}return Promise.reject(i)})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",qn),s=await i.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e){const t=In(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}(e),t}),o=await zn._fromIdTokenResponse(r,"signIn",s);return await r._updateCurrentUser(o.user),o}function Wn(e){return R(e).signOut()}const Qn="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Qn,"1"),this.storage.removeItem(Qn),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn extends Xn{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=mn(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);gn()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Jn.type="LOCAL";const Yn=Jn;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends Xn{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Zn.type="SESSION";const er=Zn;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class tr{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new tr(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null==s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function nr(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */tr.receivers=[];class rr{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const c=nr("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ir(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function sr(){return void 0!==ir().WorkerGlobalScope&&"function"==typeof ir().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const or="firebaseLocalStorageDb",ar="firebaseLocalStorage",cr="fbase_key";class ur{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hr(e,t){return e.transaction([ar],t?"readwrite":"readonly").objectStore(ar)}function lr(){const e=indexedDB.open(or,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(ar,{keyPath:cr})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(ar)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(or);return new ur(e).toPromise()}(),t(await lr()))})})}async function dr(e,t,n){const r=hr(e,!0).put({[cr]:t,value:n});return new ur(r).toPromise()}function fr(e,t){const n=hr(e,!0).delete(t);return new ur(n).toPromise()}class pr{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await lr()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return sr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=tr._getInstance(sr()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(e){return null}}(),!this.activeServiceWorker)return;this.sender=new rr(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await lr();return await dr(e,Qn,"1"),await fr(e,Qn),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>dr(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=hr(e,!1).get(t),r=await new ur(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>fr(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=hr(e,!1).getAll();return new ur(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}pr.type="LOCAL";const gr=pr;new Et(3e4,6e4);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class mr extends On{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Pn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Pn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Pn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function yr(e){
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return async function(e,t,n=!1){if($e(e.app))return Promise.reject(mt(e));const r="signIn",i=await Gn(e,r,t),s=await zn._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(s.user),s}(e.auth,new mr(e),e.bypassAuthState)}function vr(e){const{auth:t,user:n}=e;return vt(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e;if($e(r.app))return Promise.reject(mt(r));const i="reauthenticate";try{const s=await Kt(e,Gn(r,i,t,e),n);vt(s.idToken,r,"internal-error");const o=zt(s.idToken);vt(o,r,"internal-error");const{sub:a}=o;return vt(e.uid===a,r,"user-mismatch"),zn._forOperation(e,i,s)}catch(s){throw"auth/user-not-found"===(null==s?void 0:s.code)&&ft(r,"user-mismatch"),s}}(n,new mr(e),e.bypassAuthState)}async function wr(e){const{auth:t,user:n}=e;return vt(n,t,"internal-error"),async function(e,t,n=!1){const r=await Kt(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return zn._forOperation(e,"link",r)}(n,new mr(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return yr;case"linkViaPopup":case"linkViaRedirect":return wr;case"reauthViaPopup":case"reauthViaRedirect":return vr;default:ft(this.auth,"internal-error")}}resolve(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir=new Et(2e3,1e4);class _r extends br{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,_r.currentPopupAction&&_r.currentPopupAction.cancel(),_r.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return vt(e,this.auth,"internal-error"),e}async onExecution(){bt(1===this.filter.length,"Popup operations only handle one event");const e=nr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(pt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(pt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,_r.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(pt(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,Ir.get())};e()}}_r.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Tr="pendingRedirect",Er=new Map;class Sr extends br{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Er.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return rn(Tr,e.config.apiKey,e.name)}(t),r=function(e){return en(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const i="true"===await r._get(n);return await r._remove(n),i}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}Er.set(this.auth._key(),e)}return this.bypassAuthState||Er.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function Cr(e,t){Er.set(e._key(),t)}async function Ar(e,t,n=!1){if($e(e.app))return Promise.reject(mt(e));const r=In(e),i=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return t?en(t):(vt(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),s=new Sr(r,i,n),o=await s.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Nr(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Nr(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(pt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Dr(e))}saveEventToCache(e){this.cachedEventUids.add(Dr(e)),this.lastProcessedEventTime=Date.now()}}function Dr(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function Nr({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const xr=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Rr=/^https?/;async function Or(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return xt(e,"GET","/v1/projects",t)}(e);for(const r of t)try{if(Pr(r))return}catch(n){}ft(e,"unauthorized-domain")}function Pr(e){const t=It(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!Rr.test(n))return!1;if(xr.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lr=new Et(3e4,6e4);function Mr(){const e=ir().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Vr(e){return new Promise((t,n)=>{var r,i,s;function o(){Mr(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Mr(),n(pt(e,"network-request-failed"))},timeout:Lr.get()})}if(null===(i=null===(r=ir().gapi)||void 0===r?void 0:r.iframes)||void 0===i?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null===(s=ir().gapi)||void 0===s?void 0:s.load)){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return ir()[t]=()=>{gapi.load?o():n(pt(e,"network-request-failed"))},En(`${Tn.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw Fr=null,e})}let Fr=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ur=new Et(5e3,15e3),jr={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Br=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function qr(e){const t=e.config;vt(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?St(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:He},i=Br.get(e.config.apiHost);i&&(r.eid=i);const s=e._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${D(r).slice(1)}`}async function zr(e){const t=await function(e){return Fr=Fr||Vr(e),Fr}(e),n=ir().gapi;return vt(n,e,"internal-error"),t.open({where:document.body,url:qr(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:jr,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=pt(e,"network-request-failed"),s=ir().setTimeout(()=>{r(i)},Ur.get());function o(){ir().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class Kr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Gr(e,t,n,r=500,i=600){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},$r),{width:r.toString(),height:i.toString(),top:s,left:o}),u=w().toLowerCase();n&&(a=un(u)?"_blank":n),an(u)&&(t=t||"http://localhost",c.scrollbars="yes");const h=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=w()){var t;return pn(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new Kr(null);const l=window.open(t||"",a,h);vt(l,e,"popup-blocked");try{l.focus()}catch(d){}return new Kr(l)}const Hr="__/auth/handler",Wr="emulator/auth/handler",Qr=encodeURIComponent("fac");async function Xr(e,t,n,r,i,s){vt(e.config.authDomain,e,"auth-domain-config-required"),vt(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:He,eventId:i};if(t instanceof Mn){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof Vn){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const h of Object.keys(a))void 0===a[h]&&delete a[h];const c=await e._getAppCheckToken(),u=c?`#${Qr}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${Hr}`;return St(e,Wr)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${D(a).slice(1)}${u}`}const Jr="webStorageSupport";const Yr=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=er,this._completeRedirectFn=Ar,this._overrideRedirectResult=Cr}async _openPopup(e,t,n,r){var i;bt(null===(i=this.eventManagers[e._key()])||void 0===i?void 0:i.manager,"_initialize() not called before _openPopup()");return Gr(e,await Xr(e,t,n,It(),r),nr())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){ir().location.href=e}(await Xr(e,t,n,It(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(bt(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await zr(e),n=new kr(e);return t.register("authEvent",t=>{vt(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Jr,{type:Jr},n=>{var r;const i=null===(r=null==n?void 0:n[0])||void 0===r?void 0:r[Jr];void 0!==i&&t(!!i),ft(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Or(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return mn()||cn()||pn()}};var Zr="@firebase/auth",ei="1.10.8";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ti{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){vt(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ni=l("authIdTokenMaxAge")||300;let ri=null;function ii(e=Qe()){const t=ze(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=ze(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(A(n.getOptions(),null!=t?t:{}))return e;ft(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:Yr,persistence:[gr,Yn,er]}),r=l("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(i=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>ni)return;const r=null==t?void 0:t.token;ri!==r&&(ri=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){R(e).beforeAuthStateChanged(t,n)}(n,t,()=>t(n.currentUser)),function(e,t,n,r){R(e).onIdTokenChanged(t,n,r)}(n,e=>t(e))}}var i;const s=c("auth");return s&&Nn(n,`http://${s}`),n}var si;Tn={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var i,s;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=pt("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(null!==(s=null===(i=document.getElementsByTagName("head"))||void 0===i?void 0:i[0])&&void 0!==s?s:document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},si="Browser",qe(new O("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:s,authDomain:o}=n.options;vt(s&&!s.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:s,authDomain:o,clientPlatform:si,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:yn(si)},c=new bn(n,r,i,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(en);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),qe(new O("auth-internal",e=>{const t=In(e.getProvider("auth").getImmediate());return new ti(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Xe(Zr,ei,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(si)),Xe(Zr,ei,"esm2017");var oi,ai,ci="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(e,t,n){n||(n=0);var r=Array(16);if("string"==typeof t)for(var i=0;16>i;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;16>i;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];var s=e.g[3],o=t+(s^n&(i^s))+r[0]+3614090360&4294967295;o=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=n+(o<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^s&(n^i))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=t+(n^i^s)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=t+(i^(n|~s))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=t+(i^(n|~s))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=t+(i^(n|~s))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((s=(t=n+((o=t+(i^(n|~s))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((i=s+((o=i+(t^(s|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+s&4294967295}function r(e,t){this.h=t;for(var n=[],r=!0,i=e.length-1;0<=i;i--){var s=0|e[i];r&&s==t||(n[i]=s,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.D=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.C=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}(t,function(){this.blockSize=-1}),t.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.u=function(e,t){void 0===t&&(t=e.length);for(var r=t-this.blockSize,i=this.B,s=this.h,o=0;o<t;){if(0==s)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(i[s++]=e.charCodeAt(o++),s==this.blockSize){n(this,i),s=0;break}}else for(;o<t;)if(i[s++]=e[o++],s==this.blockSize){n(this,i),s=0;break}}this.h=s,this.o+=t},t.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var n=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&n,n/=256;for(this.u(e),e=Array(16),t=n=0;4>t;++t)for(var r=0;32>r;r+=8)e[n++]=this.g[t]>>>r&255;return e};var i={};function s(e){return-128<=e&&128>e?function(e,t){var n=i;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],0>e?-1:0)}):new r([0|e],0>e?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(0>e)return d(o(-e));for(var t=[],n=1,i=0;e>=n;i++)t[i]=e/n|0,n*=4294967296;return new r(t,0)}var a=s(0),c=s(1),u=s(16777216);function h(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function l(e){return-1==e.h}function d(e){for(var t=e.g.length,n=[],i=0;i<t;i++)n[i]=~e.g[i];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function g(e,t){this.g=e,this.h=t}function m(e,t){if(h(t))throw Error("division by zero");if(h(e))return new g(a,a);if(l(e))return t=m(d(e),t),new g(d(t.g),d(t.h));if(l(t))return t=m(e,d(t)),new g(d(t.g),t.h);if(30<e.g.length){if(l(e)||l(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;0>=r.l(e);)n=y(n),r=y(r);var i=v(n,1),s=v(r,1);for(r=v(r,2),n=v(n,2);!h(r);){var u=s.add(r);0>=u.l(e)&&(i=i.add(n),s=u),r=v(r,1),n=v(n,1)}return t=f(e,i.j(t)),new g(i,t)}for(i=a;0<=e.l(t);){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),u=(s=o(n)).j(t);l(u)||0<u.l(e);)u=(s=o(n-=r)).j(t);h(s)&&(s=c),i=i.add(s),e=f(e,u)}return new g(i,e)}function y(e){for(var t=e.g.length+1,n=[],i=0;i<t;i++)n[i]=e.i(i)<<1|e.i(i-1)>>>31;return new r(n,e.h)}function v(e,t){var n=t>>5;t%=32;for(var i=e.g.length-n,s=[],o=0;o<i;o++)s[o]=0<t?e.i(o+n)>>>t|e.i(o+n+1)<<32-t:e.i(o+n);return new r(s,e.h)}(e=r.prototype).m=function(){if(l(this))return-d(this).m();for(var e=0,t=1,n=0;n<this.g.length;n++){var r=this.i(n);e+=(0<=r?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(h(this))return"0";if(l(this))return"-"+d(this).toString(e);for(var t=o(Math.pow(e,6)),n=this,r="";;){var i=m(n,t).g,s=((0<(n=f(n,i.j(t))).g.length?n.g[0]:n.h)>>>0).toString(e);if(h(n=i))return s+r;for(;6>s.length;)s="0"+s;r=s+r}},e.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return l(e=f(this,e))?-1:h(e)?0:1},e.abs=function(){return l(this)?d(this):this},e.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0,s=0;s<=t;s++){var o=i+(65535&this.i(s))+(65535&e.i(s)),a=(o>>>16)+(this.i(s)>>>16)+(e.i(s)>>>16);i=a>>>16,o&=65535,a&=65535,n[s]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(h(this)||h(e))return a;if(l(this))return l(e)?d(this).j(d(e)):d(d(this).j(e));if(l(e))return d(this.j(d(e)));if(0>this.l(u)&&0>e.l(u))return o(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],i=0;i<2*t;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(var s=0;s<e.g.length;s++){var c=this.i(i)>>>16,f=65535&this.i(i),g=e.i(s)>>>16,m=65535&e.i(s);n[2*i+2*s]+=f*m,p(n,2*i+2*s),n[2*i+2*s+1]+=c*m,p(n,2*i+2*s+1),n[2*i+2*s+1]+=f*g,p(n,2*i+2*s+1),n[2*i+2*s+2]+=c*g,p(n,2*i+2*s+2)}for(i=0;i<t;i++)n[i]=n[2*i+1]<<16|n[2*i];for(i=t;i<2*t;i++)n[i]=0;return new r(n,0)},e.A=function(e){return m(this,e).h},e.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)&e.i(i);return new r(n,this.h&e.h)},e.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)|e.i(i);return new r(n,this.h|e.h)},e.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)^e.i(i);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.v,t.prototype.reset=t.prototype.s,t.prototype.update=t.prototype.u,ai=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),i=a,s=0;s<t.length;s+=8){var c=Math.min(8,t.length-s),u=parseInt(t.substring(s,s+c),n);8>c?(c=o(Math.pow(n,c)),i=i.j(c).add(o(u))):i=(i=i.j(r)).add(o(u))}return i},oi=r}).apply(void 0!==ci?ci:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var ui,hi,li,di,fi,pi,gi,mi,yi="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof yi&&yi];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(e,r){if(r)e:{var i=n;e=e.split(".");for(var s=0;s<e.length-1;s++){var o=e[s];if(!(o in i))break e;i=i[o]}(r=r(s=i[e=e[e.length-1]]))!=s&&null!=r&&t(i,e,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",function(e){return e||function(){return function(e,t){e instanceof String&&(e+="");var n=0,r=!1,i={next:function(){if(!r&&n<e.length){var i=n++;return{value:t(i,e[i]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}(this,function(e,t){return t})}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var r=r||{},i=this||self;function s(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){if(!e)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),e.apply(t,n)}}return function(){return e.apply(t,arguments)}}function u(e,t,n){return(u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function h(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function l(e,t){function n(){}n.prototype=t.prototype,e.aa=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Qb=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}function d(e){const t=e.length;if(0<t){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let n=1;n<arguments.length;n++){const t=arguments[n];if(s(t)){const n=e.length||0,r=t.length||0;e.length=n+r;for(let i=0;i<r;i++)e[n+i]=t[i]}else e.push(t)}}function p(e){return/^[\s\xa0]*$/.test(e)}function g(){var e=i.navigator;return e&&(e=e.userAgent)?e:""}function m(e){return m[" "](e),e}m[" "]=function(){};var y=!(-1==g().indexOf("Gecko")||-1!=g().toLowerCase().indexOf("webkit")&&-1==g().indexOf("Edge")||-1!=g().indexOf("Trident")||-1!=g().indexOf("MSIE")||-1!=g().indexOf("Edge"));function v(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function w(e){const t={};for(const n in e)t[n]=e[n];return t}const b="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(e,t){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)e[n]=r[n];for(let t=0;t<b.length;t++)n=b[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function _(e){var t=1;e=e.split(":");const n=[];for(;0<t&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function T(e){i.setTimeout(()=>{throw e},0)}function E(){var e=D;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var S=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new C,e=>e.reset());class C{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let A,k=!1,D=new class{constructor(){this.h=this.g=null}add(e,t){const n=S.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},N=()=>{const e=i.Promise.resolve(void 0);A=()=>{e.then(x)}};var x=()=>{for(var e;e=E();){try{e.h.call(e.g)}catch(n){T(n)}var t=S;t.j(e),100>t.h&&(t.h++,e.next=t.g,t.g=e)}k=!1};function R(){this.s=this.s,this.C=this.C}function O(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}R.prototype.s=!1,R.prototype.ma=function(){this.s||(this.s=!0,this.N())},R.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var P=function(){if(!i.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};i.addEventListener("test",e,t),i.removeEventListener("test",e,t)}catch(n){}return e}();function L(e,t){if(O.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(y){e:{try{m(t.nodeName);var i=!0;break e}catch(s){}i=!1}i||(t=null)}}else"mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement);this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:M[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&L.aa.h.call(this)}}l(L,O);var M={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var V="closure_listenable_"+(1e6*Math.random()|0),F=0;function U(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++F,this.da=this.fa=!1}function j(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function B(e){this.src=e,this.g={},this.h=0}function q(e,t){var n=t.type;if(n in e.g){var r,i=e.g[n],s=Array.prototype.indexOf.call(i,t,void 0);(r=0<=s)&&Array.prototype.splice.call(i,s,1),r&&(j(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function z(e,t,n,r){for(var i=0;i<e.length;++i){var s=e[i];if(!s.da&&s.listener==t&&s.capture==!!n&&s.ha==r)return i}return-1}B.prototype.add=function(e,t,n,r,i){var s=e.toString();(e=this.g[s])||(e=this.g[s]=[],this.h++);var o=z(e,t,r,i);return-1<o?(t=e[o],n||(t.fa=!1)):((t=new U(t,this.src,s,!!r,i)).fa=n,e.push(t)),t};var $="closure_lm_"+(1e6*Math.random()|0),K={};function G(e,t,n,r,i){if(Array.isArray(t)){for(var s=0;s<t.length;s++)G(e,t[s],n,r,i);return null}return n=Z(n),e&&e[V]?e.K(t,n,!!o(r)&&!!r.capture,i):function(e,t,n,r,i,s){if(!t)throw Error("Invalid event type");var a=o(i)?!!i.capture:!!i,c=J(e);if(c||(e[$]=c=new B(e)),n=c.add(t,n,r,a,s),n.proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=X;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)P||(i=a),void 0===i&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent(Q(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}(e,t,n,!1,r,i)}function H(e,t,n,r,i){if(Array.isArray(t))for(var s=0;s<t.length;s++)H(e,t[s],n,r,i);else r=o(r)?!!r.capture:!!r,n=Z(n),e&&e[V]?(e=e.i,(t=String(t).toString())in e.g&&(-1<(n=z(s=e.g[t],n,r,i))&&(j(s[n]),Array.prototype.splice.call(s,n,1),0==s.length&&(delete e.g[t],e.h--)))):e&&(e=J(e))&&(t=e.g[t.toString()],e=-1,t&&(e=z(t,n,r,i)),(n=-1<e?t[e]:null)&&W(n))}function W(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[V])q(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(Q(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=J(t))?(q(n,e),0==n.h&&(n.src=null,t[$]=null)):j(e)}}}function Q(e){return e in K?K[e]:K[e]="on"+e}function X(e,t){if(e.da)e=!0;else{t=new L(t,this);var n=e.listener,r=e.ha||e.src;e.fa&&W(e),e=n.call(r,t)}return e}function J(e){return(e=e[$])instanceof B?e:null}var Y="__closure_events_fn_"+(1e9*Math.random()>>>0);function Z(e){return"function"==typeof e?e:(e[Y]||(e[Y]=function(t){return e.handleEvent(t)}),e[Y])}function ee(){R.call(this),this.i=new B(this),this.M=this,this.F=null}function te(e,t){var n,r=e.F;if(r)for(n=[];r;r=r.F)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new O(t,e);else if(t instanceof O)t.target=t.target||e;else{var i=t;I(t=new O(r,e),i)}if(i=!0,n)for(var s=n.length-1;0<=s;s--){var o=t.g=n[s];i=ne(o,r,!0,t)&&i}if(i=ne(o=t.g=e,r,!0,t)&&i,i=ne(o,r,!1,t)&&i,n)for(s=0;s<n.length;s++)i=ne(o=t.g=n[s],r,!1,t)&&i}function ne(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var i=!0,s=0;s<t.length;++s){var o=t[s];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&q(e.i,o),i=!1!==a.call(c,r)&&i}}return i&&!r.defaultPrevented}function re(e,t,n){if("function"==typeof e)n&&(e=u(e,n));else{if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=u(e.handleEvent,e)}return 2147483647<Number(t)?-1:i.setTimeout(e,t||0)}function ie(e){e.g=re(()=>{e.g=null,e.i&&(e.i=!1,ie(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}l(ee,R),ee.prototype[V]=!0,ee.prototype.removeEventListener=function(e,t,n,r){H(this,e,t,n,r)},ee.prototype.N=function(){if(ee.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var n=t.g[e],r=0;r<n.length;r++)j(n[r]);delete t.g[e],t.h--}}this.F=null},ee.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},ee.prototype.L=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class se extends R{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:ie(this)}N(){super.N(),this.g&&(i.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function oe(e){R.call(this),this.h=e,this.g={}}l(oe,R);var ae=[];function ce(e){v(e.g,function(e,t){this.g.hasOwnProperty(t)&&W(e)},e),e.g={}}oe.prototype.N=function(){oe.aa.N.call(this),ce(this)},oe.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ue=i.JSON.stringify,he=i.JSON.parse,le=class{stringify(e){return i.JSON.stringify(e,void 0)}parse(e){return i.JSON.parse(e,void 0)}};function de(){}function fe(e){return e.h||(e.h=e.i())}function pe(){}de.prototype.h=null;var ge={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function me(){O.call(this,"d")}function ye(){O.call(this,"c")}l(me,O),l(ye,O);var ve={},we=null;function be(){return we=we||new ee}function Ie(e){O.call(this,ve.La,e)}function _e(e){const t=be();te(t,new Ie(t))}function Te(e,t){O.call(this,ve.STAT_EVENT,e),this.stat=t}function Ee(e){const t=be();te(t,new Te(t,e))}function Se(e,t){O.call(this,ve.Ma,e),this.size=t}function Ce(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return i.setTimeout(function(){e()},t)}function Ae(){this.g=!0}function ke(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var n=JSON.parse(t);if(n)for(e=0;e<n.length;e++)if(Array.isArray(n[e])){var r=n[e];if(!(2>r.length)){var i=r[1];if(Array.isArray(i)&&!(1>i.length)){var s=i[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(var o=1;o<i.length;o++)i[o]=""}}}return ue(n)}catch(a){return t}}(e,n)+(r?" "+r:"")})}ve.La="serverreachability",l(Ie,O),ve.STAT_EVENT="statevent",l(Te,O),ve.Ma="timingevent",l(Se,O),Ae.prototype.xa=function(){this.g=!1},Ae.prototype.info=function(){};var De,Ne={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},xe={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function Re(){}function Oe(e,t,n,r){this.j=e,this.i=t,this.l=n,this.R=r||1,this.U=new oe(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Pe}function Pe(){this.i=null,this.g="",this.h=!1}l(Re,de),Re.prototype.g=function(){return new XMLHttpRequest},Re.prototype.i=function(){return{}},De=new Re;var Le={},Me={};function Ve(e,t,n){e.L=1,e.v=ut(it(t)),e.m=n,e.P=!0,Fe(e,null)}function Fe(e,t){e.F=Date.now(),Be(e),e.A=it(e.v);var n=e.A,r=e.R;Array.isArray(r)||(r=[String(r)]),_t(n.i,"t",r),e.C=0,n=e.j.J,e.h=new Pe,e.g=hn(e.j,n?t:null,!e.m),0<e.O&&(e.M=new se(u(e.Y,e,e.g),e.O)),t=e.U,n=e.g,r=e.ca;var i="readystatechange";Array.isArray(i)||(i&&(ae[0]=i.toString()),i=ae);for(var s=0;s<i.length;s++){var o=G(n,i[s],r||t.handleEvent,!1,t.h||t);if(!o)break;t.g[o.key]=o}t=e.H?w(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),_e(),function(e,t,n,r,i,s){e.info(function(){if(e.g)if(s)for(var o="",a=s.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var h=u[0];u=u[1];var l=h.split("_");o=2<=l.length&&"type"==l[1]?o+(h+"=")+u+"&":o+(h+"=redacted&")}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.u,e.A,e.l,e.R,e.m)}function Ue(e){return!!e.g&&("GET"==e.u&&2!=e.L&&e.j.Ca)}function je(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Me:(n=Number(t.substring(n,r)),isNaN(n)?Le:(r+=1)+n>t.length?Me:(t=t.slice(r,r+n),e.C=r+n,t))}function Be(e){e.S=Date.now()+e.I,qe(e,e.I)}function qe(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Ce(u(e.ba,e),t)}function ze(e){e.B&&(i.clearTimeout(e.B),e.B=null)}function $e(e){0==e.j.G||e.J||sn(e.j,e)}function Ke(e){ze(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,ce(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function Ge(e,t){try{var n=e.j;if(0!=n.G&&(n.g==e||Je(n.h,e)))if(!e.K&&Je(n.h,e)&&3==n.G){try{var r=n.Da.g.parse(t)}catch(h){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){e:if(!n.u){if(n.g){if(!(n.g.F+3e3<e.F))break e;rn(n),Ht(n)}en(n),Ee(18)}}else n.za=i[1],0<n.za-n.T&&37500>i[2]&&n.F&&0==n.v&&!n.C&&(n.C=Ce(u(n.Za,n),6e3));if(1>=Xe(n.h)&&n.ca){try{n.ca()}catch(h){}n.ca=void 0}}else an(n,11)}else if((e.K||n.g==e)&&rn(n),!p(t))for(i=n.Da.g.parse(t),t=0;t<i.length;t++){let u=i[t];if(n.T=u[0],u=u[1],2==n.G)if("c"==u[0]){n.K=u[1],n.ia=u[2];const t=u[3];null!=t&&(n.la=t,n.j.info("VER="+n.la));const i=u[4];null!=i&&(n.Aa=i,n.j.info("SVER="+n.Aa));const h=u[5];null!=h&&"number"==typeof h&&0<h&&(r=1.5*h,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const l=e.g;if(l){const e=l.g?l.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=r.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(Ye(s,s.h),s.h=null))}if(r.D){const e=l.g?l.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.ya=e,ct(r.I,r.D,e))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-e.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=e;if((r=n).qa=un(r,r.J?r.ia:null,r.W),o.K){Ze(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(ze(a),Be(a)),r.g=o}else Zt(r);0<n.i.length&&Qt(n)}else"stop"!=u[0]&&"close"!=u[0]||an(n,7);else 3==n.G&&("stop"==u[0]||"close"==u[0]?"stop"==u[0]?an(n,7):Gt(n):"noop"!=u[0]&&n.l&&n.l.ta(u),n.v=0)}_e()}catch(h){}}Oe.prototype.ca=function(e){e=e.target;const t=this.M;t&&3==qt(e)?t.j():this.Y(e)},Oe.prototype.Y=function(e){try{if(e==this.g)e:{const d=qt(this.g);var t=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||zt(this.g)))){this.J||4!=d||7==t||_e(),ze(this);var n=this.g.Z();this.X=n;t:if(Ue(this)){var r=zt(this.g);e="";var s=r.length,o=4==qt(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){Ke(this),$e(this);var a="";break t}this.h.i=new i.TextDecoder}for(t=0;t<s;t++)this.h.h=!0,e+=this.h.i.decode(r[t],{stream:!(o&&t==s-1)});r.length=0,this.h.g+=e,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(e,t,n,r,i,s,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+t+"\n"+n+"\n"+s+" "+o})}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){t:{if(this.g){var c,u=this.g;if((c=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(c)){var h=c;break t}}h=null}if(!(n=h)){this.o=!1,this.s=3,Ee(12),Ke(this),$e(this);break e}ke(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ge(this,n)}if(this.P){let e;for(n=!0;!this.J&&this.C<a.length;){if(e=je(this,a),e==Me){4==d&&(this.s=4,Ee(14),n=!1),ke(this.i,this.l,null,"[Incomplete Response]");break}if(e==Le){this.s=4,Ee(15),ke(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}ke(this.i,this.l,e,null),Ge(this,e)}if(Ue(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,Ee(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var l=this.j;l.g==this&&l.ba&&!l.M&&(l.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),tn(l),l.M=!0,Ee(11))}}else ke(this.i,this.l,a,"[Invalid Chunked Response]"),Ke(this),$e(this)}else ke(this.i,this.l,a,null),Ge(this,a);4==d&&Ke(this),this.o&&!this.J&&(4==d?sn(this.j,this):(this.o=!1,Be(this)))}else(function(e){const t={};e=(e.g&&2<=qt(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(p(e[r]))continue;var n=_(e[r]);const i=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const s=t[i]||[];t[i]=s,s.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),Ke(this),$e(this)}}}catch(d){}},Oe.prototype.cancel=function(){this.J=!0,Ke(this)},Oe.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.A),2!=this.L&&(_e(),Ee(17)),Ke(this),this.s=2,$e(this)):qe(this,this.S-e)};var He=class{constructor(e,t){this.g=e,this.map=t}};function We(e){this.l=e||10,i.PerformanceNavigationTiming?e=0<(e=i.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(i.chrome&&i.chrome.loadTimes&&i.chrome.loadTimes()&&i.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Qe(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Xe(e){return e.h?1:e.g?e.g.size:0}function Je(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Ye(e,t){e.g?e.g.add(t):e.h=t}function Ze(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function et(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.D);return t}return d(e.i)}function tt(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(s(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var n=function(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(s(e)||"string"==typeof e){var t=[];e=e.length;for(var n=0;n<e;n++)t.push(n);return t}t=[],n=0;for(const r in e)t[n++]=r;return t}}}(e),r=function(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(s(e)){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t}for(r in t=[],n=0,e)t[n++]=e[r];return t}(e),i=r.length,o=0;o<i;o++)t.call(void 0,r[o],n&&n[o],e)}We.prototype.cancel=function(){if(this.i=et(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var nt=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rt(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof rt){this.h=e.h,st(this,e.j),this.o=e.o,this.g=e.g,ot(this,e.s),this.l=e.l;var t=e.i,n=new vt;n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),at(this,n),this.m=e.m}else e&&(t=String(e).match(nt))?(this.h=!1,st(this,t[1]||"",!0),this.o=ht(t[2]||""),this.g=ht(t[3]||"",!0),ot(this,t[4]),this.l=ht(t[5]||"",!0),at(this,t[6]||"",!0),this.m=ht(t[7]||"")):(this.h=!1,this.i=new vt(null,this.h))}function it(e){return new rt(e)}function st(e,t,n){e.j=n?ht(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function ot(e,t){if(t){if(t=Number(t),isNaN(t)||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function at(e,t,n){t instanceof vt?(e.i=t,function(e,t){t&&!e.j&&(wt(e),e.i=null,e.g.forEach(function(e,t){var n=t.toLowerCase();t!=n&&(bt(this,t),_t(this,n,e))},e)),e.j=t}(e.i,e.h)):(n||(t=lt(t,mt)),e.i=new vt(t,e.h))}function ct(e,t,n){e.i.set(t,n)}function ut(e){return ct(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function ht(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function lt(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,dt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function dt(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}rt.prototype.toString=function(){var e=[],t=this.j;t&&e.push(lt(t,ft,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(lt(t,ft,!0),"@"),e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&e.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(lt(n,"/"==n.charAt(0)?gt:pt,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",lt(n,yt)),e.join("")};var ft=/[#\/\?@]/g,pt=/[#\?:]/g,gt=/[#\?]/g,mt=/[#\?@]/g,yt=/#/g;function vt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function wt(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var n=0;n<e.length;n++){var r=e[n].indexOf("="),i=null;if(0<=r){var s=e[n].substring(0,r);i=e[n].substring(r+1)}else s=e[n];t(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function bt(e,t){wt(e),t=Tt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function It(e,t){return wt(e),t=Tt(e,t),e.g.has(t)}function _t(e,t,n){bt(e,t),0<n.length&&(e.i=null,e.g.set(Tt(e,t),d(n)),e.h+=n.length)}function Tt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function Et(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function St(){this.g=new le}function Ct(e,t,n){const r=n||"";try{tt(e,function(e,n){let i=e;o(e)&&(i=ue(e)),t.push(r+n+"="+encodeURIComponent(i))})}catch(i){throw t.push(r+"type="+encodeURIComponent("_badmap")),i}}function At(e){this.l=e.Ub||null,this.j=e.eb||!1}function kt(e,t){ee.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function Dt(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function Nt(e){e.readyState=4,e.l=null,e.j=null,e.v=null,xt(e)}function xt(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Rt(e){let t="";return v(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function Ot(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Rt(n),"string"==typeof e?null!=n&&encodeURIComponent(String(n)):ct(e,t,n))}function Pt(e){ee.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(e=vt.prototype).add=function(e,t){wt(this),this.i=null,e=Tt(this,e);var n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){wt(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.na=function(){wt(this);const e=Array.from(this.g.values()),t=Array.from(this.g.keys()),n=[];for(let r=0;r<t.length;r++){const i=e[r];for(let e=0;e<i.length;e++)n.push(t[r])}return n},e.V=function(e){wt(this);let t=[];if("string"==typeof e)It(this,e)&&(t=t.concat(this.g.get(Tt(this,e))));else{e=Array.from(this.g.values());for(let n=0;n<e.length;n++)t=t.concat(e[n])}return t},e.set=function(e,t){return wt(this),this.i=null,It(this,e=Tt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&0<(e=this.V(e)).length?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(var n=0;n<t.length;n++){var r=t[n];const s=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var i=s;""!==o[r]&&(i+="="+encodeURIComponent(String(o[r]))),e.push(i)}}return this.i=e.join("&")},l(At,de),At.prototype.g=function(){return new kt(this.l,this.j)},At.prototype.i=function(e){return function(){return e}}({}),l(kt,ee),(e=kt.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,xt(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||i).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,Nt(this)),this.readyState=0},e.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,xt(this)),this.g&&(this.readyState=3,xt(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==i.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Dt(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))},e.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?Nt(this):xt(this),3==this.readyState&&Dt(this)}},e.Ra=function(e){this.g&&(this.response=this.responseText=e,Nt(this))},e.Qa=function(e){this.g&&(this.response=e,Nt(this))},e.ga=function(){this.g&&Nt(this)},e.setRequestHeader=function(e,t){this.u.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(kt.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),l(Pt,ee);var Lt=/^https?$/i,Mt=["POST","PUT"];function Vt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,Ft(e),jt(e)}function Ft(e){e.A||(e.A=!0,te(e,"complete"),te(e,"error"))}function Ut(e){if(e.h&&void 0!==r&&(!e.v[1]||4!=qt(e)||2!=e.Z()))if(e.u&&4==qt(e))re(e.Ea,0,e);else if(te(e,"readystatechange"),4==qt(e)){e.h=!1;try{const r=e.Z();e:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var s;if(s=0===r){var o=String(e.D).match(nt)[1]||null;!o&&i.self&&i.self.location&&(o=i.self.location.protocol.slice(0,-1)),s=!Lt.test(o?o.toLowerCase():"")}n=s}if(n)te(e,"complete"),te(e,"success");else{e.m=6;try{var a=2<qt(e)?e.g.statusText:""}catch(c){a=""}e.l=a+" ["+e.Z()+"]",Ft(e)}}finally{jt(e)}}}function jt(e,t){if(e.g){Bt(e);const r=e.g,i=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||te(e,"ready");try{r.onreadystatechange=i}catch(n){}}}function Bt(e){e.I&&(i.clearTimeout(e.I),e.I=null)}function qt(e){return e.g?e.g.readyState:0}function zt(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function $t(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Kt(e){this.Aa=0,this.i=[],this.j=new Ae,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=$t("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=$t("baseRetryDelayMs",5e3,e),this.cb=$t("retryDelaySeedMs",1e4,e),this.Wa=$t("forwardChannelMaxRetries",2,e),this.wa=$t("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new We(e&&e.concurrentRequestLimit),this.Da=new St,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function Gt(e){if(Wt(e),3==e.G){var t=e.U++,n=it(e.I);if(ct(n,"SID",e.K),ct(n,"RID",t),ct(n,"TYPE","terminate"),Jt(e,n),(t=new Oe(e,e.j,t)).L=2,t.v=ut(it(n)),n=!1,i.navigator&&i.navigator.sendBeacon)try{n=i.navigator.sendBeacon(t.v.toString(),"")}catch(r){}!n&&i.Image&&((new Image).src=t.v,n=!0),n||(t.g=hn(t.j,null),t.g.ea(t.v)),t.F=Date.now(),Be(t)}cn(e)}function Ht(e){e.g&&(tn(e),e.g.cancel(),e.g=null)}function Wt(e){Ht(e),e.u&&(i.clearTimeout(e.u),e.u=null),rn(e),e.h.cancel(),e.s&&("number"==typeof e.s&&i.clearTimeout(e.s),e.s=null)}function Qt(e){if(!Qe(e.h)&&!e.s){e.s=!0;var t=e.Ga;A||N(),k||(A(),k=!0),D.add(t,e),e.B=0}}function Xt(e,t){var n;n=t?t.l:e.U++;const r=it(e.I);ct(r,"SID",e.K),ct(r,"RID",n),ct(r,"AID",e.T),Jt(e,r),e.m&&e.o&&Ot(r,e.m,e.o),n=new Oe(e,e.j,n,e.B+1),null===e.m&&(n.H=e.o),t&&(e.i=t.D.concat(e.i)),t=Yt(e,n,1e3),n.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),Ye(e.h,n),Ve(n,r,t)}function Jt(e,t){e.H&&v(e.H,function(e,n){ct(t,n,e)}),e.l&&tt({},function(e,n){ct(t,n,e)})}function Yt(e,t,n){n=Math.min(e.i.length,n);var r=e.l?u(e.l.Na,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?0<n?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let o=!0;for(let a=0;a<n;a++){let n=i[a].g;const c=i[a].map;if(n-=t,0>n)t=Math.max(0,i[a].g-100),o=!1;else try{Ct(c,e,"req"+n+"_")}catch(s){r&&r(c)}}if(o){r=e.join("&");break e}}}return e=e.i.splice(0,n),t.D=e,r}function Zt(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;A||N(),k||(A(),k=!0),D.add(t,e),e.v=0}}function en(e){return!(e.g||e.u||3<=e.v)&&(e.Y++,e.u=Ce(u(e.Fa,e),on(e,e.v)),e.v++,!0)}function tn(e){null!=e.A&&(i.clearTimeout(e.A),e.A=null)}function nn(e){e.g=new Oe(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=it(e.qa);ct(t,"RID","rpc"),ct(t,"SID",e.K),ct(t,"AID",e.T),ct(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&ct(t,"TO",e.ja),ct(t,"TYPE","xmlhttp"),Jt(e,t),e.m&&e.o&&Ot(t,e.m,e.o),e.L&&(e.g.I=e.L);var n=e.g;e=e.ia,n.L=1,n.v=ut(it(t)),n.m=null,n.P=!0,Fe(n,e)}function rn(e){null!=e.C&&(i.clearTimeout(e.C),e.C=null)}function sn(e,t){var n=null;if(e.g==t){rn(e),tn(e),e.g=null;var r=2}else{if(!Je(e.h,t))return;n=t.D,Ze(e.h,t),r=1}if(0!=e.G)if(t.o)if(1==r){n=t.m?t.m.length:0,t=Date.now()-t.F;var i=e.B;te(r=be(),new Se(r,n)),Qt(e)}else Zt(e);else if(3==(i=t.s)||0==i&&0<t.X||!(1==r&&function(e,t){return!(Xe(e.h)>=e.h.j-(e.s?1:0)||(e.s?(e.i=t.D.concat(e.i),0):1==e.G||2==e.G||e.B>=(e.Va?0:e.Wa)||(e.s=Ce(u(e.Ga,e,t),on(e,e.B)),e.B++,0)))}(e,t)||2==r&&en(e)))switch(n&&0<n.length&&(t=e.h,t.i=t.i.concat(n)),i){case 1:an(e,5);break;case 4:an(e,10);break;case 3:an(e,6);break;default:an(e,2)}}function on(e,t){let n=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(n*=2),n*t}function an(e,t){if(e.j.info("Error code "+t),2==t){var n=u(e.fb,e),r=e.Xa;const t=!r;r=new rt(r||"//www.google.com/images/cleardot.gif"),i.location&&"http"==i.location.protocol||st(r,"https"),ut(r),t?function(e,t){const n=new Ae;if(i.Image){const r=new Image;r.onload=h(Et,n,"TestLoadImage: loaded",!0,t,r),r.onerror=h(Et,n,"TestLoadImage: error",!1,t,r),r.onabort=h(Et,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=h(Et,n,"TestLoadImage: timeout",!1,t,r),i.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new Ae;const n=new AbortController,r=setTimeout(()=>{n.abort(),Et(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?Et(0,0,!0,t):Et(0,0,!1,t)}).catch(()=>{clearTimeout(r),Et(0,0,!1,t)})}(r.toString(),n)}else Ee(2);e.G=0,e.l&&e.l.sa(t),cn(e),Wt(e)}function cn(e){if(e.G=0,e.ka=[],e.l){const t=et(e.h);0==t.length&&0==e.i.length||(f(e.ka,t),f(e.ka,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.ra()}}function un(e,t,n){var r=n instanceof rt?it(n):new rt(n);if(""!=r.g)t&&(r.g=t+"."+r.g),ot(r,r.s);else{var s=i.location;r=s.protocol,t=t?t+"."+s.hostname:s.hostname,s=+s.port;var o=new rt(null);r&&st(o,r),t&&(o.g=t),s&&ot(o,s),n&&(o.l=n),r=o}return n=e.D,t=e.ya,n&&t&&ct(r,n,t),ct(r,"VER",e.la),Jt(e,r),r}function hn(e,t,n){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Ca&&!e.pa?new Pt(new At({eb:n})):new Pt(e.pa)).Ha(e.J),t}function ln(){}function dn(){}function fn(e,t){ee.call(this),this.g=new Kt(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!p(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!p(t)&&(this.g.D=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new mn(this)}function pn(e){me.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function gn(){ye.call(this),this.status=1}function mn(e){this.g=e}(e=Pt.prototype).Ha=function(e){this.J=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():De.g(),this.v=this.o?fe(this.o):fe(De),this.g.onreadystatechange=u(this.Ea,this);try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Vt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var s in r)n.set(s,r[s]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),s=i.FormData&&e instanceof i.FormData,!(0<=Array.prototype.indexOf.call(Mt,t,void 0))||r||s||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[i,a]of n)this.g.setRequestHeader(i,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Bt(this),this.u=!0,this.g.send(e),this.u=!1}catch(o){Vt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,te(this,"complete"),te(this,"abort"),jt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),jt(this,!0)),Pt.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?Ut(this):this.bb())},e.bb=function(){Ut(this)},e.isActive=function(){return!!this.g},e.Z=function(){try{return 2<qt(this)?this.g.status:-1}catch(e){return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),he(t)}},e.Ba=function(){return this.m},e.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Kt.prototype).la=8,e.G=1,e.connect=function(e,t,n,r){Ee(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=un(this,null,this.W),Qt(this)},e.Ga=function(e){if(this.s)if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const i=new Oe(this,this.j,e);let s=this.o;if(this.S&&(s?(s=w(s),I(s,this.S)):s=this.S),null!==this.m||this.O||(i.H=s,s=null),this.P)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(t+=r)){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=Yt(this,i,t),ct(n=it(this.I),"RID",e),ct(n,"CVER",22),this.D&&ct(n,"X-HTTP-Session-Id",this.D),Jt(this,n),s&&(this.O?t="headers="+encodeURIComponent(String(Rt(s)))+"&"+t:this.m&&Ot(n,this.m,s)),Ye(this.h,i),this.Ua&&ct(n,"TYPE","init"),this.P?(ct(n,"$req",t),ct(n,"SID","null"),i.T=!0,Ve(i,n,null)):Ve(i,n,t),this.G=2}}else 3==this.G&&(e?Xt(this,e):0==this.i.length||Qe(this.h)||Xt(this))},e.Fa=function(){if(this.u=null,nn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=Ce(u(this.ab,this),e)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),Ht(this),nn(this))},e.Za=function(){null!=this.C&&(this.C=null,Ht(this),en(this),Ee(19))},e.fb=function(e){e?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=ln.prototype).ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){},dn.prototype.g=function(e,t){return new fn(e,t)},l(fn,ee),fn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},fn.prototype.close=function(){Gt(this.g)},fn.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.u&&((n={}).__data__=ue(e),e=n);t.i.push(new He(t.Ya++,e)),3==t.G&&Qt(t)},fn.prototype.N=function(){this.g.l=null,delete this.j,Gt(this.g),delete this.g,fn.aa.N.call(this)},l(pn,me),l(gn,ye),l(mn,ln),mn.prototype.ua=function(){te(this.g,"a")},mn.prototype.ta=function(e){te(this.g,new pn(e))},mn.prototype.sa=function(e){te(this.g,new gn)},mn.prototype.ra=function(){te(this.g,"b")},dn.prototype.createWebChannel=dn.prototype.g,fn.prototype.send=fn.prototype.o,fn.prototype.open=fn.prototype.m,fn.prototype.close=fn.prototype.close,mi=function(){return new dn},gi=function(){return be()},pi=ve,fi={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ne.NO_ERROR=0,Ne.TIMEOUT=8,Ne.HTTP_ERROR=6,di=Ne,xe.COMPLETE="complete",li=xe,pe.EventType=ge,ge.OPEN="a",ge.CLOSE="b",ge.ERROR="c",ge.MESSAGE="d",ee.prototype.listen=ee.prototype.K,hi=pe,Pt.prototype.listenOnce=Pt.prototype.L,Pt.prototype.getLastError=Pt.prototype.Ka,Pt.prototype.getLastErrorCode=Pt.prototype.Ba,Pt.prototype.getStatus=Pt.prototype.Z,Pt.prototype.getResponseJson=Pt.prototype.Oa,Pt.prototype.getResponseText=Pt.prototype.oa,Pt.prototype.send=Pt.prototype.ea,Pt.prototype.setWithCredentials=Pt.prototype.Ha,ui=Pt}).apply(void 0!==yi?yi:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const vi="@firebase/firestore",wi="4.8.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}bi.UNAUTHENTICATED=new bi(null),bi.GOOGLE_CREDENTIALS=new bi("google-credentials-uid"),bi.FIRST_PARTY=new bi("first-party-uid"),bi.MOCK_USER=new bi("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ii="11.10.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _i=new z("@firebase/firestore");function Ti(){return _i.logLevel}function Ei(e,...t){if(_i.logLevel<=V.DEBUG){const n=t.map(Ai);_i.debug(`Firestore (${Ii}): ${e}`,...n)}}function Si(e,...t){if(_i.logLevel<=V.ERROR){const n=t.map(Ai);_i.error(`Firestore (${Ii}): ${e}`,...n)}}function Ci(e,...t){if(_i.logLevel<=V.WARN){const n=t.map(Ai);_i.warn(`Firestore (${Ii}): ${e}`,...n)}}function Ai(e){if("string"==typeof e)return e;try{
/**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,Di(e,r,n)}function Di(e,t,n){let r=`FIRESTORE (${Ii}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(i){r+=" CONTEXT: "+n}throw Si(r),new Error(r)}function Ni(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||Di(t,i,r)}function xi(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ri={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Oi extends E{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Mi{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(bi.UNAUTHENTICATED))}shutdown(){}}class Vi{constructor(e){this.t=e,this.currentUser=bi.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ni(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let i=new Pi;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Pi,e.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{Ei("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(Ei("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Pi)}},0),s()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(Ei("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Ni("string"==typeof t.accessToken,31837,{l:t}),new Li(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ni(null===e||"string"==typeof e,2055,{h:e}),new bi(e)}}class Fi{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=bi.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Ui{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Fi(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(bi.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ji{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Bi{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,$e(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Ni(void 0===this.o,3512);const n=e=>{null!=e.error&&Ei("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,Ei("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{Ei("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):Ei("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ji(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(Ni("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new ji(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qi(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zi(){return new TextEncoder}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=qi(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function Ki(e,t){return e<t?-1:e>t?1:0}function Gi(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=e.codePointAt(n),i=t.codePointAt(n);if(r!==i){if(r<128&&i<128)return Ki(r,i);{const s=zi(),o=Wi(s.encode(Hi(e,n)),s.encode(Hi(t,n)));return 0!==o?o:Ki(r,i)}}n+=r>65535?2:1}return Ki(e.length,t.length)}function Hi(e,t){return e.codePointAt(t)>65535?e.substring(t,t+2):e.substring(t,t+1)}function Wi(e,t){for(let n=0;n<e.length&&n<t.length;++n)if(e[n]!==t[n])return Ki(e[n],t[n]);return Ki(e.length,t.length)}function Qi(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function Xi(e){return e+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji="__name__";class Yi{constructor(e,t,n){void 0===t?t=0:t>e.length&&ki(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&ki(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===Yi.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Yi?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=Yi.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return Ki(e.length,t.length)}static compareSegments(e,t){const n=Yi.isNumericId(e),r=Yi.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?Yi.extractNumericId(e).compare(Yi.extractNumericId(t)):Gi(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return oi.fromString(e.substring(4,e.length-2))}}class Zi extends Yi{construct(e,t,n){return new Zi(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Oi(Ri.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new Zi(t)}static emptyPath(){return new Zi([])}}const es=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ts extends Yi{construct(e,t,n){return new ts(e,t,n)}static isValidIdentifier(e){return es.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ts.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===Ji}static keyField(){return new ts([Ji])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(0===n.length)throw new Oi(Ri.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let s=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Oi(Ri.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Oi(Ri.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(s=!s,r++):"."!==t||s?(n+=t,r++):(i(),r++)}if(i(),s)throw new Oi(Ri.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ts(t)}static emptyPath(){return new ts([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e){this.path=e}static fromPath(e){return new ns(Zi.fromString(e))}static fromName(e){return new ns(Zi.fromString(e).popFirst(5))}static empty(){return new ns(Zi.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===Zi.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return Zi.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ns(new Zi(e.slice()))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(e,t,n){if(!n)throw new Oi(Ri.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function is(e){if(!ns.isDocumentKey(e))throw new Oi(Ri.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function ss(e){if(ns.isDocumentKey(e))throw new Oi(Ri.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function os(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function as(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":ki(12329,{type:typeof e})}function cs(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Oi(Ri.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=as(e);throw new Oi(Ri.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(e,t){const n={typeString:e};return t&&(n.value=t),n}function hs(e,t){if(!os(e))throw new Oi(Ri.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new Oi(Ri.INVALID_ARGUMENT,n);return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ls=-62135596800,ds=1e6;class fs{static now(){return fs.fromMillis(Date.now())}static fromDate(e){return fs.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*ds);return new fs(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Oi(Ri.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Oi(Ri.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ls)throw new Oi(Ri.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Oi(Ri.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ds}_compareTo(e){return this.seconds===e.seconds?Ki(this.nanoseconds,e.nanoseconds):Ki(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:fs._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(hs(e,fs._jsonSchema))return new fs(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ls;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}fs._jsonSchemaVersion="firestore/timestamp/1.0",fs._jsonSchema={type:us("string",fs._jsonSchemaVersion),seconds:us("number"),nanoseconds:us("number")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ps{static fromTimestamp(e){return new ps(e)}static min(){return new ps(new fs(0,0))}static max(){return new ps(new fs(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gs=-1;class ms{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function ys(e){return e.fields.find(e=>2===e.kind)}function vs(e){return e.fields.filter(e=>2!==e.kind)}ms.UNKNOWN_ID=-1;class ws{constructor(e,t){this.fieldPath=e,this.kind=t}}class bs{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new bs(0,Ts.min())}}function Is(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=ps.fromTimestamp(1e9===r?new fs(n+1,0):new fs(n,r));return new Ts(i,ns.empty(),t)}function _s(e){return new Ts(e.readTime,e.key,gs)}class Ts{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ts(ps.min(),ns.empty(),gs)}static max(){return new Ts(ps.max(),ns.empty(),gs)}}function Es(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=ns.comparator(e.documentKey,t.documentKey),0!==n?n:Ki(e.largestBatchId,t.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const Ss="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Cs{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function As(e){if(e.code!==Ri.FAILED_PRECONDITION||e.message!==Ss)throw e;Ei("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ki(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new ks((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof ks?t:ks.resolve(t)}catch(t){return ks.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):ks.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):ks.reject(t)}static resolve(e){return new ks((t,n)=>{t(e)})}static reject(e){return new ks((t,n)=>{n(e)})}static waitFor(e){return new ks((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=ks.resolve(!1);for(const n of e)t=t.next(e=>e?ks.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new ks((n,r)=>{const i=e.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const c=a;t(e[c]).next(e=>{s[c]=e,++o,o===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new ks((n,r)=>{const i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ds="SimpleDb";class Ns{static open(e,t,n,r){try{return new Ns(t,e.transaction(r,n))}catch(i){throw new Ps(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Pi,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Ps(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Us(t.target.error);this.S.reject(new Ps(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(Ei(Ds,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Ms(t)}}class xs{static delete(e){return Ei(Ds,"Removing database:",e),Vs(o().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!T())return!1;if(xs.F())return!0;const e=w(),t=xs.M(e),n=0<t&&t<10,r=Rs(e),i=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null===(e=process.__PRIVATE_env)||void 0===e?void 0:e.O)}static N(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.B=n,this.L=null,12.2===xs.M(w())&&Si("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(e){return this.db||(Ei(Ds,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Ps(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Oi(Ri.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Oi(Ri.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Ps(e,r))},r.onupgradeneeded=e=>{Ei(Ds,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;if(null!==this.L&&this.L!==e.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${e.oldVersion}, event.newVersion=${e.newVersion}, db.version=${t.version}`);this.B.q(t,r.transaction,e.oldVersion,this.version).next(()=>{Ei(Ds,"Database upgrade to version "+this.version+" complete")})}}),this.db.addEventListener("close",e=>{const t=e.target;this.L=t.version},{passive:!0})),this.db.addEventListener("versionchange",e=>{var t;null===e.newVersion&&(Ci('Received "versionchange" event with newVersion===null; notifying the registered DatabaseDeletedListener, if any'),null===(t=this.databaseDeletedListener)||void 0===t||t.call(this))},{passive:!0}),this.db}setDatabaseDeletedListener(e){if(this.databaseDeletedListener)throw new Error("setDatabaseDeletedListener() may only be called once, and it has already been called");this.databaseDeletedListener=e}async runTransaction(e,t,n,r){const i="readonly"===t;let s=0;for(;;){++s;try{this.db=await this.k(e);const t=Ns.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.v(),e)).catch(e=>(t.abort(e),ks.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(o){const e=o,t="FirebaseError"!==e.name&&s<3;if(Ei(Ds,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Rs(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Os{constructor(e){this.$=e,this.U=!1,this.K=null}get isDone(){return this.U}get W(){return this.K}set cursor(e){this.$=e}done(){this.U=!0}G(e){this.K=e}delete(){return Vs(this.$.delete())}}class Ps extends Oi{constructor(e,t){super(Ri.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Ls(e){return"IndexedDbTransactionError"===e.name}class Ms{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(Ei(Ds,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(Ei(Ds,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Vs(n)}add(e){return Ei(Ds,"ADD",this.store.name,e,e),Vs(this.store.add(e))}get(e){return Vs(this.store.get(e)).next(t=>(void 0===t&&(t=null),Ei(Ds,"GET",this.store.name,e,t),t))}delete(e){return Ei(Ds,"DELETE",this.store.name,e),Vs(this.store.delete(e))}count(){return Ei(Ds,"COUNT",this.store.name),Vs(this.store.count())}j(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new ks((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.J(e,(e,n)=>{t.push(n)}).next(()=>t)}}H(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new ks((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}Y(e,t){Ei(Ds,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Z=!1;const r=this.cursor(n);return this.J(r,(e,t,n)=>n.delete())}X(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.J(r,t)}ee(e){const t=this.cursor({});return new ks((n,r)=>{t.onerror=e=>{const t=Us(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}J(e,t){const n=[];return new ks((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{const i=e.target.result;if(!i)return void r();const s=new Os(i),o=t(i.primaryKey,i.value,s);if(o instanceof ks){const e=o.catch(e=>(s.done(),ks.reject(e)));n.push(e)}s.isDone?r():null===s.W?i.continue():i.continue(s.W)}}).next(()=>ks.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Z?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Vs(e){return new ks((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Us(e.target.error);n(t)}})}let Fs=!1;function Us(e){const t=xs.M(w());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Oi("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Fs||(Fs=!0,setTimeout(()=>{throw e},0)),e}}return e}const js="IndexBackfiller";class Bs{constructor(e,t){this.asyncQueue=e,this.te=t,this.task=null}start(){this.ne(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}ne(e){Ei(js,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.te.re();Ei(js,`Documents written: ${e}`)}catch(e){Ls(e)?Ei(js,"Ignoring IndexedDB error during index backfill: ",e):await As(e)}await this.ne(6e4)})}}class qs{constructor(e,t){this.localStore=e,this.persistence=t}async re(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.ie(t,e))}ie(e,t){const n=new Set;let r=t,i=!0;return ks.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return Ei(js,`Processing collection: ${t}`),this.se(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}se(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this.oe(r,n)).next(n=>(Ei(js,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}oe(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=_s(t);Es(r,n)>0&&(n=r)}),new Ts(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this._e(e),this.ae=e=>t.writeSequenceNumber(e))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}zs.ue=-1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $s=-1;function Ks(e){return null==e}function Gs(e){return 0===e&&1/e==-1/0}function Hs(e){return"number"==typeof e&&Number.isInteger(e)&&!Gs(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ws="";function Qs(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=Js(t)),t=Xs(e.get(n),t);return Js(t)}function Xs(e,t){let n=t;const r=e.length;for(let i=0;i<r;i++){const t=e.charAt(i);switch(t){case"\0":n+="";break;case Ws:n+="";break;default:n+=t}}return n}function Js(e){return e+Ws+""}function Ys(e){const t=e.length;if(Ni(t>=2,64408,{path:e}),2===t)return Ni(e.charAt(0)===Ws&&""===e.charAt(1),56145,{path:e}),Zi.emptyPath();const n=t-2,r=[];let i="";for(let s=0;s<t;){const t=e.indexOf(Ws,s);switch((t<0||t>n)&&ki(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(s,t);let o;0===i.length?o=n:(i+=n,o=i,i=""),r.push(o);break;case"":i+=e.substring(s,t),i+="\0";break;case"":i+=e.substring(s,t+1);break;default:ki(61167,{path:e})}s=t+2}return new Zi(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zs="remoteDocuments",eo="owner",to="owner",no="mutationQueues",ro="mutations",io="batchId",so="userMutationsIndex",oo=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(e,t){return[e,Qs(t)]}function co(e,t,n){return[e,Qs(t),n]}const uo={},ho="documentMutations",lo="remoteDocumentsV14",fo=["prefixPath","collectionGroup","readTime","documentId"],po="documentKeyIndex",go=["prefixPath","collectionGroup","documentId"],mo="collectionGroupIndex",yo=["collectionGroup","readTime","prefixPath","documentId"],vo="remoteDocumentGlobal",wo="remoteDocumentGlobalKey",bo="targets",Io="queryTargetsIndex",_o=["canonicalId","targetId"],To="targetDocuments",Eo=["targetId","path"],So="documentTargetsIndex",Co=["path","targetId"],Ao="targetGlobalKey",ko="targetGlobal",Do="collectionParents",No=["collectionId","parent"],xo="clientMetadata",Ro="bundles",Oo="namedQueries",Po="indexConfiguration",Lo="collectionGroupIndex",Mo="indexState",Vo=["indexId","uid"],Fo="sequenceNumberIndex",Uo=["uid","sequenceNumber"],jo="indexEntries",Bo=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],qo="documentKeyIndex",zo=["indexId","uid","orderedDocumentKey"],$o="documentOverlays",Ko=["userId","collectionPath","documentId"],Go="collectionPathOverlayIndex",Ho=["userId","collectionPath","largestBatchId"],Wo="collectionGroupOverlayIndex",Qo=["userId","collectionGroup","largestBatchId"],Xo="globals",Jo=[no,ro,ho,Zs,bo,eo,ko,To,xo,vo,Do,Ro,Oo],Yo=[...Jo,$o],Zo=[no,ro,ho,lo,bo,eo,ko,To,xo,vo,Do,Ro,Oo,$o],ea=Zo,ta=[...ea,Po,Mo,jo],na=ta,ra=[...ta,Xo],ia=ra;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa extends Cs{constructor(e,t){super(),this.ce=e,this.currentSequenceNumber=t}}function oa(e,t){const n=xi(e);return xs.N(n.ce,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aa(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function ca(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function ua(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(e,t){this.comparator=e,this.root=t||da.EMPTY}insert(e,t){return new ha(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,da.BLACK,null,null))}remove(e){return new ha(this.comparator,this.root.remove(e,this.comparator).copy(null,null,da.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new la(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new la(this.root,e,this.comparator,!1)}getReverseIterator(){return new la(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new la(this.root,e,this.comparator,!0)}}class la{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class da{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:da.RED,this.left=null!=r?r:da.EMPTY,this.right=null!=i?i:da.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new da(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return da.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return da.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,da.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,da.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ki(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ki(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ki(27949);return e+(this.isRed()?0:1)}}da.EMPTY=null,da.RED=!0,da.BLACK=!1,da.EMPTY=new class{constructor(){this.size=0}get key(){throw ki(57766)}get value(){throw ki(16141)}get color(){throw ki(16727)}get left(){throw ki(29726)}get right(){throw ki(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new da(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fa{constructor(e){this.comparator=e,this.data=new ha(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new pa(this.data.getIterator())}getIteratorFrom(e){return new pa(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof fa))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new fa(this.comparator);return t.data=e,t}}class pa{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function ga(e){return e.hasNext()?e.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e){this.fields=e,e.sort(ts.comparator)}static empty(){return new ma([])}unionWith(e){let t=new fa(ts.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ma(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Qi(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new ya("Invalid base64 string: "+t):t}}(e);return new va(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new va(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ki(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}va.EMPTY_BYTE_STRING=new va("");const wa=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ba(e){if(Ni(!!e,39018),"string"==typeof e){let t=0;const n=wa.exec(e);if(Ni(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Ia(e.seconds),nanos:Ia(e.nanos)}}function Ia(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function _a(e){return"string"==typeof e?va.fromBase64String(e):va.fromUint8Array(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta="server_timestamp",Ea="__type__",Sa="__previous_value__",Ca="__local_write_time__";function Aa(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[Ea])||void 0===n?void 0:n.stringValue)===Ta}function ka(e){const t=e.mapValue.fields[Sa];return Aa(t)?ka(t):t}function Da(e){const t=ba(e.mapValue.fields[Ca].timestampValue);return new fs(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t,n,r,i,s,o,a,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u}}const xa="(default)";class Ra{constructor(e,t){this.projectId=e,this.database=t||xa}static empty(){return new Ra("","")}get isDefaultDatabase(){return this.database===xa}isEqual(e){return e instanceof Ra&&e.projectId===this.projectId&&e.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa="__type__",Pa="__max__",La={mapValue:{fields:{__type__:{stringValue:Pa}}}},Ma="__vector__",Va="value",Fa={nullValue:"NULL_VALUE"};function Ua(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Aa(e)?4:nc(e)?9007199254740991:ec(e)?10:11:ki(28295,{value:e})}function ja(e,t){if(e===t)return!0;const n=Ua(e);if(n!==Ua(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Da(e).isEqual(Da(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=ba(e.timestampValue),r=ba(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,_a(e.bytesValue).isEqual(_a(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return Ia(e.geoPointValue.latitude)===Ia(t.geoPointValue.latitude)&&Ia(e.geoPointValue.longitude)===Ia(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Ia(e.integerValue)===Ia(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=Ia(e.doubleValue),r=Ia(t.doubleValue);return n===r?Gs(n)===Gs(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return Qi(e.arrayValue.values||[],t.arrayValue.values||[],ja);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(aa(n)!==aa(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!ja(n[i],r[i])))return!1;return!0}(e,t);default:return ki(52216,{left:e})}var r}function Ba(e,t){return void 0!==(e.values||[]).find(e=>ja(e,t))}function qa(e,t){if(e===t)return 0;const n=Ua(e),r=Ua(t);if(n!==r)return Ki(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return Ki(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=Ia(e.integerValue||e.doubleValue),r=Ia(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return za(e.timestampValue,t.timestampValue);case 4:return za(Da(e),Da(t));case 5:return Gi(e.stringValue,t.stringValue);case 6:return function(e,t){const n=_a(e),r=_a(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let i=0;i<n.length&&i<r.length;i++){const e=Ki(n[i],r[i]);if(0!==e)return e}return Ki(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=Ki(Ia(e.latitude),Ia(t.latitude));return 0!==n?n:Ki(Ia(e.longitude),Ia(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return $a(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;const o=e.fields||{},a=t.fields||{},c=null===(n=o[Va])||void 0===n?void 0:n.arrayValue,u=null===(r=a[Va])||void 0===r?void 0:r.arrayValue,h=Ki((null===(i=null==c?void 0:c.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==h?h:$a(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===La.mapValue&&t===La.mapValue)return 0;if(e===La.mapValue)return 1;if(t===La.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const e=Gi(r[o],s[o]);if(0!==e)return e;const t=qa(n[r[o]],i[s[o]]);if(0!==t)return t}return Ki(r.length,s.length)}(e.mapValue,t.mapValue);default:throw ki(23264,{le:n})}}function za(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return Ki(e,t);const n=ba(e),r=ba(t),i=Ki(n.seconds,r.seconds);return 0!==i?i:Ki(n.nanos,r.nanos)}function $a(e,t){const n=e.values||[],r=t.values||[];for(let i=0;i<n.length&&i<r.length;++i){const e=qa(n[i],r[i]);if(e)return e}return Ki(n.length,r.length)}function Ka(e){return Ga(e)}function Ga(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=ba(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?_a(e.bytesValue).toBase64():"referenceValue"in e?function(e){return ns.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=Ga(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const i of t)r?r=!1:n+=",",n+=`${i}:${Ga(e.fields[i])}`;return n+"}"}(e.mapValue):ki(61005,{value:e})}function Ha(e){switch(Ua(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=ka(e);return t?16+Ha(t):16;case 5:return 2*e.stringValue.length;case 6:return _a(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+Ha(t),0);case 10:case 11:return function(e){let t=0;return ca(e.fields,(e,n)=>{t+=e.length+Ha(n)}),t}(e.mapValue);default:throw ki(13486,{value:e})}}function Wa(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function Qa(e){return!!e&&"integerValue"in e}function Xa(e){return!!e&&"arrayValue"in e}function Ja(e){return!!e&&"nullValue"in e}function Ya(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function Za(e){return!!e&&"mapValue"in e}function ec(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[Oa])||void 0===n?void 0:n.stringValue)===Ma}function tc(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){const t={mapValue:{fields:{}}};return ca(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=tc(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=tc(e.arrayValue.values[n]);return t}return Object.assign({},e)}function nc(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Pa}const rc={mapValue:{fields:{[Oa]:{stringValue:Ma},[Va]:{arrayValue:{}}}}};function ic(e){return"nullValue"in e?Fa:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?Wa(Ra.empty(),ns.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?ec(e)?rc:{mapValue:{}}:ki(35942,{value:e})}function sc(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?Wa(Ra.empty(),ns.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?rc:"mapValue"in e?ec(e)?{mapValue:{}}:La:ki(61959,{value:e})}function oc(e,t){const n=qa(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function ac(e,t){const n=qa(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cc{constructor(e){this.value=e}static empty(){return new cc({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Za(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tc(t)}setAll(e){let t=ts.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=tc(e):r.push(i.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());Za(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ja(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];Za(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){ca(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new cc(tc(this.value))}}function uc(e){const t=[];return ca(e.fields,(e,n)=>{const r=new ts([e]);if(Za(n)){const e=uc(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new ma(t)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class hc{constructor(e,t,n,r,i,s,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(e){return new hc(e,0,ps.min(),ps.min(),ps.min(),cc.empty(),0)}static newFoundDocument(e,t,n,r){return new hc(e,1,t,ps.min(),n,r,0)}static newNoDocument(e,t){return new hc(e,2,t,ps.min(),ps.min(),cc.empty(),0)}static newUnknownDocument(e,t){return new hc(e,3,t,ps.min(),ps.min(),cc.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ps.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=cc.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=cc.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ps.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof hc&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new hc(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(e,t){this.position=e,this.inclusive=t}}function dc(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){const s=t[i],o=e.position[i];if(r=s.field.isKeyField()?ns.comparator(ns.fromName(o.referenceValue),n.key):qa(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function fc(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!ja(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(e,t="asc"){this.field=e,this.dir=t}}function gc(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc{}class yc extends mc{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new Ac(e,t,n):"array-contains"===t?new xc(e,n):"in"===t?new Rc(e,n):"not-in"===t?new Oc(e,n):"array-contains-any"===t?new Pc(e,n):new yc(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new kc(e,n):new Dc(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(qa(t,this.value)):null!==t&&Ua(this.value)===Ua(t)&&this.matchesComparison(qa(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return ki(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class vc extends mc{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new vc(e,t)}matches(e){return wc(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.he||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function wc(e){return"and"===e.op}function bc(e){return"or"===e.op}function Ic(e){return _c(e)&&wc(e)}function _c(e){for(const t of e.filters)if(t instanceof vc)return!1;return!0}function Tc(e){if(e instanceof yc)return e.field.canonicalString()+e.op.toString()+Ka(e.value);if(Ic(e))return e.filters.map(e=>Tc(e)).join(",");{const t=e.filters.map(e=>Tc(e)).join(",");return`${e.op}(${t})`}}function Ec(e,t){return e instanceof yc?(n=e,(r=t)instanceof yc&&n.op===r.op&&n.field.isEqual(r.field)&&ja(n.value,r.value)):e instanceof vc?function(e,t){return t instanceof vc&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&Ec(n,t.filters[r]),!0)}(e,t):void ki(19439);var n,r}function Sc(e,t){const n=e.filters.concat(t);return vc.create(n,e.op)}function Cc(e){return e instanceof yc?`${(t=e).field.canonicalString()} ${t.op} ${Ka(t.value)}`:e instanceof vc?function(e){return e.op.toString()+" {"+e.getFilters().map(Cc).join(" ,")+"}"}(e):"Filter";var t}class Ac extends yc{constructor(e,t,n){super(e,t,n),this.key=ns.fromName(n.referenceValue)}matches(e){const t=ns.comparator(e.key,this.key);return this.matchesComparison(t)}}class kc extends yc{constructor(e,t){super(e,"in",t),this.keys=Nc("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Dc extends yc{constructor(e,t){super(e,"not-in",t),this.keys=Nc("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Nc(e,t){var n;return((null===(n=t.arrayValue)||void 0===n?void 0:n.values)||[]).map(e=>ns.fromName(e.referenceValue))}class xc extends yc{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Xa(t)&&Ba(t.arrayValue,this.value)}}class Rc extends yc{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&Ba(this.value.arrayValue,t)}}class Oc extends yc{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ba(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!Ba(this.value.arrayValue,t)}}class Pc extends yc{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Xa(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>Ba(this.value.arrayValue,e))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,t=null,n=[],r=[],i=null,s=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.Pe=null}}function Mc(e,t=null,n=[],r=[],i=null,s=null,o=null){return new Lc(e,t,n,r,i,s,o)}function Vc(e){const t=xi(e);if(null===t.Pe){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Tc(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),Ks(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>Ka(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>Ka(e)).join(",")),t.Pe=e}return t.Pe}function Fc(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!gc(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!Ec(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!fc(e.startAt,t.startAt)&&fc(e.endAt,t.endAt)}function Uc(e){return ns.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function jc(e,t){return e.filters.filter(e=>e instanceof yc&&e.field.isEqual(t))}function Bc(e,t,n){let r=Fa,i=!0;for(const s of jc(e,t)){let e=Fa,t=!0;switch(s.op){case"<":case"<=":e=ic(s.value);break;case"==":case"in":case">=":e=s.value;break;case">":e=s.value,t=!1;break;case"!=":case"not-in":e=Fa}oc({value:r,inclusive:i},{value:e,inclusive:t})<0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];oc({value:r,inclusive:i},{value:e,inclusive:n.inclusive})<0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}function qc(e,t,n){let r=La,i=!0;for(const s of jc(e,t)){let e=La,t=!0;switch(s.op){case">=":case">":e=sc(s.value),t=!1;break;case"==":case"in":case"<=":e=s.value;break;case"<":e=s.value,t=!1;break;case"!=":case"not-in":e=La}ac({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];ac({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zc{constructor(e,t=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function $c(e,t,n,r,i,s,o,a){return new zc(e,t,n,r,i,s,o,a)}function Kc(e){return new zc(e)}function Gc(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function Hc(e){return null!==e.collectionGroup}function Wc(e){const t=xi(e);if(null===t.Te){t.Te=[];const e=new Set;for(const r of t.explicitOrderBy)t.Te.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new fa(ts.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Te.push(new pc(r,n))}),e.has(ts.keyField().canonicalString())||t.Te.push(new pc(ts.keyField(),n))}return t.Te}function Qc(e){const t=xi(e);return t.Ie||(t.Ie=function(e,t){if("F"===e.limitType)return Mc(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new pc(e.field,t)});const n=e.endAt?new lc(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new lc(e.startAt.position,e.startAt.inclusive):null;return Mc(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}(t,Wc(e))),t.Ie}function Xc(e,t){const n=e.filters.concat([t]);return new zc(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function Jc(e,t,n){return new zc(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function Yc(e,t){return Fc(Qc(e),Qc(t))&&e.limitType===t.limitType}function Zc(e){return`${Vc(Qc(e))}|lt:${e.limitType}`}function eu(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>Cc(e)).join(", ")}]`),Ks(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>Ka(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>Ka(e)).join(",")),`Target(${t})`}(Qc(e))}; limitType=${e.limitType})`}function tu(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):ns.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of Wc(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=dc(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,Wc(n),r)||n.endAt&&!function(e,t,n){const r=dc(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,Wc(n),r)));var n,r}function nu(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function ru(e){return(t,n)=>{let r=!1;for(const i of Wc(e)){const e=iu(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}function iu(e,t,n){const r=e.field.isKeyField()?ns.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?qa(r,i):ki(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return ki(19790,{direction:e.dir})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,e))return i}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){ca(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return ua(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou=new ha(ns.comparator);function au(){return ou}const cu=new ha(ns.comparator);function uu(...e){let t=cu;for(const n of e)t=t.insert(n.key,n);return t}function hu(e){let t=cu;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function lu(){return fu()}function du(){return fu()}function fu(){return new su(e=>e.toString(),(e,t)=>e.isEqual(t))}const pu=new ha(ns.comparator),gu=new fa(ns.comparator);function mu(...e){let t=gu;for(const n of e)t=t.add(n);return t}const yu=new fa(Ki);function vu(){return yu}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Gs(t)?"-0":t}}function bu(e){return{integerValue:""+e}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Iu{constructor(){this._=void 0}}function _u(e,t,n){return e instanceof Su?function(e,t){const n={fields:{[Ea]:{stringValue:Ta},[Ca]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Aa(t)&&(t=ka(t)),t&&(n.fields[Sa]=t),{mapValue:n}}(n,t):e instanceof Cu?Au(e,t):e instanceof ku?Du(e,t):function(e,t){const n=Eu(e,t),r=xu(n)+xu(e.Ee);return Qa(n)&&Qa(e.Ee)?bu(r):wu(e.serializer,r)}(e,t)}function Tu(e,t,n){return e instanceof Cu?Au(e,t):e instanceof ku?Du(e,t):n}function Eu(e,t){return e instanceof Nu?Qa(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class Su extends Iu{}class Cu extends Iu{constructor(e){super(),this.elements=e}}function Au(e,t){const n=Ru(t);for(const r of e.elements)n.some(e=>ja(e,r))||n.push(r);return{arrayValue:{values:n}}}class ku extends Iu{constructor(e){super(),this.elements=e}}function Du(e,t){let n=Ru(t);for(const r of e.elements)n=n.filter(e=>!ja(e,r));return{arrayValue:{values:n}}}class Nu extends Iu{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function xu(e){return Ia(e.integerValue||e.doubleValue)}function Ru(e){return Xa(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ou{constructor(e,t){this.field=e,this.transform=t}}class Pu{constructor(e,t){this.version=e,this.transformResults=t}}class Lu{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Lu}static exists(e){return new Lu(void 0,e)}static updateTime(e){return new Lu(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Mu(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Vu{}function Fu(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new Wu(e.key,Lu.none()):new zu(e.key,e.data,Lu.none());{const n=e.data,r=cc.empty();let i=new fa(ts.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new $u(e.key,r,new ma(i.toArray()),Lu.none())}}function Uu(e,t,n){var r;e instanceof zu?function(e,t,n){const r=e.value.clone(),i=Gu(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof $u?function(e,t,n){if(!Mu(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=Gu(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(Ku(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function ju(e,t,n,r){return e instanceof zu?function(e,t,n,r){if(!Mu(e.precondition,t))return n;const i=e.value.clone(),s=Hu(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof $u?function(e,t,n,r){if(!Mu(e.precondition,t))return n;const i=Hu(e.fieldTransforms,r,t),s=t.data;return s.setAll(Ku(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(i=t,s=n,Mu(e.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):s);var i,s}function Bu(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),i=Eu(r.transform,e||null);null!=i&&(null===n&&(n=cc.empty()),n.set(r.field,i))}return n||null}function qu(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&Qi(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof Cu&&r instanceof Cu||n instanceof ku&&r instanceof ku?Qi(n.elements,r.elements,ja):n instanceof Nu&&r instanceof Nu?ja(n.Ee,r.Ee):n instanceof Su&&r instanceof Su);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class zu extends Vu{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class $u extends Vu{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Ku(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function Gu(e,t,n){const r=new Map;Ni(e.length===n.length,32656,{Ae:n.length,Re:e.length});for(let i=0;i<n.length;i++){const s=e[i],o=s.transform,a=t.data.field(s.field);r.set(s.field,Tu(o,a,n[i]))}return r}function Hu(e,t,n){const r=new Map;for(const i of e){const e=i.transform,s=n.data.field(i.field);r.set(i.field,_u(e,s,t))}return r}class Wu extends Vu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Qu extends Vu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&Uu(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=ju(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=ju(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=du();return this.mutations.forEach(r=>{const i=e.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=t.has(r.key)?null:o;const a=Fu(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(ps.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),mu())}isEqual(e){return this.batchId===e.batchId&&Qi(this.mutations,e.mutations,(e,t)=>qu(e,t))&&Qi(this.baseMutations,e.baseMutations,(e,t)=>qu(e,t))}}class Ju{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Ni(e.mutations.length===n.length,58842,{Ve:e.mutations.length,me:n.length});let r=function(){return pu}();const i=e.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new Ju(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zu{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var eh,th;function nh(e){switch(e){case Ri.OK:return ki(64938);case Ri.CANCELLED:case Ri.UNKNOWN:case Ri.DEADLINE_EXCEEDED:case Ri.RESOURCE_EXHAUSTED:case Ri.INTERNAL:case Ri.UNAVAILABLE:case Ri.UNAUTHENTICATED:return!1;case Ri.INVALID_ARGUMENT:case Ri.NOT_FOUND:case Ri.ALREADY_EXISTS:case Ri.PERMISSION_DENIED:case Ri.FAILED_PRECONDITION:case Ri.ABORTED:case Ri.OUT_OF_RANGE:case Ri.UNIMPLEMENTED:case Ri.DATA_LOSS:return!0;default:return ki(15467,{code:e})}}function rh(e){if(void 0===e)return Si("GRPC error has no .code"),Ri.UNKNOWN;switch(e){case eh.OK:return Ri.OK;case eh.CANCELLED:return Ri.CANCELLED;case eh.UNKNOWN:return Ri.UNKNOWN;case eh.DEADLINE_EXCEEDED:return Ri.DEADLINE_EXCEEDED;case eh.RESOURCE_EXHAUSTED:return Ri.RESOURCE_EXHAUSTED;case eh.INTERNAL:return Ri.INTERNAL;case eh.UNAVAILABLE:return Ri.UNAVAILABLE;case eh.UNAUTHENTICATED:return Ri.UNAUTHENTICATED;case eh.INVALID_ARGUMENT:return Ri.INVALID_ARGUMENT;case eh.NOT_FOUND:return Ri.NOT_FOUND;case eh.ALREADY_EXISTS:return Ri.ALREADY_EXISTS;case eh.PERMISSION_DENIED:return Ri.PERMISSION_DENIED;case eh.FAILED_PRECONDITION:return Ri.FAILED_PRECONDITION;case eh.ABORTED:return Ri.ABORTED;case eh.OUT_OF_RANGE:return Ri.OUT_OF_RANGE;case eh.UNIMPLEMENTED:return Ri.UNIMPLEMENTED;case eh.DATA_LOSS:return Ri.DATA_LOSS;default:return ki(39323,{code:e})}}(th=eh||(eh={}))[th.OK=0]="OK",th[th.CANCELLED=1]="CANCELLED",th[th.UNKNOWN=2]="UNKNOWN",th[th.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",th[th.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",th[th.NOT_FOUND=5]="NOT_FOUND",th[th.ALREADY_EXISTS=6]="ALREADY_EXISTS",th[th.PERMISSION_DENIED=7]="PERMISSION_DENIED",th[th.UNAUTHENTICATED=16]="UNAUTHENTICATED",th[th.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",th[th.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",th[th.ABORTED=10]="ABORTED",th[th.OUT_OF_RANGE=11]="OUT_OF_RANGE",th[th.UNIMPLEMENTED=12]="UNIMPLEMENTED",th[th.INTERNAL=13]="INTERNAL",th[th.UNAVAILABLE=14]="UNAVAILABLE",th[th.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ih=new oi([4294967295,4294967295],0);function sh(e){const t=zi().encode(e),n=new ai;return n.update(t),new Uint8Array(n.digest())}function oh(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new oi([n,r],0),new oi([i,s],0)]}class ah{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new ch(`Invalid padding: ${t}`);if(n<0)throw new ch(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new ch(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new ch(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=oi.fromNumber(this.fe)}pe(e,t,n){let r=e.add(t.multiply(oi.fromNumber(n)));return 1===r.compare(ih)&&(r=new oi([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.fe)return!1;const t=sh(e),[n,r]=oh(t);for(let i=0;i<this.hashCount;i++){const e=this.pe(n,r,i);if(!this.ye(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),s=new ah(i,r,t);return n.forEach(e=>s.insert(e)),s}insert(e){if(0===this.fe)return;const t=sh(e),[n,r]=oh(t);for(let i=0;i<this.hashCount;i++){const e=this.pe(n,r,i);this.we(e)}}we(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class ch extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,hh.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new uh(ps.min(),r,new ha(Ki),au(),mu())}}class hh{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new hh(n,t,mu(),mu(),mu())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh{constructor(e,t,n,r){this.Se=e,this.removedTargetIds=t,this.key=n,this.be=r}}class dh{constructor(e,t){this.targetId=e,this.De=t}}class fh{constructor(e,t,n=va.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class ph{constructor(){this.ve=0,this.Ce=yh(),this.Fe=va.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return 0!==this.ve}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=mu(),t=mu(),n=mu();return this.Ce.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:ki(38017,{changeType:i})}}),new hh(this.Fe,this.Me,e,t,n)}ke(){this.xe=!1,this.Ce=yh()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Ni(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class gh{constructor(e){this.We=e,this.Ge=new Map,this.ze=au(),this.je=mh(),this.Je=mh(),this.He=new ha(Ki)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,t=>{const n=this.tt(t);switch(e.state){case 0:this.nt(t)&&n.Be(e.resumeToken);break;case 1:n.Ue(),n.Oe||n.ke(),n.Be(e.resumeToken);break;case 2:n.Ue(),n.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(n.Ke(),n.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),n.Be(e.resumeToken));break;default:ki(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach((e,n)=>{this.nt(n)&&t(n)})}it(e){const t=e.targetId,n=e.De.count,r=this.st(t);if(r){const i=r.target;if(Uc(i))if(0===n){const e=new ns(i.path);this.Xe(t,e,hc.newNoDocument(e,ps.min()))}else Ni(1===n,20013,{expectedCount:n});else{const r=this.ot(t);if(r!==n){const n=this._t(e),i=n?this.ut(n,e,r):1;if(0!==i){this.rt(t);const e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,e)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let s,o;try{s=_a(n).toUint8Array()}catch(a){if(a instanceof ya)return Ci("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new ah(s,r,i)}catch(a){return Ci(a instanceof ch?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.fe?null:o}ut(e,t,n){return t.De.count===n-this.ht(e,t.targetId)?0:2}ht(e,t){const n=this.We.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const i=this.We.lt(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.Xe(t,n,null),r++)}),r}Pt(e){const t=new Map;this.Ge.forEach((n,r)=>{const i=this.st(r);if(i){if(n.current&&Uc(i.target)){const t=new ns(i.target.path);this.Tt(t).has(r)||this.It(r,t)||this.Xe(r,t,hc.newNoDocument(t,e))}n.Ne&&(t.set(r,n.Le()),n.ke())}});let n=mu();this.Je.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.st(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.ze.forEach((t,n)=>n.setReadTime(e));const r=new uh(e,t,this.He,this.ze,n);return this.ze=au(),this.je=mh(),this.Je=mh(),this.He=new ha(Ki),r}Ze(e,t){if(!this.nt(e))return;const n=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,n),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,n){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),n&&(this.ze=this.ze.insert(t,n))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new ph,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new fa(Ki),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new fa(Ki),this.je=this.je.insert(e,t)),t}nt(e){const t=null!==this.st(e);return t||Ei("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new ph),this.We.getRemoteKeysForTarget(e).forEach(t=>{this.Xe(e,t,null)})}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function mh(){return new ha(ns.comparator)}function yh(){return new ha(ns.comparator)}const vh=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),wh=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),bh=(()=>({and:"AND",or:"OR"}))();class Ih{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function _h(e,t){return e.useProto3Json||Ks(t)?t:{value:t}}function Th(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Eh(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Sh(e,t){return Th(e,t.toTimestamp())}function Ch(e){return Ni(!!e,49232),ps.fromTimestamp(function(e){const t=ba(e);return new fs(t.seconds,t.nanos)}(e))}function Ah(e,t){return kh(e,t).canonicalString()}function kh(e,t){const n=(r=e,new Zi(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function Dh(e){const t=Zi.fromString(e);return Ni(Xh(t),10190,{key:t.toString()}),t}function Nh(e,t){return Ah(e.databaseId,t.path)}function xh(e,t){const n=Dh(t);if(n.get(1)!==e.databaseId.projectId)throw new Oi(Ri.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Oi(Ri.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new ns(Lh(n))}function Rh(e,t){return Ah(e.databaseId,t)}function Oh(e){const t=Dh(e);return 4===t.length?Zi.emptyPath():Lh(t)}function Ph(e){return new Zi(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Lh(e){return Ni(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function Mh(e,t,n){return{name:Nh(e,t),fields:n.value.mapValue.fields}}function Vh(e,t){let n;if(t instanceof zu)n={update:Mh(e,t.key,t.value)};else if(t instanceof Wu)n={delete:Nh(e,t.key)};else if(t instanceof $u)n={update:Mh(e,t.key,t.data),updateMask:Qh(t.fieldMask)};else{if(!(t instanceof Qu))return ki(16599,{Rt:t.type});n={verify:Nh(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof Su)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof Cu)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof ku)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Nu)return{fieldPath:t.field.canonicalString(),increment:n.Ee};throw ki(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(i=t.precondition).updateTime?{updateTime:Sh(r,i.updateTime)}:void 0!==i.exists?{exists:i.exists}:ki(27497))),n;var r,i}function Fh(e,t){const n=t.currentDocument?void 0!==(i=t.currentDocument).updateTime?Lu.updateTime(Ch(i.updateTime)):void 0!==i.exists?Lu.exists(i.exists):Lu.none():Lu.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)Ni("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new Su;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new Cu(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new ku(e)}else"increment"in t?n=new Nu(e,t.increment):ki(16584,{proto:t});const r=ts.fromServerFormat(t.fieldPath);return new Ou(r,n)}(e,t)):[];var i;if(t.update){t.update.name;const i=xh(e,t.update.name),s=new cc({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new ma(t.map(e=>ts.fromServerFormat(e)))}(t.updateMask);return new $u(i,s,e,n,r)}return new zu(i,s,n,r)}if(t.delete){const r=xh(e,t.delete);return new Wu(r,n)}if(t.verify){const r=xh(e,t.verify);return new Qu(r,n)}return ki(1463,{proto:t})}function Uh(e,t){return{documents:[Rh(e,t.path)]}}function jh(e,t){const n={structuredQuery:{}},r=t.path;let i;null!==t.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Rh(e,i);const s=function(e){if(0!==e.length)return Wh(vc.create(e,"and"))}(t.filters);s&&(n.structuredQuery.where=s);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:Gh((t=e).field),direction:zh(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=_h(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{Vt:n,parent:i};var c}function Bh(e){let t=Oh(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Ni(1===r,65062);const e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let s=[];n.where&&(s=function(e){const t=qh(e);return t instanceof vc&&Ic(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new pc(Hh((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,Ks(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new lc(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new lc(n,t)}(n.endAt)),$c(t,i,o,s,a,"F",c,u)}function qh(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=Hh(e.unaryFilter.field);return yc.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=Hh(e.unaryFilter.field);return yc.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Hh(e.unaryFilter.field);return yc.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=Hh(e.unaryFilter.field);return yc.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ki(61313);default:return ki(60726)}}(e):void 0!==e.fieldFilter?(t=e,yc.create(Hh(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ki(58110);default:return ki(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return vc.create(e.compositeFilter.filters.map(e=>qh(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return ki(1026)}}(e.compositeFilter.op))}(e):ki(30097,{filter:e});var t}function zh(e){return vh[e]}function $h(e){return wh[e]}function Kh(e){return bh[e]}function Gh(e){return{fieldPath:e.canonicalString()}}function Hh(e){return ts.fromServerFormat(e.fieldPath)}function Wh(e){return e instanceof yc?function(e){if("=="===e.op){if(Ya(e.value))return{unaryFilter:{field:Gh(e.field),op:"IS_NAN"}};if(Ja(e.value))return{unaryFilter:{field:Gh(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(Ya(e.value))return{unaryFilter:{field:Gh(e.field),op:"IS_NOT_NAN"}};if(Ja(e.value))return{unaryFilter:{field:Gh(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Gh(e.field),op:$h(e.op),value:e.value}}}(e):e instanceof vc?function(e){const t=e.getFilters().map(e=>Wh(e));return 1===t.length?t[0]:{compositeFilter:{op:Kh(e.op),filters:t}}}(e):ki(54877,{filter:e})}function Qh(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Xh(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e,t,n,r,i=ps.min(),s=ps.min(),o=va.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new Jh(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Jh(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Jh(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Jh(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yh{constructor(e){this.gt=e}}function Zh(e,t){let n;if(t.document)n=function(e,t,n){const r=xh(e,t.name),i=Ch(t.updateTime),s=t.createTime?Ch(t.createTime):ps.min(),o=new cc({mapValue:{fields:t.fields}}),a=hc.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}(e.gt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=ns.fromSegments(t.noDocument.path),r=rl(t.noDocument.readTime);n=hc.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return ki(56709);{const e=ns.fromSegments(t.unknownDocument.path),r=rl(t.unknownDocument.version);n=hc.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new fs(e[0],e[1]);return ps.fromTimestamp(t)}(t.readTime)),n}function el(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:tl(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:Nh(i=e.gt,(s=t).key),fields:s.data.value.mapValue.fields,updateTime:Th(i,s.version.toTimestamp()),createTime:Th(i,s.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:nl(t.version)};else{if(!t.isUnknownDocument())return ki(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:nl(t.version)}}var i,s;return r}function tl(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function nl(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function rl(e){const t=new fs(e.seconds,e.nanoseconds);return ps.fromTimestamp(t)}function il(e,t){const n=(t.baseMutations||[]).map(t=>Fh(e.gt,t));for(let s=0;s<t.mutations.length-1;++s){const e=t.mutations[s];if(s+1<t.mutations.length&&void 0!==t.mutations[s+1].transform){const n=t.mutations[s+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(s+1,1),++s}}const r=t.mutations.map(t=>Fh(e.gt,t)),i=fs.fromMillis(t.localWriteTimeMs);return new Xu(t.batchId,i,n,r)}function sl(e){const t=rl(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?rl(e.lastLimboFreeSnapshotVersion):ps.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Ni(1===t,1966,{count:t}),Qc(Kc(Oh(e.documents[0])))}(e.query):function(e){return Qc(Bh(e))}(e.query),new Jh(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,va.fromBase64String(e.resumeToken))}function ol(e,t){const n=nl(t.snapshotVersion),r=nl(t.lastLimboFreeSnapshotVersion);let i;i=Uc(t.target)?Uh(e.gt,t.target):jh(e.gt,t.target).Vt;const s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Vc(t.target),readTime:n,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function al(e){const t=Bh({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?Jc(t,t.limit,"L"):t}function cl(e,t){return new Yu(t.largestBatchId,Fh(e.gt,t.overlayMutation))}function ul(e,t){const n=t.path.lastSegment();return[e,Qs(t.path.popLast()),n]}function hl(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:nl(r.readTime),documentKey:Qs(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{getBundleMetadata(e,t){return dl(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:rl(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return dl(e).put({bundleId:(n=t).id,createTime:nl(Ch(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return fl(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:al(t.bundledQuery),readTime:rl(t.readTime)};var t})}saveNamedQuery(e,t){return fl(e).put({name:(n=t).name,readTime:nl(Ch(n.readTime)),bundledQuery:n.bundledQuery});var n}}function dl(e){return oa(e,Ro)}function fl(e){return oa(e,Oo)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e,t){this.serializer=e,this.userId=t}static yt(e,t){const n=t.uid||"";return new pl(e,n)}getOverlay(e,t){return gl(e).get(ul(this.userId,t)).next(e=>e?cl(this.serializer,e):null)}getOverlays(e,t){const n=lu();return ks.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,i)=>{const s=new Yu(t,i);r.push(this.wt(e,s))}),ks.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(Qs(e.getCollectionPath())));const i=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(gl(e).Y(Go,r))}),ks.waitFor(i)}getOverlaysForCollection(e,t,n){const r=lu(),i=Qs(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return gl(e).j(Go,s).next(e=>{for(const t of e){const e=cl(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const i=lu();let s;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return gl(e).X({index:Wo,range:o},(e,t,n)=>{const o=cl(this.serializer,t);i.size()<r||o.largestBatchId===s?(i.set(o.getKey(),o),s=o.largestBatchId):n.done()}).next(()=>i)}wt(e,t){return gl(e).put(function(e,t,n){const[r,i,s]=ul(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:Vh(e.gt,n.mutation)}}(this.serializer,this.userId,t))}}function gl(e){return oa(e,$o)}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{St(e){return oa(e,Xo)}getSessionToken(e){return this.St(e).get("sessionToken").next(e=>{const t=null==e?void 0:e.value;return t?va.fromUint8Array(t):va.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl{constructor(){}bt(e,t){this.Dt(e,t),t.vt()}Dt(e,t){if("nullValue"in e)this.Ct(t,5);else if("booleanValue"in e)this.Ct(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.Ct(t,15),t.Ft(Ia(e.integerValue));else if("doubleValue"in e){const n=Ia(e.doubleValue);isNaN(n)?this.Ct(t,13):(this.Ct(t,15),Gs(n)?t.Ft(0):t.Ft(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ct(t,20),"string"==typeof n&&(n=ba(n)),t.Mt(`${n.seconds||""}`),t.Ft(n.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.Ct(t,30),t.Nt(_a(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ct(t,45),t.Ft(n.latitude||0),t.Ft(n.longitude||0)}else"mapValue"in e?nc(e)?this.Ct(t,Number.MAX_SAFE_INTEGER):ec(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):ki(19022,{Qt:e})}xt(e,t){this.Ct(t,25),this.$t(e,t)}$t(e,t){t.Mt(e)}kt(e,t){const n=e.fields||{};this.Ct(t,55);for(const r of Object.keys(n))this.xt(r,t),this.Dt(n[r],t)}Lt(e,t){var n,r;const i=e.fields||{};this.Ct(t,53);const s=Va,o=(null===(r=null===(n=i[s].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.length)||0;this.Ct(t,15),t.Ft(Ia(o)),this.xt(s,t),this.Dt(i[s],t)}qt(e,t){const n=e.values||[];this.Ct(t,50);for(const r of n)this.Dt(r,t)}Bt(e,t){this.Ct(t,37),ns.fromName(e).path.forEach(e=>{this.Ct(t,60),this.$t(e,t)})}Ct(e,t){e.Ft(t)}Ot(e){e.Ft(2)}}yl.Ut=new yl;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const vl=255;function wl(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function bl(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=wl(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class Il{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Kt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Wt(n.value),n=t.next();this.Gt()}zt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.jt(n.value),n=t.next();this.Jt()}Ht(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Wt(e);else if(e<2048)this.Wt(960|e>>>6),this.Wt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Wt(480|e>>>12),this.Wt(128|63&e>>>6),this.Wt(128|63&e);else{const e=t.codePointAt(0);this.Wt(240|e>>>18),this.Wt(128|63&e>>>12),this.Wt(128|63&e>>>6),this.Wt(128|63&e)}}this.Gt()}Yt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.jt(e);else if(e<2048)this.jt(960|e>>>6),this.jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.jt(480|e>>>12),this.jt(128|63&e>>>6),this.jt(128|63&e);else{const e=t.codePointAt(0);this.jt(240|e>>>18),this.jt(128|63&e>>>12),this.jt(128|63&e>>>6),this.jt(128|63&e)}}this.Jt()}Zt(e){const t=this.Xt(e),n=bl(t);this.en(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}tn(e){const t=this.Xt(e),n=bl(t);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}nn(){this.rn(vl),this.rn(255)}sn(){this._n(vl),this._n(255)}reset(){this.position=0}seed(e){this.en(e.length),this.buffer.set(e,this.position),this.position+=e.length}an(){return this.buffer.slice(0,this.position)}Xt(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Wt(e){const t=255&e;0===t?(this.rn(0),this.rn(255)):t===vl?(this.rn(vl),this.rn(0)):this.rn(t)}jt(e){const t=255&e;0===t?(this._n(0),this._n(255)):t===vl?(this._n(vl),this._n(0)):this._n(e)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(e){this.en(1),this.buffer[this.position++]=e}_n(e){this.en(1),this.buffer[this.position++]=~e}en(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class _l{constructor(e){this.un=e}Nt(e){this.un.Kt(e)}Mt(e){this.un.Ht(e)}Ft(e){this.un.Zt(e)}vt(){this.un.nn()}}class Tl{constructor(e){this.un=e}Nt(e){this.un.zt(e)}Mt(e){this.un.Yt(e)}Ft(e){this.un.tn(e)}vt(){this.un.sn()}}class El{constructor(){this.un=new Il,this.cn=new _l(this.un),this.ln=new Tl(this.un)}seed(e){this.un.seed(e)}hn(e){return 0===e?this.cn:this.ln}an(){return this.un.an()}reset(){this.un.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(e,t,n,r){this.Pn=e,this.Tn=t,this.In=n,this.dn=r}En(){const e=this.dn.length,t=0===e||255===this.dn[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new Sl(this.Pn,this.Tn,this.In,n)}An(e,t,n){return{indexId:this.Pn,uid:e,arrayValue:kl(this.In),directionalValue:kl(this.dn),orderedDocumentKey:kl(t),documentKey:n.path.toArray()}}Rn(e,t,n){const r=this.An(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function Cl(e,t){let n=e.Pn-t.Pn;return 0!==n?n:(n=Al(e.In,t.In),0!==n?n:(n=Al(e.dn,t.dn),0!==n?n:ns.comparator(e.Tn,t.Tn)))}function Al(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function kl(e){return _()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function Dl(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class Nl{constructor(e){this.Vn=new fa((e,t)=>ts.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.mn=e.orderBy,this.fn=[];for(const t of e.filters){const e=t;e.isInequality()?this.Vn=this.Vn.add(e):this.fn.push(e)}}get gn(){return this.Vn.size>1}pn(e){if(Ni(e.collectionGroup===this.collectionId,49279),this.gn)return!1;const t=ys(e);if(void 0!==t&&!this.yn(t))return!1;const n=vs(e);let r=new Set,i=0,s=0;for(;i<n.length&&this.yn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const e=this.Vn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[i];if(!this.wn(e,t)||!this.Sn(this.mn[s++],t))return!1}++i}for(;i<n.length;++i){const e=n[i];if(s>=this.mn.length||!this.Sn(this.mn[s++],e))return!1}return!0}bn(){if(this.gn)return null;let e=new fa(ts.comparator);const t=[];for(const n of this.fn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new ws(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new ws(n.field,0))}for(const n of this.mn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new ws(n.field,"asc"===n.dir?0:1)));return new ms(ms.UNKNOWN_ID,this.collectionId,t,bs.empty())}yn(e){for(const t of this.fn)if(this.wn(t,e))return!0;return!1}wn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}Sn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xl(e){var t,n;if(Ni(e instanceof yc||e instanceof vc,20012),e instanceof yc){if(e instanceof Rc){const r=(null===(n=null===(t=e.value.arrayValue)||void 0===t?void 0:t.values)||void 0===n?void 0:n.map(t=>yc.create(e.field,"==",t)))||[];return vc.create(r,"or")}return e}const r=e.filters.map(e=>xl(e));return vc.create(r,e.op)}function Rl(e){if(0===e.getFilters().length)return[];const t=Ml(xl(e));return Ni(Ll(t),7391),Ol(t)||Pl(t)?[t]:t.getFilters()}function Ol(e){return e instanceof yc}function Pl(e){return e instanceof vc&&Ic(e)}function Ll(e){return Ol(e)||Pl(e)||function(e){if(e instanceof vc&&bc(e)){for(const t of e.getFilters())if(!Ol(t)&&!Pl(t))return!1;return!0}return!1}(e)}function Ml(e){if(Ni(e instanceof yc||e instanceof vc,34018),e instanceof yc)return e;if(1===e.filters.length)return Ml(e.filters[0]);const t=e.filters.map(e=>Ml(e));let n=vc.create(t,e.op);return n=Ul(n),Ll(n)?n:(Ni(n instanceof vc,64498),Ni(wc(n),40251),Ni(n.filters.length>1,57927),n.filters.reduce((e,t)=>Vl(e,t)))}function Vl(e,t){let n;return Ni(e instanceof yc||e instanceof vc,38388),Ni(t instanceof yc||t instanceof vc,25473),n=e instanceof yc?t instanceof yc?(r=e,i=t,vc.create([r,i],"and")):Fl(e,t):t instanceof yc?Fl(t,e):function(e,t){if(Ni(e.filters.length>0&&t.filters.length>0,48005),wc(e)&&wc(t))return Sc(e,t.getFilters());const n=bc(e)?e:t,r=bc(e)?t:e,i=n.filters.map(e=>Vl(e,r));return vc.create(i,"or")}(e,t),Ul(n);var r,i}function Fl(e,t){if(wc(t))return Sc(t,e.getFilters());{const n=t.filters.map(t=>Vl(e,t));return vc.create(n,"or")}}function Ul(e){if(Ni(e instanceof yc||e instanceof vc,11850),e instanceof yc)return e;const t=e.getFilters();if(1===t.length)return Ul(t[0]);if(_c(e))return e;const n=t.map(e=>Ul(e)),r=[];return n.forEach(t=>{t instanceof yc?r.push(t):t instanceof vc&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:vc.create(r,e.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class jl{constructor(){this.Dn=new Bl}addToCollectionParentIndex(e,t){return this.Dn.add(t),ks.resolve()}getCollectionParents(e,t){return ks.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return ks.resolve()}deleteFieldIndex(e,t){return ks.resolve()}deleteAllFieldIndexes(e){return ks.resolve()}createTargetIndexes(e,t){return ks.resolve()}getDocumentsMatchingTarget(e,t){return ks.resolve(null)}getIndexType(e,t){return ks.resolve(0)}getFieldIndexes(e,t){return ks.resolve([])}getNextCollectionGroupToUpdate(e){return ks.resolve(null)}getMinOffset(e,t){return ks.resolve(Ts.min())}getMinOffsetFromCollectionGroup(e,t){return ks.resolve(Ts.min())}updateCollectionGroup(e,t,n){return ks.resolve()}updateIndexEntries(e,t){return ks.resolve()}}class Bl{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new fa(Zi.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new fa(Zi.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ql="IndexedDbIndexManager",zl=new Uint8Array(0);class $l{constructor(e,t){this.databaseId=t,this.vn=new Bl,this.Cn=new su(e=>Vc(e),(e,t)=>Fc(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});const i={collectionId:n,parent:Qs(r)};return Kl(e).put(i)}return ks.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[Xi(t),""],!1,!0);return Kl(e).j(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(Ys(r.parent))}return n})}addFieldIndex(e,t){const n=Hl(e),r={indexId:(i=t).indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var i;delete r.indexId;const s=n.add(r);if(t.indexState){const n=Wl(e);return s.next(e=>{n.put(hl(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=Hl(e),r=Wl(e),i=Gl(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Hl(e),n=Gl(e),r=Wl(e);return t.Y().next(()=>n.Y()).next(()=>r.Y())}createTargetIndexes(e,t){return ks.forEach(this.Fn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new Nl(t).bn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=Gl(e);let r=!0;const i=new Map;return ks.forEach(this.Fn(t),t=>this.Mn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=mu();const r=[];return ks.forEach(i,(i,s)=>{var o;Ei(ql,`Using index ${o=i,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${Vc(t)}`);const a=function(e,t){const n=ys(t);if(void 0===n)return null;for(const r of jc(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(s,i),c=function(e,t){const n=new Map;for(const r of vs(t))for(const t of jc(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),u=function(e,t){const n=[];let r=!0;for(const i of vs(t)){const t=0===i.kind?Bc(e,i.fieldPath,e.startAt):qc(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new lc(n,r)}(s,i),h=function(e,t){const n=[];let r=!0;for(const i of vs(t)){const t=0===i.kind?qc(e,i.fieldPath,e.endAt):Bc(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new lc(n,r)}(s,i),l=this.xn(i,s,u),d=this.xn(i,s,h),f=this.On(i,s,c),p=this.Nn(i.indexId,a,l,u.inclusive,d,h.inclusive,f);return ks.forEach(p,i=>n.H(i,t.limit).next(t=>{t.forEach(t=>{const n=ns.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return ks.resolve(null)})}Fn(e){let t=this.Cn.get(e);return t||(t=0===e.filters.length?[e]:Rl(vc.create(e.filters,"and")).map(t=>Mc(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t),t)}Nn(e,t,n,r,i,s,o){const a=(null!=t?t.length:1)*Math.max(n.length,i.length),c=a/(null!=t?t.length:1),u=[];for(let h=0;h<a;++h){const a=t?this.Bn(t[h/c]):zl,l=this.Ln(e,a,n[h%c],r),d=this.kn(e,a,i[h%c],s),f=o.map(t=>this.Ln(e,a,t,!0));u.push(...this.createRange(l,d,f))}return u}Ln(e,t,n,r){const i=new Sl(e,ns.empty(),t,n);return r?i:i.En()}kn(e,t,n,r){const i=new Sl(e,ns.empty(),t,n);return r?i.En():i}Mn(e,t){const n=new Nl(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.pn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.Fn(t);return ks.forEach(r,t=>this.Mn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new fa(ts.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}qn(e,t){const n=new El;for(const r of vs(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const i=n.hn(r.kind);yl.Ut.bt(e,i)}return n.an()}Bn(e){const t=new El;return yl.Ut.bt(e,t.hn(0)),t.an()}Qn(e,t){const n=new El;return yl.Ut.bt(Wa(this.databaseId,t),n.hn(function(e){const t=vs(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.an()}On(e,t,n){if(null===n)return[];let r=[];r.push(new El);let i=0;for(const s of vs(e)){const e=n[i++];for(const n of r)if(this.$n(t,s.fieldPath)&&Xa(e))r=this.Un(r,s,e);else{const t=n.hn(s.kind);yl.Ut.bt(e,t)}}return this.Kn(r)}xn(e,t,n){return this.On(e,t,n.position)}Kn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].an();return t}Un(e,t,n){const r=[...e],i=[];for(const s of n.arrayValue.values||[])for(const e of r){const n=new El;n.seed(e.an()),yl.Ut.bt(s,n.hn(t.kind)),i.push(n)}return i}$n(e,t){return!!e.filters.find(e=>e instanceof yc&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=Hl(e),r=Wl(e);return(t?n.j(Lo,IDBKeyRange.bound(t,t)):n.j()).next(e=>{const t=[];return ks.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new bs(t.sequenceNumber,new Ts(rl(t.readTime),new ns(Ys(t.documentKey)),t.largestBatchId)):bs.empty(),r=e.fields.map(([e,t])=>new ws(ts.fromServerFormat(e),t));return new ms(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:Ki(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=Hl(e),i=Wl(e);return this.Wn(e).next(e=>r.j(Lo,IDBKeyRange.bound(t,t)).next(t=>ks.forEach(t,t=>i.put(hl(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return ks.forEach(t,(t,r)=>{const i=n.get(t.collectionGroup);return(i?ks.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),ks.forEach(i,n=>this.Gn(e,t,n).next(t=>{const i=this.zn(r,n);return t.isEqual(i)?ks.resolve():this.jn(e,r,n,t,i)}))))})}Jn(e,t,n,r){return Gl(e).put(r.An(this.uid,this.Qn(n,t.key),t.key))}Hn(e,t,n,r){return Gl(e).delete(r.Rn(this.uid,this.Qn(n,t.key),t.key))}Gn(e,t,n){const r=Gl(e);let i=new fa(Cl);return r.X({index:qo,range:IDBKeyRange.only([n.indexId,this.uid,kl(this.Qn(n,t))])},(e,r)=>{i=i.add(new Sl(n.indexId,t,Dl(r.arrayValue),Dl(r.directionalValue)))}).next(()=>i)}zn(e,t){let n=new fa(Cl);const r=this.qn(t,e);if(null==r)return n;const i=ys(t);if(null!=i){const s=e.data.field(i.fieldPath);if(Xa(s))for(const i of s.arrayValue.values||[])n=n.add(new Sl(t.indexId,e.key,this.Bn(i),r))}else n=n.add(new Sl(t.indexId,e.key,zl,r));return n}jn(e,t,n,r,i){Ei(ql,"Updating index entries for document '%s'",t.key);const s=[];return function(e,t,n,r,i){const s=e.getIterator(),o=t.getIterator();let a=ga(s),c=ga(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=ga(o)):t?(i(a),a=ga(s)):(a=ga(s),c=ga(o))}}(r,i,Cl,r=>{s.push(this.Jn(e,t,n,r))},r=>{s.push(this.Hn(e,t,n,r))}),ks.waitFor(s)}Wn(e){let t=1;return Wl(e).X({index:Fo,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>Cl(e,t)).filter((e,t,n)=>!t||0!==Cl(e,n[t-1]));const r=[];r.push(e);for(const s of n){const n=Cl(s,e),i=Cl(s,t);if(0===n)r[0]=e.En();else if(n>0&&i<0)r.push(s),r.push(s.En());else if(i>0)break}r.push(t);const i=[];for(let s=0;s<r.length;s+=2){if(this.Yn(r[s],r[s+1]))return[];const e=r[s].Rn(this.uid,zl,ns.empty()),t=r[s+1].Rn(this.uid,zl,ns.empty());i.push(IDBKeyRange.bound(e,t))}return i}Yn(e,t){return Cl(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Ql)}getMinOffset(e,t){return ks.mapArray(this.Fn(t),t=>this.Mn(e,t).next(e=>e||ki(44426))).next(Ql)}}function Kl(e){return oa(e,Do)}function Gl(e){return oa(e,jo)}function Hl(e){return oa(e,Po)}function Wl(e){return oa(e,Mo)}function Ql(e){Ni(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const i=e[r].indexState.offset;Es(i,t)<0&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new Ts(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Jl=41943040;class Yl{static withCacheSize(e){return new Yl(e,Yl.DEFAULT_COLLECTION_PERCENTILE,Yl.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zl(e,t,n){const r=e.store(ro),i=e.store(ho),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.X({range:o},(e,t,n)=>(a++,n.delete()));s.push(c.next(()=>{Ni(1===a,47070,{batchId:n.batchId})}));const u=[];for(const h of n.mutations){const e=co(t,h.key.path,n.batchId);s.push(i.delete(e)),u.push(h.key)}return ks.waitFor(s).next(()=>u)}function ed(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw ki(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Yl.DEFAULT_COLLECTION_PERCENTILE=10,Yl.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Yl.DEFAULT=new Yl(Jl,Yl.DEFAULT_COLLECTION_PERCENTILE,Yl.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Yl.DISABLED=new Yl(-1,0,0);class td{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Zn={}}static yt(e,t,n,r){Ni(""!==e.uid,64387);const i=e.isAuthenticated()?e.uid:"";return new td(i,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return rd(e).X({index:so,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const i=id(e),s=rd(e);return s.add({}).next(o=>{Ni("number"==typeof o,49019);const a=new Xu(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>Vh(e.gt,t)),i=n.mutations.map(t=>Vh(e.gt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,a),u=[];let h=new fa((e,t)=>Ki(e.canonicalString(),t.canonicalString()));for(const e of r){const t=co(this.userId,e.key.path,o);h=h.add(e.key.path.popLast()),u.push(s.put(c)),u.push(i.put(t,uo))}return h.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Zn[o]=a.keys()}),ks.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return rd(e).get(t).next(e=>e?(Ni(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),il(this.serializer,e)):null)}Xn(e,t){return this.Zn[t]?ks.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Zn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return rd(e).X({index:so,range:r},(e,t,r)=>{t.userId===this.userId&&(Ni(t.batchId>=n,47524,{er:n}),i=il(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=$s;return rd(e).X({index:so,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,$s],[this.userId,Number.POSITIVE_INFINITY]);return rd(e).j(so,t).next(e=>e.map(e=>il(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ao(this.userId,t.path),r=IDBKeyRange.lowerBound(n),i=[];return id(e).X({range:r},(n,r,s)=>{const[o,a,c]=n,u=Ys(a);if(o===this.userId&&t.path.isEqual(u))return rd(e).get(c).next(e=>{if(!e)throw ki(61480,{tr:n,batchId:c});Ni(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),i.push(il(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new fa(Ki);const r=[];return t.forEach(t=>{const i=ao(this.userId,t.path),s=IDBKeyRange.lowerBound(i),o=id(e).X({range:s},(e,r,i)=>{const[s,o,a]=e,c=Ys(o);s===this.userId&&t.path.isEqual(c)?n=n.add(a):i.done()});r.push(o)}),ks.waitFor(r).next(()=>this.nr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,i=ao(this.userId,n),s=IDBKeyRange.lowerBound(i);let o=new fa(Ki);return id(e).X({range:s},(e,t,i)=>{const[s,a,c]=e,u=Ys(a);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):i.done()}).next(()=>this.nr(e,o))}nr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(rd(e).get(t).next(e=>{if(null===e)throw ki(35274,{batchId:t});Ni(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(il(this.serializer,e))}))}),ks.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return Zl(e.ce,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.rr(t.batchId)}),ks.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}rr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return ks.resolve();const n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return id(e).X({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=Ys(e[1]);r.push(t)}else n.done()}).next(()=>{Ni(0===r.length,56720,{ir:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return nd(e,this.userId,t)}sr(e){return sd(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:$s,lastStreamToken:""})}}function nd(e,t,n){const r=ao(t,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return id(e).X({range:s,Z:!0},(e,n,r)=>{const[s,a,c]=e;s===t&&a===i&&(o=!0),r.done()}).next(()=>o)}function rd(e){return oa(e,ro)}function id(e){return oa(e,ho)}function sd(e){return oa(e,no)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new od(0)}static ur(){return new od(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.cr(e).next(t=>{const n=new od(t.highestTargetId);return t.highestTargetId=n.next(),this.lr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.cr(e).next(e=>ps.fromTimestamp(new fs(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.cr(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.cr(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.lr(e,r)))}addTargetData(e,t){return this.hr(e,t).next(()=>this.cr(e).next(n=>(n.targetCount+=1,this.Pr(t,n),this.lr(e,n))))}updateTargetData(e,t){return this.hr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>cd(e).delete(t.targetId)).next(()=>this.cr(e)).next(t=>(Ni(t.targetCount>0,8065),t.targetCount-=1,this.lr(e,t)))}removeTargets(e,t,n){let r=0;const i=[];return cd(e).X((s,o)=>{const a=sl(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,i.push(this.removeTargetData(e,a)))}).next(()=>ks.waitFor(i)).next(()=>r)}forEachTarget(e,t){return cd(e).X((e,n)=>{const r=sl(n);t(r)})}cr(e){return ud(e).get(Ao).next(e=>(Ni(null!==e,2888),e))}lr(e,t){return ud(e).put(Ao,t)}hr(e,t){return cd(e).put(ol(this.serializer,t))}Pr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.cr(e).next(e=>e.targetCount)}getTargetData(e,t){const n=Vc(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return cd(e).X({range:r,index:Io},(e,n,r)=>{const s=sl(n);Fc(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){const r=[],i=hd(e);return t.forEach(t=>{const s=Qs(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),ks.waitFor(r)}removeMatchingKeys(e,t,n){const r=hd(e);return ks.forEach(t,t=>{const i=Qs(t.path);return ks.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=hd(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=hd(e);let i=mu();return r.X({range:n,Z:!0},(e,t,n)=>{const r=Ys(e[1]),s=new ns(r);i=i.add(s)}).next(()=>i)}containsKey(e,t){const n=Qs(t.path),r=IDBKeyRange.bound([n],[Xi(n)],!1,!0);let i=0;return hd(e).X({index:So,Z:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}Et(e,t){return cd(e).get(t).next(e=>e?sl(e):null)}}function cd(e){return oa(e,bo)}function ud(e){return oa(e,ko)}function hd(e){return oa(e,To)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ld="LruGarbageCollector",dd=1048576;function fd([e,t],[n,r]){const i=Ki(e,n);return 0===i?Ki(t,r):i}class pd{constructor(e){this.Tr=e,this.buffer=new fa(fd),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();fd(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class gd{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Ar=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return null!==this.Ar}Rr(e){Ei(ld,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Ls(e)?Ei(ld,"Ignoring IndexedDB error during garbage collection: ",e):await As(e)}await this.Rr(3e5)})}}class md{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return ks.resolve(zs.ue);const n=new pd(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.gr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(Ei("LruGarbageCollector","Garbage collection skipped; disabled"),ks.resolve(Xl)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(Ei("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Xl):this.pr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let n,r,i,s,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(Ei("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),Ti()<=V.DEBUG&&Ei("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${s-u}ms\n\tDetermined least recently used ${r} in `+(o-s)+`ms\n\tRemoved ${i} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),ks.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}function yd(e,t){return new md(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e,t){this.db=e,this.garbageCollector=yd(this,t)}mr(e){const t=this.yr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}yr(e){let t=0;return this.gr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}gr(e,t){return this.wr(e,(e,n)=>t(n))}addReference(e,t,n){return wd(e,n)}removeReference(e,t,n){return wd(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return wd(e,t)}Sr(e,t){return function(e,t){let n=!1;return sd(e).ee(r=>nd(e,r,t).next(e=>(e&&(n=!0),ks.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.wr(e,(s,o)=>{if(o<=t){const t=this.Sr(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,ps.min()),hd(e).delete([0,Qs(s.path)])))});r.push(t)}}).next(()=>ks.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return wd(e,t)}wr(e,t){const n=hd(e);let r,i=zs.ue;return n.X({index:So},([e,n],{path:s,sequenceNumber:o})=>{0===e?(i!==zs.ue&&t(new ns(Ys(r)),i),i=o,r=s):i=zs.ue}).next(()=>{i!==zs.ue&&t(new ns(Ys(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function wd(e,t){return hd(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:Qs(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd{constructor(){this.changes=new su(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,hc.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?ks.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Id{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Sd(e).put(n)}removeEntry(e,t,n){return Sd(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],tl(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.br(e,n)))}getEntry(e,t){let n=hc.newInvalidDocument(t);return Sd(e).X({index:po,range:IDBKeyRange.only(Cd(t))},(e,r)=>{n=this.Dr(t,r)}).next(()=>n)}vr(e,t){let n={size:0,document:hc.newInvalidDocument(t)};return Sd(e).X({index:po,range:IDBKeyRange.only(Cd(t))},(e,r)=>{n={document:this.Dr(t,r),size:ed(r)}}).next(()=>n)}getEntries(e,t){let n=au();return this.Cr(e,t,(e,t)=>{const r=this.Dr(e,t);n=n.insert(e,r)}).next(()=>n)}Fr(e,t){let n=au(),r=new ha(ns.comparator);return this.Cr(e,t,(e,t)=>{const i=this.Dr(e,t);n=n.insert(e,i),r=r.insert(e,ed(t))}).next(()=>({documents:n,Mr:r}))}Cr(e,t,n){if(t.isEmpty())return ks.resolve();let r=new fa(kd);t.forEach(e=>r=r.add(e));const i=IDBKeyRange.bound(Cd(r.first()),Cd(r.last())),s=r.getIterator();let o=s.getNext();return Sd(e).X({index:po,range:i},(e,t,r)=>{const i=ns.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&kd(o,i)<0;)n(o,null),o=s.getNext();o&&o.isEqual(i)&&(n(o,t),o=s.hasNext()?s.getNext():null),o?r.G(Cd(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){const s=t.path,o=[s.popLast().toArray(),s.lastSegment(),tl(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Sd(e).j(IDBKeyRange.bound(o,a,!0)).next(e=>{null==i||i.incrementDocumentReadCount(e.length);let n=au();for(const i of e){const e=this.Dr(ns.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(tu(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=au();const s=Ad(t,n),o=Ad(t,Ts.max());return Sd(e).X({index:mo,range:IDBKeyRange.bound(s,o,!0)},(e,t,n)=>{const s=this.Dr(ns.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);i=i.insert(s.key,s),i.size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new Td(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return Ed(e).get(wo).next(e=>(Ni(!!e,20021),e))}br(e,t){return Ed(e).put(wo,t)}Dr(e,t){if(t){const e=Zh(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(ps.min()))return e}return hc.newInvalidDocument(e)}}function _d(e){return new Id(e)}class Td extends bd{constructor(e,t){super(),this.Or=e,this.trackRemovals=t,this.Nr=new su(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new fa((e,t)=>Ki(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{const o=this.Nr.get(i);if(t.push(this.Or.removeEntry(e,i,o.readTime)),s.isValidDocument()){const a=el(this.Or.serializer,s);r=r.add(i.path.popLast());const c=ed(a);n+=c-o.size,t.push(this.Or.addEntry(e,i,a))}else if(n-=o.size,this.trackRemovals){const n=el(this.Or.serializer,s.convertToNoDocument(ps.min()));t.push(this.Or.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Or.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Or.updateMetadata(e,n)),ks.waitFor(t)}getFromCache(e,t){return this.Or.vr(e,t).next(e=>(this.Nr.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Or.Fr(e,t).next(({documents:e,Mr:t})=>(t.forEach((t,n)=>{this.Nr.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function Ed(e){return oa(e,vo)}function Sd(e){return oa(e,lo)}function Cd(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Ad(e,t){const n=t.documentKey.path.toArray();return[e,tl(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function kd(e,t){const n=e.path.toArray(),r=t.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=Ki(n[s],r[s]),i)return i;return i=Ki(n.length,r.length),i||(i=Ki(n[n.length-2],r[r.length-2]),i||Ki(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Dd{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&ju(n.mutation,e,ma.empty(),fs.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,mu()).next(()=>t))}getLocalViewOfDocuments(e,t,n=mu()){const r=lu();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=uu();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=lu();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,mu()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=au();const s=fu(),o=fu();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof $u)?i=i.insert(t.key,t):void 0!==o?(s.set(t.key,o.mutation.getFieldMask()),ju(o.mutation,t,o.mutation.getFieldMask(),fs.now())):s.set(t.key,ma.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>{var n;return o.set(e,new Dd(t,null!==(n=s.get(e))&&void 0!==n?n:null))}),o))}recalculateAndSaveOverlays(e,t){const n=fu();let r=new ha((e,t)=>e-t),i=mu();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const i of e)i.keys().forEach(e=>{const s=t.get(e);if(null===s)return;let o=n.get(e)||ma.empty();o=i.applyToLocalView(s,o),n.set(e,o);const a=(r.get(i.batchId)||mu()).add(e);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=du();c.forEach(e=>{if(!i.has(e)){const r=Fu(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,a,u))}return ks.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return i=t,ns.isDocumentKey(i.path)&&null===i.collectionGroup&&0===i.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):Hc(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r);var i}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):ks.resolve(lu());let o=gs,a=i;return s.next(t=>ks.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?ks.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,a,t,mu())).next(e=>({batchId:o,changes:hu(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ns(t)).next(e=>{let t=uu();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let s=uu();return this.indexManager.getCollectionParents(e,i).next(o=>ks.forEach(o,o=>{const a=(c=t,u=o.child(i),new zc(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,hc.newInvalidDocument(r)))});let n=uu();return e.forEach((e,r)=>{const s=i.get(e);void 0!==s&&ju(s.mutation,r,ma.empty(),fs.now()),tu(t,r)&&(n=n.insert(e,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return ks.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,{id:(n=t).id,version:n.version,createTime:Ch(n.createTime)}),ks.resolve();var n}getNamedQuery(e,t){return ks.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,{name:(n=t).name,query:al(n.bundledQuery),readTime:Ch(n.readTime)}),ks.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rd{constructor(){this.overlays=new ha(ns.comparator),this.kr=new Map}getOverlay(e,t){return ks.resolve(this.overlays.get(t))}getOverlays(e,t){const n=lu();return ks.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.wt(e,t,r)}),ks.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.kr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.kr.delete(n)),ks.resolve()}getOverlaysForCollection(e,t,n){const r=lu(),i=t.length+1,s=new ns(t.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const e=o.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return ks.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new ha((e,t)=>e-t);const s=this.overlays.getIterator();for(;s.hasNext();){const e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=lu(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=lu(),a=i.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return ks.resolve(o)}wt(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.kr.get(r.largestBatchId).delete(n.key);this.kr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new Yu(t,n));let i=this.kr.get(t);void 0===i&&(i=mu(),this.kr.set(t,i)),this.kr.set(t,i.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(){this.sessionToken=va.EMPTY_BYTE_STRING}getSessionToken(e){return ks.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,ks.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pd{constructor(){this.qr=new fa(Ld.Qr),this.$r=new fa(Ld.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const n=new Ld(e,t);this.qr=this.qr.add(n),this.$r=this.$r.add(n)}Kr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new Ld(e,t))}Gr(e,t){e.forEach(e=>this.removeReference(e,t))}zr(e){const t=new ns(new Zi([])),n=new Ld(t,e),r=new Ld(t,e+1),i=[];return this.$r.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new ns(new Zi([])),n=new Ld(t,e),r=new Ld(t,e+1);let i=mu();return this.$r.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){const t=new Ld(e,0),n=this.qr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class Ld{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return ns.comparator(e.key,t.key)||Ki(e.Hr,t.Hr)}static Ur(e,t){return Ki(e.Hr,t.Hr)||ns.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Md{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new fa(Ld.Qr)}checkEmpty(e){return ks.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const i=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new Xu(i,t,n,r);this.mutationQueue.push(s);for(const o of r)this.Yr=this.Yr.add(new Ld(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return ks.resolve(s)}lookupMutationBatch(e,t){return ks.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.Xr(n),i=r<0?0:r;return ks.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return ks.resolve(0===this.mutationQueue.length?$s:this.er-1)}getAllMutationBatches(e){return ks.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ld(t,0),r=new Ld(t,Number.POSITIVE_INFINITY),i=[];return this.Yr.forEachInRange([n,r],e=>{const t=this.Zr(e.Hr);i.push(t)}),ks.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new fa(Ki);return t.forEach(e=>{const t=new Ld(e,0),r=new Ld(e,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([t,r],e=>{n=n.add(e.Hr)})}),ks.resolve(this.ei(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;ns.isDocumentKey(i)||(i=i.child(""));const s=new Ld(new ns(i),0);let o=new fa(Ki);return this.Yr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Hr)),!0)},s),ks.resolve(this.ei(o))}ei(e){const t=[];return e.forEach(e=>{const n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){Ni(0===this.ti(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Yr;return ks.forEach(t.mutations,r=>{const i=new Ld(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Yr=n})}rr(e){}containsKey(e,t){const n=new Ld(t,0),r=this.Yr.firstAfterOrEqual(n);return ks.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,ks.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(e){this.ni=e,this.docs=new ha(ns.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ni(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return ks.resolve(n?n.document.mutableCopy():hc.newInvalidDocument(t))}getEntries(e,t){let n=au();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():hc.newInvalidDocument(e))}),ks.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=au();const s=t.path,o=new ns(s.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||Es(_s(o),n)<=0||(r.has(o.key)||tu(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return ks.resolve(i)}getAllFromCollectionGroup(e,t,n,r){ki(9500)}ri(e,t){return ks.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new Fd(this)}getSize(e){return ks.resolve(this.size)}}class Fd extends bd{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(n)}),ks.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(e){this.persistence=e,this.ii=new su(e=>Vc(e),Fc),this.lastRemoteSnapshotVersion=ps.min(),this.highestTargetId=0,this.si=0,this.oi=new Pd,this.targetCount=0,this._i=od.ar()}forEachTarget(e,t){return this.ii.forEach((e,n)=>t(n)),ks.resolve()}getLastRemoteSnapshotVersion(e){return ks.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return ks.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),ks.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.si&&(this.si=t),ks.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new od(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,ks.resolve()}updateTargetData(e,t){return this.hr(t),ks.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,ks.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.ii.forEach((s,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.ii.delete(s),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),ks.waitFor(i).next(()=>r)}getTargetCount(e){return ks.resolve(this.targetCount)}getTargetData(e,t){const n=this.ii.get(t)||null;return ks.resolve(n)}addMatchingKeys(e,t,n){return this.oi.Kr(t,n),ks.resolve()}removeMatchingKeys(e,t,n){this.oi.Gr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),ks.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),ks.resolve()}getMatchingKeysForTargetId(e,t){const n=this.oi.Jr(t);return ks.resolve(n)}containsKey(e,t){return ks.resolve(this.oi.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(e,t){this.ai={},this.overlays={},this.ui=new zs(0),this.ci=!1,this.ci=!0,this.li=new Od,this.referenceDelegate=e(this),this.hi=new Ud(this),this.indexManager=new jl,this.remoteDocumentCache=new Vd(e=>this.referenceDelegate.Pi(e)),this.serializer=new Yh(t),this.Ti=new xd(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Rd,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ai[e.toKey()];return n||(n=new Md(t,this.referenceDelegate),this.ai[e.toKey()]=n),n}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,n){Ei("MemoryPersistence","Starting transaction:",e);const r=new Bd(this.ui.next());return this.referenceDelegate.Ii(),n(r).next(e=>this.referenceDelegate.di(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return ks.or(Object.values(this.ai).map(n=>()=>n.containsKey(e,t)))}}class Bd extends Cs{constructor(e){super(),this.currentSequenceNumber=e}}class qd{constructor(e){this.persistence=e,this.Ai=new Pd,this.Ri=null}static Vi(e){return new qd(e)}get mi(){if(this.Ri)return this.Ri;throw ki(60996)}addReference(e,t,n){return this.Ai.addReference(n,t),this.mi.delete(n.toString()),ks.resolve()}removeReference(e,t,n){return this.Ai.removeReference(n,t),this.mi.add(n.toString()),ks.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),ks.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(e=>this.mi.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.mi.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return ks.forEach(this.mi,n=>{const r=ns.fromPath(n);return this.fi(e,r).next(e=>{e||t.removeEntry(r,ps.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(e=>{e?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return ks.or([()=>ks.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class zd{constructor(e,t){this.persistence=e,this.gi=new su(e=>Qs(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=yd(this,t)}static Vi(e,t){return new zd(e,t)}Ii(){}di(e){return ks.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}yr(e){let t=0;return this.gr(e,e=>{t++}).next(()=>t)}gr(e,t){return ks.forEach(this.gi,(n,r)=>this.Sr(e,n,r).next(e=>e?ks.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ri(e,r=>this.Sr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,ps.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),ks.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),ks.resolve()}removeReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),ks.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),ks.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ha(e.data.value)),t}Sr(e,t,n){return ks.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.gi.get(t);return ks.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $d{constructor(e){this.serializer=e}q(e,t,n,r){const i=new Ns("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(eo),function(e){e.createObjectStore(no,{keyPath:"userId"});e.createObjectStore(ro,{keyPath:io,autoIncrement:!0}).createIndex(so,oo,{unique:!0}),e.createObjectStore(ho)}(e),Kd(e),function(e){e.createObjectStore(Zs)}(e));let s=ks.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(To),e.deleteObjectStore(bo),e.deleteObjectStore(ko)}(e),Kd(e)),s=s.next(()=>function(e){const t=e.store(ko),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:ps.min().toTimestamp(),targetCount:0};return t.put(Ao,n)}(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>function(e,t){return t.store(ro).j().next(n=>{e.deleteObjectStore(ro),e.createObjectStore(ro,{keyPath:io,autoIncrement:!0}).createIndex(so,oo,{unique:!0});const r=t.store(ro),i=n.map(e=>r.put(e));return ks.waitFor(i)})}(e,i))),s=s.next(()=>{!function(e){e.createObjectStore(xo,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.pi(i))),n<6&&r>=6&&(s=s.next(()=>(function(e){e.createObjectStore(vo)}(e),this.yi(i)))),n<7&&r>=7&&(s=s.next(()=>this.wi(i))),n<8&&r>=8&&(s=s.next(()=>this.Si(e,i))),n<9&&r>=9&&(s=s.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(s=s.next(()=>this.bi(i))),n<11&&r>=11&&(s=s.next(()=>{!function(e){e.createObjectStore(Ro,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Oo,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){const t=e.createObjectStore($o,{keyPath:Ko});t.createIndex(Go,Ho,{unique:!1}),t.createIndex(Wo,Qo,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>function(e){const t=e.createObjectStore(lo,{keyPath:fo});t.createIndex(po,go),t.createIndex(mo,yo)}(e)).next(()=>this.Di(e,i)).next(()=>e.deleteObjectStore(Zs))),n<14&&r>=14&&(s=s.next(()=>this.Ci(e,i))),n<15&&r>=15&&(s=s.next(()=>function(e){e.createObjectStore(Po,{keyPath:"indexId",autoIncrement:!0}).createIndex(Lo,"collectionGroup",{unique:!1});e.createObjectStore(Mo,{keyPath:Vo}).createIndex(Fo,Uo,{unique:!1});e.createObjectStore(jo,{keyPath:Bo}).createIndex(qo,zo,{unique:!1})}(e))),n<16&&r>=16&&(s=s.next(()=>{t.objectStore(Mo).clear()}).next(()=>{t.objectStore(jo).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(Xo,{keyPath:"name"})}(e)})),n<18&&r>=18&&_()&&(s=s.next(()=>{t.objectStore(Mo).clear()}).next(()=>{t.objectStore(jo).clear()})),s}yi(e){let t=0;return e.store(Zs).X((e,n)=>{t+=ed(n)}).next(()=>{const n={byteSize:t};return e.store(vo).put(wo,n)})}pi(e){const t=e.store(no),n=e.store(ro);return t.j().next(t=>ks.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,$s],[t.userId,t.lastAcknowledgedBatchId]);return n.j(so,r).next(n=>ks.forEach(n,n=>{Ni(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=il(this.serializer,n);return Zl(e,t.userId,r).next(()=>{})}))}))}wi(e){const t=e.store(To),n=e.store(Zs);return e.store(ko).get(Ao).next(e=>{const r=[];return n.X((n,i)=>{const s=new Zi(n),o=[0,Qs(s)];r.push(t.get(o).next(n=>{return n?ks.resolve():(r=s,t.put({targetId:0,path:Qs(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>ks.waitFor(r))})}Si(e,t){e.createObjectStore(Do,{keyPath:No});const n=t.store(Do),r=new Bl,i=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:Qs(r)})}};return t.store(Zs).X({Z:!0},(e,t)=>{const n=new Zi(e);return i(n.popLast())}).next(()=>t.store(ho).X({Z:!0},([e,t,n],r)=>{const s=Ys(t);return i(s.popLast())}))}bi(e){const t=e.store(bo);return t.X((e,n)=>{const r=sl(n),i=ol(this.serializer,r);return t.put(i)})}Di(e,t){const n=t.store(Zs),r=[];return n.X((e,n)=>{const i=t.store(lo),s=(a=n,a.document?new ns(Zi.fromString(a.document.name).popFirst(5)):a.noDocument?ns.fromSegments(a.noDocument.path):a.unknownDocument?ns.fromSegments(a.unknownDocument.path):ki(36783)).path.toArray(),o={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(i.put(o))}).next(()=>ks.waitFor(r))}Ci(e,t){const n=t.store(ro),r=_d(this.serializer),i=new jd(qd.Vi,this.serializer.gt);return n.j().next(e=>{const n=new Map;return e.forEach(e=>{var t;let r=null!==(t=n.get(e.userId))&&void 0!==t?t:mu();il(this.serializer,e).keys().forEach(e=>r=r.add(e)),n.set(e.userId,r)}),ks.forEach(n,(e,n)=>{const s=new bi(n),o=pl.yt(this.serializer,s),a=i.getIndexManager(s),c=td.yt(s,this.serializer,a,i.referenceDelegate);return new Nd(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new sa(t,zs.ue),e).next()})})}}function Kd(e){e.createObjectStore(To,{keyPath:Eo}).createIndex(So,Co,{unique:!0}),e.createObjectStore(bo,{keyPath:"targetId"}).createIndex(Io,_o,{unique:!0}),e.createObjectStore(ko)}const Gd="IndexedDbPersistence",Hd=18e5,Wd=5e3,Qd="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class Xd{constructor(e,t,n,r,i,s,o,a,c,u,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Fi=i,this.window=s,this.document=o,this.Mi=c,this.xi=u,this.Oi=h,this.ui=null,this.ci=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ni=null,this.inForeground=!1,this.Bi=null,this.Li=null,this.ki=Number.NEGATIVE_INFINITY,this.qi=e=>Promise.resolve(),!Xd.C())throw new Oi(Ri.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new vd(this,r),this.Qi=t+"main",this.serializer=new Yh(a),this.$i=new xs(this.Qi,this.Oi,new $d(this.serializer)),this.li=new ml,this.hi=new ad(this.referenceDelegate,this.serializer),this.remoteDocumentCache=_d(this.serializer),this.Ti=new ll,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,!1===u&&Si(Gd,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ki().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Oi(Ri.FAILED_PRECONDITION,Qd);return this.Wi(),this.Gi(),this.zi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.hi.getHighestSequenceNumber(e))}).then(e=>{this.ui=new zs(e,this.Mi)}).then(()=>{this.ci=!0}).catch(e=>(this.$i&&this.$i.close(),Promise.reject(e)))}ji(e){return this.qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.$i.setDatabaseDeletedListener(e)}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Fi.enqueueAndForget(async()=>{this.started&&await this.Ki()}))}Ki(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Yd(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Ji(e).next(e=>{e||(this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)))})}).next(()=>this.Hi(e)).next(t=>this.isPrimary&&!t?this.Yi(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if(Ls(e))return Ei(Gd,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return Ei(Gd,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Fi.enqueueRetryable(()=>this.qi(e)),this.isPrimary=e})}Ji(e){return Jd(e).get(to).next(e=>ks.resolve(this.Xi(e)))}es(e){return Yd(e).delete(this.clientId)}async ts(){if(this.isPrimary&&!this.ns(this.ki,Hd)){this.ki=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=oa(e,xo);return t.j().next(e=>{const n=this.rs(e,Hd),r=e.filter(e=>-1===n.indexOf(e));return ks.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ui)for(const t of e)this.Ui.removeItem(this.ss(t.clientId))}}zi(){this.Li=this.Fi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ki().then(()=>this.ts()).then(()=>this.zi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.xi?ks.resolve(!0):Jd(e).get(to).next(t=>{if(null!==t&&this.ns(t.leaseTimestampMs,Wd)&&!this._s(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new Oi(Ri.FAILED_PRECONDITION,Qd);return!1}}return!(!this.networkEnabled||!this.inForeground)||Yd(e).j().next(e=>void 0===this.rs(e,Wd).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&Ei(Gd,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ci=!1,this.us(),this.Li&&(this.Li.cancel(),this.Li=null),this.cs(),this.ls(),await this.$i.runTransaction("shutdown","readwrite",[eo,xo],e=>{const t=new sa(e,zs.ue);return this.Yi(t).next(()=>this.es(t))}),this.$i.close(),this.hs()}rs(e,t){return e.filter(e=>this.ns(e.updateTimeMs,t)&&!this._s(e.clientId))}Ps(){return this.runTransaction("getActiveClients","readonly",e=>Yd(e).j().next(e=>this.rs(e,Hd).map(e=>e.clientId)))}get started(){return this.ci}getGlobalsCache(){return this.li}getMutationQueue(e,t){return td.yt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new $l(e,this.serializer.gt.databaseId)}getDocumentOverlayCache(e){return pl.yt(this.serializer,e)}getBundleCache(){return this.Ti}runTransaction(e,t,n){Ei(Gd,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",i=18===(s=this.Oi)?ia:17===s?ra:16===s?na:15===s?ta:14===s?ea:13===s?Zo:12===s?Yo:11===s?Jo:void ki(60245);var s;let o;return this.$i.runTransaction(e,r,i,r=>(o=new sa(r,this.ui?this.ui.next():zs.ue),"readwrite-primary"===t?this.Ji(o).next(e=>!!e||this.Hi(o)).next(t=>{if(!t)throw Si(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)),new Oi(Ri.FAILED_PRECONDITION,Ss);return n(o)}).next(e=>this.Zi(o).next(()=>e)):this.Ts(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Ts(e){return Jd(e).get(to).next(e=>{if(null!==e&&this.ns(e.leaseTimestampMs,Wd)&&!this._s(e.ownerId)&&!this.Xi(e)&&!(this.xi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Oi(Ri.FAILED_PRECONDITION,Qd)})}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Jd(e).put(to,t)}static C(){return xs.C()}Yi(e){const t=Jd(e);return t.get(to).next(e=>this.Xi(e)?(Ei(Gd,"Releasing primary lease."),t.delete(to)):ks.resolve())}ns(e,t){const n=Date.now();return!(e<n-t||e>n&&(Si(`Detected an update time that is in the future: ${e} > ${n}`),1))}Wi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Bi=()=>{this.Fi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Ki()))},this.document.addEventListener("visibilitychange",this.Bi),this.inForeground="visible"===this.document.visibilityState)}cs(){this.Bi&&(this.document.removeEventListener("visibilitychange",this.Bi),this.Bi=null)}Gi(){var e;"function"==typeof(null===(e=this.window)||void 0===e?void 0:e.addEventListener)&&(this.Ni=()=>{this.us();const e=/(?:Version|Mobile)\/1[456]/;I()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Fi.enterRestrictedMode(!0),this.Fi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ni))}ls(){this.Ni&&(this.window.removeEventListener("pagehide",this.Ni),this.Ni=null)}_s(e){var t;try{const n=null!==(null===(t=this.Ui)||void 0===t?void 0:t.getItem(this.ss(e)));return Ei(Gd,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Si(Gd,"Failed to get zombied client id.",n),!1}}us(){if(this.Ui)try{this.Ui.setItem(this.ss(this.clientId),String(Date.now()))}catch(e){Si("Failed to set zombie client id.",e)}}hs(){if(this.Ui)try{this.Ui.removeItem(this.ss(this.clientId))}catch(e){}}ss(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Jd(e){return oa(e,eo)}function Yd(e){return oa(e,xo)}function Zd(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class ef{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Is=n,this.ds=r}static Es(e,t){let n=mu(),r=mu();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new ef(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=I()?8:Rs(w())>0?6:4}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.ps(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ys(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;const n=new tf;return this.ws(e,t,n).next(r=>{if(i.result=r,this.Rs)return this.Ss(e,t,n,r.size)})}).next(()=>i.result)}Ss(e,t,n,r){return n.documentReadCount<this.Vs?(Ti()<=V.DEBUG&&Ei("QueryEngine","SDK will not create cache indexes for query:",eu(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),ks.resolve()):(Ti()<=V.DEBUG&&Ei("QueryEngine","Query:",eu(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.fs*r?(Ti()<=V.DEBUG&&Ei("QueryEngine","The SDK decides to create cache indexes for query:",eu(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Qc(t))):ks.resolve())}ps(e,t){if(Gc(t))return ks.resolve(null);let n=Qc(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=Jc(t,null,"F"),n=Qc(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const i=mu(...r);return this.gs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const s=this.bs(t,r);return this.Ds(t,s,i,n.readTime)?this.ps(e,Jc(t,null,"F")):this.vs(e,s,t,n)}))})))}ys(e,t,n,r){return Gc(t)||r.isEqual(ps.min())?ks.resolve(null):this.gs.getDocuments(e,n).next(i=>{const s=this.bs(t,i);return this.Ds(t,s,n,r)?ks.resolve(null):(Ti()<=V.DEBUG&&Ei("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),eu(t)),this.vs(e,s,t,Is(r,gs)).next(e=>e))})}bs(e,t){let n=new fa(ru(e));return t.forEach((t,r)=>{tu(e,r)&&(n=n.add(r))}),n}Ds(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ws(e,t,n){return Ti()<=V.DEBUG&&Ei("QueryEngine","Using full collection scan to execute query:",eu(t)),this.gs.getDocumentsMatchingQuery(e,t,Ts.min(),n)}vs(e,t,n,r){return this.gs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rf="LocalStore";class sf{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new ha(Ki),this.Ms=new su(e=>Vc(e),Fc),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(n)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Nd(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}}function of(e,t,n,r){return new sf(e,t,n,r)}async function af(e,t){const n=xi(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(i=>(r=i,n.Ns(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const i=[],s=[];let o=mu();for(const e of r){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Bs:e,removedBatchIds:i,addedBatchIds:s}))})})}function cf(e){const t=xi(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.hi.getLastRemoteSnapshotVersion(e))}function uf(e,t){const n=xi(e),r=t.snapshotVersion;let i=n.Fs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const s=n.Os.newChangeBuffer({trackRemovals:!0});i=n.Fs;const o=[];t.targetChanges.forEach((s,a)=>{const c=i.get(a);if(!c)return;o.push(n.hi.removeMatchingKeys(e,s.removedDocuments,a).next(()=>n.hi.addMatchingKeys(e,s.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);null!==t.targetMismatches.get(a)?u=u.withResumeToken(va.EMPTY_BYTE_STRING,ps.min()).withLastLimboFreeSnapshotVersion(ps.min()):s.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(s.resumeToken,r)),i=i.insert(a,u),function(e,t,n){if(0===e.resumeToken.approximateByteSize())return!0;if(t.snapshotVersion.toMicroseconds()-e.snapshotVersion.toMicroseconds()>=3e8)return!0;return n.addedDocuments.size+n.modifiedDocuments.size+n.removedDocuments.size>0}(c,u,s)&&o.push(n.hi.updateTargetData(e,u))});let a=au(),c=mu();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(function(e,t,n){let r=mu(),i=mu();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=au();return n.forEach((n,s)=>{const o=e.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(ps.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):Ei(rf,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Ls:r,ks:i}})}(e,s,t.documentUpdates).next(e=>{a=e.Ls,c=e.ks})),!r.isEqual(ps.min())){const t=n.hi.getLastRemoteSnapshotVersion(e).next(t=>n.hi.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return ks.waitFor(o).next(()=>s.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.Fs=i,e))}function hf(e,t){const n=xi(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=$s),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function lf(e,t){const n=xi(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.hi.getTargetData(e,t).next(i=>i?(r=i,ks.resolve(r)):n.hi.allocateTargetId(e).next(i=>(r=new Jh(t,i,"TargetPurposeListen",e.currentSequenceNumber),n.hi.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.Fs.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Fs=n.Fs.insert(e.targetId,e),n.Ms.set(t,e.targetId)),e})}async function df(e,t,n){const r=xi(e),i=r.Fs.get(t),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,e=>r.persistence.referenceDelegate.removeTarget(e,i))}catch(o){if(!Ls(o))throw o;Ei(rf,`Failed to update sequence numbers for target ${t}: ${o}`)}r.Fs=r.Fs.remove(t),r.Ms.delete(i.target)}function ff(e,t,n){const r=xi(e);let i=ps.min(),s=mu();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=xi(e),i=r.Ms.get(n);return void 0!==i?ks.resolve(r.Fs.get(i)):r.hi.getTargetData(t,n)}(r,e,Qc(t)).next(t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(e,t.targetId).next(e=>{s=e})}).next(()=>r.Cs.getDocumentsMatchingQuery(e,t,n?i:ps.min(),n?s:mu())).next(e=>(mf(r,nu(t),e),{documents:e,qs:s})))}function pf(e,t){const n=xi(e),r=xi(n.hi),i=n.Fs.get(t);return i?Promise.resolve(i.target):n.persistence.runTransaction("Get target data","readonly",e=>r.Et(e,t).next(e=>e?e.target:null))}function gf(e,t){const n=xi(e),r=n.xs.get(t)||ps.min();return n.persistence.runTransaction("Get new document changes","readonly",e=>n.Os.getAllFromCollectionGroup(e,t,Is(r,gs),Number.MAX_SAFE_INTEGER)).then(e=>(mf(n,t,e),e))}function mf(e,t,n){let r=e.xs.get(t)||ps.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.xs.set(t,r)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf="firestore_clients";function vf(e,t){return`${yf}_${e}_${t}`}const wf="firestore_mutations";function bf(e,t,n){let r=`${wf}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const If="firestore_targets";function _f(e,t){return`${If}_${e}_${t}`}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tf="SharedClientState";class Ef{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static Ks(e,t,n){const r=JSON.parse(n);let i,s="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return s&&r.error&&(s="string"==typeof r.error.message&&"string"==typeof r.error.code,s&&(i=new Oi(r.error.code,r.error.message))),s?new Ef(e,t,r.state,i):(Si(Tf,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Sf{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ks(e,t){const n=JSON.parse(t);let r,i="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return i&&n.error&&(i="string"==typeof n.error.message&&"string"==typeof n.error.code,i&&(r=new Oi(n.error.code,n.error.message))),i?new Sf(e,n.state,r):(Si(Tf,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Cf{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ks(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,i=vu();for(let s=0;r&&s<n.activeTargetIds.length;++s)r=Hs(n.activeTargetIds[s]),i=i.add(n.activeTargetIds[s]);return r?new Cf(e,i):(Si(Tf,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Af{constructor(e,t){this.clientId=e,this.onlineState=t}static Ks(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new Af(t.clientId,t.onlineState):(Si(Tf,`Failed to parse online state: ${e}`),null)}}class kf{constructor(){this.activeTargetIds=vu()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Df{constructor(e,t,n,r,i){this.window=e,this.Fi=t,this.persistenceKey=n,this.js=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Js=this.Hs.bind(this),this.Ys=new ha(Ki),this.started=!1,this.Zs=[];const s=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=vf(this.persistenceKey,this.js),this.eo=`firestore_sequence_number_${this.persistenceKey}`,this.Ys=this.Ys.insert(this.js,new kf),this.no=new RegExp(`^${yf}_${s}_([^_]*)$`),this.ro=new RegExp(`^${wf}_${s}_(\\d+)(?:_(.*))?$`),this.io=new RegExp(`^${If}_${s}_(\\d+)$`),this.so=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this.oo=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.Js)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ps();for(const n of e){if(n===this.js)continue;const e=this.getItem(vf(this.persistenceKey,n));if(e){const t=Cf.Ks(n,e);t&&(this.Ys=this.Ys.insert(t.clientId,t))}}this._o();const t=this.storage.getItem(this.so);if(t){const e=this.ao(t);e&&this.uo(e)}for(const n of this.Zs)this.Hs(n);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.eo,JSON.stringify(e))}getAllActiveQueryTargets(){return this.co(this.Ys)}isActiveQueryTarget(e){let t=!1;return this.Ys.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.lo(e,"pending")}updateMutationState(e,t,n){this.lo(e,t,n),this.ho(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem(_f(this.persistenceKey,e));if(t){const r=Sf.Ks(e,t);r&&(n=r.state)}}return t&&this.Po.Gs(e),this._o(),n}removeLocalQueryTarget(e){this.Po.zs(e),this._o()}isLocalQueryTarget(e){return this.Po.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(_f(this.persistenceKey,e))}updateQueryState(e,t,n){this.To(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.ho(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.Io(e)}notifyBundleLoaded(e){this.Eo(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return Ei(Tf,"READ",e,t),t}setItem(e,t){Ei(Tf,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){Ei(Tf,"REMOVE",e),this.storage.removeItem(e)}Hs(e){const t=e;if(t.storageArea===this.storage){if(Ei(Tf,"EVENT",t.key,t.newValue),t.key===this.Xs)return void Si("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Fi.enqueueRetryable(async()=>{if(this.started){if(null!==t.key)if(this.no.test(t.key)){if(null==t.newValue){const e=this.Ao(t.key);return this.Ro(e,null)}{const e=this.Vo(t.key,t.newValue);if(e)return this.Ro(e.clientId,e)}}else if(this.ro.test(t.key)){if(null!==t.newValue){const e=this.mo(t.key,t.newValue);if(e)return this.fo(e)}}else if(this.io.test(t.key)){if(null!==t.newValue){const e=this.po(t.key,t.newValue);if(e)return this.yo(e)}}else if(t.key===this.so){if(null!==t.newValue){const e=this.ao(t.newValue);if(e)return this.uo(e)}}else if(t.key===this.eo){const e=function(e){let t=zs.ue;if(null!=e)try{const n=JSON.parse(e);Ni("number"==typeof n,30636,{wo:e}),t=n}catch(n){Si(Tf,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==zs.ue&&this.sequenceNumberHandler(e)}else if(t.key===this.oo){const e=this.So(t.newValue);await Promise.all(e.map(e=>this.syncEngine.bo(e)))}}else this.Zs.push(t)})}}get Po(){return this.Ys.get(this.js)}_o(){this.setItem(this.Xs,this.Po.Ws())}lo(e,t,n){const r=new Ef(this.currentUser,e,t,n),i=bf(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Ws())}ho(e){const t=bf(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Io(e){const t={clientId:this.js,onlineState:e};this.storage.setItem(this.so,JSON.stringify(t))}To(e,t,n){const r=_f(this.persistenceKey,e),i=new Sf(e,t,n);this.setItem(r,i.Ws())}Eo(e){const t=JSON.stringify(Array.from(e));this.setItem(this.oo,t)}Ao(e){const t=this.no.exec(e);return t?t[1]:null}Vo(e,t){const n=this.Ao(e);return Cf.Ks(n,t)}mo(e,t){const n=this.ro.exec(e),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return Ef.Ks(new bi(i),r,t)}po(e,t){const n=this.io.exec(e),r=Number(n[1]);return Sf.Ks(r,t)}ao(e){return Af.Ks(e)}So(e){return JSON.parse(e)}async fo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Do(e.batchId,e.state,e.error);Ei(Tf,`Ignoring mutation for non-active user ${e.user.uid}`)}yo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Ys.insert(e,t):this.Ys.remove(e),r=this.co(this.Ys),i=this.co(n),s=[],o=[];return i.forEach(e=>{r.has(e)||s.push(e)}),r.forEach(e=>{i.has(e)||o.push(e)}),this.syncEngine.Co(s,o).then(()=>{this.Ys=n})}uo(e){this.Ys.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}co(e){let t=vu();return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class Nf{constructor(){this.Fo=new kf,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,n){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new kf,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{xo(e){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rf="ConnectivityMonitor";class Of{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){Ei(Rf,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){Ei(Rf,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pf=null;function Lf(){return null===Pf?Pf=268435456+Math.round(2147483648*Math.random()):Pf++,"0x"+Pf.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Mf="RestConnection",Vf={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Ff{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.Ko=this.databaseId.database===xa?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){const s=Lf(),o=this.Go(e,t.toUriEncodedString());Ei(Mf,`Sending RPC '${e}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(a,r,i);const{host:c}=new URL(o),u=f(c);return this.jo(e,o,a,n,u).then(t=>(Ei(Mf,`Received RPC '${e}' ${s}: `,t),t),t=>{throw Ci(Mf,`RPC '${e}' ${s} failed with error: `,t,"url: ",o,"request:",n),t})}Jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}zo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+Ii,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Go(e,t){const n=Vf[e];return`${this.$o}/v1/${t}:${n}`}terminate(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf="WebChannelConnection";class Bf extends Ff{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,n,r,i){const s=Lf();return new Promise((i,o)=>{const a=new ui;a.setWithCredentials(!0),a.listenOnce(li.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case di.NO_ERROR:const t=a.getResponseJson();Ei(jf,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case di.TIMEOUT:Ei(jf,`RPC '${e}' ${s} timed out`),o(new Oi(Ri.DEADLINE_EXCEEDED,"Request time out"));break;case di.HTTP_ERROR:const n=a.getStatus();if(Ei(jf,`RPC '${e}' ${s} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(Ri).indexOf(t)>=0?t:Ri.UNKNOWN}(t.status);o(new Oi(e,t.message))}else o(new Oi(Ri.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Oi(Ri.UNAVAILABLE,"Connection failed."));break;default:ki(9055,{c_:e,streamId:s,l_:a.getLastErrorCode(),h_:a.getLastError()})}}finally{Ei(jf,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(r);Ei(jf,`RPC '${e}' ${s} sending request:`,r),a.send(t,"POST",c,n,15)})}P_(e,t,n){const r=Lf(),i=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],s=mi(),o=gi(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.zo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const u=i.join("");Ei(jf,`Creating RPC '${e}' stream ${r}: ${u}`,a);const h=s.createWebChannel(u,a);this.T_(h);let l=!1,d=!1;const f=new Uf({Ho:t=>{d?Ei(jf,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(l||(Ei(jf,`Opening RPC '${e}' stream ${r} transport.`),h.open(),l=!0),Ei(jf,`RPC '${e}' stream ${r} sending:`,t),h.send(t))},Yo:()=>h.close()}),p=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};return p(h,hi.EventType.OPEN,()=>{d||(Ei(jf,`RPC '${e}' stream ${r} transport opened.`),f.s_())}),p(h,hi.EventType.CLOSE,()=>{d||(d=!0,Ei(jf,`RPC '${e}' stream ${r} transport closed`),f.__(),this.I_(h))}),p(h,hi.EventType.ERROR,t=>{d||(d=!0,Ci(jf,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),f.__(new Oi(Ri.UNAVAILABLE,"The operation could not be completed")))}),p(h,hi.EventType.MESSAGE,t=>{var n;if(!d){const i=t.data[0];Ni(!!i,16349);const s=i,o=(null==s?void 0:s.error)||(null===(n=s[0])||void 0===n?void 0:n.error);if(o){Ei(jf,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=eh[e];if(void 0!==t)return rh(t)}(t),i=o.message;void 0===n&&(n=Ri.INTERNAL,i="Unknown error status: "+t+" with message "+o.message),d=!0,f.__(new Oi(n,i)),h.close()}else Ei(jf,`RPC '${e}' stream ${r} received:`,i),f.a_(i)}}),p(o,pi.STAT_EVENT,t=>{t.stat===fi.PROXY?Ei(jf,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===fi.NOPROXY&&Ei(jf,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.o_()},0),f}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qf(){return"undefined"!=typeof window?window:null}function zf(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $f(e){return new Ih(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Fi=e,this.timerId=t,this.d_=n,this.E_=r,this.A_=i,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),r=Math.max(0,t-n);r>0&&Ei("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,r,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){null!==this.V_&&(this.V_.skipDelay(),this.V_=null)}cancel(){null!==this.V_&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gf="PersistentStream";class Hf{constructor(e,t,n,r,i,s,o,a){this.Fi=e,this.w_=n,this.S_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new Kf(e,t)}M_(){return 1===this.state||5===this.state||this.x_()}x_(){return 2===this.state||3===this.state}start(){this.C_=0,4!==this.state?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&null===this.D_&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,4!==e?this.F_.reset():t&&t.code===Ri.RESOURCE_EXHAUSTED?(Si(t.toString()),Si("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===Ri.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.b_===t&&this.W_(e,n)},t=>{e(()=>{const e=new Oi(Ri.UNKNOWN,"Fetching auth token failed: "+t.message);return this.G_(e)})})}W_(e,t){const n=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.e_(()=>{n(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(e=>{n(()=>this.G_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.C_?this.j_(e):this.onNext(e))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return Ei(Gf,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget(()=>this.b_===e?t():(Ei(Gf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Wf extends Hf{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const i="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:ki(39313,{state:r}),s=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Ni(void 0===t||"string"==typeof t,58123),va.fromBase64String(t||"")):(Ni(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),va.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?Ri.UNKNOWN:rh(e.code);return new Oi(t,e.message||"")}(a);n=new fh(i,s,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const i=xh(e,r.document.name),s=Ch(r.document.updateTime),o=r.document.createTime?Ch(r.document.createTime):ps.min(),a=new cc({mapValue:{fields:r.document.fields}}),c=hc.newFoundDocument(i,s,o,a),u=r.targetIds||[],h=r.removedTargetIds||[];n=new lh(u,h,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const i=xh(e,r.document),s=r.readTime?Ch(r.readTime):ps.min(),o=hc.newNoDocument(i,s),a=r.removedTargetIds||[];n=new lh([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const i=xh(e,r.document),s=r.removedTargetIds||[];n=new lh([],s,i,null)}else{if(!("filter"in t))return ki(11601,{At:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:i}=e,s=new Zu(r,i),o=e.targetId;n=new dh(o,s)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return ps.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?ps.min():t.readTime?Ch(t.readTime):ps.min()}(e);return this.listener.J_(t,n)}H_(e){const t={};t.database=Ph(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Uc(r)?{documents:Uh(e,r)}:{query:jh(e,r).Vt},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=Eh(e,t.resumeToken);const r=_h(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(ps.min())>0){n.readTime=Th(e,t.snapshotVersion.toTimestamp());const r=_h(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ki(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.k_(t)}Y_(e){const t={};t.database=Ph(this.serializer),t.removeTarget=e,this.k_(t)}}class Qf extends Hf{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Ni(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Ni(!e.writeResults||0===e.writeResults.length,55816),this.listener.ea()}onNext(e){Ni(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=function(e,t){return e&&e.length>0?(Ni(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?Ch(e.updateTime):Ch(t);return n.isEqual(ps.min())&&(n=Ch(t)),new Pu(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=Ch(e.commitTime);return this.listener.ta(n,t)}na(){const e={};e.database=Ph(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>Vh(this.serializer,e))};this.k_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xf{}class Jf extends Xf{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new Oi(Ri.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,kh(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Ri.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Oi(Ri.UNKNOWN,e.toString())})}Jo(e,t,n,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Jo(e,kh(t,n),r,s,o,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Ri.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Oi(Ri.UNKNOWN,e.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class Yf{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){0===this.sa&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){"Online"===this.state?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,"Online"===e&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Si(t),this._a=!1):Ei("OnlineStateTracker",t)}ha(){null!==this.oa&&(this.oa.cancel(),this.oa=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zf="RemoteStore";class ep{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=i,this.Ea.xo(e=>{n.enqueueAndForget(async()=>{up(this)&&(Ei(Zf,"Restarting streams for network reachability change."),await async function(e){const t=xi(e);t.Ia.add(4),await np(t),t.Aa.set("Unknown"),t.Ia.delete(4),await tp(t)}(this))})}),this.Aa=new Yf(n,r)}}async function tp(e){if(up(e))for(const t of e.da)await t(!0)}async function np(e){for(const t of e.da)await t(!1)}function rp(e,t){const n=xi(e);n.Ta.has(t.targetId)||(n.Ta.set(t.targetId,t),cp(n)?ap(n):kp(n).x_()&&sp(n,t))}function ip(e,t){const n=xi(e),r=kp(n);n.Ta.delete(t),r.x_()&&op(n,t),0===n.Ta.size&&(r.x_()?r.B_():up(n)&&n.Aa.set("Unknown"))}function sp(e,t){if(e.Ra.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(ps.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}kp(e).H_(t)}function op(e,t){e.Ra.$e(t),kp(e).Y_(t)}function ap(e){e.Ra=new gh({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),Et:t=>e.Ta.get(t)||null,lt:()=>e.datastore.serializer.databaseId}),kp(e).start(),e.Aa.aa()}function cp(e){return up(e)&&!kp(e).M_()&&e.Ta.size>0}function up(e){return 0===xi(e).Ia.size}function hp(e){e.Ra=void 0}async function lp(e){e.Aa.set("Online")}async function dp(e){e.Ta.forEach((t,n)=>{sp(e,t)})}async function fp(e,t){hp(e),cp(e)?(e.Aa.la(t),ap(e)):e.Aa.set("Unknown")}async function pp(e,t,n){if(e.Aa.set("Online"),t instanceof fh&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ta.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ta.delete(r),e.Ra.removeTarget(r))}(e,t)}catch(r){Ei(Zf,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await gp(e,r)}else if(t instanceof lh?e.Ra.Ye(t):t instanceof dh?e.Ra.it(t):e.Ra.et(t),!n.isEqual(ps.min()))try{const t=await cf(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.Ra.Pt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=e.Ta.get(r);i&&e.Ta.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ta.get(t);if(!r)return;e.Ta.set(t,r.withResumeToken(va.EMPTY_BYTE_STRING,r.snapshotVersion)),op(e,t);const i=new Jh(r.target,t,n,r.sequenceNumber);sp(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(i){Ei(Zf,"Failed to raise snapshot:",i),await gp(e,i)}}async function gp(e,t,n){if(!Ls(t))throw t;e.Ia.add(1),await np(e),e.Aa.set("Offline"),n||(n=()=>cf(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{Ei(Zf,"Retrying IndexedDB access"),await n(),e.Ia.delete(1),await tp(e)})}function mp(e,t){return t().catch(n=>gp(e,n,t))}async function yp(e){const t=xi(e),n=Dp(t);let r=t.Pa.length>0?t.Pa[t.Pa.length-1].batchId:$s;for(;vp(t);)try{const e=await hf(t.localStore,r);if(null===e){0===t.Pa.length&&n.B_();break}r=e.batchId,wp(t,e)}catch(i){await gp(t,i)}bp(t)&&Ip(t)}function vp(e){return up(e)&&e.Pa.length<10}function wp(e,t){e.Pa.push(t);const n=Dp(e);n.x_()&&n.Z_&&n.X_(t.mutations)}function bp(e){return up(e)&&!Dp(e).M_()&&e.Pa.length>0}function Ip(e){Dp(e).start()}async function _p(e){Dp(e).na()}async function Tp(e){const t=Dp(e);for(const n of e.Pa)t.X_(n.mutations)}async function Ep(e,t,n){const r=e.Pa.shift(),i=Ju.from(r,t,n);await mp(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await yp(e)}async function Sp(e,t){t&&Dp(e).Z_&&await async function(e,t){if(nh(n=t.code)&&n!==Ri.ABORTED){const n=e.Pa.shift();Dp(e).N_(),await mp(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await yp(e)}var n}(e,t),bp(e)&&Ip(e)}async function Cp(e,t){const n=xi(e);n.asyncQueue.verifyOperationInProgress(),Ei(Zf,"RemoteStore received new credentials");const r=up(n);n.Ia.add(3),await np(n),r&&n.Aa.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ia.delete(3),await tp(n)}async function Ap(e,t){const n=xi(e);t?(n.Ia.delete(2),await tp(n)):t||(n.Ia.add(2),await np(n),n.Aa.set("Unknown"))}function kp(e){return e.Va||(e.Va=function(e,t,n){const r=xi(e);return r.ia(),new Wf(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:lp.bind(null,e),e_:dp.bind(null,e),n_:fp.bind(null,e),J_:pp.bind(null,e)}),e.da.push(async t=>{t?(e.Va.N_(),cp(e)?ap(e):e.Aa.set("Unknown")):(await e.Va.stop(),hp(e))})),e.Va}function Dp(e){return e.ma||(e.ma=function(e,t,n){const r=xi(e);return r.ia(),new Qf(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:()=>Promise.resolve(),e_:_p.bind(null,e),n_:Sp.bind(null,e),ea:Tp.bind(null,e),ta:Ep.bind(null,e)}),e.da.push(async t=>{t?(e.ma.N_(),await yp(e)):(await e.ma.stop(),e.Pa.length>0&&(Ei(Zf,`Stopping write stream with ${e.Pa.length} pending writes`),e.Pa=[]))})),e.ma
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Np{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new Pi,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const s=Date.now()+n,o=new Np(e,t,s,r,i);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Oi(Ri.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function xp(e,t){if(Si("AsyncQueue",`${t}: ${e}`),Ls(e))return new Oi(Ri.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rp{static emptySet(e){return new Rp(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||ns.comparator(t.key,n.key):(e,t)=>ns.comparator(e.key,t.key),this.keyedMap=uu(),this.sortedSet=new ha(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Rp))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new Rp;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op{constructor(){this.fa=new ha(ns.comparator)}track(e){const t=e.doc.key,n=this.fa.get(t);n?0!==e.type&&3===n.type?this.fa=this.fa.insert(t,e):3===e.type&&1!==n.type?this.fa=this.fa.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.fa=this.fa.remove(t):1===e.type&&2===n.type?this.fa=this.fa.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ki(63341,{At:e,ga:n}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal((t,n)=>{e.push(n)}),e}}class Pp{constructor(e,t,n,r,i,s,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,i){const s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new Pp(e,t,Rp.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Yc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class Mp{constructor(){this.queries=Vp(),this.onlineState="Unknown",this.Da=new Set}terminate(){!function(e,t){const n=xi(e),r=n.queries;n.queries=Vp(),r.forEach((e,n)=>{for(const r of n.wa)r.onError(t)})}(this,new Oi(Ri.ABORTED,"Firestore shutting down"))}}function Vp(){return new su(e=>Zc(e),Yc)}async function Fp(e,t){const n=xi(e);let r=3;const i=t.query;let s=n.queries.get(i);s?!s.Sa()&&t.ba()&&(r=2):(s=new Lp,r=t.ba()?0:1);try{switch(r){case 0:s.ya=await n.onListen(i,!0);break;case 1:s.ya=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const e=xp(o,`Initialization of query '${eu(t.query)}' failed`);return void t.onError(e)}n.queries.set(i,s),s.wa.push(t),t.va(n.onlineState),s.ya&&t.Ca(s.ya)&&qp(n)}async function Up(e,t){const n=xi(e),r=t.query;let i=3;const s=n.queries.get(r);if(s){const e=s.wa.indexOf(t);e>=0&&(s.wa.splice(e,1),0===s.wa.length?i=t.ba()?0:1:!s.Sa()&&t.ba()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function jp(e,t){const n=xi(e);let r=!1;for(const i of t){const e=i.query,t=n.queries.get(e);if(t){for(const e of t.wa)e.Ca(i)&&(r=!0);t.ya=i}}r&&qp(n)}function Bp(e,t,n){const r=xi(e),i=r.queries.get(t);if(i)for(const s of i.wa)s.onError(n);r.queries.delete(t)}function qp(e){e.Da.forEach(e=>{e.next()})}var zp,$p;($p=zp||(zp={})).Fa="default",$p.Cache="cache";class Kp{constructor(e,t,n){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=n||{}}Ca(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new Pp(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache)return!0;if(!this.ba())return!0;const n="Offline"!==t;return(!this.options.ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}La(e){e=Pp.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==zp.Cache}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(e){this.key=e}}class Hp{constructor(e){this.key=e}}class Wp{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=mu(),this.mutatedKeys=mu(),this.Xa=ru(e),this.eu=new Rp(this.Xa)}get tu(){return this.Ha}nu(e,t){const n=t?t.ru:new Op,r=t?t.eu:this.eu;let i=t?t.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),h=tu(this.query,t)?t:null,l=!!u&&this.mutatedKeys.has(u.key),d=!!h&&(h.hasLocalMutations||this.mutatedKeys.has(h.key)&&h.hasCommittedMutations);let f=!1;u&&h?u.data.isEqual(h.data)?l!==d&&(n.track({type:3,doc:h}),f=!0):this.iu(u,h)||(n.track({type:2,doc:h}),f=!0,(a&&this.Xa(h,a)>0||c&&this.Xa(h,c)<0)&&(o=!0)):!u&&h?(n.track({type:0,doc:h}),f=!0):u&&!h&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(h?(s=s.add(h),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{eu:s,ru:n,Ds:o,mutatedKeys:i}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const s=e.ru.pa();s.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ki(20277,{At:e})}};return n(e)-n(t)}(e.type,t.type)||this.Xa(e.doc,t.doc)),this.su(n),r=null!=r&&r;const o=t&&!r?this.ou():[],a=0===this.Za.size&&this.current&&!r?1:0,c=a!==this.Ya;return this.Ya=a,0!==s.length||c?{snapshot:new Pp(this.query,e.eu,i,s,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),_u:o}:{_u:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Op,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(e=>this.Ha=this.Ha.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ha=this.Ha.delete(e)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=mu(),this.eu.forEach(e=>{this.au(e.key)&&(this.Za=this.Za.add(e.key))});const t=[];return e.forEach(e=>{this.Za.has(e)||t.push(new Hp(e))}),this.Za.forEach(n=>{e.has(n)||t.push(new Gp(n))}),t}uu(e){this.Ha=e.qs,this.Za=mu();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Pp.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,0===this.Ya,this.hasCachedResults)}}const Qp="SyncEngine";class Xp{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Jp{constructor(e){this.key=e,this.lu=!1}}class Yp{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.hu={},this.Pu=new su(e=>Zc(e),Yc),this.Tu=new Map,this.Iu=new Set,this.du=new ha(ns.comparator),this.Eu=new Map,this.Au=new Pd,this.Ru={},this.Vu=new Map,this.mu=od.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return!0===this.fu}}async function Zp(e,t,n=!0){const r=kg(e);let i;const s=r.Pu.get(t);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await tg(r,t,n,!0),i}async function eg(e,t){const n=kg(e);await tg(n,t,!0,!1)}async function tg(e,t,n,r){const i=await lf(e.localStore,Qc(t)),s=i.targetId,o=e.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await ng(e,t,s,"current"===o,i.resumeToken)),e.isPrimaryClient&&n&&rp(e.remoteStore,i),a}async function ng(e,t,n,r,i){e.gu=(t,n,r)=>async function(e,t,n,r){let i=t.view.nu(n);i.Ds&&(i=await ff(e.localStore,t.query,!1).then(({documents:e})=>t.view.nu(e,i)));const s=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(i,e.isPrimaryClient,s,o);return pg(e,t.targetId,a._u),a.snapshot}(e,t,n,r);const s=await ff(e.localStore,t,!0),o=new Wp(t,s.qs),a=o.nu(s.documents),c=hh.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=o.applyChanges(a,e.isPrimaryClient,c);pg(e,n,u._u);const h=new Xp(t,n,o);return e.Pu.set(t,h),e.Tu.has(n)?e.Tu.get(n).push(t):e.Tu.set(n,[t]),u.snapshot}async function rg(e,t,n){const r=xi(e),i=r.Pu.get(t),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(e=>!Yc(e,t))),void r.Pu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await df(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&ip(r.remoteStore,i.targetId),dg(r,i.targetId)}).catch(As)):(dg(r,i.targetId),await df(r.localStore,i.targetId,!0))}async function ig(e,t){const n=xi(e),r=n.Pu.get(t),i=n.Tu.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),ip(n.remoteStore,r.targetId))}async function sg(e,t){const n=xi(e);try{const e=await uf(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Eu.get(t);r&&(Ni(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.lu=!0:e.modifiedDocuments.size>0?Ni(r.lu,14607):e.removedDocuments.size>0&&(Ni(r.lu,42227),r.lu=!1))}),await yg(n,e,t)}catch(r){await As(r)}}function og(e,t,n){const r=xi(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Pu.forEach((n,r)=>{const i=r.view.va(t);i.snapshot&&e.push(i.snapshot)}),function(e,t){const n=xi(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const i of n.wa)i.va(t)&&(r=!0)}),r&&qp(n)}(r.eventManager,t),e.length&&r.hu.J_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function ag(e,t,n){const r=xi(e);r.sharedClientState.updateQueryState(t,"rejected",n);const i=r.Eu.get(t),s=i&&i.key;if(s){let e=new ha(ns.comparator);e=e.insert(s,hc.newNoDocument(s,ps.min()));const n=mu().add(s),i=new uh(ps.min(),new Map,new ha(Ki),e,n);await sg(r,i),r.du=r.du.remove(s),r.Eu.delete(t),mg(r)}else await df(r.localStore,t,!1).then(()=>dg(r,t,n)).catch(As)}async function cg(e,t){const n=xi(e),r=t.batch.batchId;try{const e=await function(e,t){const n=xi(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),i=n.Os.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const i=n.batch,s=i.keys();let o=ks.resolve();return s.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const s=n.docVersions.get(e);Ni(null!==s,48541),t.version.compareTo(s)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,i))}(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=mu();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);lg(n,r,null),hg(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await yg(n,e)}catch(i){await As(i)}}async function ug(e,t,n){const r=xi(e);try{const e=await function(e,t){const n=xi(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(Ni(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);lg(r,t,n),hg(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await yg(r,e)}catch(i){await As(i)}}function hg(e,t){(e.Vu.get(t)||[]).forEach(e=>{e.resolve()}),e.Vu.delete(t)}function lg(e,t,n){const r=xi(e);let i=r.Ru[r.currentUser.toKey()];if(i){const e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.Ru[r.currentUser.toKey()]=i}}function dg(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Tu.get(t))e.Pu.delete(r),n&&e.hu.pu(r,n);e.Tu.delete(t),e.isPrimaryClient&&e.Au.zr(t).forEach(t=>{e.Au.containsKey(t)||fg(e,t)})}function fg(e,t){e.Iu.delete(t.path.canonicalString());const n=e.du.get(t);null!==n&&(ip(e.remoteStore,n),e.du=e.du.remove(t),e.Eu.delete(n),mg(e))}function pg(e,t,n){for(const r of n)r instanceof Gp?(e.Au.addReference(r.key,t),gg(e,r)):r instanceof Hp?(Ei(Qp,"Document no longer in limbo: "+r.key),e.Au.removeReference(r.key,t),e.Au.containsKey(r.key)||fg(e,r.key)):ki(19791,{yu:r})}function gg(e,t){const n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Iu.has(r)||(Ei(Qp,"New document in limbo: "+n),e.Iu.add(r),mg(e))}function mg(e){for(;e.Iu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){const t=e.Iu.values().next().value;e.Iu.delete(t);const n=new ns(Zi.fromString(t)),r=e.mu.next();e.Eu.set(r,new Jp(n)),e.du=e.du.insert(n,r),rp(e.remoteStore,new Jh(Qc(Kc(n.path)),r,"TargetPurposeLimboResolution",zs.ue))}}async function yg(e,t,n){const r=xi(e),i=[],s=[],o=[];r.Pu.isEmpty()||(r.Pu.forEach((e,a)=>{o.push(r.gu(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const i=e?!e.fromCache:null===(t=null==n?void 0:n.targetChanges.get(a.targetId))||void 0===t?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(e){i.push(e);const t=ef.Es(a.targetId,e);s.push(t)}}))}),await Promise.all(o),r.hu.J_(i),await async function(e,t){const n=xi(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>ks.forEach(t,t=>ks.forEach(t.Is,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>ks.forEach(t.ds,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!Ls(r))throw r;Ei(rf,"Failed to update sequence numbers: "+r)}for(const i of t){const e=i.targetId;if(!i.fromCache){const t=n.Fs.get(e),r=t.snapshotVersion,i=t.withLastLimboFreeSnapshotVersion(r);n.Fs=n.Fs.insert(e,i)}}}(r.localStore,s))}async function vg(e,t){const n=xi(e);if(!n.currentUser.isEqual(t)){Ei(Qp,"User change. New user:",t.toKey());const e=await af(n.localStore,t);n.currentUser=t,i="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).Vu.forEach(e=>{e.forEach(e=>{e.reject(new Oi(Ri.CANCELLED,i))})}),r.Vu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await yg(n,e.Bs)}var r,i}function wg(e,t){const n=xi(e),r=n.Eu.get(t);if(r&&r.lu)return mu().add(r.key);{let e=mu();const r=n.Tu.get(t);if(!r)return e;for(const t of r){const r=n.Pu.get(t);e=e.unionWith(r.view.tu)}return e}}async function bg(e,t){const n=xi(e),r=await ff(n.localStore,t.query,!0),i=t.view.uu(r);return n.isPrimaryClient&&pg(n,t.targetId,i._u),i}async function Ig(e,t){const n=xi(e);return gf(n.localStore,t).then(e=>yg(n,e))}async function _g(e,t,n,r){const i=xi(e),s=await function(e,t){const n=xi(e),r=xi(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",e=>r.Xn(e,t).next(t=>t?n.localDocuments.getDocuments(e,t):ks.resolve(null)))}(i.localStore,t);var o,a;null!==s?("pending"===n?await yp(i.remoteStore):"acknowledged"===n||"rejected"===n?(lg(i,t,r||null),hg(i,t),o=i.localStore,a=t,xi(xi(o).mutationQueue).rr(a)):ki(6720,"Unknown batchState",{wu:n}),await yg(i,s)):Ei(Qp,"Cannot apply mutation batch with id: "+t)}async function Tg(e,t,n){const r=xi(e),i=[],s=[];for(const o of t){let e;const t=r.Tu.get(o);if(t&&0!==t.length){e=await lf(r.localStore,Qc(t[0]));for(const e of t){const t=r.Pu.get(e),n=await bg(r,t);n.snapshot&&s.push(n.snapshot)}}else{const t=await pf(r.localStore,o);e=await lf(r.localStore,t),await ng(r,Eg(t),o,!1,e.resumeToken)}i.push(e)}return r.hu.J_(s),i}function Eg(e){return $c(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function Sg(e){return t=xi(e).localStore,xi(xi(t).persistence).Ps();var t}async function Cg(e,t,n,r){const i=xi(e);if(i.fu)return void Ei(Qp,"Ignoring unexpected query state notification.");const s=i.Tu.get(t);if(s&&s.length>0)switch(n){case"current":case"not-current":{const e=await gf(i.localStore,nu(s[0])),r=uh.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,va.EMPTY_BYTE_STRING);await yg(i,e,r);break}case"rejected":await df(i.localStore,t,!0),dg(i,t,r);break;default:ki(64155,n)}}async function Ag(e,t,n){const r=kg(e);if(r.fu){for(const e of t){if(r.Tu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){Ei(Qp,"Adding an already active target "+e);continue}const t=await pf(r.localStore,e),n=await lf(r.localStore,t);await ng(r,Eg(t),n.targetId,!1,n.resumeToken),rp(r.remoteStore,n)}for(const e of n)r.Tu.has(e)&&await df(r.localStore,e,!1).then(()=>{ip(r.remoteStore,e),dg(r,e)}).catch(As)}}function kg(e){const t=xi(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=sg.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=wg.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=ag.bind(null,t),t.hu.J_=jp.bind(null,t.eventManager),t.hu.pu=Bp.bind(null,t.eventManager),t}function Dg(e){const t=xi(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=cg.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=ug.bind(null,t),t}class Ng{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=$f(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return of(this.persistence,new nf,e.initialUser,this.serializer)}Du(e){return new jd(qd.Vi,this.serializer)}bu(e){return new Nf}async terminate(){var e,t;null===(e=this.gcScheduler)||void 0===e||e.stop(),null===(t=this.indexBackfillerScheduler)||void 0===t||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ng.provider={build:()=>new Ng};class xg extends Ng{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Ni(this.persistence.referenceDelegate instanceof zd,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new gd(n,e.asyncQueue,t)}Du(e){const t=void 0!==this.cacheSizeBytes?Yl.withCacheSize(this.cacheSizeBytes):Yl.DEFAULT;return new jd(e=>zd.Vi(e,t),this.serializer)}}class Rg extends Ng{constructor(e,t,n){super(),this.Mu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Mu.initialize(this,e),await Dg(this.Mu.syncEngine),await yp(this.Mu.remoteStore),await this.persistence.ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return of(this.persistence,new nf,e.initialUser,this.serializer)}Cu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new gd(n,e.asyncQueue,t)}Fu(e,t){const n=new qs(t,this.persistence);return new Bs(e.asyncQueue,n)}Du(e){const t=Zd(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?Yl.withCacheSize(this.cacheSizeBytes):Yl.DEFAULT;return new Xd(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,qf(),zf(),this.serializer,this.sharedClientState,!!this.forceOwnership)}bu(e){return new Nf}}class Og extends Rg{constructor(e,t){super(e,t,!1),this.Mu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Mu.syncEngine;this.sharedClientState instanceof Df&&(this.sharedClientState.syncEngine={Do:_g.bind(null,t),vo:Cg.bind(null,t),Co:Ag.bind(null,t),Ps:Sg.bind(null,t),bo:Ig.bind(null,t)},await this.sharedClientState.start()),await this.persistence.ji(async e=>{await async function(e,t){const n=xi(e);if(kg(n),Dg(n),!0===t&&!0!==n.fu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await Tg(n,e.toArray());n.fu=!0,await Ap(n.remoteStore,!0);for(const r of t)rp(n.remoteStore,r)}else if(!1===t&&!1!==n.fu){const e=[];let t=Promise.resolve();n.Tu.forEach((r,i)=>{n.sharedClientState.isLocalQueryTarget(i)?e.push(i):t=t.then(()=>(dg(n,i),df(n.localStore,i,!0))),ip(n.remoteStore,i)}),await t,await Tg(n,e),function(e){const t=xi(e);t.Eu.forEach((e,n)=>{ip(t.remoteStore,n)}),t.Au.jr(),t.Eu=new Map,t.du=new ha(ns.comparator)}(n),n.fu=!1,await Ap(n.remoteStore,!1)}}(this.Mu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}bu(e){const t=qf();if(!Df.C(t))throw new Oi(Ri.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Zd(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Df(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Pg{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>og(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=vg.bind(null,this.syncEngine),await Ap(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new Mp}createDatastore(e){const t=$f(e.databaseInfo.databaseId),n=(r=e.databaseInfo,new Bf(r));var r;return function(e,t,n,r){return new Jf(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,i=e=>og(this.syncEngine,e,0),s=Of.C()?new Of:new xf,new ep(t,n,r,i,s);var t,n,r,i,s}createSyncEngine(e,t){return function(e,t,n,r,i,s,o){const a=new Yp(e,t,n,r,i,s);return o&&(a.fu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=xi(e);Ei(Zf,"RemoteStore shutting down."),t.Ia.add(5),await np(t),t.Ea.shutdown(),t.Aa.set("Unknown")}(this.remoteStore),null===(e=this.datastore)||void 0===e||e.terminate(),null===(t=this.eventManager)||void 0===t||t.terminate()}}Pg.provider={build:()=>new Pg};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Lg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Si("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mg{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new Oi(Ri.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=xi(e),r={documents:t.map(e=>Nh(n.serializer,e))},i=await n.Jo("BatchGetDocuments",n.serializer.databaseId,Zi.emptyPath(),r,t.length),s=new Map;i.forEach(e=>{const t=function(e,t){return"found"in t?function(e,t){Ni(!!t.found,43571),t.found.name,t.found.updateTime;const n=xh(e,t.found.name),r=Ch(t.found.updateTime),i=t.found.createTime?Ch(t.found.createTime):ps.min(),s=new cc({mapValue:{fields:t.found.fields}});return hc.newFoundDocument(n,r,i,s)}(e,t):"missing"in t?function(e,t){Ni(!!t.missing,3894),Ni(!!t.readTime,22933);const n=xh(e,t.missing),r=Ch(t.readTime);return hc.newNoDocument(n,r)}(e,t):ki(7234,{result:t})}(n.serializer,e);s.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=s.get(e.toString());Ni(!!t,55234,{key:e}),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new Wu(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=ns.fromPath(t);this.mutations.push(new Qu(n,this.precondition(n)))}),await async function(e,t){const n=xi(e),r={writes:t.map(e=>Vh(n.serializer,e))};await n.Wo("Commit",n.serializer.databaseId,Zi.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw ki(50498,{Wu:e.constructor.name});t=ps.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new Oi(Ri.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(ps.min())?Lu.exists(!1):Lu.updateTime(t):Lu.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(ps.min()))throw new Oi(Ri.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Lu.updateTime(t)}return Lu.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vg{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.Gu=n.maxAttempts,this.F_=new Kf(this.asyncQueue,"transaction_retry")}zu(){this.Gu-=1,this.ju()}ju(){this.F_.g_(async()=>{const e=new Mg(this.datastore),t=this.Ju(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.Hu(e)}))}).catch(e=>{this.Hu(e)})})}Ju(e){try{const t=this.updateFunction(e);return!Ks(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Hu(e){this.Gu>0&&this.Yu(e)?(this.Gu-=1,this.asyncQueue.enqueueAndForget(()=>(this.ju(),Promise.resolve()))):this.deferred.reject(e)}Yu(e){if("FirebaseError"===e.name){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!nh(t)}return!1}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg="FirestoreClient";class Ug{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=bi.UNAUTHENTICATED,this.clientId=$i.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{Ei(Fg,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(Ei(Fg,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Pi;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=xp(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function jg(e,t){e.asyncQueue.verifyOperationInProgress(),Ei(Fg,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await af(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>{Ci("Terminating Firestore due to IndexedDb database deletion"),e.terminate().then(()=>{Ei("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(e=>{Ci("Terminating Firestore due to IndexedDb database deletion failed",e)})}),e._offlineComponents=t}async function Bg(e,t){e.asyncQueue.verifyOperationInProgress();const n=await async function(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){Ei(Fg,"Using user provided OfflineComponentProvider");try{await jg(e,e._uninitializedComponentsProvider._offline)}catch(t){const i=t;if(!("FirebaseError"===(n=i).name?n.code===Ri.FAILED_PRECONDITION||n.code===Ri.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&n instanceof DOMException)||22===n.code||20===n.code||11===n.code))throw i;Ci("Error using user provided cache. Falling back to memory cache: "+i),await jg(e,new Ng)}}else Ei(Fg,"Using default OfflineComponentProvider"),await jg(e,new xg(void 0));var n;return e._offlineComponents}(e);Ei(Fg,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>Cp(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>Cp(t.remoteStore,n)),e._onlineComponents=t}async function qg(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(Ei(Fg,"Using user provided OnlineComponentProvider"),await Bg(e,e._uninitializedComponentsProvider._online)):(Ei(Fg,"Using default OnlineComponentProvider"),await Bg(e,new Pg))),e._onlineComponents}async function zg(e){const t=await qg(e),n=t.eventManager;return n.onListen=Zp.bind(null,t.syncEngine),n.onUnlisten=rg.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=eg.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=ig.bind(null,t.syncEngine),n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function $g(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Kg=new Map,Gg=!0;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hg{constructor(e){var t,n;if(void 0===e.host){if(void 0!==e.ssl)throw new Oi(Ri.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=Gg}else this.host=e.host,this.ssl=null!==(t=e.ssl)&&void 0!==t?t:Gg;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=Jl;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<dd)throw new Oi(Ri.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,n,r){if(!0===t&&!0===r)throw new Oi(Ri.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=$g(null!==(n=e.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Oi(Ri.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Oi(Ri.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Oi(Ri.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class Wg{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Hg({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Oi(Ri.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Oi(Ri.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Hg(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Mi;switch(e.type){case"firstParty":return new Ui(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Oi(Ri.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=Kg.get(e);t&&(Ei("ComponentProvider","Removing Datastore"),Kg.delete(e),t.terminate())}(this),Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Qg(this.firestore,e,this._query)}}class Xg{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Jg(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Xg(this.firestore,e,this._key)}toJSON(){return{type:Xg._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(hs(t,Xg._jsonSchema))return new Xg(e,n||null,new ns(Zi.fromString(t.referencePath)))}}Xg._jsonSchemaVersion="firestore/documentReference/1.0",Xg._jsonSchema={type:us("string",Xg._jsonSchemaVersion),referencePath:us("string")};class Jg extends Qg{constructor(e,t,n){super(e,t,Kc(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Xg(this.firestore,null,new ns(e))}withConverter(e){return new Jg(this.firestore,e,this._path)}}function Yg(e,t,...n){if(e=R(e),rs("collection","path",t),e instanceof Wg){const r=Zi.fromString(t,...n);return ss(r),new Jg(e,null,r)}{if(!(e instanceof Xg||e instanceof Jg))throw new Oi(Ri.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Zi.fromString(t,...n));return ss(r),new Jg(e.firestore,null,r)}}function Zg(e,t,...n){if(e=R(e),1===arguments.length&&(t=$i.newId()),rs("doc","path",t),e instanceof Wg){const r=Zi.fromString(t,...n);return is(r),new Xg(e,null,new ns(r))}{if(!(e instanceof Xg||e instanceof Jg))throw new Oi(Ri.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Zi.fromString(t,...n));return is(r),new Xg(e.firestore,e instanceof Jg?e.converter:null,new ns(r))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const em="AsyncQueue";class tm{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Kf(this,"async_queue_retry"),this.oc=()=>{const e=zf();e&&Ei(em,"Visibility state changed to "+e.visibilityState),this.F_.y_()},this._c=e;const t=zf();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=zf();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new Pi;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(0!==this.Zu.length){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Ls(e))throw e;Ei(em,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(e=>{throw this.tc=e,this.nc=!1,Si("INTERNAL UNHANDLED ERROR: ",nm(e)),e}).then(e=>(this.nc=!1,e))));return this._c=t,t}enqueueAfterDelay(e,t,n){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=Np.createAndSchedule(this,e,t,n,e=>this.lc(e));return this.ec.push(r),r}ac(){this.tc&&ki(47125,{hc:nm(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do{e=this._c,await e}while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function nm(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}function rm(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}class im extends Wg{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new tm,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new tm(e),this._firestoreClient=void 0,await e}}}function sm(e,t,n){n||(n=xa);const r=ze(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(A(r.getOptions(n),t))return e;throw new Oi(Ri.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new Oi(Ri.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<dd)throw new Oi(Ri.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&f(t.host)&&p(t.host),r.initialize({options:t,instanceIdentifier:n})}function om(e){if(e._terminated)throw new Oi(Ri.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||am(e),e._firestoreClient}function am(e){var t,n,r;const i=e._freezeSettings(),s=(o=e._databaseId,a=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",c=e._persistenceKey,new Na(o,a,c,(u=i).host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,$g(u.experimentalLongPollingOptions),u.useFetchStreams,u.isUsingEmulator));var o,a,c,u;e._componentsProvider||(null===(n=i.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=i.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(e._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),e._firestoreClient=new Ug(e._authCredentials,e._appCheckCredentials,e._queue,s,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function cm(e,t){Ci("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return hm(e,Pg.provider,{build:e=>new Rg(e,n.cacheSizeBytes,void 0)}),Promise.resolve()}async function um(e){Ci("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();hm(e,Pg.provider,{build:e=>new Og(e,t.cacheSizeBytes)})}function hm(e,t,n){if((e=cs(e,im))._firestoreClient||e._terminated)throw new Oi(Ri.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Oi(Ri.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},am(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(e){this._byteString=e}static fromBase64String(e){try{return new lm(va.fromBase64String(e))}catch(t){throw new Oi(Ri.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new lm(va.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:lm._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(hs(e,lm._jsonSchema))return lm.fromBase64String(e.bytes)}}lm._jsonSchemaVersion="firestore/bytes/1.0",lm._jsonSchema={type:us("string",lm._jsonSchemaVersion),bytes:us("string")};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class dm{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Oi(Ri.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ts(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pm{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Oi(Ri.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Oi(Ri.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ki(this._lat,e._lat)||Ki(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:pm._jsonSchemaVersion}}static fromJSON(e){if(hs(e,pm._jsonSchema))return new pm(e.latitude,e.longitude)}}pm._jsonSchemaVersion="firestore/geoPoint/1.0",pm._jsonSchema={type:us("string",pm._jsonSchemaVersion),latitude:us("number"),longitude:us("number")};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gm{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:gm._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(hs(e,gm._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new gm(e.vectorValues);throw new Oi(Ri.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}gm._jsonSchemaVersion="firestore/vectorValue/1.0",gm._jsonSchema={type:us("string",gm._jsonSchemaVersion),vectorValues:us("object")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mm=/^__.*__$/;class ym{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new $u(e,this.data,this.fieldMask,t,this.fieldTransforms):new zu(e,this.data,t,this.fieldTransforms)}}class vm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new $u(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function wm(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ki(40011,{Ec:e})}}class bm{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.Ac(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new bm(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Rc({path:n,mc:!1});return r.fc(e),r}gc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Rc({path:n,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Lm(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(0===e.length)throw this.wc("Document fields must not be empty");if(wm(this.Ec)&&mm.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class Im{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||$f(e)}Dc(e,t,n,r=!1){return new bm({Ec:e,methodName:t,bc:n,path:ts.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function _m(e){const t=e._freezeSettings(),n=$f(e._databaseId);return new Im(e._databaseId,!!t.ignoreUndefinedProperties,n)}function Tm(e,t,n,r,i,s={}){const o=e.Dc(s.merge||s.mergeFields?2:0,t,n,i);xm("Data must be an object, but it was:",o,r);const a=Dm(r,o);let c,u;if(s.merge)c=new ma(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const e=[];for(const r of s.mergeFields){const i=Rm(t,r,n);if(!o.contains(i))throw new Oi(Ri.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);Mm(e,i)||e.push(i)}c=new ma(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new ym(new cc(a),c,u)}class Em extends fm{_toFieldTransform(e){if(2!==e.Ec)throw 1===e.Ec?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Em}}class Sm extends fm{_toFieldTransform(e){return new Ou(e.path,new Su)}isEqual(e){return e instanceof Sm}}function Cm(e,t,n,r){const i=e.Dc(1,t,n);xm("Data must be an object, but it was:",i,r);const s=[],o=cc.empty();ca(r,(e,r)=>{const a=Pm(t,e,n);r=R(r);const c=i.gc(a);if(r instanceof Em)s.push(a);else{const e=km(r,c);null!=e&&(s.push(a),o.set(a,e))}});const a=new ma(s);return new vm(o,a,i.fieldTransforms)}function Am(e,t,n,r,i,s){const o=e.Dc(1,t,n),a=[Rm(t,r,n)],c=[i];if(s.length%2!=0)throw new Oi(Ri.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<s.length;d+=2)a.push(Rm(t,s[d])),c.push(s[d+1]);const u=[],h=cc.empty();for(let d=a.length-1;d>=0;--d)if(!Mm(u,a[d])){const e=a[d];let t=c[d];t=R(t);const n=o.gc(e);if(t instanceof Em)u.push(e);else{const r=km(t,n);null!=r&&(u.push(e),h.set(e,r))}}const l=new ma(u);return new vm(h,l,o.fieldTransforms)}function km(e,t){if(Nm(e=R(e)))return xm("Unsupported field value:",t,e),Dm(e,t);if(e instanceof fm)return function(e,t){if(!wm(t.Ec))throw t.wc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.wc(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.mc&&4!==t.Ec)throw t.wc("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const i of e){let e=km(i,t.yc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=R(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return function(e,t){return Hs(t)?bu(t):wu(e,t)}(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=fs.fromDate(e);return{timestampValue:Th(t.serializer,n)}}if(e instanceof fs){const n=new fs(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:Th(t.serializer,n)}}if(e instanceof pm)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof lm)return{bytesValue:Eh(t.serializer,e._byteString)};if(e instanceof Xg){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.wc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Ah(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof gm)return n=e,r=t,{mapValue:{fields:{[Oa]:{stringValue:Ma},[Va]:{arrayValue:{values:n.toArray().map(e=>{if("number"!=typeof e)throw r.wc("VectorValues must only contain numeric values.");return wu(r.serializer,e)})}}}}};var n,r;throw t.wc(`Unsupported field value: ${as(e)}`)}(e,t)}function Dm(e,t){const n={};return ua(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):ca(e,(e,r)=>{const i=km(r,t.Vc(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function Nm(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof fs||e instanceof pm||e instanceof lm||e instanceof Xg||e instanceof fm||e instanceof gm)}function xm(e,t,n){if(!Nm(n)||!os(n)){const r=as(n);throw"an object"===r?t.wc(e+" a custom object"):t.wc(e+" "+r)}}function Rm(e,t,n){if((t=R(t))instanceof dm)return t._internalPath;if("string"==typeof t)return Pm(e,t);throw Lm("Field path arguments must be of type string or ",e,!1,void 0,n)}const Om=new RegExp("[~\\*/\\[\\]]");function Pm(e,t,n){if(t.search(Om)>=0)throw Lm(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new dm(...t.split("."))._internalPath}catch(r){throw Lm(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Lm(e,t,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new Oi(Ri.INVALID_ARGUMENT,a+e+c)}function Mm(e,t){return e.some(e=>e.isEqual(t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vm{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Xg(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new Fm(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Um("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class Fm extends Vm{data(){return super.data()}}function Um(e,t){return"string"==typeof t?Pm(e,t):t instanceof dm?t._internalPath:t._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jm(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Oi(Ri.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Bm{}class qm extends Bm{}function zm(e,t,...n){let r=[];t instanceof Bm&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof Km).length,n=e.filter(e=>e instanceof $m).length;if(t>1||t>0&&n>0)throw new Oi(Ri.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)e=i._apply(e);return e}class $m extends qm{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new $m(e,t,n)}_apply(e){const t=this._parse(e);return Xm(e._query,t),new Qg(e.firestore,e.converter,Xc(e._query,t))}_parse(e){const t=_m(e.firestore),n=function(e,t,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new Oi(Ri.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){Qm(o,s);const t=[];for(const n of o)t.push(Wm(r,e,n));a={arrayValue:{values:t}}}else a=Wm(r,e,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||Qm(o,s),a=function(e,t,n,r=!1){return km(n,e.Dc(r?4:3,t))}(n,t,o,"in"===s||"not-in"===s);return yc.create(i,s,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value);return n}}class Km extends Bm{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Km(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:vc.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const i of r)Xm(n,i),n=Xc(n,i)}(e._query,t),new Qg(e.firestore,e.converter,Xc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class Gm extends qm{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Gm(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Oi(Ri.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Oi(Ri.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new pc(t,n)}(e._query,this._field,this._direction);return new Qg(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new zc(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function Hm(e,t="asc"){const n=t,r=Um("orderBy",e);return Gm._create(r,n)}function Wm(e,t,n){if("string"==typeof(n=R(n))){if(""===n)throw new Oi(Ri.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Hc(t)&&-1!==n.indexOf("/"))throw new Oi(Ri.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(Zi.fromString(n));if(!ns.isDocumentKey(r))throw new Oi(Ri.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Wa(e,new ns(r))}if(n instanceof Xg)return Wa(e,n._key);throw new Oi(Ri.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${as(n)}.`)}function Qm(e,t){if(!Array.isArray(e)||0===e.length)throw new Oi(Ri.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Xm(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Oi(Ri.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Oi(Ri.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}class Jm{convertValue(e,t="none"){switch(Ua(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ia(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(_a(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ki(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return ca(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const i=null===(r=null===(n=null===(t=e.fields)||void 0===t?void 0:t[Va].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map(e=>Ia(e.doubleValue));return new gm(i)}convertGeoPoint(e){return new pm(Ia(e.latitude),Ia(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=ka(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Da(e));default:return null}}convertTimestamp(e){const t=ba(e);return new fs(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Zi.fromString(e);Ni(Xh(n),9688,{name:e});const r=new Ra(n.get(1),n.get(3)),i=new ns(n.popFirst(5));return r.isEqual(t)||Si(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ym(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class Zm extends Jm{constructor(e){super(),this.firestore=e}convertBytes(e){return new lm(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xg(this.firestore,null,t)}}class ey{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ty extends Vm{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ny(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Um("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Oi(Ri.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ty._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}ty._jsonSchemaVersion="firestore/documentSnapshot/1.0",ty._jsonSchema={type:us("string",ty._jsonSchemaVersion),bundleSource:us("string","DocumentSnapshot"),bundleName:us("string"),bundle:us("string")};class ny extends ty{data(e={}){return super.data(e)}}class ry{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new ey(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new ny(this._firestore,this._userDataWriter,n.key,n,new ey(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Oi(Ri.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new ny(e._firestore,e._userDataWriter,n.doc.key,n.doc,new ey(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new ny(e._firestore,e._userDataWriter,t.doc.key,t.doc,new ey(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),s=n.indexOf(t.doc.key)),{type:iy(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Oi(Ri.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ry._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=$i.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function iy(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ki(61501,{type:e})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sy(e){e=cs(e,Xg);const t=cs(e.firestore,im);return function(e,t,n={}){const r=new Pi;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new Lg({next:a=>{s.Ou(),t.enqueueAndForget(()=>Up(e,o));const c=a.docs.has(n);!c&&a.fromCache?i.reject(new Oi(Ri.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?i.reject(new Oi(Ri.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:e=>i.reject(e)}),o=new Kp(Kc(n.path),s,{includeMetadataChanges:!0,ka:!0});return Fp(e,o)}(await zg(e),e.asyncQueue,t,n,r)),r.promise}(om(t),e._key).then(n=>py(t,e,n))}ry._jsonSchemaVersion="firestore/querySnapshot/1.0",ry._jsonSchema={type:us("string",ry._jsonSchemaVersion),bundleSource:us("string","QuerySnapshot"),bundleName:us("string"),bundle:us("string")};class oy extends Jm{constructor(e){super(),this.firestore=e}convertBytes(e){return new lm(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xg(this.firestore,null,t)}}function ay(e){e=cs(e,Qg);const t=cs(e.firestore,im),n=om(t),r=new oy(t);return jm(e._query),function(e,t,n={}){const r=new Pi;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new Lg({next:n=>{s.Ou(),t.enqueueAndForget(()=>Up(e,o)),n.fromCache&&"server"===r.source?i.reject(new Oi(Ri.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),o=new Kp(n,s,{includeMetadataChanges:!0,ka:!0});return Fp(e,o)}(await zg(e),e.asyncQueue,t,n,r)),r.promise}(n,e._query).then(n=>new ry(t,r,e,n))}function cy(e,t,n){e=cs(e,Xg);const r=cs(e.firestore,im),i=Ym(e.converter,t,n);return fy(r,[Tm(_m(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,Lu.none())])}function uy(e,t,n,...r){e=cs(e,Xg);const i=cs(e.firestore,im),s=_m(i);let o;return o="string"==typeof(t=R(t))||t instanceof dm?Am(s,"updateDoc",e._key,t,n,r):Cm(s,"updateDoc",e._key,t),fy(i,[o.toMutation(e._key,Lu.exists(!0))])}function hy(e){return fy(cs(e.firestore,im),[new Wu(e._key,Lu.none())])}function ly(e,t){const n=cs(e.firestore,im),r=Zg(e),i=Ym(e.converter,t);return fy(n,[Tm(_m(e.firestore),"addDoc",r._key,i,null!==e.converter,{}).toMutation(r._key,Lu.exists(!1))]).then(()=>r)}function dy(e,...t){var n,r,i;e=R(e);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||rm(t[o])||(s=t[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(rm(t[o])){const e=t[o];t[o]=null===(n=e.next)||void 0===n?void 0:n.bind(e),t[o+1]=null===(r=e.error)||void 0===r?void 0:r.bind(e),t[o+2]=null===(i=e.complete)||void 0===i?void 0:i.bind(e)}let c,u,h;if(e instanceof Xg)u=cs(e.firestore,im),h=Kc(e._key.path),c={next:n=>{t[o]&&t[o](py(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=cs(e,Qg);u=cs(n.firestore,im),h=n._query;const r=new oy(u);c={next:e=>{t[o]&&t[o](new ry(u,r,n,e))},error:t[o+1],complete:t[o+2]},jm(e._query)}return function(e,t,n,r){const i=new Lg(r),s=new Kp(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>Fp(await zg(e),s)),()=>{i.Ou(),e.asyncQueue.enqueueAndForget(async()=>Up(await zg(e),s))}}(om(u),h,a,c)}function fy(e,t){return function(e,t){const n=new Pi;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n,r){const i=Dg(t);try{const e=await function(e,t){const n=xi(e),r=fs.now(),i=t.reduce((e,t)=>e.add(t.key),mu());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=au(),c=mu();return n.Os.getEntries(e,i).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(i=>{s=i;const o=[];for(const e of t){const t=Bu(e,s.get(e.key).overlayedDocument);null!=t&&o.push(new $u(e.key,t,uc(t.value.mapValue),Lu.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(s,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:hu(s)}))}(i.localStore,n);i.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Ru[e.currentUser.toKey()];r||(r=new ha(Ki)),r=r.insert(t,n),e.Ru[e.currentUser.toKey()]=r}(i,e.batchId,r),await yg(i,e.changes),await yp(i.remoteStore)}catch(e){const n=xp(e,"Failed to persist write");r.reject(n)}}(await function(e){return qg(e).then(e=>e.syncEngine)}(e),t,n)),n.promise}(om(e),t)}function py(e,t,n){const r=n.docs.get(t._key),i=new oy(e);return new ty(e,i,t._key,r,new ey(n.hasPendingWrites,n.fromCache),t.converter)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gy={maxAttempts:5};function my(e,t){if((e=R(e)).firestore!==t)throw new Oi(Ri.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=_m(e)}get(e){const t=my(e,this._firestore),n=new Zm(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return ki(24041);const r=e[0];if(r.isFoundDocument())return new Vm(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Vm(this._firestore,n,t._key,null,t.converter);throw ki(18433,{doc:r})})}set(e,t,n){const r=my(e,this._firestore),i=Ym(r.converter,t,n),s=Tm(this._dataReader,"Transaction.set",r._key,i,null!==r.converter,n);return this._transaction.set(r._key,s),this}update(e,t,n,...r){const i=my(e,this._firestore);let s;return s="string"==typeof(t=R(t))||t instanceof dm?Am(this._dataReader,"Transaction.update",i._key,t,n,r):Cm(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,s),this}delete(e){const t=my(e,this._firestore);return this._transaction.delete(t._key),this}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy extends yy{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=my(e,this._firestore),n=new oy(this._firestore);return super.get(e).then(e=>new ty(this._firestore,n,t._key,e._document,new ey(!1,!1),t.converter))}}function wy(e,t,n){e=cs(e,im);const r=Object.assign(Object.assign({},gy),n);return function(e){if(e.maxAttempts<1)throw new Oi(Ri.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(e,t,n){const r=new Pi;return e.asyncQueue.enqueueAndForget(async()=>{const i=await function(e){return qg(e).then(e=>e.datastore)}(e);new Vg(e.asyncQueue,i,n,t,r).zu()}),r.promise}(om(e),n=>t(new vy(e,n)),r)}function by(){return new Sm("serverTimestamp")}!function(e,t=!0){Ii=He,qe(new O("firestore",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new im(new Vi(e.getProvider("auth-internal")),new Bi(i,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Oi(Ri.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ra(e.options.projectId,t)}(i,n),i);return r=Object.assign({useFetchStreams:t},r),s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),Xe(vi,wi,e),Xe(vi,wi,"esm2017")}();export{Wn as A,zm as B,O as C,Hm as D,by as E,E as F,Un as G,He as S,fs as T,qe as _,$e as a,R as b,ze as c,u as d,g as e,We as f,Qe as g,sm as h,f as i,ii as j,um as k,cm as l,sy as m,Zg as n,Yg as o,p,dy as q,Xe as r,ay as s,wy as t,v as u,hy as v,uy as w,cy as x,ly as y,Hn as z};

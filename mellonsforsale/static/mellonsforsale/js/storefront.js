(()=>{"use strict";var e,t={76:(e,t,n)=>{n.d(t,{Z:()=>s});var a=n(294),r=n.n(a);class l extends r().Component{constructor(e){super(e),this.state={obj:e.item_object}}make_body_component(){const e=this.state.obj;return r().createElement("div",{className:"card-body"},r().createElement("strong",null," Description:  ")," ",e.description," ",r().createElement("br",null),r().createElement("strong",null," Location: ")," ",e.location," ",r().createElement("br",null),r().createElement("strong",null," Price: ")," ","$",e.price," ",r().createElement("br",null),r().createElement("strong",null," Seller: ")," ",r().createElement("a",{href:e.seller_id}," ",e.seller_name," ")," ",r().createElement("br",null))}make_deletable_component(){const e=this.state.obj,t=r().createElement("button",null,e.delete_text);return t.onclick=()=>{var e;e=this.state.obj.id,confirm("Confirm to delete this item?")&&$.ajax({url:"/delete_item/"+e,data:{csrfmiddlewaretoken:getCSRFToken()},type:"POST",dataType:"json"}).done(e=>{""==e?(console.log("Successful item deletion!"),update()):(alert("Error occurred."),console.log(e))}).fail(ajaxFailure)},e.deletable?t:r().createElement("a",null)}render(){const e=this.props.item_object,t=this.make_body_component(),n=this.make_deletable_component();return r().createElement("div",{id:e.id,className:"card"},r().createElement("div",{className:"card-title"},r().createElement("strong",null,"Name:",e.name)),t,r().createElement("div",{className:"card-footer"},n))}}const s=l},3:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(294),r=n.n(a),l=n(755),s=n.n(l),o=n(561),i=n(76);class c extends r().Component{constructor(e){super(e),this.state={obj:e.item_object,item:new i.Z(e)}}make_body_component(){return this.state.item.make_body_component()}make_deletable_component(){return this.state.item.make_deletable_component()}make_interest_component(){const e=this.state.obj;let t;return t=e.me_interested?"star_yellow":"star",r().createElement("div",null,r().createElement("button",{id:t,onClick:()=>this.handleClick(e.id)},r().createElement("strong",null," Interested ☆ ")))}handleClick(e){s().ajax({url:"/item-interest/"+e,data:{csrfmiddlewaretoken:(0,o.m5)()},type:"POST",dataType:"json"}).done(t=>{""==t?"star"==s()(`#${e} button`)[0].id?s()(`#${e} button`)[0].id="star_yellow":s()(`#${e} button`)[0].id="star":(t=JSON.parse(t),console.log("An error occurred. "+t.message))}).fail(o.t1)}render(){const e=this.state.obj,t=this.make_body_component(),n=this.make_interest_component(),a=this.make_deletable_component();return r().createElement("div",{id:e.id,className:"card"},r().createElement("div",{className:"card-title"},r().createElement("strong",null,"Name:",e.name)),t,r().createElement("div",{className:"card-footer"},a,n))}}const m=c},163:(e,t,n)=>{var a=n(935),r=n.n(a),l=n(294),s=n.n(l),o=n(755),i=n.n(o),c=n(561),m=n(3);class d extends s().Component{constructor(e){super(e),this.state={obj:e.item_object,item:new m.Z(e)}}make_body_component(){return this.state.item.make_body_component()}make_deletable_component(){return this.state.item.make_deletable_component()}make_interest_component(){return this.state.item.make_interest_component()}render(){const e=this.state.obj,t=this.make_body_component(),n=this.make_interest_component();return s().createElement("div",{id:e.id,className:"card"},s().createElement("span",{className:"card-title centered-content"},s().createElement("strong",null,"Name:",e.name)),t,s().createElement("div",{className:"card-footer"},n))}}const u=d;class p extends s().Component{constructor(e){super(e),this.state={items:[],queryLabels:[]}}componentDidMount(){this.update(),this.interval=setInterval(()=>{console.log("Update at "+(new Date).toISOString()),this.state.queryLabels.length>0?this.updateWithQueryLabels(this.state.queryLabels):this.update()},3e4)}componentWillUnmount(){clearInterval(this.interval)}update(){i().ajax({url:"/get-storefront-listing",data:{csrfmiddlewaretoken:(0,c.m5)()},type:"GET",dataType:"json"}).done(e=>{const t=e.items;this.setState({items:t})}).fail(c.t1)}updateWithQueryLabels(e){0==e.length?this.update():i().ajax({url:"/filter-item-listing",data:{query_labels:JSON.stringify(e),csrfmiddlewaretoken:(0,c.m5)(),user_lng:void 0,user_lat:void 0},type:"GET",dataType:"json"}).done(t=>{this.setState({items:t,queryLabels:e})}).fail(c.t1)}render(){const e=[];if(this.state.items.length>0)for(let t=0;t<this.state.items.length;t++){const n=this.state.items[t];e.push(s().createElement(u,{key:n.id.toString(),item_object:n}))}else e.push(s().createElement("p",{key:"none"},"Currently, no one else has items up for sale."));return s().createElement("div",{id:"item_listing"},s().createElement("h4",null,"Item Listing"),e)}}const h=p;class _ extends s().Component{constructor(e){super(e),this.state={obj:e.category_list_object}}render(){const{obj:e}=this.state;return s().createElement("div",{className:"category"},s().createElement("h5",null,e.category),e.labels.map(e=>s().createElement("div",{className:"label",key:e.id,"data-label":e.id},s().createElement("input",{type:"checkbox"}),s().createElement("span",null,e.name))))}}const b=_;class f extends s().Component{constructor(e){super(e),this.state={filter_list:[],location_value:0}}componentDidMount(){this.update()}update(){$.ajax({url:"/get-filter-listing",data:{csrfmiddlewaretoken:(0,c.m5)()},type:"GET",dataType:"json"}).done(e=>{const t=e.categories;this.setState({filter_list:t})}).fail(c.t1)}handleChange(e){this.setState({location_value:e.target.value})}render(){return s().createElement("form",{id:"filter_list"},s().createElement("h4",null,"Filters"),this.state.filter_list.map(e=>s().createElement(b,{key:e.id,category_list_object:e})),s().createElement("span",null," Within (x) distance from my location (km): "),s().createElement("span",null,s().createElement("input",{id:"id_location_input",type:"number",value:this.state.location_value,onChange:e=>this.handleChange(e)})),s().createElement("input",{type:"hidden",name:"csrfmiddlewaretoken",value:(0,c.m5)()}),s().createElement("div",null,s().createElement("button",{id:"id_filter_submit"},"Submit")))}}const g=f;i()(document).ready(()=>{r().render(s().createElement(g,null),document.getElementById("storefront_filter_list"));const e=r().render(s().createElement(h,null),document.getElementById("storefront_item_listing"));i()("#id_filter_submit").on("click",t=>{t.preventDefault();const n=new Array,a=document.getElementById("filter_list").getElementsByClassName("category");for(let e=0;e<a.length;e++){const t=a[e].getElementsByClassName("label");for(let e=0;e<t.length;e++){const a=t[e].getAttribute("data-label");if(null==a)return void(0,c.dT)("Label has no value.");const r=parseInt(a);if(isNaN(r))return void(0,c.dT)("Attempted to pass non-integer data to the server.");t[e].getElementsByTagName("input")[0].checked&&n.push(["key",r])}}const r=document.getElementById("id_location_input");if(null!=r){const e=parseFloat(r.value);if(0==e)n.push(["distance",1e3]);else{if(isNaN(e)||!(e>0))return void alert("Filter distance value in not a positive number! Try again.");if(e>1e6)return void alert("Filter distance value too large! Try again.");n.push(["distance",e])}}e.updateWithQueryLabels(n)})})}},n={};function a(e){if(n[e])return n[e].exports;var r=n[e]={exports:{}};return t[e].call(r.exports,r,r.exports,a),r.exports}a.m=t,a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},a.l=(t,n,r)=>{if(e[t])e[t].push(n);else{var l,s;if(void 0!==r)for(var o=document.getElementsByTagName("script"),i=0;i<o.length;i++){var c=o[i];if(c.getAttribute("src")==t||c.getAttribute("data-webpack")=="mellonsforsale:"+r){l=c;break}}l||(s=!0,(l=document.createElement("script")).charset="utf-8",l.timeout=120,a.nc&&l.setAttribute("nonce",a.nc),l.setAttribute("data-webpack","mellonsforsale:"+r),l.src=t),e[t]=[n];var m=n=>{m=()=>{},l.onerror=l.onload=null,clearTimeout(d);var a=e[t];delete e[t],l.parentNode.removeChild(l),a&&a.forEach(e=>e(n))},d=setTimeout(()=>{m({type:"timeout",target:l})},12e4);l.onerror=l.onload=m,s&&document.head.appendChild(l)}},(()=>{var e={959:0},t=[[163,325]],n=()=>{};function r(){for(var n,r=0;r<t.length;r++){for(var l=t[r],s=!0,o=1;o<l.length;o++){var i=l[o];0!==e[i]&&(s=!1)}s&&(t.splice(r--,1),n=a(a.s=l[0]))}return 0===t.length&&(a.x(),a.x=()=>{}),n}function l(r){for(var l,s,o=r[0],c=r[1],m=r[2],d=r[3],u=0,p=[];u<o.length;u++)s=o[u],a.o(e,s)&&e[s]&&p.push(e[s][0]),e[s]=0;for(l in c)a.o(c,l)&&(a.m[l]=c[l]);for(d&&d(a),i&&i(r);p.length;)p.shift()();return m&&t.push.apply(t,m),n()}a.x=()=>{a.x=()=>{},s=s.slice();for(var e=0;e<s.length;e++)l(s[e]);return(n=r)()};var s=window.webpackJsonpmellonsforsale=window.webpackJsonpmellonsforsale||[],o=s.push.bind(s);s.push=l;var i=o})(),a.x()})();
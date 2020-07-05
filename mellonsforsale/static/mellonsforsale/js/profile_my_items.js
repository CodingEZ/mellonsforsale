(()=>{"use strict";var e,t={796:(e,t,n)=>{var a=n(935),l=n.n(a),r=n(294),s=n.n(r),i=n(755),o=n.n(i),c=n(561);class d extends s().Component{constructor(e){super(e),this.state={obj:e.item_object,update:e.update,info_is_updated:!1,last_update:new Date}}componentDidMount(){this.interval=setInterval(()=>{const e=new Date;if(this.state.info_is_updated&&e-this.state.last_update>2e3){this.setState({info_is_updated:!1,last_update:e});!function(e){o().ajax({url:"/edit_item/"+e,data:{name:document.getElementById("name_"+e).value,description:document.getElementById("description_"+e).value,state:document.getElementById("state_"+e).value,city:document.getElementById("city_"+e).value,street:document.getElementById("street_"+e).value,zip:document.getElementById("zip_"+e).value,price:document.getElementById("price_"+e).value.replace(/[^0-9.]/g,""),csrfmiddlewaretoken:(0,c.m5)()},type:"POST",dataType:"json"}).done(e=>{""==e?(console.log("Successful update!"),o()("#update")[0].innerHTML="<a> Updated ! </a> <br/>",setTimeout(()=>{o()("#update")[0].innerHTML=""},1e3)):(e=JSON.parse(e),console.log("Error occurred during update. "+e.message))}).fail(c.t1)}(this.state.obj.id)}},1e3)}componentWillUnmount(){clearInterval(this.interval)}handleChange(e,t){switch(e){case"name":this.state.obj.name=t.target.value;break;case"description":this.state.obj.description=t.target.value;break;case"street":this.state.obj.street=t.target.value;break;case"city":this.state.obj.city=t.target.value;break;case"state":this.state.obj.state=t.target.value;break;case"zip":this.state.obj.zip=t.target.value;break;case"price":this.state.obj.price=t.target.value;break;default:throw"No case for label. Potential new field not added to React UI."}this.setState({info_is_updated:!0,obj:this.state.obj})}addNames(){const e=this.props.item_object,t=[];if(e.interested_users.length>0)for(let n=0;n<e.interested_users.length;n++){const a=e.interested_users[n],l=s().createElement("div",{key:`item_${e.id}_user_${a.id}`},s().createElement("a",{href:a.link},a.name));t.push(l)}else t.push(s().createElement("div",{key:`item_${e.id}_user_none`},s().createElement("a",null," No one has indicated interest for this item ")));return t}delete(){if(confirm("Confirm to delete this item?")){const{id:e}=this.state.obj,{update:t}=this.state;o().ajax({url:"/delete_item/"+e,data:{csrfmiddlewaretoken:(0,c.m5)()},type:"POST",dataType:"json"}).done(e=>{""==e?(console.log("Successful item deletion!"),t()):(alert("Error occurred."),console.log(e))}).fail(c.t1)}}render(){const{obj:e}=this.state;return e.deletable?s().createElement("div",{className:"card"},s().createElement("div",{className:"card-title centered-content"},s().createElement("strong",null," Name: "),s().createElement("input",{id:"name_"+e.id,type:"text",value:e.name,onChange:e=>this.handleChange("name",e)})),s().createElement("div",{className:"card-body"},s().createElement("div",{className:"form-section"},s().createElement("div",null,s().createElement("strong",null," Description: ")),s().createElement("div",null,s().createElement("input",{id:"description_"+e.id,type:"text",value:e.description,onChange:e=>this.handleChange("description",e)}))),s().createElement("div",{className:"form-section"},s().createElement("div",null," ",s().createElement("strong",null," Location: ")," "),s().createElement("div",null,s().createElement("label",{id:"location",htmlFor:"street"},"Street: ")),s().createElement("div",null,s().createElement("input",{name:"street",id:"street_"+e.id,type:"text",value:e.street,onChange:e=>this.handleChange("street",e)})),s().createElement("div",null,s().createElement("label",{id:"location",htmlFor:"city"},"City: ")),s().createElement("div",null,s().createElement("input",{name:"city",id:"city_"+e.id,type:"text",value:e.city,onChange:e=>this.handleChange("city",e)})),s().createElement("div",null,s().createElement("label",{id:"location",htmlFor:"state"},"State :  ")),s().createElement("div",null,s().createElement("input",{name:"state",id:"state_"+e.id,type:"text",value:e.state,onChange:e=>this.handleChange("state",e)})),s().createElement("div",null,s().createElement("label",{id:"location",htmlFor:"zip"},"Zip : ")),s().createElement("div",null,s().createElement("input",{name:"zip",id:"zip_"+e.id,type:"text",value:e.zip,onChange:e=>this.handleChange("zip",e)}))),s().createElement("div",{className:"form-section"},s().createElement("div",null,s().createElement("strong",null," Price ($): ")),s().createElement("div",null,s().createElement("input",{id:"price_"+e.id,type:"text",value:e.price,onChange:e=>this.handleChange("price",e)}))),s().createElement("div",{className:"form-section"},s().createElement("div",null," ",s().createElement("strong",null," Seller: ")," ",s().createElement("a",{href:e.seller_id}," ",e.seller_name," ")," "),s().createElement("div",null," ",s().createElement("strong",null," Interested: ")," ",this.addNames()," "))),s().createElement("div",{className:"card-footer"},s().createElement("button",{id:"delete_"+e.id,className:"item-delete",onClick:()=>{this.delete()}},e.delete_text))):s().createElement("div",{id:"item"+e.id,className:"card"},s().createElement("div",{className:"card-title"},s().createElement("strong",null,"Name:",e.name)),s().createElement("div",{className:"card-body"},s().createElement("strong",null," Description:  ")," ",e.description," ",s().createElement("br",null),s().createElement("strong",null," Location: ")," ",e.location," ",s().createElement("br",null),s().createElement("strong",null," Price: ")," ",e.price," ",s().createElement("br",null),s().createElement("strong",null," Seller: ")," ",s().createElement("a",{href:e.seller_id}," ",e.seller_name," ")," ",s().createElement("br",null),s().createElement("strong",null," Interested: ")," ",this.addNames()," ",s().createElement("br",null)),s().createElement("div",{className:"card-footer"},s().createElement("a",null)))}}class m extends s().Component{constructor(e){super(e),this.state={first_name:e.first_name,last_name:e.last_name,username:e.username,items:[]}}componentDidMount(){this.update(),this.interval=setInterval(()=>{console.log("Update at "+(new Date).toISOString()),this.update()},1e4)}componentWillUnmount(){clearInterval(this.interval)}update(){o().ajax({url:"/get-item-listing",data:{include_username:this.state.username,destroyable:!0,csrfmiddlewaretoken:(0,c.m5)()},type:"GET",dataType:"json"}).done(e=>{this.setState({items:e}),console.log("Successful own listing initialization!")}).fail(c.t1)}render(){const e=[];if(this.state.items.length>0)for(let t=0;t<this.state.items.length;){const n=this.state.items[t];e.push(s().createElement(d,{key:n.id.toString(),item_object:n,update:this.update.bind(this)}))}else e.push(s().createElement("p",{key:"none"},"Currently has no items up for sale."));return s().createElement("div",{id:"item_listing"},s().createElement("h4",null,"Items owned by",`${this.state.first_name} ${this.state.last_name}`),s().createElement("div",{id:"update",className:"centered-content"}),e)}}class u extends s().Component{constructor(e){super(e),this.state={obj:e.item_object}}addNames(){const e=this.props.item_object,t=[];if(e.interested_users.length>0)for(let n=0;n<e.interested_users.length;n++){const a=e.interested_users[n],l=s().createElement("div",{key:`item_${e.id}_user_${a.id}`},s().createElement("a",{href:a.link},a.name));t.push(l)}else t.push(s().createElement("div",{key:`item_${e.id}_user_none`},s().createElement("a",null," No one has indicated interest for this item ")));return t}handleClick(e){o().ajax({url:"/interested/"+e,data:{csrfmiddlewaretoken:(0,c.m5)()},type:"POST",dataType:"json"}).done(t=>{""==t?"star"==o()(`#${e} button`)[0].id?o()(`#${e} button`)[0].id="star_yellow":o()(`#${e} button`)[0].id="star":(t=JSON.parse(t),console.log("An error occurred. "+t.message))}).fail(c.t1)}render(){const e=this.props.item_object,t=s().createElement("div",{className:"card-body"},s().createElement("strong",null," Description:  ")," ",e.description," ",s().createElement("br",null),s().createElement("strong",null," Location: ")," ",e.location," ",s().createElement("br",null),s().createElement("strong",null," Price: ")," ","$",e.price," ",s().createElement("br",null),s().createElement("strong",null," Seller: ")," ",s().createElement("a",{href:e.seller_id}," ",e.seller_name," ")," ",s().createElement("br",null),s().createElement("strong",null," Interested: ")," ",this.addNames()," ",s().createElement("br",null));let n;n=e.me_interested?"star_yellow":"star";const a=s().createElement("div",null,s().createElement("button",{id:n,onClick:()=>this.handleClick(e.id)},s().createElement("strong",null," Interested ☆ ")));let l;return l=e.deletable?s().createElement("a",{id:"delete",href:e.delete_url}," ",e.delete_text," "):s().createElement("a",null),s().createElement("div",{id:e.id,className:"card"},s().createElement("div",{className:"card-title"},s().createElement("strong",null,"Name:",e.name)),t,s().createElement("div",{className:"card-footer"},l,a))}}class p extends s().Component{constructor(e){super(e),this.state={first_name:e.first_name,last_name:e.last_name,username:e.username,items:[]}}componentDidMount(){this.update()}update(){o().ajax({url:"/get-item-listing",data:{interest_username:this.state.username,destroyable:!1,csrfmiddlewaretoken:(0,c.m5)()},type:"GET",dataType:"json"}).done(e=>{this.setState({items:e}),console.log("Successful interest listing initialization!")}).fail(c.t1)}render(){const e=[];if(this.state.items.length>0)for(let t=0;t<this.state.items.length;){const n=this.state.items[t];e.push(s().createElement(u,{key:n.id.toString(),item_object:n}))}else e.push(s().createElement("p",{key:"none"},"Currently not interested in any items."));return s().createElement("div",{id:"item_listing"},s().createElement("h4",null,"Items of expressed interested from",`${this.state.first_name} ${this.state.last_name}`),e)}}o()(document).ready(()=>{l().render(s().createElement(m,null),document.getElementById("profile_items")),l().render(s().createElement(p,null),document.getElementById("interest_items"))})}},n={};function a(e){if(n[e])return n[e].exports;var l=n[e]={exports:{}};return t[e].call(l.exports,l,l.exports,a),l.exports}a.m=t,a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},a.l=(t,n,l)=>{if(e[t])e[t].push(n);else{var r,s;if(void 0!==l)for(var i=document.getElementsByTagName("script"),o=0;o<i.length;o++){var c=i[o];if(c.getAttribute("src")==t||c.getAttribute("data-webpack")=="mellonsforsale:"+l){r=c;break}}r||(s=!0,(r=document.createElement("script")).charset="utf-8",r.timeout=120,a.nc&&r.setAttribute("nonce",a.nc),r.setAttribute("data-webpack","mellonsforsale:"+l),r.src=t),e[t]=[n];var d=n=>{d=()=>{},r.onerror=r.onload=null,clearTimeout(m);var a=e[t];delete e[t],r.parentNode.removeChild(r),a&&a.forEach(e=>e(n))},m=setTimeout(()=>{d({type:"timeout",target:r})},12e4);r.onerror=r.onload=d,s&&document.head.appendChild(r)}},(()=>{var e={586:0},t=[[796,325]],n=()=>{};function l(){for(var n,l=0;l<t.length;l++){for(var r=t[l],s=!0,i=1;i<r.length;i++){var o=r[i];0!==e[o]&&(s=!1)}s&&(t.splice(l--,1),n=a(a.s=r[0]))}return 0===t.length&&(a.x(),a.x=()=>{}),n}function r(l){for(var r,s,i=l[0],c=l[1],d=l[2],m=l[3],u=0,p=[];u<i.length;u++)s=i[u],a.o(e,s)&&e[s]&&p.push(e[s][0]),e[s]=0;for(r in c)a.o(c,r)&&(a.m[r]=c[r]);for(m&&m(a),o&&o(l);p.length;)p.shift()();return d&&t.push.apply(t,d),n()}a.x=()=>{a.x=()=>{},s=s.slice();for(var e=0;e<s.length;e++)r(s[e]);return(n=l)()};var s=window.webpackJsonpmellonsforsale=window.webpackJsonpmellonsforsale||[],i=s.push.bind(s);s.push=r;var o=i})(),a.x()})();
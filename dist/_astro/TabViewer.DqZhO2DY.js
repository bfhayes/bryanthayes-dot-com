import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as m,R as S}from"./index.DtoOFyvK.js";const z=({tabs:f,title:x,tuning:L="E A D G B E",capo:T="no capo",tempo:b,songKey:v})=>{const[j,w]=m.useState(!1),[h,N]=m.useState(!1),[R,k]=m.useState(0),[u,y]=m.useState(parseInt(b?.replace(" BPM","")||"120")),M=m.useRef(null),c=m.useRef(null),E=()=>{document.fullscreenElement?(document.exitFullscreen(),w(!1)):(M.current?.requestFullscreen(),w(!0))},D=()=>{if(c.current)return;N(!0);const n=6e4/u;c.current=setInterval(()=>{k(o=>{const s=g.reduce((t,r)=>t+(r.measures?.length||0),0),l=o+1;return l>=s*4?(C(),0):l})},n)},C=()=>{c.current&&(clearInterval(c.current),c.current=null),N(!1),k(0)},G=()=>{h?C():D()};m.useEffect(()=>()=>{c.current&&clearInterval(c.current)},[]);const P=n=>{const o=n.trim().split(`
`),s=[];let l=null,t=[];for(let r=0;r<o.length;r++){const a=o[r].trim();if(!a)continue;if(a.startsWith("[")&&a.endsWith("]")){t.length>0&&(l&&s.push({header:l,measures:p(t)}),t=[]),l=a;continue}/^[eEbBgGdDaAT]\s*[\|\-\[]/.test(a)?(t.push(a),(t.length===6||t.length===4&&a.startsWith("G"))&&(l||(l=""),s.push({header:l,measures:p(t)}),t=[],l=null)):a&&!a.startsWith("[")&&(t.length>0&&(l&&s.push({header:l,measures:p(t)}),t=[],l=null),s.push({header:"",text:a}))}return t.length>0&&s.push({header:l||"",measures:p(t)}),s},p=n=>{if(n.length===0)return[];const o=[],s=n.map(r=>r.replace(/^[eEbBgGdDaAT]\s*[\|\-\[]/,"").split("|").map(i=>i.trim())),l=Math.max(...s.map(r=>r.length));let t=0;for(let r=0;r<l;r++)for(let a=0;a<s.length;a++){const i=s[a][r]||"";t=Math.max(t,i.length)}for(let r=0;r<l;r++){const a={strings:s.map(i=>{let d=i[r]||"";for(;d.length<t;)d+="-";return d.split("").map(B=>B==="-"?"":B)})};a.strings.some(i=>i.some(d=>d!==""))&&o.push(a)}return o},g=P(f);return e.jsxs("div",{className:"tab-viewer bg-white rounded-lg shadow-md overflow-hidden",children:[e.jsx("div",{className:"bg-gray-900 text-white p-4",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{children:[x&&e.jsx("h3",{className:"text-xl font-bold mb-2",children:x}),e.jsxs("div",{className:"flex flex-wrap gap-4 text-sm",children:[e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:"font-semibold mr-1",children:"Tuning:"})," ",L]}),v&&e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:"font-semibold mr-1",children:"Key:"})," ",v]}),e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:"font-semibold mr-1",children:"Capo:"})," ",T]}),b&&e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:"font-semibold mr-1",children:"Tempo:"})," ",b]})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:G,className:"p-2 hover:bg-gray-800 rounded transition-colors",title:h?"Stop playback":"Start playback",children:h?e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M6 4h4v16H6V4zm8 0h4v16h-4V4z"})}):e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})})}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("button",{onClick:()=>y(Math.max(40,u-10)),className:"px-2 py-1 hover:bg-gray-800 rounded transition-colors",title:"Decrease tempo",children:"-"}),e.jsxs("span",{className:"min-w-[60px] text-center",children:[u," BPM"]}),e.jsx("button",{onClick:()=>y(Math.min(200,u+10)),className:"px-2 py-1 hover:bg-gray-800 rounded transition-colors",title:"Increase tempo",children:"+"})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:E,className:"p-2 hover:bg-gray-800 rounded transition-colors",title:"Toggle fullscreen",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:j?e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 9V5H5m0 4h4m6-4h4v4m0-4h-4m-6 10v4h4m-4-4h4m6 4h4v-4m-4 0h4"}):e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5"})})}),e.jsx("button",{onClick:()=>{const n=new Blob([f],{type:"text/plain"}),o=URL.createObjectURL(n),s=document.createElement("a");s.href=o,s.download=`${x||"tabs"}.txt`,s.click(),URL.revokeObjectURL(o)},className:"p-2 hover:bg-gray-800 rounded transition-colors",title:"Download tabs",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})})]})]})]})}),e.jsx("div",{ref:M,className:`p-4 lg:p-6 overflow-x-auto bg-gray-50 ${j?"fullscreen-tabs":""}`,children:e.jsx("div",{className:"tab-grid-content",children:g.map((n,o)=>e.jsxs("div",{className:"mb-8",children:[n.header&&e.jsx("h4",{className:"text-base font-bold text-gray-700 mb-3",children:n.header}),n.text&&e.jsx("p",{className:"text-xs text-gray-600 italic mb-3",children:n.text}),n.measures&&e.jsx("div",{className:"tab-grid-wrapper overflow-x-auto",children:e.jsx("table",{className:"tab-grid",children:e.jsx("tbody",{children:[0,1,2,3,4,5].map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"string-label",children:["e","B","G","D","A","E"][s]}),n.measures.map((l,t)=>{let r=0;for(let i=0;i<o;i++)r+=g[i].measures?.length||0;r+=t;const a=h&&Math.floor(R/4)===r;return e.jsxs(S.Fragment,{children:[e.jsx("td",{className:"measure-separator",children:"|"}),l.strings[s]?.map((i,d)=>e.jsx("td",{className:`tab-cell ${a?"current-measure":""}`,children:i||"-"},d))||e.jsx("td",{className:`tab-cell ${a?"current-measure":""}`,children:"-"})]},t)}),e.jsx("td",{className:"measure-separator",children:"|"})]},s))})})})]},o))})}),e.jsx("style",{children:`
        .tab-viewer.fullscreen-tabs {
          padding: 2rem;
          height: 100vh;
          overflow-y: auto;
        }
        
        .tab-viewer .tab-grid {
          border-collapse: collapse;
          font-family: 'Courier New', Courier, monospace;
          font-size: 14px;
          background: white;
        }
        
        .tab-viewer .tab-grid td {
          padding: 2px 4px;
          height: 24px;
          vertical-align: middle;
          text-align: center;
        }
        
        .tab-viewer .string-label {
          font-weight: bold;
          color: #4b5563;
          padding-right: 8px !important;
          text-align: right !important;
          border-right: 2px solid #000;
        }
        
        .tab-viewer .measure-separator {
          padding: 0 2px !important;
          color: #000;
          font-weight: normal;
        }
        
        .tab-viewer .tab-cell {
          min-width: 20px;
          border-top: 1px solid #d1d5db;
          border-bottom: 1px solid #d1d5db;
        }
        
        .tab-viewer .tab-grid tr:first-child .tab-cell {
          border-top: 2px solid #000;
        }
        
        .tab-viewer .tab-grid tr:last-child .tab-cell {
          border-bottom: 2px solid #000;
        }
        
        .tab-viewer .current-measure {
          background-color: #fbbf24 !important;
          color: #000 !important;
          font-weight: bold;
        }
        
        @media (max-width: 640px) {
          .tab-viewer .tab-grid {
            font-size: 11px;
          }
          
          .tab-viewer .tab-cell {
            min-width: 16px;
            padding: 1px 2px;
          }
        }
      `})]})};export{z as default};

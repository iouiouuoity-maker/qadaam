// Жаңа QADAM Worker жарияланған соң URL-ін тек осы жерге енгізіңіз.
const AI_API_URL = "ЖАҢА_CLOUDFLARE_WORKER_URL";
window.askQadamAI = async function(messages) {
 if(!AI_API_URL.startsWith('https://')) throw new Error('AI көмекші әзірге қолжетімсіз. Есептер мен зертханалар жұмыс істеп тұр.');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),40000);
 try{const response=await fetch(AI_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.slice(-6)}),signal:controller.signal});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'AI уақытша жауап бере алмады.');if(typeof data.answer!=='string')throw new Error('Жауап алынбады. Кейінірек қайталап көр.');return data.answer;}catch(e){if(e.name==='AbortError')throw new Error('Жауап күту уақыты аяқталды. Кейінірек қайталап көр.');throw e;}finally{clearTimeout(timeout)}
};

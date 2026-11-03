// Netlify server-side OpenAI TTS proxy. Set OPENAI_API_KEY in Netlify environment variables.
exports.handler = async event => {
  if(event.httpMethod !== 'POST') return {statusCode:405,headers:{Allow:'POST'},body:'Method not allowed'};
  const key=process.env.OPENAI_API_KEY;
  if(!key) return {statusCode:503,body:'Voice provider not configured'};
  const origin=event.headers.origin;
  const site=event.headers.host;
  if(origin){try{if(new URL(origin).host!==site)return {statusCode:403,body:'Origin not allowed'};}catch{return {statusCode:403,body:'Origin not allowed'};}}
  let data;
  try{data=JSON.parse(event.body||'{}');}catch{return {statusCode:400,body:'Invalid JSON'};}
  const text=data.text,language=data.language;
  if(typeof text!=='string'||!text.trim()||text.length>4000||!['en-US','fr-FR','tr-TR'].includes(language))return {statusCode:400,body:'Invalid voice request'};
  try {
    const response=await fetch('https://api.openai.com/v1/audio/speech',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({model:'tts-1',voice:'nova',input:text,response_format:'mp3',speed:1})
    });
    if(!response.ok)return {statusCode:502,body:'Speech provider unavailable'};
    const buffer=Buffer.from(await response.arrayBuffer());
    return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':'audio/mpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:buffer.toString('base64')};
  }catch{return {statusCode:502,body:'Speech provider unavailable'};}
};

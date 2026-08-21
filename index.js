import { Redis } from "@upstash/redis";

const sample = {
  groups: [
    {title:"OWNERS",color:"#C084FC",members:[["pow","Lead builder of the fictional network.","p",""],["lusid","Systems designer and UI architect.","l",""]]},
    {title:"CO OWNERS",color:"#A855F7",members:[["Mako","Creative director and motion designer.","M",""],["Astra","Frontend engineer and visual designer.","A",""]]},
    {title:"ADMINS",color:"#60A5FA",members:[["Pixel","Keeps the database organized.","P",""],["Echo","Animation and interaction specialist.","E",""],["Vex","Testing and accessibility.","V",""],["Rin","UI component maintainer.","R",""]]},
    {title:"CREATORS",color:"#A855F7",members:[["Lumi","Illustration and avatar art.","L",""],["Kairo","Motion graphics and effects.","K",""],["Sora","Typography and layout.","S",""]]},
    {title:"SKID",color:"#C084FC",members:[["Katana","Fictional profile for demonstration.","K",""],["Quill","Fictional profile for demonstration.","Q",""],["Roxy","Fictional profile for demonstration.","R",""],["Vexel","Fictional profile for demonstration.","V",""]]},
    {title:"LARP",color:"#FFFFFF",members:[["Redshift","Fictional profile for demonstration.","R",""],["Neon","Fictional profile for demonstration.","N",""],["Static","Fictional profile for demonstration.","S",""],["Glitch","Fictional profile for demonstration.","G",""],["Byte","Fictional profile for demonstration.","B",""]]}
  ]
};
function db(){return Redis.fromEnv();}
async function getData(){ try { const x=await db().get("roster"); return x || sample; } catch(e){ return sample; } }
export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(req.method==="GET") return res.status(200).json(await getData());
  if(req.method==="POST"){
    const secret=req.headers["x-roster-admin-key"];
    if(!process.env.ROSTER_ADMIN_KEY || secret!==process.env.ROSTER_ADMIN_KEY) return res.status(401).json({error:"Unauthorized"});
    await db().set("roster",req.body);
    return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:"Method not allowed"});
}

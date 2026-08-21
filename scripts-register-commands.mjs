const app=process.env.DISCORD_APPLICATION_ID, token=process.env.DISCORD_BOT_TOKEN, guild=process.env.DISCORD_GUILD_ID;
const commands=[
{name:"addperson",description:"Add a person to the roster",options:[
{type:3,name:"name",description:"Name",required:true},{type:3,name:"role",description:"Category/role",required:true},{type:3,name:"description",description:"Description",required:true},{type:11,name:"pfp",description:"Profile picture",required:false}]},
{name:"removeperson",description:"Remove a person",options:[{type:3,name:"name",description:"Name",required:true}]},
{name:"update",description:"Update a person",options:[{type:3,name:"name",description:"Current name",required:true},{type:3,name:"role",description:"New category",required:false},{type:3,name:"description",description:"New description",required:false},{type:11,name:"pfp",description:"New profile picture",required:false}]},
{name:"giveperms",description:"Give roster manager permission",options:[{type:6,name:"user",description:"User",required:true}]},
{name:"removeperms",description:"Remove roster manager permission",options:[{type:6,name:"user",description:"User",required:true}]},
{name:"info",description:"Show bot information"},{name:"lol",description:"lol"}];
const r=await fetch(`https://discord.com/api/v10/applications/${app}/guilds/${guild}/commands`,{method:"PUT",headers:{Authorization:`Bot ${token}`,"Content-Type":"application/json"},body:JSON.stringify(commands)});
console.log(await r.text());
if(!r.ok)process.exit(1);

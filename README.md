# POWPOW Roster + Discord Bot

This package keeps your existing static roster site and adds a Discord slash-command API.

## Commands
- `/addperson name role description pfp` — adds a profile and optional attached image.
- `/removeperson name` — removes a profile.
- `/update name role description pfp` — updates a profile.
- `/giveperms user` — gives roster-manager permission.
- `/removeperms user` — removes it.
- `/info`
- `/lol`

The website reads `/api/roster`, so Discord changes appear on the Vercel site after refresh.

## Vercel environment variables
Add these in Project Settings → Environment Variables:
- `DISCORD_APPLICATION_ID` = your Application ID
- `DISCORD_PUBLIC_KEY` = Public Key from Discord Developer Portal → General Information
- `DISCORD_BOT_TOKEN` = your bot token (SECRET; never commit it)
- `DISCORD_GUILD_ID` = your test server ID
- `BOT_OWNER_ID` = your Discord user ID (the owner who can manage permissions)
- `UPSTASH_REDIS_REST_URL` = from your Upstash/Vercel Redis database
- `UPSTASH_REDIS_REST_TOKEN` = from your Upstash/Vercel Redis database
- `ROSTER_ADMIN_KEY` = a long random secret for direct API writes

## Register slash commands
Run with Node 18+:
`DISCORD_APPLICATION_ID=... DISCORD_BOT_TOKEN=... DISCORD_GUILD_ID=... node scripts-register-commands.mjs`

On Windows PowerShell:
`$env:DISCORD_APPLICATION_ID="..."; $env:DISCORD_BOT_TOKEN="..."; $env:DISCORD_GUILD_ID="..."; node scripts-register-commands.mjs`

## Discord Developer Portal
Set Interactions Endpoint URL to:
`https://YOUR-VERCEL-DOMAIN.vercel.app/api/discord/interactions`

Copy the app's Public Key into `DISCORD_PUBLIC_KEY`.

For an install link, use Discord's OAuth2 URL generator with scopes `bot` and `applications.commands`. For the simplest install, give the bot only the permissions it actually needs; these commands don't require Administrator.

## Important
Discord attachment CDN URLs can expire. For permanent profile pictures, use a permanent image host/CDN later. The current version uses the attachment URL directly because it requires no additional image-storage service.

Your existing music behavior remains: the included MP3 starts after the visitor clicks the roster button, because browsers block autoplay on page load.


## Discord endpoint
Set Discord's Interactions Endpoint URL to `/api/discord/interactions` on your production Vercel domain. The endpoint verifies Discord's Ed25519 signature using `DISCORD_PUBLIC_KEY` and answers Discord's PING with `{ "type": 1 }`.

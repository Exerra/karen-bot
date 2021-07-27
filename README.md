<p align="center">
  <img src="readme.svg">
</p>

<a href="https://status.exerra.xyz" id="freshstatus-badge-root" data-banner-style="compact">
  <img src="https://public-api.freshstatus.io/v1/public/badge.svg/?badge=0b9b52df-6e1d-4d16-b836-5595b35bcef8" />
</a>

![Guilds](https://img.shields.io/badge/dynamic/json?color=success&label=Guilds&query=servercount&url=https%3A%2F%2Fcdn.exerra.xyz%2Fkaren%2Fstats%2F)
![Users](https://img.shields.io/badge/dynamic/json?color=success&label=Users&query=users&url=https%3A%2F%2Fcdn.exerra.xyz%2Fkaren%2Fstats%2F)
![DiscordJS version](https://img.shields.io/badge/dynamic/json?color=informational&label=DiscordJS&prefix=v&query=DiscordJS&url=https%3A%2F%2Fcdn.exerra.xyz%2Fkaren%2Fstats%2F)
![License](https://img.shields.io/github/license/exerra-discord/karen-bot)
[![Discord Bots](https://top.gg/api/widget/status/599289687743397889.svg)](https://top.gg/bot/599289687743397889)

![Repository size](https://img.shields.io/github/repo-size/exerra-discord/karen-bot)

Karen Bot is a multi-purpose bot

TODO: finish readme later

## Links

[Main website](https://karen.exerra.xyz)

[Docs (Commands)](https://docs.karen.exerra.xyz)

[Status page](https://status.exerra.xyz)

[Invite link](https://discord.com/oauth2/authorize?client_id=599289687743397889&scope=applications.commands%20bot&permissions=8)

## Commit etiquette

* Push small commits (e.g If you changed 2 directories, commit one directory, then commit the other directory and only THEN push)
* Keep commit titles short and then explain them in the description of the commit.
* **DO NOT PUSH TO MASTER BRANCH!** Push to a new branch (e.g username-whatyouchanged and create a PR)

## Setup instructions
So, Karen Bot is quite tightly integrated with my *private* API, which is good & bad news. Good news is that a lot of strain is taken off of Karen and put on my API, while the bad news is that someone without API access can't really run Karen that good. Fortunately, I have designed a lot of the API to have as little server side processing as possible, ensuring a ~~tedious~~ simple transition to your own API or just saving files on your computer!
So this section will walk you through the necessary things to get Karen Bot atleast slightly functional :)

### Discord token
This is going to be super simple
First, go to [discord.com/developers/applications](https://discord.com/developers/applications) and click on the button "New application"
![How to create new application](https://cdn.exerra.xyz/files/png/tutorials/discord_bot_token/create_application.png)

Then, name your application
![How to name application](https://cdn.exerra.xyz/files/png/tutorials/discord_bot_token/name_application.png)

Great! Now you have an application, but not a bot! To get a bot, create on the "Bot" tab on the sidebar, then when it asks you if you *really* want to create a bot, just say yes!
![How to create bot](https://cdn.exerra.xyz/files/png/tutorials/discord_bot_token/click_on_bot.png)

Wow, you can follow simple instructions, great! To get the token, click on "Copy" under the token while on the Bot tab. Now, be careful where you put it since tokens are basically like usernames and passwords for bots.
![How to copy token](https://cdn.exerra.xyz/files/png/tutorials/discord_bot_token/copy_token.png)

Aaand you're done with the token part, congratz! 🎉

### Spotify OAuth token
First, go to [developer.spotify.com/dashboard/applications](https://developer.spotify.com/dashboard/applications) and log in/sign up (if you don't have a spotify account for some god awful reason)

Then, click on the big green "Create application" button and give it a name & description
![How to create app](https://cdn.exerra.xyz/files/png/tutorials/spotify_oauth/create_app.png)

Now you have a shiny Spotify application, great! So next, click on "Show client secret". Make sure not to leak the secret since it is, well, a secret!
![How to get OAuth token](https://cdn.exerra.xyz/files/png/tutorials/spotify_oauth/get_token.png)

Oh hey, already at the end of this section! Good job, go pat yourself on the back 🥳

### Genius OAuth token
First, go to [genius.com/developers/](https://genius.com/developers/). Then create on the biggest button you can find, aka "Create an API client"
![How to navigate the startpage](https://cdn.exerra.xyz/files/png/tutorials/genius_oauth/startpage.png)

Then log in/sign up and you will be presented the API client creation screen. Fill in the name and if you want, the rest of the fields, then click "Save"
![How to create an API client](https://cdn.exerra.xyz/files/png/tutorials/genius_oauth/create_api_client.png)

Now you will get to the "All API Clients" screen, great! Click "Generate Access Token" and save it! (Again, keep it super super private)
![How to copy OAuth token](https://cdn.exerra.xyz/files/png/tutorials/genius_oauth/get_tokens.png)

HOORAY! YOU HAVE DEMONSTRATED AN EXCEPTIONAL ABILITY TO FOLLOW SIMPLE INSTRUCTIONS, WAY TO GO! ONLY A FEW LEFT 🥳🎉

### Clarifai AI Key
Now now now, this is the last one (for now)! Pat yourself on the back before proceeding.

You done? Good. First, go to [link](link) and sign up
![How to sign up](https://cdn.exerra.xyz/files/png/tutorials/clarifai_key/homepage.png)

When you have signed up, click on "Create application" and set up the fields. BUT BEFORE YOU CONTINUE, YOU WILL NEED TO SET THE WORKFLOW TYPE TO **MODERATION**! IT IS VERY VERY IMPORTANT
![How to create application](https://cdn.exerra.xyz/files/png/tutorials/clarifai_key/create_app.png)
![SET WORKFLOW TYPE](https://cdn.exerra.xyz/files/png/tutorials/clarifai_key/set_workflow.png)

Now, just copy the key and you're done!
![How to copy key](https://cdn.exerra.xyz/files/png/tutorials/clarifai_key/copy_key.png)

### Putting that all in .env
So, clone/fork the repo and create an .env file.

For each field, add the content to it in the .env file after the = (Remember, no spaces)

| Field              | Content             |
|--------------------|---------------------|
| DISCORD_TOKEN      | Discord token       |
| SPOTIFY_ID         | Spotify ID          |
| SPOTIFY_SECRET     | Spotify secret      |
| GENIUS_ACCESSTOKEN | Genius access token |
| NSFAI_KEY          | Clarifai key        |



## Special thanks to

[@Salint](https://github.com/Salint) for helping out in general

[@levichlev](https://github.com/levichlev) for helping out with the Spotify command

[@Julz4455](https://github.com/Julz4455) for not getting angry that I borrowed some code

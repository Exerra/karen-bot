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

## Special thanks to

[@Salint](https://github.com/Salint) for helping out in general

[@levichlev](https://github.com/levichlev) for helping out with the Spotify command

[@Julz4455](https://github.com/Julz4455) for not getting angry that I borrowed some code

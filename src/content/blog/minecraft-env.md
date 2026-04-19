---
title: 'Minecraft Data Collection Env'
description: 'I built a Minecraft data collection environment from scratch for world model training. This post documents the setup: game environment, RCON, and the design decisions behind it.'
pubDate: '2026-04-18'
tags: ['data', 'agent']
---

## Background

Recently I have been running world model experiments as a free-time hobby. "World model" is a blanket term nowadays; if the goal is to train an autoregressive video generation model that predicts the next frames based on the context and the current action input like [WHAMM](https://www.microsoft.com/en-us/research/articles/whamm-real-time-world-modelling-of-interactive-environments/), it requires a large amount of paired video and action data. Some would choose to record the trajectories themselves (for example, this [CSGO dataset](https://github.com/TeaPearce/Counter-Strike_Behavioural_Cloning)), but I wanted to have an agent doing that for me while I'm asleep.

For this, Minecraft is a great video game environment to collect data using agents. While there already exist a few frameworks for controlling agents in Minecraft (for example, [Malmo](https://github.com/microsoft/malmo), [MineRL](https://minerl.readthedocs.io/en/latest/), [MineDojo](https://minedojo.org/), and [Mineflayer](https://github.com/prismarinejs/mineflayer)), I wanted to build my own agent control and recording pipeline from scratch for maximum flexibility. The goal I had in mind was to keep the game environment, the recording module, and the agent module decoupled, so that:

- for the agent I can use any policy: deterministic actions, RL policies, or LLM/VLM APIs;
- the data can be recorded at 60 FPS.

I'm sure there are better ways to set up the data collection pipeline. This post documents the way that works for me and the technical considerations I had. This includes setting up the game environment, orchestrating the recorder components, and controlling the agent.

## Minecraft Game Environment

I use Minecraft Java Edition 1.21.4 with Prism Launcher 9.4. Minecraft JE does not have native controller support, so I installed the Controlify mod to add Xbox controller support.

![Prism Launcher Mods](/images/minecraft-env/prism_launcher_mods.png)

In the game instance's Settings tab, under the Java card, I added the following line to Java arguments:
`-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M`. I set Minimum Memory Allocation to 512, and Maximum Memory Allocation to 4096.
![Prism Launcher Java](/images/minecraft-env/prism_launcher_java.png)

Then, in the Game Window card, I set the window size to be 1280x720 for 720p recording.
![Prism Launcher Window](/images/minecraft-env/prism_launcher_window.png)

At this point, singleplayer should work. But I wanted to get internal game states (for example, player coordinates) from the game environment in addition to the visuals. I found that setting up the Remote Console (RCON) would be much more straightforward than low-level hacking.

For this, I use PaperMC to host the Minecraft server locally. After installing it and running it for the first time, we can go to `server.properties` to edit the server settings. We must set `enable-rcon=true`, and configure `rcon.password` and `rcon.port` (these will be used by the Python scripts later). Other helpful settings include:

```json
difficulty=peaceful
enable-rcon=true
gamemode=creative
level-type=minecraft\:flat
rcon.password=YOUR_PASSWORD
rcon.port=YOUR_RCON_PORT
spawn-monsters=false
```

If all are set up properly, we should see the localhost server in the multiplayer screen:
![Multiplayer Server](/images/minecraft-env/mc_multiplayer_server.png)

At this point, the Minecraft game and server environment is ready.

## Game Recorder and Orchestrator

TODO

## Agent Module

TODO

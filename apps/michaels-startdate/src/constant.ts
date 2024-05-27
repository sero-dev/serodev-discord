export default {
  messages: {
    youShouldKnowThis: 'You should know this already.',
    incompetence:
      'This level of incompetence is the reason why other developers are better than you.',
    tropicThunderGif: 'https://tenor.com/view/tropic-thunder-dumb-gif-13930962',
    stopAsking: 'No and stop asking me!',
    warningYou: "I'm warning you",
    checkDms: 'Check your DMs...',
    sleepWithFishes:
      "Listen here, you punk. You ask me one more time, and you're gonna sleeping with the fishes.",
    dontSpeakReact: "I'm sorry, I don't speak React",
    noSpeakyReact: 'MEEEE NOOOOO SPEAKYYYY REACTTTTT!',
    goodSoup: 'You are about to be good soup',
    heyMichael: (timeFromNow: string) =>
      `Hey Michael, You should know this but if you didn't. You will be starting your new position on June 10th 2024, which is in exactly ${timeFromNow} from now.`,
    default: (timeFromNow: string) =>
      `Michael Gathwright will be starting his new position on June 10th 2024, which is in exactly ${timeFromNow} from now.`,
  },

  config: {
    discordToken: 'DISCORD_TOKEN',
    clientId: 'DISCORD_CLIENT_ID',
    guildId: 'DISCORD_GUILD_ID',
    devMode: 'DEV_MODE',
  },
};

//npm install discord.js
//npm install ffmpeg-static
// npm install @discordjs/opus

const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const ytdl = require('ytdl-core');
const db = new Database();
const client = new Discord.Client();

let connection = null;

client.on('message', async message => {
  if (!message.guild) return;

  if (message.content === '/join') {

    if (message.member.voice.channel) {
      connection = await message.member.voice.channel.join();
      message.channel.send('Done!');
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
  }
});

const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable", "broken"]

const starterEncouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person / bot!",
  "Stand tall, You are a king!",
  "Ahh! I'm there for you!",
]

db.get("encouragements").then(encouragements => {

  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }  
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }  
})

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
}

function deleteEncouragment(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
  })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  if (msg.content === "$Brown-munde") {
    connection.play(ytdl('https://www.youtube.com/watch?v=VNs_cCtdbPc', { filter: 'audioonly' }));
    msg.channel.send("Playing Brown Munde");
  }
  if(msg.content === "$/"){
    msg.reply("You can try following Commands\n 1.get inspirational Quote ($inpire) \n 2. Try To talk to me \n 3. I can play some Songs for You ($Song-name) \n 4. Join the audio channel (/join) \n 5. Add new filteration message to your list ($new -your message-) \n 6. can delete your old message ($del -your message-) \n 7. you can turn me off and on ($responding true/false)");
  }
  if(msg.content === "$teji-Seat"){
       connection.play(ytdl('https://www.youtube.com/watch?v=terrX5lNBkU', { filter: 'audioonly' }));
       msg.channel.send("Playing Teji Seat");
  }
  if(msg.content == "$faded"){
    connection.play(ytdl('https://www.youtube.com/watch?v=60ItHLz5WEA', {filter : 'video'}))
    msg.channel.send("Playing Faded");
  }
  if(msg.content == "$Daimond-heart"){
    connection.play(ytdl('https://www.youtube.com/watch?v=sJXZ9Dok7u8', {filter : 'video'}))
    msg.channel.send("Playing Daimond Heart");
  }
  
  if (msg.author.bot) return
  if(msg.content === "POW"){
      msg.reply("Boom.Bam.Bop.Bada bap boop.POW :-*");
      msg.channel.send(":-*");

  }

  db.get("responding").then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
      })
    }
  })

  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if (msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncouragment(index)
    msg.channel.send("Encouraging message deleted.")
  }

  if (msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }
    
  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("$responding ")[1]

    if (value.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
      db.set("responding", false)
      msg.channel.send("Responding is off.")
    }
  }
})
client.login( "YOUR TOKEN")

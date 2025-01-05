const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

let mlhEventUrl = "https://mlh.io/seasons/2025/events"
let devpostUrl = "https://devpost.com/api/hackathons"
let devfolioUrl = "https://devfolio.co/_next/data/Ubss0UCPXvZPmsRBC7ZoA/hackathons.json"

let data = {}
app.get('/mlhEvents',async (req,res)=>{
    let html = await fetch(mlhEventUrl).then(response => response.text()).then((html) => { return html });

    let $ = cheerio.load(html)

    const eventContainer = $('div[class="event-wrapper"]')
    
    for(let i=0;i<eventContainer.length;i++){
        // console.log(i)
        $ = cheerio.load(eventContainer[i])
        let eventUrl = $('a').attr("href")
        let posterUrl = $('div[class="image-wrap"]>img').attr("src")
        let eventLogo = $('div[class="event-logo"]>img').attr("src")
        let eventName = $('h3[class="event-name"]').text()
        let eventDate = $('p[class="event-date"]').text()
        let eventMode = $('div[class="event-hybrid-notes"]>span').text()
        // let eventLocationCont = $('div[class="event-location"]')
        // console.log(eventLocationCont)
        let eventCity = $('div[class="event-location"]>span[itemprop="city"]').text()
        let eventState = $('div[class="event-location"]>span[itemprop="state"]').text()
        let eventLocation = eventCity+","+eventState
        // console.log(eventUrl)
        let eventData = {
            "eventUrl" : eventUrl,
            "posterUrl" : posterUrl,
            "eventLogo" : eventLogo,
            "eventName" : eventName,
            "eventDate" : eventDate,
            "eventMode" : eventMode,
            "eventLocation" : eventLocation
        }
        data[eventName] = eventData
    }
    // console.log(data)
    res.send(data)
    
})

app.get('/devpostEvents',async (req,res)=>{
    let hackathonResponse = await fetch(devpostUrl).then(response => response.json()).then((data) => { return data });
    res.send(hackathonResponse)
})
app.get('/devfolioEvents',async (req,res)=>{
    let devfolioResponse = await fetch(devfolioUrl).then(response => response.json()).then((data) => { return data });
    res.send(devfolioResponse)
})

app.listen(PORT,()=>{
    console.log("server running")
})
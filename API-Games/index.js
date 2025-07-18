const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const DB = {
    games: [
        {
            id: 28,
            title: "Call of Duty BO6",
            year: 2024,
            price: 300
        },
        {
            id: 35,
            title: "Monster Hunter IB",
            year: 2022,
            price: 180
        },
        {
            id: 12,
            title: "Counter Strike 2",
            year: 2022,
            price: 0
        }
    ]
}

app.get('/games', (req, res) => {
    res.statusCode = 200
    res.json(DB.games)
})

app.get('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)
        var correctGame = DB.games.find(g => g.id == id)

        if(!correctGame) {
            res.sendStatus(404)
        }
        res.statusCode = 200
        res.send(correctGame)
    }
    
})

app.post('/game', (req, res) => {
    var {title, year, price} = req.body

    DB.games.push({
        id: 63,
        title,
        year,
        price
    })

    res.sendStatus(200)

})

app.delete('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)
        var indexGame = DB.games.findIndex(g => g.id == id)

        if(indexGame == -1){
            res.sendStatus(404)
        } 
        else{
            DB.games.splice(indexGame,1)
            res.sendStatus(200)
        }
    }
})

app.put('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)
        var correctGame = DB.games.find(g => g.id == id)

        if(!correctGame) {
            res.sendStatus(404)
        }

        var {title, year, price} = req.body
        
        if (title || year || price != undefined) {
            correctGame.title = title || correctGame.title
            correctGame.year = year || correctGame.year
            correctGame.price = price || correctGame.price

            res.sendStatus(200)
        }

    }
    
})

app.listen(50000, () => {
    console.log("API está rodando!")
})
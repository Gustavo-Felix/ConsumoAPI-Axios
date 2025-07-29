const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const JWTsecret = "dsjkdhkjdhjkdsahjkdhajksdhajksdhajkhj"

app.use(cors())

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

function auth(req, res, next) {
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(" ")
        const token = bearer[1]
        jwt.verify(token, JWTsecret, (err, data) => {
            if(err){
                res.status(401)
                res.json({err: "Token inválido"})
            }
            else{
                req.token = token
                req.loggedUser = {id: data.id, email: data.email}
                next()
            }
        })
    }
    else{
        res.status(401)
        res.json({err: "Token inválido"})
    }
}

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
    ], 
    users: [
        {
            id: 1,
            nome: "Gustavo",
            email: "gustavoksjlsj@gmail.com",
            password: "111111"
        },
        {
            id: 20,
            nome: "bruno",
            email: "brun0kasj@gmail.com",
            password: "2222222"
        },
    ]
}

app.get('/games', auth, (req, res) => {
    var HATEOAS = [
        {
            href:"http://localhost:50000/game/0",
            method:"DELETE",
            rel:"delete_game"
        },
        {
            href:"http://localhost:50000/games",
            method:"GET",
            rel:"get_game"
        },
        {
            href:"http://localhost:50000/auth",
            method:"POST",
            rel:"login"
        }
    ]

    res.statusCode = 200
    res.json({games: DB.games, _links: HATEOAS})
})

app.get('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)

        var HATEOAS = [
            {
                href:"http://localhost:50000/game/"+id,
                method:"DELETE",
                rel:"delete_game"
            },
            {
                href:"http://localhost:50000/game/"+id,
                method:"GET",
                rel:"get_game"
            },
            {
                href:"http://localhost:50000/auth",
                method:"POST",
                rel:"login"
            }
        ]

        var correctGame = DB.games.find(g => g.id == id)

        if(!correctGame) {
            res.sendStatus(404)
        }
        res.statusCode = 200
        res.send(correctGame)
    }
    
})

app.post('/game', auth, (req, res) => {
    var {title, year, price} = req.body

    DB.games.push({
        id: 63,
        title,
        year,
        price
    })

    res.sendStatus(200)

})

app.delete('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)

        var HATEOAS = [
            {
                href:"http://localhost:50000/game/"+id,
                method:"DELETE",
                rel:"delete_game"
            },
            {
                href:"http://localhost:50000/game/"+id,
                method:"PUT",
                rel:"edit_game"
            },
            {
                href:"http://localhost:50000/game/"+id,
                method:"GET",
                rel:"get_game"
            }
        ]
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

app.put('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id)
        var HATEOAS = [
            {
                href:"http://localhost:50000/game/"+id,
                method:"DELETE",
                rel:"delete_game"
            },
            {
                href:"http://localhost:50000/game/"+id,
                method:"PUT",
                rel:"edit_game"
            },
            {
                href:"http://localhost:50000/game/"+id,
                method:"GET",
                rel:"get_game"
            },
            {
                href:"http://localhost:50000/games/",
                method:"GET",
                rel:"get_all_games"
            }
        ]
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

app.post("/auth", (req, res) => {
    var { email, password } = req.body

    if(email != undefined){
        var user = DB.users.find(user => user.email == email)

        if(user){

            if(user.password == password){
                jwt.sign({id: user.id, email: user.email}, JWTsecret, {expiresIn:"48h"}, (err, token) => {
                    if(err){
                        res.sendStatus(400)
                        res.json({token: "Falha Interna!"})
                    }else{
                        res.status(200)
                        res.json({token: token})
                    }
                })
            }
            else{
                res.sendStatus(401)
                res.json({err: "Credenciais inválidas!"})
            }

        }
        else{
            res.sendStatus(404)
            res.json({err: "O email não existe no banco de dados!"})
        }
    }
    else {
        res.sendStatus(400)
        res.json({err: "O email é inválido!"})
    }

})

app.listen(50000, () => {
    console.log("API está rodando!")
})
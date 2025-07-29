# API de games
Esta API foi desenvolvida para desenvolver conhecimentos sobre ferramentas de criação de API, como:
    - Axios
    - JWT
    - Express

## EndPoints
### GET /games
Endpoint responsável por retornar a listagem de todos os games cadastrados.
### Parametros
Nenhum
#### Respostas
##### OK! 200
É divulgado em JSON todos os games.

Exemplo de resposta:
```
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
```

##### Falha na Autenticação! 401
Aconteceu uma falha durante o processo de autenticação do token na requisição.
Motivo: Token inválido/Expirado

Exemplo de resposta:
```
{
    "err": "Token inválido!"
}
```

### POST /auth
Endpoint responsável por autenticar e criar o token.
### Parametros
email: E-mail do usuario cadastrado no Banco.
password: Senha do usuario cadastrado no Banco.

```
{
    "email": "gustavoksjlsj@gmail.com",
    "password": "111111"
}
```
#### Respostas
##### OK! 200
Caso isso aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos na API.

Exemplo de resposta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                      OiJndXN0YXZva3NqbHNqQGdtYWlsLmNvbSIsImlhdCI6MTc1Mzc4NDIwNSwiZXhwIjoxNzUzOTU3MDA1fQ.eM2TIuuCemAEX3oQB3AlKht8sqTUbqe8byRYGtJbdXA"
}
```

##### Falha na Autenticação! 401
Aconteceu uma falha durante o processo de autenticação da requisição. 
Motivos: Senha ou e-mail incorretos.

Exemplo de resposta:
```
{
    err: 'Credenciais inválidas!'
}
```
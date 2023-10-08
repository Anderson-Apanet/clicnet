const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const Handlebars = require('handlebars');



const app = express() // Executa o express

// Configurar o express para pegar o body via middleware
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

// Configurando template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Ativa a ponte para arquivos estáticos
app.use(express.static('public'))


// Ajustando a visualização de data e hora na consulta de conexões do cliente 
Handlebars.registerHelper('formatDate', function (dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  });

// Rota Raiz
app.get('/', (req, res) => {
    res.render('home')
})

// Rota para inserir contratos
app.post('/contracts/insertcontract', (req, res) => {
    const username = req.body.username
    const conexao = req.body.conexao

    const sql = `INSERT INTO apasys_contratos (username, conexao) VALUES ('${username}', '${conexao}')`

    pool.query(sql, function(err) {
       
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/contracts')
    })
})

// Rota para resgatar contratos
app.get('/contracts', (req, res) => {
    
    const sql = "SELECT username, acctstarttime, acctstoptime, framedipaddress, acctinputoctets, acctoutputoctets FROM radacct WHERE username='clicnet2236' ORDER BY radacctid DESC limit 5"

    pool.query(sql, function (err, data){
        
        if (err) {
            console.log(err)
            return
        }

        const contracts = data

        console.log(contracts)

        res.render('contracts', { contracts })

    })
})

// Rota para resgatar um dado especifico como id, no caso abaixo estou usando o username
app.get('/contracts/:username', (req, res) => {

    const username = req.params.username

    const sql = `SELECT username, conexao FROM apasys_contratos WHERE username = '${username}'`
    
    pool.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const contract = data[0]

        res.render('contract', { contract })
    })
})

// Rota para edição de um registro primeira etapa
app.get('/contracts/edit/:username', (req, res) => {

    const username = req.params.username

    const sql = `SELECT username, conexao FROM apasys_contratos WHERE username = '${username}'`

    pool.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const contract = data[0]

        res.render('editcontract', { contract })
    })
})

// Rota para atualização do registro, sequencia da etapa da rota acima
app.post('/contracts/updatecontract', (req, res) => {
    
    const username = req.body.username
    const conexao = req.body.conexao
    const pppoe = req.body.pppoe

    const sql = `UPDATE apasys_contratos SET username = '${username}', conexao = '${conexao}' WHERE username = '${pppoe}'`

    pool.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            return
        } 
        console.log(sql)
        res.redirect('/contracts')
    })
})


// Rota para exclusão de contratos
app.post('/contracts/remove/:username', (req, res) => {

    const username = req.params.username

    const sql = `DELETE FROM apasys_contratos WHERE username = '${username}'`

    pool.query(sql, function(err) {
        if (err) {
            console.log(err)
            return
        } 

        res.redirect('/contracts')
    })

})


app.listen(3333)
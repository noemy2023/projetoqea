const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const connection = require("./database/database") // modulo de conexao com o banco de dados
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Conexão com o banco de dados

connection
    .authenticate()
    .then(() =>{
        console.log("Conexão com o banco de dados iniciada")
    })
    .catch((msgErro) =>{
        console.log(msgErro)
    })

//Usar EJS como View Engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Body parser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//Rotas
app.get('/', (req,res) => {
    Pergunta.findAll({raw:true, order:[
      ["id", "DESC"]    
    ]}).then(
        perguntas =>{
            res.render('index', {
                perguntas: perguntas
            })
        }
    )
})

app.get('/perguntar', (req,res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    // res.send("Formulário recebido! Titulo: " + titulo + " descrição: " + descricao)
    if(titulo != "" || descricao != ""){
        Pergunta.create({
            titulo: titulo,
            descricao: descricao
        }).then(()=>{
            res.redirect('/')
        })
    }   
})

app.get("/pergunta/:id", (req, res) =>{
    var id = req.params.id;

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){
        
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [["id", "DESC"]]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })

        }else{
            res.redirect('/')
        }
    })
})

app.post('/resposta', (req,res) => {
    var corpo = req.body.corpo;
    var idpergunta = req.body.idpergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: idpergunta
    }).then(() =>{
        res.redirect("/pergunta/" + idpergunta)
    })
})

app.listen(3333, () =>{
    console.log("Servidor rodando")
})
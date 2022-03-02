var tbody = document.querySelector(".corpo_tabela");
var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
let idDelecao;
let quantidadeAntiga = 0;
let quantidadeMinima = document.getElementById('input_mim')
var regra = /^[0-9]+$/;

const url = 'https://sheetdb.io/api/v1/db3oydpcb9aaz'
const urlH = 'https://sheetdb.io/api/v1/jj3wwgeziiiyf'

//---------------------------------------------------------------- axios----------------------------------------------------------------------
function salvar(id, descricao, fracao, minimo, quantidade, reposicao){
  axios.post(url,{
    "data":{
      "ID": id,
      "DESCRICAO": descricao,
      "FRACAO": fracao,
      "MIN": minimo,
      "QUANTIDADE": quantidade,
      "REPO": reposicao
    }
  })
}

function atualizar(descricao, novaDescricao, fracao, minimo, quantidade, reposicao){
  axios.patch(`${url}/ID/${descricao}`,{
    "data":{
      "DESCRICAO": novaDescricao,
      "FRACAO": fracao,
      "MIN": minimo,
      "QUANTIDADE": quantidade,
      "REPO": reposicao
    }
  })
  .then(resposta =>{
    console.log(resposta.data)
  })
}

function salvarHistorico(nome, descricao, operacao, quantidade, data){
  axios.post(urlH,{
    "data":{
      "NOME":nome,
      "DESCRICAO": descricao,
      "OPERACAO": operacao,
      "QUANTIDADE": quantidade,
      "DATA": data
    }
  })
}

function atualizarQtdItem(id, quantidade, reposicao){
  axios.patch(`${url}/ID/${id}`,{
    "data":{
      "QUANTIDADE": quantidade,
      "REPO": reposicao
    }
  })
  .then(resposta =>{
    console.log(resposta.data)
  })
  .catch(err =>{
    console.log(err);
  })
}

function coletar(){
  axios.get(`${url}?sort_by=DESCRICAO&sort_order=asc`)
    .then(resposta =>{
      //console.log(resposta.data)
      carregarTabela(resposta.data)
    })
}

function coletarDesc(descricao){
  
  axios.get(`${url}/search?ID=${descricao}`)
    .then(resposta =>{
      
      document.querySelector('#input_des').value = resposta.data[0].DESCRICAO;
      document.querySelector('#input_frac').value = resposta.data[0].FRACAO;
      document.querySelector('#input_qtd').value = resposta.data[0].QUANTIDADE;
      quantidadeMinima.setAttribute("value", parseInt(resposta.data[0].MIN));

      quantidadeAntiga = resposta.data[0].QUANTIDADE;

      console.log(quantidadeAntiga);
    })
    .catch(err =>{
      console.log(err)
    })
}
/**
 * Metodo do tipo errow function novo
 * @param {descrição} desc 
 */
const geyById = async(id)=>{
  const result = await axios.get(`${url}/search?ID=${id}`);
  return result.data;
}

function coletarDescPart(descricao){
  
  axios.get(`${url}/search?DESCRICAO=${descricao}*`)
    .then(resposta =>{
      
      document.querySelector('#input_des').value = resposta.data[0].DESCRICAO;
      document.querySelector('#input_frac').value = resposta.data[0].FRACAO;
      document.querySelector('#input_qtd').value = resposta.data[0].QUANTIDADE;
      

      quantidadeAntiga = resposta.data[0].QUANTIDADE;
      

      //console.log(resposta);
    })
    .catch(err =>{
      console.log(err)
    })
}

function deletar(descricao){
  axios.delete(`${url}/ID/${descricao}`)
  .then(resposta =>{
    console.log(resposta.data)
  })
}
//---------------------------------------------------------------- axios----------------------------------------------------------------------
//carregarTabela();

coletar()

const setarDados = async ()=>{
  const resposta = await geyById(idDelecao);
  //console.log(resposta[0].DESCRICAO);
  document.querySelector('#input_des').value = resposta[0].DESCRICAO;
  document.querySelector('#input_frac').value = resposta[0].FRACAO;
  document.querySelector('#input_qtd').value = resposta[0].QUANTIDADE;
  document.querySelector('#input_des_saida').value = resposta[0].DESCRICAO;
  quantidadeAntiga = resposta[0].QUANTIDADE;
  quantidadeMinima = resposta[0].MIN;
  
}

tbody.addEventListener('dblclick', evento =>{

  setarDados();
  toggleFormSaida();
})

function carregarTabela(resultado){
  var tr = '';
  for (let index = 0; index < resultado.length; index++) {
    tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
    tr += '<td>' + resultado[index].ID + '</td>';
    tr += '<td>' + resultado[index].DESCRICAO + '</td>';
    tr += '<td>' + resultado[index].FRACAO + '</td>';
    tr += '<td>' + resultado[index].MIN + '</td>';
    tr += '<td>' + resultado[index].QUANTIDADE + '</td>';
    tr += '<td>' + resultado[index].REPO + '</td>';
    tr += '</tr>';
  }
  tbody.innerHTML = tr;
}

function selecionar(_id){
  
  desmarcarLinhasTabela()
  var row = document.getElementById(_id);
  row.style.backgroundColor = "rgba(96, 190, 72, 0.39)";
  idDelecao = row.firstChild.textContent;
  //console.log("opa "+idDelecao);
}

function buscarItem(id){
  db.transaction(function(banco){
    banco.executeSql("SELECT i.desc, i.qtd FROM item i where id=?;",[id.toString()], function(tx, resultado){
      var row = resultado.rows;
      document.getElementById("input_des_saida").value = row[0].desc;
      quantidadeAntiga = row[0].qtd;
    });
  });
}

function carregarSelect(){
  var meuSelect = document.getElementById("sl-saida");
  db.transaction(function(banco){
    banco.executeSql("SELECT * FROM funcionario;",[], function(tx, resultado){
      var rows = resultado.rows;
      var op = '';
      for (let index = 0; index < rows.length; index++) {
        op += '<option id='+rows[index].id+' value='+rows[index].id+' selected>'+rows[index].nome+'</option>';
      }
      meuSelect.innerHTML = op;
    });
  });
}

function desmarcarLinhasTabela(){
  for (let index = 0; index < tbody.rows.length; index++) {
    
    tbody.rows[index].style.backgroundColor = "white";
  }
}

document.querySelector("#botao_enviar").addEventListener("click", (evento) => {
  var descricao = document.querySelector("#input_des").value.toUpperCase();
  var quantidade = document.querySelector("#input_qtd").value;
  var fracao = document.querySelector('#input_frac').value.toUpperCase();
  var tipoOperacao = document.querySelector('#botao_enviar').value;
  var minimo = document.querySelector('#input_mim').value;
  var reposicao = (quantidade - minimo);
  var id = randomId(5).toUpperCase();

  if(tipoOperacao === "Salvar"){
    if(quantidade != 0 && quantidade.match(regra) && descricao != ""){
      try{
        salvar(id, descricao, fracao, minimo, quantidade, reposicao)
        alert("Salvo com sucesso");
      }catch(msg){
        alert("Falha ao salvar");
      }
    }
    else{
      alert("Quantidade invalida");
    }
  }
  else{
    if(quantidade != 0 && quantidade.match(regra) && descricao != ""){
      try{
        reposicao = (quantidade - minimo)
        atualizar(idDelecao, descricao, fracao, minimo, quantidade, reposicao)
        alert("Editardo com sucesso");
      }catch(msg){
        alert("Falha ao Editar");
      }
    }
    else{
      alert("Quantidade invalida");
    }
  }

  toggleForm();
  window.location.reload(true);
});

document.querySelector("#botao_enviar_saida").addEventListener("click", (evento) =>{
  
  var select = document.getElementById('sl-saida');
  var nomeFuncionario = select.options[select.selectedIndex].text;
  var quant = document.getElementById("input_qtd_saida").value;
  var desc = document.getElementById('input_des_saida').value;
  var opera = document.getElementById("operacao").textContent;
  var currentTime = new Date();

  const formarter = Intl.DateTimeFormat('pt-BR',{
    weekday:"long",
    year:"numeric",
    month:"short",
    day:"numeric",
    hour:"numeric",
    minute:"numeric"
  })

  let valor  = document.getElementById('switch-shadow').checked;
  //trabalhar esse metodo
  
  if(quant != 0 && quant.match(regra) && nomeFuncionario !== "Funcionario"){

    if(valor){
    
      let novaQuant = (parseInt(quantidadeAntiga)  + parseInt(quant) );
      let reposicao = (novaQuant - quantidadeMinima);
      console.log('antiga '+quantidadeAntiga + ' atual '+quant+ ' nova '+novaQuant)
      try{
        atualizarQtdItem(idDelecao, novaQuant, reposicao);
      }
      catch(err){
        alert("Falha na operação")
        return 0;
      }
      
    }
    else{
      let novaQuant = (parseInt(quantidadeAntiga)  - parseInt(quant) );
      let reposicao = (novaQuant - quantidadeMinima);
      console.log('antiga '+quantidadeAntiga + ' atual '+quant+ ' nova '+novaQuant)
      try{
        atualizarQtdItem(idDelecao, novaQuant, reposicao)
      }
      catch(msg){
        alert("Falha na operação")
        return 0;
      }
      
    }
    
    try{
      salvarHistorico(nomeFuncionario, desc, opera, quant, formarter.format(currentTime));
    }catch(msg){
      alert("Falha ao salvar o historico")
      return 0;
    }
      alert("Registro incluido com sucesso");
  }
  else{
    alert("Campo invalido");
  }
  
  toggleFormSaida();
  window.location.reload(true);
});

document.querySelector(".dropdown__submenu--item").addEventListener("click", (evento) => { //mesmo selecionando pela class so pela o primeiro elemento
  let acao = evento.target.textContent.trim().toLowerCase();
  
  if(acao === "cadastrar"){
    document.querySelector('#botao_enviar').value = "Salvar";
    toggleForm();
  }
});

document.querySelector('#id_editar').addEventListener("click", evento =>{
  document.querySelector('#botao_enviar').value = "Editar";
  coletarDesc(idDelecao);
  toggleForm();
})

document.getElementById('switch-shadow').addEventListener('click', (event) =>{
  let valor  = document.getElementById('switch-shadow').checked;
  console.log(valor);
  if(valor){
    document.getElementById("operacao").innerText = "ENTRADA";
  }
  else{
    document.getElementById("operacao").innerText = "SAIDA";
  }
})

/**
 * cadastrar uma saida
 *
document.querySelector("#cadastrar").addEventListener("click", (evento) => { //mesmo selecionando pela class so pela o primeiro elemento
  let acao = evento.target.textContent.trim().toLowerCase();
  //console.log("opa");
  //console.log(idDelecao);
  if(idDelecao.match(regra) && idDelecao != 0 && typeof(idDelecao) !== 'undefined'){
    
    buscarItem(idDelecao);
    
    carregarSelect();
    toggleFormSaida();
  }
  else{
    alert("Escolha um item");
  }
});
*/

document.querySelector("#id_deletar").addEventListener("click", (evento) => {
  var right = confirm("Deseja excluir o registro?");
  if (right){
    
    try{
      deletar(idDelecao.toString());
      alert("Excluido com sucesso");
    }
    catch(msg){
      alert("Falha ao excluir intem");
    }
  }
  coletar();
});

//aqui

document.querySelector("#botao_cencelar").addEventListener("click", (evento) =>{
  toggleForm();
});

document.querySelector("#botao_cencelar_saida").addEventListener("click", (evento) =>{
  toggleFormSaida();
});

function toggleForm(){
  const formulario = document.querySelector(".over-cad");
  formulario.classList.toggle("over_active");
}

function toggleFormSaida(){
  const formularioSaida = document.querySelector(".over-saida");
  formularioSaida.classList.toggle("over_active");
}

document.getElementById('relatorio').addEventListener("click", (evento) => {
  window.print();
});

document.querySelector('#buscar').addEventListener('click', (evento)=>{
  const desc = document.querySelector('#search');
})

const randomId = len =>{
  let id = ''
  do{
    id += Math.random().toString(36).substring(2)
  }while(id.length < len)
  id = id.substring(0, len)
  return id
}

document.getElementById('somar').addEventListener('click', (evento)=>{
  let val = quantidadeMinima.getAttribute("value")
  console.log("valor "+val)
  let newVal  = (parseInt(val) + 1)
  quantidadeMinima.setAttribute("value", newVal)
  //console.log(randomId(5));
})

document.getElementById('sub').addEventListener('click', (evento)=>{
  let val = quantidadeMinima.getAttribute("value")
  console.log("valor "+val)
  let newVal  = (parseInt(val) - 1)
  quantidadeMinima.setAttribute("value", newVal)
})

//salvar("ONU", "UN", 20);
//coletar();
//coletarDesc("ONU");
//atualizar("ONU", "ATUAL", "OPA", 0)
//deletar("ATUAL");
//salvar("BONINA FIBRA FIBERHOME", "MT", 100)

//atualizarQtdItem("FIXA FIO FIX", 0);
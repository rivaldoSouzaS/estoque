var tbody = document.querySelector(".corpo_tabela");
//var descricao = "";
var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
let idDelecao;
let quantidadeAntiga = 0;
var regra = /^[0-9]+$/;

//---------------------------------------------------------------- axios----------------------------------------------------------------------
function salvar(descricao, fracao, quantidade){
  axios.post('https://sheetdb.io/api/v1/f99viqo7fmto4',{
    "data":{
      "DESCRICAO": descricao,
      "FRACAO": fracao,
      "QUANTIDADE": quantidade
    }
  })
}

function salvarHistorico(nome, descricao, operacao, quantidade, data){
  axios.post('https://sheetdb.io/api/v1/jj3wwgeziiiyf',{
    "data":{
      "NOME":nome,
      "DESCRICAO": descricao,
      "OPERACAO": operacao,
      "QUANTIDADE": quantidade,
      "DATA": data
    }
  })
}

function atualizarQtdItem(descricao, quantidade){
  axios.patch(`https://sheetdb.io/api/v1/f99viqo7fmto4/DESCRICAO/${descricao}`,{
    "data":{"QUANTIDADE": quantidade}
  })
  .then(resposta =>{
    console.log(resposta.data)
  })
  .catch(err =>{
    console.log(err);
  })
}



function coletar(){
  axios.get('https://sheetdb.io/api/v1/f99viqo7fmto4?sort_by=DESCRICAO&sort_order=asc')
    .then(resposta =>{
      //console.log(resposta.data)
      carregarTabela(resposta.data)
    })
}

function coletarDesc(descricao){
  
  axios.get(`https://sheetdb.io/api/v1/f99viqo7fmto4/search?DESCRICAO=${descricao}`)
    .then(resposta =>{
      
      document.querySelector('#input_des').value = resposta.data[0].DESCRICAO;
      document.querySelector('#input_frac').value = resposta.data[0].FRACAO;
      document.querySelector('#input_qtd').value = resposta.data[0].QUANTIDADE;

      quantidadeAntiga = resposta.data[0].QUANTIDADE;

      console.log(quantidadeAntiga);
    })
    .catch(err =>{
      console.log(err)
    })
}

function atualizar(descricao, novaDescricao, fracao, quantidade){
  axios.patch(`https://sheetdb.io/api/v1/f99viqo7fmto4/DESCRICAO/${descricao}`,{
    "data":{
      "DESCRICAO": novaDescricao,
      "FRACAO": fracao,
      "QUANTIDADE": quantidade
    }
  })
  .then(resposta =>{
    console.log(resposta.data)
  })
}

function deletar(descricao){
  axios.delete(`https://sheetdb.io/api/v1/f99viqo7fmto4/DESCRICAO/${descricao}`)
  .then(resposta =>{
    console.log(resposta.data)
  })
}
//---------------------------------------------------------------- axios----------------------------------------------------------------------
//carregarTabela();

coletar()

tbody.addEventListener('dblclick', evento =>{
  //carregarSelect();
  document.querySelector('#input_des_saida').value = idDelecao;
  coletarDesc(idDelecao);
  toggleFormSaida();
})

function carregarTabela(resultado){
  var tr = '';
  for (let index = 0; index < resultado.length; index++) {
    tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
    tr += '<td>' + resultado[index].DESCRICAO + '</td>';
    tr += '<td>' + resultado[index].FRACAO + '</td>';
    tr += '<td>' + resultado[index].QUANTIDADE + '</td>';
    tr += '</tr>';
    //console.log("ok")
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
  var descricao = document.querySelector("#input_des").value;
  var quantidade = document.querySelector("#input_qtd").value;
  var fracao = document.querySelector('#input_frac').value;
  var tipoOperacao = document.querySelector('#botao_enviar').value;

  if(tipoOperacao === "Salvar"){
    if(quantidade != 0 && quantidade.match(regra) && descricao != ""){
      try{
        salvar(descricao, fracao, quantidade)
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
        atualizar(idDelecao, descricao, fracao, quantidade)
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
      console.log('antiga '+quantidadeAntiga + ' atual '+quant+ ' nova '+novaQuant)
      try{
        atualizarQtdItem(idDelecao, novaQuant);
      }
      catch(err){
        alert("Falha na operação")
        return 0;
      }
      
    }
    else{
      let novaQuant = (parseInt(quantidadeAntiga)  - parseInt(quant) );
      console.log('antiga '+quantidadeAntiga + ' atual '+quant+ ' nova '+novaQuant)
      try{
        atualizarQtdItem(idDelecao, novaQuant)
      }
      catch(msg){
        alert("Falha na operação")
        return 0;
      }
      
    }
    
    try{
      salvarHistorico(nomeFuncionario, idDelecao, opera, quant, formarter.format(currentTime));
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
    document.getElementById("operacao").innerText = "Entrada";
  }
  else{
    document.getElementById("operacao").innerText = "Saida";
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



//salvar("ONU", "UN", 20);
//coletar();
//coletarDesc("ONU");
//atualizar("ONU", "ATUAL", "OPA", 0)
//deletar("ATUAL");
//salvar("BONINA FIBRA FIBERHOME", "MT", 100)

//atualizarQtdItem("FIXA FIO FIX", 0);
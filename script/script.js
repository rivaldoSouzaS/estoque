var tbody = document.querySelector(".corpo_tabela");
//var descricao = "";
var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
let idDelecao;
let quantidadeAntiga = 0;
var regra = /^[0-9]+$/;

db.transaction(function(banco){
  banco.executeSql("SELECT * FROM item ORDER BY desc COLLATE NOCASE;",[], function(tx, resultado){
    var rows = resultado.rows;
    var tr = '';
    for (let index = 0; index < rows.length; index++) {
      tr += '<tr onClick="selecionar('+rows[index].id+')" id='+rows[index].id+'>';
      tr += '<td>' + rows[index].id + '</td>';
      tr += '<td>' + rows[index].desc + '</td>';
      tr += '<td>' + rows[index].qtd + '</td>';
      tr += '</tr>';
    }
    tbody.innerHTML = tr;
  });
});

function carregarTabela(){

  db.transaction(function(banco){
    banco.executeSql("SELECT * FROM item ORDER BY desc COLLATE NOCASE;",[], function(tx, resultado){
      var rows = resultado.rows;
      var tr = '';
      for (let index = 0; index < rows.length; index++) {
        tr += '<tr onClick="selecionar('+rows[index].id+')" id='+rows[index].id+'>';
        tr += '<td>' + rows[index].id + '</td>';
        tr += '<td>' + rows[index].desc + '</td>';
        tr += '<td>' + rows[index].qtd + '</td>';
        tr += '</tr>';
      }
      tbody.innerHTML = tr;
    });
  });
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

function selecionar(_id){
  
  desmarcarLinhasTabela()
  var row = document.getElementById(_id);
  row.style.backgroundColor = "rgba(96, 190, 72, 0.39)";
  idDelecao = row.firstChild.textContent;
}

function desmarcarLinhasTabela(){
  for (let index = 0; index < tbody.rows.length; index++) {
    tbody.rows[index].style.backgroundColor = "white";
  }
}

document.querySelector("#botao_enviar").addEventListener("click", (evento) => {
  var descricao = document.querySelector("#input_des").value;
  var quantidade = document.querySelector("#input_qtd").value;

  if(quantidade != 0 && quantidade.match(regra) && descricao != ""){
    db.transaction(function(banco){
      banco.executeSql("insert into item(desc, qtd) values (?, ?);",[descricao, quantidade]);
    });
    alert("Salvo com sucesso");
  }
  else{
    alert("Quantidade invalida");
  }

  toggleForm();
  window.location.reload(true);
});

document.querySelector("#botao_enviar_saida").addEventListener("click", (evento) =>{
  
  var select = document.getElementById('sl-saida');
  var idFuncionario = select.options[select.selectedIndex].value;
  var quant = document.getElementById("input_qtd_saida").value;
  var opera = document.getElementById("operacao").textContent;
  var currentTime = new Date();

  let valor  = document.getElementById('switch-shadow').checked;
  //trabalhar esse metodo
  
  if(quant != 0 && quant.match(regra)){

    if(valor){
      let navaQuant = (parseInt(quantidadeAntiga) + parseInt(quant));
      console.log("nova quant "+navaQuant+" antida "+quantidadeAntiga+" quantidade baixa "+quant);
      buscarItem(idDelecao);
      db.transaction(function(banco){
        banco.executeSql('UPDATE item SET qtd=? WHERE id=?', [navaQuant, idDelecao ]);
        console.log("update")
      });
    }
    else{
      let navaQuant = (quantidadeAntiga - quant);
      
      buscarItem(idDelecao);
      db.transaction(function(banco){
        banco.executeSql('UPDATE item SET qtd=? WHERE id=?', [navaQuant, idDelecao ]);
        console.log("update")
      });
    }
    
  
    db.transaction(function(banco){
    
      banco.executeSql("insert into historico(id_func, id_item, operacao, qtd, data) values (?, ?, ?, ?, ?);",[idFuncionario, idDelecao, opera, quant, currentTime]);
      
    });
    
    alert("Salvo com sucesso");
  }
  else{
    alert("Quantidade invalida");
  }
  carregarTabela();
  toggleFormSaida();
});

document.querySelector(".dropdown__submenu--item").addEventListener("click", (evento) => { //mesmo selecionando pela class so pela o primeiro elemento
  let acao = evento.target.textContent.trim().toLowerCase();
  if(acao === "cadastrar"){
    toggleForm();
  }
});

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
 */
document.querySelector("#cadastrar").addEventListener("click", (evento) => { //mesmo selecionando pela class so pela o primeiro elemento
  let acao = evento.target.textContent.trim().toLowerCase();
  //console.log("opa");
  console.log(idDelecao);
  if(idDelecao.match(regra) && idDelecao != 0 && typeof(idDelecao) !== 'undefined'){
    
    buscarItem(idDelecao);
    
    carregarSelect();
    toggleFormSaida();
  }
  else{
    alert("Escolha um item");
  }
});

document.querySelector("#id_deletar").addEventListener("click", (evento) => {
  var right = confirm("Deseja excluir o registro?");
  if (right){
    db.transaction(function(tx) {
      console.log(idDelecao);
      tx.executeSql('DELETE FROM item WHERE id=?', [idDelecao.toString()]);
    });
  }
  carregarTabela();
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



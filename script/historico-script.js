var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
var tbody = document.querySelector(".corpo_tabela_historico");
var meuSelect = document.querySelector('#sl-relatorio-saida')

function coletar(){
  axios.get('https://sheetdb.io/api/v1/jj3wwgeziiiyf')
    .then(resposta =>{
      //console.log(resposta.data)
      carregarTabela(resposta.data)
    })
}

function coletarDesc(nomeFunc){
  
  axios.get(`https://sheetdb.io/api/v1/jj3wwgeziiiyf/search?NOME=${nomeFunc}`)
    .then(resposta =>{
      carregarTabela(resposta.data)
    })
    .catch(err =>{
      console.log(err)
    })
}

meuSelect.addEventListener('click',function(){
  var select = document.getElementById('sl-relatorio-saida');
  var nomeFunc = select.options[select.selectedIndex].text;
  coletarDesc(nomeFunc);

});


function carregarTabela(resultado){
  console.log("OK")
  var tr = '';
  for (let index = 0; index < resultado.length; index++) {
    tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
    tr += '<td>' + resultado[index].NOME + '</td>';
    tr += '<td>' + resultado[index].DESCRICAO + '</td>';
    tr += '<td>' + resultado[index].OPERACAO + '</td>';
    tr += '<td>' + resultado[index].QUANTIDADE + '</td>';
    tr += '<td>' + resultado[index].DATA+ '</td>';
    tr += '</tr>';
    //console.log("ok")
  }
  tbody.innerHTML = tr;
}

coletar();

/*
var meuSelect = document.getElementById("sl-relatorio-saida");

db.transaction(function(banco){
    banco.executeSql("SELECT * FROM funcionario;",[], function(tx, resultado){
    var rows = resultado.rows;
    var op = '';
    for (let index = 0; index < rows.length; index++) {
        op += '<option value='+rows[index].id+' >'+rows[index].nome+'</option>';
    }
    meuSelect.innerHTML = op;
    });
});

db.transaction(function(banco){
    banco.executeSql("SELECT f.nome, i.desc, h.operacao, h.qtd, h.data FROM funcionario f, historico h, item i WHERE h.id_func = f.id and h.id_item = i.id and f.id > 0;",[], function(tx, resultado){
      var rows = resultado.rows;
      var tr = '';
      for (let index = 0; index < rows.length; index++) {
        tr += '<tr onClick="selecionar('+rows[index].id+')" id='+rows[index].id+'>';
        tr += '<td>' + rows[index].nome + '</td>';
        tr += '<td>' + rows[index].desc + '</td>';
        tr += '<td>' + rows[index].operacao + '</td>';
        tr += '<td>' + rows[index].qtd + '</td>';
        tr += '<td>' + rows[index].data.substring(0, 25); + '</td>';
        tr += '</tr>';
      }
      tbody.innerHTML = tr;
    });
});


meuSelect.addEventListener('click',function(){
    
    var select = document.getElementById('sl-relatorio-saida');
    var idFuncionario = select.options[select.selectedIndex].value;
    console.log("opa "+idFuncionario);
    db.transaction(function(banco){
        banco.executeSql("SELECT f.nome, i.desc, h.operacao, h.qtd, h.data FROM funcionario f, historico h, item i WHERE h.id_func = f.id and h.id_item = i.id and f.id = ?;",[idFuncionario], function(tx, resultado){
          var rows = resultado.rows;
          var tr = '';
          for (let index = 0; index < rows.length; index++) {
            tr += '<tr onClick="selecionar('+rows[index].id+')" id='+rows[index].id+'>';
            tr += '<td>' + rows[index].nome + '</td>';
            tr += '<td>' + rows[index].desc + '</td>';
            tr += '<td>' + rows[index].operacao + '</td>';
            tr += '<td>' + rows[index].qtd + '</td>';
            tr += '<td>' + rows[index].data.substring(0, 25); + '</td>';
            tr += '</tr>';
          }
          tbody.innerHTML = tr;
        });
    });
});



*/

document.getElementById("botao-gerar-relatorio").addEventListener("click", (evento) => {
  window.print();
});

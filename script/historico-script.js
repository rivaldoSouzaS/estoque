var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
var tbody = document.querySelector(".corpo_tabela_historico");
var idBusca;

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
    console.log('OK')
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

document.getElementById("botao-gerar-relatorio").addEventListener("click", (evento) => {
    window.print();
});



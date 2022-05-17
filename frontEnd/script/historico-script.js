var db = openDatabase("BancoDeDados", 1.0, "estoque", 512);
var tbody = document.querySelector(".corpo_tabela_historico");
var meuSelect = document.querySelector('#sl-relatorio-saida');

const urlH = 'https://sheetdb.io/api/v1/jj3wwgeziiiyf'

function coletar(){
  axios.get(urlH)
    .then(resposta =>{
      //console.log(resposta.data)
      carregarTabela(resposta.data)
    })
}

function coletarDesc(nomeFunc){
  
  axios.get(`${urlH}/search?NOME=${nomeFunc}`)
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
  //console.log("OK")
  var tr = '';
  for (let index = 0; index < resultado.length; index++) {
    tr += '<tr ondblClick="selecionar('+index+')" id='+index+'>';
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


coletar();

document.getElementById("botao-gerar-relatorio").addEventListener("click", (evento) => {
  window.print();
});

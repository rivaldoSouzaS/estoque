var tbody = document.querySelector(".corpo_tabela");

document
  .querySelector(".dropdown__submenu")
  .addEventListener("click", (evento) => {
    let pais = evento.target.textContent.trim().toLowerCase();
    fetchAssincrono(pais);
  });

async function fetchAssincrono(pais) {
  resposta = await fetch(
    `https://api.covid19api.com/country/${pais}/status/confirmed`
  );
  const dados = await resposta.json();
  tbody.innerText = " ";
  calcular(dados, "2020");
  calcular(dados, "2021");
}

//aqui

function calcular(dados, ano) {
  var arrayLista = [];
  for (var index_1 = 0; index_1 < 12; index_1++) {
    var ultimoDiaMes = new Date(2020, index_1 + 1, 0).getDate();

    for (var index = 0; index < dados.length; index++) {
      var quantidadeCasosMes = 0;
      var proximoDia = 0;
      var diaAtual = dados[index].Cases;
      var data = dados[index].Date.substring(0, 10);
      if (index < dados.length - 1) {
        proximoDia = dados[index + 1].Cases;
      }
      var diferencaDia = proximoDia - diaAtual;
      var minhaData;
      quantidadeCasosMes = quantidadeCasosMes + diferencaDia;
      if (index_1 + 1 < 10) {
        minhaData = `${ano}-0${index_1 + 1}-${ultimoDiaMes}`;
      } else {
        minhaData = `${ano}-${index_1 + 1}-${ultimoDiaMes}`;
      }

      if (data == minhaData) {
        arrayLista[index_1] = quantidadeCasosMes;
        quantidadeCasosMes = 0;
        preencherTabela(
          minhaData.substring(0, 4),
          index_1,
          arrayLista[index_1]
        );
      }
    }
  }
}

function gerarMeses(index) {
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  return month[index];
}

function preencherTabela(ano, mesCasos, casos) {
  let tr = tbody.insertRow();
  let td_ano = tr.insertCell();
  let td_mes = tr.insertCell();
  let td_quant = tr.insertCell();
  td_ano.innerText = ano;
  td_mes.innerText = gerarMeses(mesCasos);
  td_quant.innerText = casos;

  console.log(mesCasos);
}

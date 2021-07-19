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

  // metodoAno2020(dados);
  calcular(dados);
}

function metodoAno2020(dados) {
  console.log("casos de 2020");
  for (let index_1 = 0; index_1 < 12; index_1++) {
    var ultimoDiaMes = new Date(2020, index_1 + 1, 0).getDate();
    for (let index = 0; index < dados.length; index++) {
      let data = dados[index].Date.substring(0, 10);

      if (index_1 + 1 < 10) {
        if (data == `2020-0${index_1 + 1}-${ultimoDiaMes}`) {
          console.log(dados[index].Cases);
        }
      } else {
        if (data == `2020-${index_1 + 1}-${ultimoDiaMes}`) {
          console.log(dados[index].Cases);
        }
      }
    }
  }
  console.log(dados);
}

function calcular(dados) {
  console.log(dados);

  var arrayLista = [];
  for (var index_1 = 0; index_1 < 12; index_1++) {
    var ultimoDiaMes = new Date(2020, index_1 + 1, 0).getDate();

    for (var index = 0; index < dados.length; index++) {
      var quantidadeCasosMes = 0; // esta fora desse for
      var proximoDia = 0;
      var diaAtual = dados[index].Cases;
      var data = dados[index].Date.substring(0, 10);
      if (index < dados.length - 1) {
        proximoDia = dados[index + 1].Cases;
      }
      var diferencaDia = proximoDia - diaAtual;

      quantidadeCasosMes = quantidadeCasosMes + diferencaDia;
      if (index_1 + 1 < 10) {
        if (data == `2020-0${index_1 + 1}-${ultimoDiaMes}`) {
          arrayLista[index_1] = quantidadeCasosMes;
          quantidadeCasosMes = 0;
          console.log("MES " + index_1 + "-" + arrayLista[index_1]);
        }
      } else {
        if (data == `2020-${index_1 + 1}-${ultimoDiaMes}`) {
          arrayLista[index_1] = quantidadeCasosMes;
          quantidadeCasosMes = 0;
          console.log("MES " + index_1 + "-" + arrayLista[index_1]);
        }
      }
    }
  }
}

//ultima verção

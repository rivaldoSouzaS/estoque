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

  verificarMeses2020(dados);
}

function verificarMeses2020(dados) {
  let cont = 0;
  for (let index = 0; index < dados.length; index++) {
    let data = dados[index].Date.substring(0, 7);
    if (data === "2020-03") {
      console.log(dados[index].Date);
      cont += dados[index].Cases;
    }
  }
  //console.log(dados[0].Cases);
  console.log("quantidade de casos no mes " + cont);
}

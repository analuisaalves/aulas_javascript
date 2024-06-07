var elementoLista = document.getElementById("lista");
var elementoOrdenacao = document.querySelector("select");
var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];
var detalhes = document.getElementById("detalhes");

/**
 * Função que busca a lista de países e retorna uma Promessa com a lista.
 * Promessas são funções assíncronas que utilizam .then e .catch para obter o resultado;
 * @returns Promise(object[])
 */
function carregarLista() {
  // variável com o link da API
  const link_api = "https://restcountries.com/v3.1/all";
  // função fetch que busca os dados via HTTP GET
  return fetch(link_api)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      return obj;
    });
}

/**
 * Função que ordena a lista pelo valor passado
 * @param {object[]} lista
 * @param {string} ordernarPor 
 * @returns {object[]}
 */
function ordenar(lista, ordernarPor) {
  if (!elementoOrdenacao) {
    return lista;
  }
  // Tipo de ordenação
  if (ordernarPor == "regiao") {
    return lista.sort(function (anterior, atual) {
      return anterior.region.localeCompare(atual.region);
    });
  } else if (ordernarPor == "nome") {
    return lista.sort(function (anterior, atual) {
      return anterior.name.official.localeCompare(atual.name.official);
    });
  } else if (ordernarPor == "capital") {
    return lista.sort(function (anterior, atual) {
      const capitalAnterior = anterior.capital ? anterior.capital[0] : '';
      const capitalAtual = atual.capital ? atual.capital[0] : '';
      return capitalAnterior.localeCompare(capitalAtual);
    });
  }
  return lista;
}

/**
 * Adiciona item na tela
 * @param {object} pais  
 */
function adicionarPaisNaTela(pais) {
  if (!elementoLista) {
    return;
  }
  // criar um novo elemento html <tr>
  const item = document.createElement("tr");
  
  // template string com a imagem da bandeira e detalhes
  const conteudo = `
    <td><img src="${pais.flags.svg}" alt="Flag of ${pais.name.official}" width="20"></td>
    <td>${pais.name.official}</td>
    <td>${pais.region}</td>
    <td>${pais.capital}</td>
  `;
  
  // adicionar conteúdo ao elemento <tr> como HTML
  item.innerHTML = conteudo;
  
  // Adicionar evento de clique para mostrar detalhes do país
  item.addEventListener("click", function() {
    mostrarDetalhes(pais);
  });
  
  // adicionar elemento como filho ao elemento lista
  elementoLista.appendChild(item);
}

/**
 * Função para mostrar detalhes do país no modal
 * @param {object} pais
 */
function mostrarDetalhes(pais) {
  const conteudoDetalhes = `
    <h2>${pais.name.official}</h2>
    <p><strong>Região:</strong> ${pais.region}</p>
    <p><strong>Sub-região:</strong> ${pais.subregion}</p>
    <p><strong>Capital:</strong> ${pais.capital}</p>
    <p><strong>População:</strong> ${pais.population}</p>
    <p><strong>Área:</strong> ${pais.area} km²</p>
    <img src="${pais.flags.svg}" alt="Flag of ${pais.name.official}" width="100">
  `;
  detalhes.innerHTML = conteudoDetalhes;
  modal.style.display = "block";
}

/**
 * Carregar Dados
 */
function carregarDados() {
  carregarLista()
    .then((lista) => {
      // arrow function: função anônima definida com =>
      // será executada se não ocorrer erro

      // ordenar lista
      const ordernarPor = elementoOrdenacao.value;
      lista = ordenar(lista, ordernarPor);

      // limpar elementos
      elementoLista.innerHTML = "";
      for (let pais of lista) {
        adicionarPaisNaTela(pais);
      }
    })
    .catch((err) => {
      // função será chamada caso ocorra um erro
      console.error(err);
    });
}

/**
 * Instruções que serão executadas quando carregar o arquivo no navegador
 */
elementoOrdenacao.addEventListener("change", (evento) => {
  carregarDados();
});

// Definir valor padrão de ordenação como "capital"
elementoOrdenacao.value = "capital";

// Carregar dados inicialmente ordenados por capital
carregarDados();

// Quando o usuário clicar no "x", fechar o modal
span.onclick = function() {
  modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, fechá-lo
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

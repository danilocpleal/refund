//Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
//busca o span dentro da estrutura HTML toda
const expenseQtde = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//Captura o evento de input para formatar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove os caracteres não numéricos;
  let value = amount.value.replace(/\D/g, "")

  //Transformar o valor em centavos.
  value = Number(value) / 100

  // atualiza o valor do input.
  amount.value = formatCurrrencyBRL(value)  
}

function formatCurrrencyBRL(value) {
  //Formata o valor no padrão BRL (Real brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
   
  //Retorna o valor formatado
  return value
}

//Captura o evendo de onsubmit do formulário para obter os valores
form.onsubmit = (event) => {
  //Previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  //Cria um objeto com os detalhes das despesas informadas no formulário.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  //Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense)
}

//Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    //Cria o elemento para para adicionar o item(li) na lista(ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense") 

    //Cria o ícome da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    //Cria a info das despesas.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona o name e category em expenseInfo
    expenseInfo.append(expenseName, expenseCategory)

    //Cria valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    //Cria o ícone de deleção
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", `img/remove.svg`)
    removeIcon.setAttribute("alt", "remover")

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na lista.
    expenseList.append(expenseItem)

    //Atualiza os totais
    updateTotals()

    //Limpa o formulário
    limpaForm()

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

//Atualiza os totais das solicitações.
function updateTotals(){
  try {
    //Recupera todos os itens (li) da lista (ul)
    const item = expenseList.children

    //atualiza a quantidade de itens da lista
    expenseQtde.textContent = `${item.length} ${item.length > 1 ? "despesas" : "despesa"}`

    let total = 0

    //Percorre cada item (li) da lista (ul)
    for (let linha = 0; linha < item.length; linha++){
      const itemAmount = item[linha].querySelector(".expense-amount")

      //Remove caracteres não  numéricos e substitui a virgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      //Converte para float
      value = parseFloat(value)

      //Verifica se o valor é númerico
      if (isNaN(value)){
        return alert("Não foi possível calcular o total, o valor informado não é numérico.")
      } 

      //Incrementar o valor total.
      total += Number(value)
    }
 
    //Cria a small para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    //Formata o valor e remove o R$ que será exibido pela small com estilo customizado.
    total = formatCurrrencyBRL(total).toUpperCase().replace("R$", "")
    
    //Limpa o conteúdo do elemento e adiciona o símbolo formatado e o valor total.
    expenseTotal.innerHTML = ""
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    alert("Não foi possível atualizar os totais.")
    console.log(error)
  }
}

//Evento que captura o click na lista
expenseList.addEventListener("click", function (event) {
  //Verifica se o elemento que foi clicado é o icone de remover.
  if (event.target.classList.contains("remove-icon")) {
    //Obtem a li pai do elemento clicado
    const itemRemove = event.target.closest(".expense")
    itemRemove.remove()
  }

  //Atualiza os totais
  updateTotals()
})

//Limpar campos
function limpaForm(){
  //Limpa os campos
  expense.value = ""
  category.value = ""
  amount.value = ""
  
  //Coloca o focus no campo de descrição da despesa.
  expense.focus()
}
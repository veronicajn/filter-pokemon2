const template = document.querySelector('.card')

let cardData = []

const filter = document.querySelector('.filter-input')
filter.onkeyup = filterPokemons

function filterPokemons(){
    const filtered = cardData.filter(pokemon => {
        if(pokemon.name.includes(filter.value)){
            return true
        } else {
            return false
        }
    })

    clearPokemons()
    renderPokemons(filtered)
}

function clearPokemons(){
    let container = document.querySelector('.container')
    container.innerHTML = ''
}

function renderPokemons(pokemons){ //array que contiene datos de pokemon
    pokemons.forEach(data => {
        addCard(data)
    })
}

function sorter(a, b){
    if(a.id > b.id){
        return 1
    } else {
        return -1
    }
}

function addCard(data){
    const card = template.cloneNode(true)
    document.querySelector('.container').appendChild(card)
    card.classList.remove('hidden')

    let nameNode = card.querySelector('.name-pokemon')
    nameNode.innerHTML = data.name

    let imgNode = card.querySelector('.card-img')
    imgNode.src = data.sprites.front_default

    let idNode = card.querySelector('.card-id')
    idNode.innerHTML = data.id

    let typeNode = card.querySelector('.type-pokemon')
    let typeContainer = card.querySelector('.types-pokemon')
    data.types.forEach(type => {
        let clone = typeNode.cloneNode(true)
        clone.innerHTML = type.type.name
        typeContainer.appendChild(clone)
    })
    typeContainer.children[0].remove()

    return card
}

function allPokemonLoaded(){
    cardData.sort(sorter)
    renderPokemons(cardData)
}

export function main(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => response.json())
        .then(data => {
            for(let pokemon of data.results){
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        cardData.push(pokemonData)
                        if(cardData.length === data.results.length){
                            allPokemonLoaded()
                        }
                    })
            }
        })

}

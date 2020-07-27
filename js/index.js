
const template = document.querySelector('.card')


let cardData = []

// RECORRE LOS POKEMON DEL DATA-------------------------------------------------------------------------------------------------
function renderPokemons(pokemons){//arrays de pokemons (cardData)
    
    pokemons.forEach(data => {
        addCard(data)//método que coge los elementos de las cards del data
       
    })
}



//MOSTRAR POKEMON EN EL INPUT 
function mostrarinput() {// en este método se compara lo que contiene el input al escribir con los pokemon que hay, si coincide los demás pokemon desaparecen
    let valor = document.querySelector(".cogerinput").value
    const filtered = cardData.filter(pokemon => {
        //filtrar los pokemon

       if(pokemon.name.includes(valor)){
        return true
       }else{
           return false

       }
    })
    clearPokemons()// si el pokemon es true  los demas se vacían para solo mostrar el que se escribió
    renderPokemons(filtered)
}


//LIMPIAR LOS POKEMON  DEL CONTAINER -------------------------------------------------------------------------------------------------
function clearPokemons(mostrarinput) {// en este método se hará que se limpie de vacío el pokemon, lo utilizaremos en el método anterior
    let container = document.querySelector('.container')
    container.innerHTML = ''
}


//AÑADIR LOS CARD DE POKEMON------------------------------------------------------------------------------------------------------------
function addCard(data){
    
    //eliminar el hidden de las card y cargar los hijos del container
    const card = template.cloneNode(true)
    document.querySelector('.container').appendChild(card)
    card.classList.remove('hidden')
    //cargar el nombre de pokemon
    let nameNode = card.querySelector('.nombrepokemon')
    nameNode.value = data.name
    //cargar la imagen del pokemon
    let imgNode = card.querySelector('.card-img')
    imgNode.src = data.sprites.front_default
    //cargar el id de pokemon
    let idNode = card.querySelector('.inputpok')
    idNode.value = data.id

    
    let evolucionNode = card.querySelector('.before-pokemon')
    evolucionNode.innerHTML = data.evolution

    //cargar el tipo de pokemon
    let typeNode = card.querySelector('.tipopokemon')//seleccion de la clase
    let typeContainer = card.querySelector('.pok2')//esl contenedor de los hijos tipopokemon
    data.types.forEach(type => {//seleccionar el tipo de pokemon en los data de la api
        let clone = typeNode.cloneNode(true)
        clone.innerHTML = type.type.name
        typeContainer.appendChild(clone)
    })
    typeContainer.children[1].remove()// se pone en la posicion 1 ya que  la posición 0 = nombrepokemon y no queremos que lo coja

    return card//devolver las cards

}

//ORDENACIÓN DE LOS POKEMON POR ID-----------------------------------------------------------------------------------------------------
function sorter(a, b){
    if(a > b){
        return -1
    } else {
        return 1
    }
}
//CARGAR TODOS LOS POKEMON--------------------------------------------------------------------------------------------------------------
function allPokemonLoaded(){
    // ordenarlo antes de renderizar los pokemon
    cardData.sort(sorter)//metodo de sorter que los ordena
    renderPokemons(cardData)
}



main()
 function main(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')//límite de pokemon para que coja solo 10

        .then(response => response.json())
        .then(data => {
            for(let pokemon of data.results){//resultados del data del json
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        fetch('https://pokeapi.co/api/v2/evolution-chain/' + pokemonData.id) // <- poner la url adecuada
                        .then(response => response.json())
                        .then(evolutionData => {
                            console.log(evolutionData)
                            if(evolutionData.chain.evolves_to[0]){
                                pokemonData.evolution = evolutionData.chain.evolves_to[0].species.name//guarda evolucion y vete a addcard linea 60
                            }

                               cardData.push(pokemonData)

                        if(cardData.length === data.results.length){
                            let eliminarhidden =  document.querySelector('.container-hidden')
                            eliminarhidden.classList.remove('container-hidden')

                            let hiddeninput = document.querySelector('.filter-hidden')
                            hiddeninput.classList.remove('filter-hidden')
                            //cargar los pokemon del método anterior
                            allPokemonLoaded()//metodo cargar pokemon
                            let hiddenspinner = document.querySelector('.spinnerpok').setAttribute("hidden", true)


                        }

                    })
                })
            }
        })

}

function getJSON(url, callback){
    return fetch(url)
        .then(response => response.json())
        .then(callback)
}

function main(){
    getJSON('https://pokeapi.co/api/v2/pokemon?limit=10', data => {
        for(let pokemon of data.results){
            getJSON(pokemon.url, pokemonData => {
                getJSON('https://pokeapi.co/api/v2/evolution-chain/' + pokemonData.id, evolutionData => {
                    if(evolutionData.chain.evolves_to[0]){
                        pokemonData.evolution = evolutionData.chain.evolves_to[0].species.name
                    }
                    cardData.push(pokemonData)
                    if(cardData.length === data.results.length){
                        let eliminarhidden =  document.querySelector('.container-hidden')
                            eliminarhidden.classList.remove('container-hidden')

                            let hiddeninput = document.querySelector('.filter-hidden')
                            hiddeninput.classList.remove('filter-hidden')
                            //cargar los pokemon del método anterior
                            allPokemonLoaded()//metodo cargar pokemon
                            let hiddenspinner = document.querySelector('.spinnerpok').setAttribute("hidden", true)

                    }
                })
            })
        }
    })
}







        

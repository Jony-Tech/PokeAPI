const btnBuscar = document.querySelector('#btn');
btnBuscar.addEventListener('click', buscarPokemon)

const baseUrl = 'https://pokeapi.co/api/v2/';

function crearCarta(pokemon){
    let article = document.createElement('article');
    article.classList.add('carta');
    article.innerHTML = `
        <h3>${pokemon.name}</h3>
        <ul>
          <img class="border" src="${pokemon.img}" alt="">
        </ul>
        <button onclick="obtenerInfo(${pokemon.id})">info</button>
    `
    document.querySelector('#render').appendChild(article);
}


async function obtenerPokemon(nombre){
    let respuestaApi = await fetch(`${baseUrl}pokemon/${nombre}`);
    let data = await respuestaApi.json();
    let propiedadesPokemon = {
        name: data.name,
        id: data.id,
        img: data.sprites.back_default
    }
    
    crearCarta(propiedadesPokemon);
    
}

async function obtenerListado(pokemonBuscar){
    let respuestaApi = await fetch(`${baseUrl}pokemon`);
    let listadoPokemons = await respuestaApi.json();
    let pokemonList = [];
    for (let index = 0; index < listadoPokemons.results.length; index++) {
        pokemon = listadoPokemons.results[index].name
            if(pokemonBuscar){
                pokemonList.push(pokemon)
            }else{
                await obtenerPokemon(pokemon);
            }
    }
    if(pokemonBuscar){
        const finded = pokemonList.find(function(word) {
            return pokemonBuscar === word
        });
        if (finded) {
            obtenerPokemon(finded)
        }else{
            mensajeNoEncontrado()
        }
    }

}
function mensajeNoEncontrado(){
    Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!"
    });
    obtenerListado()
}
obtenerListado();



async function buscarPokemon(e){
    e.preventDefault();
    const render = document.querySelector('#render');
    render.innerHTML = ``;
    let buscar = document.querySelector('#buscar');
    obtenerListado(buscar.value);
}

async function obtenerInfo(e){
    let respuestaApi = await fetch(`${baseUrl}pokemon/${e}`);
    let data = await respuestaApi.json();
    let propiedadesPokemon = {
        name: data.name,
        height: data.height,
        id: data.id,
        weight: data.weight,
        img: data.sprites.back_default,
        stats: data.stats
    }
    Swal.fire({
    imageUrl: `${propiedadesPokemon.img}`,
    title: `<strong>${propiedadesPokemon.name}</strong>`,
    html: `
    
    <ul>
        <li>Height: ${propiedadesPokemon.height}</li>
        <li>Weight: ${propiedadesPokemon.weight}</li>
        <li>HP: ${propiedadesPokemon.stats[0].base_stat}</li>
        <li>Effort: ${propiedadesPokemon.stats[1].base_stat}</li>
        <li>Defense: ${propiedadesPokemon.stats[2].base_stat}</li>
        
    </ul>
    `
});
}
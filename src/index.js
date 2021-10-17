//DOM objects
const pockemonName = document.getElementById("pockemonName");
const pockemonId = document.getElementById("pockemonId");
const pockemonHeight = document.getElementById("pockemonHeight");
const pockemonWeight = document.getElementById("pockemonWeight");
const pockemonImage = document.getElementById("pockemonImage");
const pockemonTypes = document.getElementById("pockemonTypes");
const pockemonFamily = document.getElementById("pockemonFamily");


let frontImageURL = "";
let backImageURL = "";
const baseURL = 'https://pokeapi.co/api/v2/'

function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    newElement.append(...children);
    newElement.classList.add(...classes);
    for ( let key in attributes){
        newElement.setAttribute(key , attributes[key] );
    }
    return newElement;
}

const showFamily = (data) =>{
    for (let i = 0 ; i < data.length ; i++){  
        let pockemonElement = createElement("li" , data[i].pokemon.name , ["list-group-item"]);
        pockemonElement.addEventListener("click" , handlerForFamilyClick)
        pockemonFamily.append(pockemonElement);
    }
}

const showTypes = (data) =>{
    for (let i = 0 ; i < data.length ; i++){  
        let typeElement = createElement("li" , data[i].type.name , ["list-group-item"]);
        typeElement.addEventListener("click" , getFamilyFromApi)
        pockemonTypes.append(typeElement);
    }
}
const showImage = (data) =>{
    frontImageURL= data['sprites']['front_default'];
    backImageURL= data['sprites']['back_default'];
    pockemonImage.src = `${frontImageURL}`;
    pockemonImage.addEventListener("mouseover", handlerForHover);
}
const showData = (data) =>{
    pockemonName.textContent = data.name;
    pockemonId.textContent = data.id;
    pockemonHeight.textContent = data.height;
    pockemonWeight.textContent = data.weight;
    console.log(data.types)
    showImage(data)
    showTypes(data.types)
}

const cleanTypesData = () =>{
    const ulLength = pockemonTypes.childNodes.length;
    for (let i = 0 ; i < ulLength ; i++){
        pockemonTypes.removeChild(pockemonTypes.childNodes[0]);
    }
}

const cleanFamilyData = () =>{
    const ulLength = pockemonFamily.childNodes.length;
    for (let i = 0 ; i < ulLength ; i++){
        pockemonFamily.removeChild(pockemonFamily.childNodes[0]);
    }
}

const deleteInput = (inputElement) =>{
    inputElement.value = "";
}

const getForApi = async (input) =>{
    try{
        let response = await axios.get(`${baseURL}pokemon/${input}`);
        return response.data;
    }
    catch(error) {
        deleteInput(document.querySelector('input'));
        console.log(error);
    }
    
}

const handlerHoverOut =() =>{
    pockemonImage.src = `${frontImageURL}`
}

//handler function => sent get request for the API and send the data to other function that show it on the page. 
const handlerForHover = () =>{
    pockemonImage.src = `${backImageURL}`
    pockemonImage.addEventListener("mouseout", handlerHoverOut)
}
const handlerForSerch = async (event) =>{
    let input = document.querySelector('input').value;
    deleteInput(document.querySelector('input'));
    cleanTypesData()
    cleanFamilyData()
    let data = await getForApi(input);
    showData(data);
}

const handlerForFamilyClick = async (event) =>{
    let input = event.target.textContent;
    cleanTypesData()
    cleanFamilyData()
    let data = await getForApi(input);
    showData(data);
}

const getFamilyFromApi = async (event) =>{
    let pockemonType = event.target.textContent;
    console.log(`${baseURL}type/${pockemonType}/`)
    let response = await fetch (`${baseURL}type/${pockemonType}/`, {
        method: 'get',
        mode: 'cors',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    if (response.status < 400){
        let result = await response.json();
        showFamily(result.pokemon)
    }else{
        error(`Something went wrong :${response.status} `)
    }
}
console.log(document.querySelector('button'))
console.log(document.querySelector('input').value)
document.querySelector('button').addEventListener("click",handlerForSerch)

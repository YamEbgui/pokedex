//DOM objects
const pockemonName = document.getElementById("pockemonName");
const pockemonId = document.getElementById("pockemonId");
const pockemonHeight = document.getElementById("pockemonHeight");
const pockemonWeight = document.getElementById("pockemonWeight");
const pockemonImage = document.getElementById("pockemonImage");
const pockemonTypes = document.getElementById("pockemonTypes");
const pockemonFamily = document.getElementById("pockemonFamily");

//variable section
let frontImageURL = "";
let backImageURL = "";
const baseURL = 'https://pokeapi.co/api/v2/'

//create element in the Dom with the arguments that it get
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    newElement.append(...children);
    newElement.classList.add(...classes);
    for ( let key in attributes){
        newElement.setAttribute(key , attributes[key] );
    }
    return newElement;
}

// create li (with eventlistener of click) for each pokemon name from the data. 
const showFamily = (data) =>{
    document.getElementById("pockFamilyTitle").removeAttribute("hidden");
    for (let i = 0 ; i < data.length ; i++){  
        let pockemonElement = createElement("li" , data[i].pokemon.name.toUpperCase() , ["list-group-item"]);
        pockemonElement.addEventListener("click" , handlerForFamilyClick)
        pockemonFamily.append(pockemonElement);
    }
}

//create li (with eventlistener of click) for each pokemon type from the data. 
const showTypes = (data) =>{
    document.getElementById("pockTypesTitle").removeAttribute("hidden");
    for (let i = 0 ; i < data.length ; i++){  
        let typeElement = createElement("li" , data[i].type.name.toUpperCase() , ["list-group-item"]);
        typeElement.addEventListener("click" , getFamilyFromApi)
        pockemonTypes.append(typeElement);
    }
}

// change the image to the image from the data(hover with mouse put other image from the data)
const showImage = (data) =>{
    frontImageURL= data['sprites']['front_default'];
    backImageURL= data['sprites']['back_default'];
    pockemonImage.src = `${frontImageURL}`;
    pockemonImage.addEventListener("mouseover", handlerForHover);
}

//change DOM objecct to show the data (pockemon data)
const showData = (data) =>{
    pockemonName.textContent ="NAME: "+ data.name.toUpperCase();
    pockemonId.textContent = "ID: "+  data.id;
    pockemonHeight.textContent ="HEIGHT: " + data.height;
    pockemonWeight.textContent ="WEIGHT " +  data.weight;
    showImage(data)
    showTypes(data.types)
}

//remove li elements from the types list in the DOM
const cleanTypesData = () =>{
    const ulLength = pockemonTypes.childNodes.length;
    for (let i = 0 ; i < ulLength ; i++){
        pockemonTypes.removeChild(pockemonTypes.childNodes[0]);
    }
}

//remove li elements from the family list in the DOM
const cleanFamilyData = () =>{
    const ulLength = pockemonFamily.childNodes.length;
    for (let i = 0 ; i < ulLength ; i++){
        pockemonFamily.removeChild(pockemonFamily.childNodes[0]);
    }
}

//make the input area blank
const deleteInput = (inputElement) =>{
    inputElement.value = "";
}

//send get reequest and return data from the API based on the url the user insert
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

// set image src and change it back when mouse is not in the image 
const handlerForHover = () =>{
    pockemonImage.src = `${backImageURL}`
    pockemonImage.addEventListener("mouseout", ()=>{
        pockemonImage.src = `${frontImageURL}`
    })
}

// delete data from the DOM and update it from the data the user insert
const handlerForSerch = async (event) =>{
    let input = document.querySelector('input').value;
    deleteInput(document.querySelector('input'));
    cleanTypesData()
    cleanFamilyData()
    let data = await getForApi(input);
    showData(data);
}

//handler for click on family member that clean the DOM and show the target data.
const handlerForFamilyClick = async (event) =>{
    let input = event.target.textContent.toLowerCase();
    cleanTypesData()
    cleanFamilyData()
    let data = await getForApi(input);
    showData(data);
    document.getElementById("pockTypesTitle").setAttribute("hidden", true);
}

// handler for click on pockemon type 
// send get request to API and update DOM. 
const getFamilyFromApi = async (event) =>{
    let pockemonType = event.target.textContent.toLowerCase();
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

document.querySelector('button').addEventListener("click",handlerForSerch)

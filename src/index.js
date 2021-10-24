
//DOM objects
const pockemonName = document.getElementById("pockemonName");
const pockemonId = document.getElementById("pockemonId");
const pockemonHeight = document.getElementById("pockemonHeight");
const pockemonWeight = document.getElementById("pockemonWeight");
const pockemonImage = document.getElementById("pockemonImage");
const pockemonTypes = document.getElementById("pockemonTypes");
const pockemonFamily = document.getElementById("pockemonFamily");
const userDom = document.getElementById("userContent");
const userStorageDom=document.getElementById("storageButton");


//variable section
let userName = "";
let frontImageURL = "";
let backImageURL = "";
const baseLocalServer = "http://localhost:8080/"
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
    document.getElementById("pockFamilyTitle").hidden= false;
    for (let i = 0 ; i < data.length ; i++){  
        let pockemonElement = createElement("li" , data[i].pokemon.name.toUpperCase() , ["list-group-item"]);
        pockemonElement.addEventListener("click" , handlerForFamilyClick)
        pockemonFamily.append(pockemonElement);
    }
}

//create li (with eventlistener of click) for each pokemon type from the data. 
const showTypes = (data) =>{
    document.getElementById("pockTypesTitle").hidden=false;
    for (let i = 0 ; i < data.length ; i++){ 
        let typeElement = createElement("li" , data[i].type.name.toUpperCase() , ["list-group-item"]);
        typeElement.addEventListener("click" , getFamilyFromApi)
        pockemonTypes.append(typeElement);
    }
}

// change the image to the image from the data(hover with mouse put other image from the data)
const showImage = (data) =>{
    frontImageURL= data.front_pic;
    backImageURL= data.back_pic;
    pockemonImage.src = `${frontImageURL}`;
    pockemonImage.addEventListener("mouseover", handlerForHover);
}

//change DOM objecct to show the data (pockemon data)
const showData = (data) =>{
    document.querySelector('input').placeholder="ENTER POKEMON NAME/ID"
    pockemonName.textContent ="NAME: "+ data.name.toUpperCase();
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
    document.getElementById("pockFamilyTitle").hidden= true;
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
        try{
            let response = await axios.get(`${baseLocalServer}pokemon/get/${input}`, {
                headers: {
                  'username': `${userName}`
                }});
                console.log(response);
            return response.data;
        }catch{
            let response = await axios.get(`${baseLocalServer}pokemon/query?name=${input}`, {
                headers: {
                  'username': `${userName}`
                }});
            return response.data;
        }
    }
    catch(error) {
        deleteInput(document.querySelector('input'));
        document.querySelector('input').placeholder="POKEMON NOT FOUND";
        
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
    try{
        let input = document.querySelector('input').value;
        deleteInput(document.querySelector('input'));
        cleanTypesData()
        cleanFamilyData()
        let data = await getForApi(input);
        showData(data);
    }catch{
        deleteInput(document.querySelector('input'));
        document.querySelector('input').placeholder="POKEMON NOT FOUND";
    }
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
    document.getElementById("pockFamilyTitle").hidden= false;
    let pockemonType = event.target.textContent.toLowerCase();
    console.log(`${baseURL}type/${pockemonType}/`)
    let response = await axios.get(`${baseURL}type/${pockemonType}/`);
    console.log(await response)
    if (response.status < 400){
        let result = await response;
        showFamily(result.data.pokemon)
    }else{
        error(`Something went wrong :${response.status} `)
    }
}

const refreshUserContent = () =>{
    console.log(typeof userDom.children[0])
    userDom.removeChild(userDom.children[0]);
    const userElement = createElement("h5",`USERNAME : ${userName}`) 
    userDom.append(userElement);
    document.getElementById("searchForm").hidden=false;
    userDom.children[0].hidden=false;
}

const handleUserLogIn = (event) =>{
    const input =document.getElementById('userInput').value;
    if(input !== ""){
        userName = input;
        console.log(userName);
        refreshUserContent();
        document.getElementById("searchButton").addEventListener("click",handlerForSerch);
        document.getElementById("catchButton").addEventListener("click",handleCatch);
        document.getElementById("releaseButton").addEventListener("click",handleRelease);
    }
}
const catchOnServer = async (input) =>{
    try{
        let response = await axios.put(`${baseLocalServer}pokemon/catch/${input}`,{}, {
            headers: {
              'username': `${userName}`
            }});
        let pokemonData = await getForApi(input);
        console.log(pokemonData)
        return pokemonData;
    }
    catch(error) {
        throw error;
        
    }
    
}
const releaseOnServer = async (input) =>{
    try{
        let response = await axios.delete(`${baseLocalServer}pokemon/release/${input}`, {
            headers: {
              'username': `${userName}`
            }},{});
        let pokemonData = await getForApi(input);
        console.log(pokemonData)
        return pokemonData;
    }
    catch(error) {
        throw error;
    }
    
}

const handleCatch = async (event) =>{
    try{
        let input = document.querySelector('input').value;
        deleteInput(document.querySelector('input'));
        cleanTypesData()
        cleanFamilyData()
        let data = await catchOnServer(input);
        console.log(data)
        showData(data);
    }catch{
        deleteInput(document.querySelector('input'));
        document.querySelector('input').placeholder="ALREADY CATCH POKEMON";
    }
}

const handleRelease = async (event) =>{
    try{
        let input = document.querySelector('input').value;
        deleteInput(document.querySelector('input'));
        cleanTypesData()
        cleanFamilyData()
        let data = await releaseOnServer(input);
        console.log(data)
        showData(data);
    }catch{
        deleteInput(document.querySelector('input'));
        document.querySelector('input').placeholder="THIS POKEMON NEVER CAUGHT";
    }
}
const getUserData = async ()=>{
    try{
        let response = await axios.get(`${baseLocalServer}pokemon/`, {
            headers: {
              'username': `${userName}`
            }});
        return response.data;
    }
    catch(error) {
        throw error;
    }
    
}

const showPokemonList = (List) =>{
    const listElement = document.getElementById("pokemonList");
    for (let i = 0 ; i < List.length; i++){
        let listItem = createElement("li",List[i].name,["dropdown-item"]);
        listItem.addEventListener("click", ()=>{
            console.log(1)
            showData(List[i]);
            handleStorage(event);
        });
        listElement.appendChild(listItem);
    }
}

const deleteListElement = () =>{
    listElement = document.getElementById("pokemonList");
    while(listElement.children[0]){
        let listItem = listElement.children[0];
        listElement.removeChild(listItem);
    }
}

const handleStorage = async (event) =>{
    if(userStorageDom.getAttribute("class").indexOf("show") > 0){
        deleteListElement();
        userStorageDom.setAttribute("class", userStorageDom.getAttribute("class").replace("show", ""));
        userStorageDom.setAttribute("aria-expanded" , false);
        let pokemonList=document.getElementById("pokemonList");
        pokemonList.setAttribute("class" , pokemonList.getAttribute("class").replace("show", "")) 
    }else{
        const pokemonStorageList = await getUserData();
        showPokemonList(pokemonStorageList);
        userStorageDom.setAttribute("class", userStorageDom.getAttribute("class") + " show");
        userStorageDom.setAttribute("aria-expanded" , true);
        let pokemonList=document.getElementById("pokemonList");
        pokemonList.setAttribute("class" , pokemonList.getAttribute("class") +" show") 
    }
}


document.getElementById("storageButton").addEventListener("click",handleStorage);
document.getElementById('login').addEventListener("click",handleUserLogIn);

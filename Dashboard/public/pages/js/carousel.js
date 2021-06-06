document.querySelector("#items").addEventListener("wheel", event =>{
if (event.deltaY >0) {
    event.target.scrollBy(300,0)
}else{
   event.target.scrollBy(-300,0) 
}
})

function retirarTraco(string) {
    let newString = string;
    for(let i =0; i < newString.length; i++) {
        let containsTraco = newString.indexOf('-'); 
        if(containsTraco != -1) {
            newString = newString.replace('-','');
        } else {
            return newString;
        }
    }
}
document.querySelector("#bt_icon").onclick = reloadPage;
document.querySelector("#icon_extend").onclick = animationMenu;


let sectionSidebar = document.querySelector("#sidebar");
let spanSidebar = document.querySelectorAll(".subtitle");
let divIconssidebar = document.querySelectorAll(".icon");
let extendIcon = document.querySelector("#icon_extend");
let extendImg = document.querySelector("#icon_extend_img");
let carousel = document.querySelector(".carousel");

let open_menu = false;

window.onload = validateUser();

function reloadPage() { 
    location.reload();
}

function validateUser(){
    usuario = sessionStorage.getItem('nomeCompleto');
    if (usuario == undefined) {
        document.getElementById("config").style="display:block";
    } else{
        document.getElementById("config").style="display:none";
    }
}

function animationMenu() {
    if (!open_menu) {
        sectionSidebar.style.animation = "extend_in 1s";
        sectionSidebar.style.width = "250px";
        extendImg.src = "../../img/icons/extend-enabled.png";
        if(carousel != null) {
            carousel.classList.toggle('minimize');
        }
        open_menu = true;
    } else {
        sectionSidebar.style.animation = "extend_out 1s";
        sectionSidebar.style.width = "80px";
        extendImg.src = "../../img/icons/extend-disabled.png";
        open_menu = false;
        setTimeout(() => {
            if(carousel != null) {
                carousel.classList.toggle('minimize');
            }
        }, 1000);
    }
    
    spanSidebar.forEach(title => {
        title.classList.toggle('hide');
    });
    
    divIconssidebar.forEach(div_icon => {
        div_icon.classList.toggle('extendIcons');
    });

}

function logof(){
    sessionStorage.clear();
    navegate("../../index.html");
}

document.querySelector("#dash").onclick = () => navegate("../Home/index.html");
document.querySelector("#relatorio").onclick = () => navegate("../Relatorio/index.html");
document.querySelector("#config").onclick = () => navegate("../Adm/adm.html");
document.querySelector("#logout").onclick = () => logof();
document.querySelector("#Blacklist").onclick = () => navegate("../Blacklist/index.html");
document.querySelector("#Incidente").onclick = () => navegate("../Incidentes/index.html")

function navegate(screen) {
    window.location.href = screen;  
}
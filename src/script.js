function openPopUp() {
    popUp = document.querySelector('.info-pop-up');
    popUp.style.opacity = "1";
    popUp.style.zIndex = "999"
}
function closePopUp() {
    popUp = document.querySelector('.info-pop-up');
    popUp.style.opacity = "0";
    popUp.style.zIndex = "-1"
}
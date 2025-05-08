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

function start() {
    introBloc = document.querySelector('.intro-pop-up');
    introBloc.style.display = "none";
    galleryButton = document.querySelector('.gallery');
    galleryButton.style.opacity = "1";
    cursor = document.getElementById('cursor');
    cursor.style.opacity = "1";

}
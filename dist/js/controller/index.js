
function disableScroll() {
    document.querySelector("body").style.overflow = "hidden";
};

function enableScroll() {
    document.querySelector("body").style.overflow = "initial";
};

function showLoaderScreen() {
    document.querySelector("#loader-container").classList.remove("visually-hidden");
};

function hideLoaderScreen() {
    document.querySelector("#loader-container").classList.add("visually-hidden");
};
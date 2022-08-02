
let loaderElement;
let spinnerElement;
let textElement;
let body;

function init() {
    loaderElement = document.createElement("div");
    loaderElement.classList.add("bg-dark", "w-100", "h-100", "position-absolute", "top-0", "bg-opacity-50", "d-flex", "justify-content-center", "align-items-center", "flex-column");

    spinnerElement = document.createElement("div");
    spinnerElement.classList.add("spinner-border", "text-primary", "fs-1");
    spinnerElement.style.width = "200px";
    spinnerElement.style.height = "200px";

    textElement = document.createElement("div");
    textElement.classList.add("text-light", "pt-5", "fs-2");
    textElement.textContent = "Carregando Documento";

    loaderElement.appendChild(spinnerElement);
    loaderElement.appendChild(textElement);

    body = document.querySelector("body");
};

function loader(task) {
    return new Promise(resolve => {
        init();
        show();

        task().then(promise => {

            resolve(promise)
            hide();
        });
    });
};

function disableScroll() {
    body.style.overflow = "hidden";
};

function enableScroll() {
    body.style.overflow = "initial";
};

function show() {
    body.appendChild(loaderElement);
    disableScroll();
};

function hide() {
    body.removeChild(loaderElement);
    enableScroll();
};

export default loader;
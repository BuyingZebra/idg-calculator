async function loadSvgIcon(
    container,
    iconName
){

    if(
        !container ||
        !iconName
    ){
        return;
    }

    try{

        const response =
            await fetch(
                `./assets/icons/${iconName}.svg`
            );

        if(
            !response.ok
        ){

            throw new Error(
                `Unable to load icon: ${iconName}`
            );

        }

        const svgMarkup =
            await response.text();

        container.innerHTML =
            svgMarkup;

    }
    catch(error){

        console.error(
            error
        );

    }

}

async function renderIcons(root=document){

    const iconElements =
        root.querySelectorAll(
            "[data-icon]"
        );

    for(
        const element
        of
        iconElements
    ){

        const developmentOnly=
            element.closest("[data-development-only]");

        if(
            developmentOnly &&
            typeof isDevelopmentMode==="function" &&
            !isDevelopmentMode()
        ){
            continue;
        }

        await loadSvgIcon(
            element,
            element.dataset.icon
        );

    }

}

async function initializeIcons(){
    await renderIcons(document);
}

document.addEventListener(
    "DOMContentLoaded",
    initializeIcons
);
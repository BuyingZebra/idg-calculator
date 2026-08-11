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

async function initializeIcons(){

    const iconElements =
        document.querySelectorAll(
            "[data-icon]"
        );

    for(
        const element
        of
        iconElements
    ){

        await loadSvgIcon(
            element,
            element.dataset.icon
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initializeIcons
);
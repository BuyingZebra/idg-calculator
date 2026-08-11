
/* ===== Layout / workspace transition ===== */

const HEADER_ANIMATION_DURATION =
    800;

function initializeLayout(){

    const headerBackButton =
        document.getElementById(
            "headerBackButton"
        );

    if(
        headerBackButton
    ){

        headerBackButton.addEventListener(
            "click",
            hideWorkspace
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initializeLayout
);

function getWorkspaceSlideDistance(){

    const pageViewport =
        document.getElementById(
            "pageViewport"
        );

    if(
        !pageViewport
    ){
        return 0;
    }

    return pageViewport
        .getBoundingClientRect()
        .width;

}

function showWorkspace(){

    const pageTrack =
        document.getElementById(
            "pageTrack"
        );

    if(
        !pageTrack
    ){
        return;
    }

    pageTrack.style.transform =
        "translateX(-50%)";

    showHeaderBackButton();

}

function hideWorkspace(){

    const pageTrack =
        document.getElementById(
            "pageTrack"
        );

    if(
        !pageTrack
    ){
        return;
    }

    animateHeaderTitleBackward(
        "Dockside Grading Tool"
    );

    pageTrack.style.transform =
        "translateX(0)";

    hideHeaderBackButton();

}

function animateHeaderTitleForward(
    title
){

    const currentTitle =
        document.getElementById(
            "headerTitleCurrent"
        );

    const incomingTitle =
        document.getElementById(
            "headerTitleIncoming"
        );

    if(
        !currentTitle ||
        !incomingTitle
    ){
        return;
    }

    const distance =
        getWorkspaceSlideDistance();

    incomingTitle.textContent =
        title;

    incomingTitle.style.transition =
        "none";

    incomingTitle.style.transform =
        `translateX(${distance}px)`;

    incomingTitle.offsetHeight;

    currentTitle.style.transition =
        `transform ${HEADER_ANIMATION_DURATION}ms ease`;

    incomingTitle.style.transition =
        `transform ${HEADER_ANIMATION_DURATION}ms ease`;

    currentTitle.style.transform =
        `translateX(-${distance}px)`;

    incomingTitle.style.transform =
        "translateX(0)";

    setTimeout(
        ()=>{

            currentTitle.textContent =
                title;

            currentTitle.style.transition =
                "none";

            currentTitle.style.transform =
                "translateX(0)";

            incomingTitle.style.transition =
                "none";

            incomingTitle.style.transform =
                `translateX(${distance}px)`;

            incomingTitle.textContent =
                "";

        },
        HEADER_ANIMATION_DURATION
    );

}

function animateHeaderTitleBackward(
    title
){

    const currentTitle =
        document.getElementById(
            "headerTitleCurrent"
        );

    const incomingTitle =
        document.getElementById(
            "headerTitleIncoming"
        );

    if(
        !currentTitle ||
        !incomingTitle
    ){
        return;
    }

    const distance =
        getWorkspaceSlideDistance();

    incomingTitle.textContent =
        title;

    incomingTitle.style.transition =
        "none";

    incomingTitle.style.transform =
        `translateX(-${distance}px)`;

    incomingTitle.offsetHeight;

    currentTitle.style.transition =
        `transform ${HEADER_ANIMATION_DURATION}ms ease`;

    incomingTitle.style.transition =
        `transform ${HEADER_ANIMATION_DURATION}ms ease`;

    currentTitle.style.transform =
        `translateX(${distance}px)`;

    incomingTitle.style.transform =
        "translateX(0)";

    setTimeout(
        ()=>{

            currentTitle.textContent =
                title;

            currentTitle.style.transition =
                "none";

            currentTitle.style.transform =
                "translateX(0)";

            incomingTitle.style.transition =
                "none";

            incomingTitle.style.transform =
                `translateX(-${distance}px)`;

            incomingTitle.textContent =
                "";

        },
        HEADER_ANIMATION_DURATION
    );

}

function showHeaderBackButton(){

    const button =
        document.getElementById(
            "headerBackButton"
        );

    if(
        !button
    ){
        return;
    }

    button.style.visibility =
        "visible";

}

function hideHeaderBackButton(){

    const button =
        document.getElementById(
            "headerBackButton"
        );

    if(
        !button
    ){
        return;
    }

    button.style.visibility =
        "hidden";

}

/* ===== Workspace routing ===== */

let currentWorkspace = null;

function loadWorkspace(step){
    currentWorkspace = step;

    switch(step){
        case 0:
            animateHeaderTitleForward("Inspection Detail");
            renderInspectionDetailWorkspace();
            break;
        case 1:
            animateHeaderTitleForward("Inspection Summary");
            renderInspectionSummaryWorkspace();
            break;
        case 2:
            animateHeaderTitleForward("Activity Slip");
            renderActivitySlipWorkspace();
            break;
        default:
            return;
    }

    showWorkspace();
}

function setWorkspaceContent(content){
    const workspaceContent = document.getElementById("workspaceContent");
    if(!workspaceContent) return;
    workspaceContent.innerHTML = content;
}

function getCurrentWorkspace(){
    return currentWorkspace;
}


/* ===== Timeline navigation ===== */

let currentStep = 0;

const timelineItems =
    document.querySelectorAll(
        ".timelineItem"
    );

function updateTimelineGeometry(){
    const container=document.getElementById("timelineContainer");
    const baseLine=document.getElementById("timelineLine");
    const progress=document.getElementById("timelineProgress");
    const nodes=Array.from(document.querySelectorAll(".timelineItem .timelineNode"));

    if(!container || !baseLine || !progress || nodes.length<2) return;

    const containerRect=container.getBoundingClientRect();
    const firstRect=nodes[0].getBoundingClientRect();
    const lastRect=nodes[nodes.length-1].getBoundingClientRect();

    const firstCenterY=(firstRect.top + firstRect.height/2) - containerRect.top;
    const lastCenterY=(lastRect.top + lastRect.height/2) - containerRect.top;
    const firstCenterX=(firstRect.left + firstRect.width/2) - containerRect.left;

    const lineHeight=Math.max(0,lastCenterY-firstCenterY);

    baseLine.style.left=`${firstCenterX}px`;
    baseLine.style.top=`${firstCenterY}px`;
    baseLine.style.height=`${lineHeight}px`;

    progress.style.left=`${firstCenterX}px`;
    progress.style.top=`${firstCenterY}px`;
    progress.dataset.fullHeight=String(lineHeight);

    updateTimelineCompletionOverlay();
}

function updateTimelineSelection(step){
    const items = Array.from(document.querySelectorAll(".timelineItem"));
    items.forEach((item,index)=>{
        const active = index === step;
        item.classList.toggle("active", active);
        if(active){
            item.setAttribute("aria-current","step");
        }else{
            item.removeAttribute("aria-current");
        }
    });

    requestAnimationFrame(updateTimelineGeometry);
}

function updateTimelineCompletionOverlay(){
    const progress=document.getElementById("timelineProgress");
    if(!progress) return;

    const items=Array.from(document.querySelectorAll(".timelineItem"));
    const allComplete=items.length>0 && items.every(item=>item.classList.contains("complete"));
    const fullHeight=Number(progress.dataset.fullHeight || 0);

    progress.style.height=allComplete ? `${fullHeight}px` : "0px";
}


function initializeTimeline(){
    const items = document.querySelectorAll(".timelineItem");

    items.forEach(item=>{
        item.addEventListener("click",()=>{
            const newStep = Number(item.dataset.step);
            moveContentTo(newStep);
            currentStep = newStep;
            updateTimelineSelection(newStep);
        });
    });

    updateTimelineSelection(0);
}

document.addEventListener(
    "DOMContentLoaded",
    initializeTimeline
);

window.addEventListener("resize",()=>{
    requestAnimationFrame(updateTimelineGeometry);
});

window.addEventListener("orientationchange",()=>{
    setTimeout(updateTimelineGeometry,120);
});

/* ===== Preview-card navigation ===== */

const debugCompletedSteps = new Set();

function updateDebugCompletionUI(){
    document.querySelectorAll("[data-debug-complete]").forEach(control=>{
        const step=Number(control.dataset.debugComplete);
        const complete=debugCompletedSteps.has(step);
        control.classList.toggle("complete",complete);
        control.classList.toggle("pending",!complete);
        control.setAttribute("aria-pressed",String(complete));

        const timelineItem=document.querySelector(`.timelineItem[data-step="${step}"]`);
        if(timelineItem) timelineItem.classList.toggle("complete",complete);
    });

    requestAnimationFrame(updateTimelineGeometry);
}

function initializeContent(){
    document.querySelectorAll("[data-open-step]").forEach(button=>{
        button.addEventListener("click",(event)=>{
            event.stopPropagation();
            loadWorkspace(Number(button.dataset.openStep));
        });
    });

    document.querySelectorAll("[data-review-step]").forEach(button=>{
        button.addEventListener("click",(event)=>{
            event.stopPropagation();
            showReviewOverlay(Number(button.dataset.reviewStep));
        });
    });

    document.querySelectorAll("[data-debug-complete]").forEach(control=>{
        control.addEventListener("click",(event)=>{
            event.stopPropagation();
            const step=Number(control.dataset.debugComplete);
            if(debugCompletedSteps.has(step)){
                debugCompletedSteps.delete(step);
            }else{
                debugCompletedSteps.add(step);
            }
            updateDebugCompletionUI();
        });
    });

    updateDebugCompletionUI();
}

document.addEventListener(
    "DOMContentLoaded",
    initializeContent
);

function moveContentTo(step){

    const track =
        document.getElementById(
            "contentTrack"
        );

    const page =
        document.querySelector(
            `.contentPage[data-step="${step}"]`
        );

    if(!page){
        return;
    }

    document
        .querySelectorAll(
            ".contentPage"
        )
        .forEach(
            (page)=>{

                page.classList.remove(
                    "active"
                );

            }
        );

    page.classList.add(
        "active"
    );

    const moveDistance =
        page.offsetTop;

    track.style.transform =
        `translateY(-${moveDistance}px)`;

}
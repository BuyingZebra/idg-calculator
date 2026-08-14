

/* ===== Development layout inspector ===== */

function initializeLayoutDebugToggle(){
    const button=document.getElementById("headerHelpButton");
    if(!button) return;

    button.addEventListener("click",()=>{
        const enabled=document.body.classList.toggle("debugLayout");
        button.setAttribute("aria-pressed",String(enabled));
        button.classList.toggle("active",enabled);
    });
}

document.addEventListener("DOMContentLoaded",initializeLayoutDebugToggle);

/* ===== Layout / workspace transition ===== */

function updateFisheriesNotification(deadPercent=0, criticalWeakPercent=0){
    const box=document.querySelector("[data-fisheries-notification]");
    if(!box) return;

    const dead=Number(deadPercent || 0);
    const critical=Number(criticalWeakPercent || 0);
    const required=dead>4 || critical>20;

    box.dataset.required=required ? "true" : "false";

    const title=box.querySelector("[data-fisheries-notification-title]");
    const text=box.querySelector("[data-fisheries-notification-text]");
    if(title) title.textContent="FISHERIES NOTIFICATION";
    if(text) text.textContent=required
        ? "Contact fisheries, thresholds exceeded"
        : "No notification is required";
}

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

function showWorkspace(){
    const pageTrack=document.getElementById("pageTrack");
    if(!pageTrack) return;
    pageTrack.style.transform="translateX(-50%)";
    showHeaderBackButton();
}

function hideWorkspace(){
    const pageTrack=document.getElementById("pageTrack");
    if(!pageTrack) return;
    pageTrack.style.transform="translateX(0)";
    hideHeaderBackButton();
    currentWorkspace=null;
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
            renderInspectionDetailWorkspace();
            break;
        case 1:
            renderInspectionSummaryWorkspace();
            break;
        case 2:
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

const completedSteps = new Set();

function updateCompletionUI(){
    document.querySelectorAll("[data-complete-step]").forEach(control=>{
        const step=Number(control.dataset.completeStep);
        const complete=completedSteps.has(step);
        control.classList.toggle("complete",complete);
        control.classList.toggle("pending",!complete);
        control.setAttribute("aria-pressed",String(complete));

        const completionIcon=control.querySelector(".cardStepIcon");
        if(completionIcon){
            const iconName=complete ? "complete" : "incomplete";
            if(completionIcon.dataset.icon !== iconName){
                completionIcon.dataset.icon=iconName;
                if(typeof loadSvgIcon==="function"){
                    loadSvgIcon(completionIcon,iconName);
                }
            }
        }

        const timelineItem=document.querySelector(`.timelineItem[data-step="${step}"]`);
        if(timelineItem) timelineItem.classList.toggle("complete",complete);
    });

    requestAnimationFrame(updateTimelineGeometry);
}


/* ===== SVG percentage arc rendering =====
   v140 production geometry:
   - 0% starts at 12 o'clock.
   - Percentage describes the visible coloured length, including round caps.
   - The centreline arc is shortened by one total stroke-width because two
     round caps extend the visible stroke by half a stroke-width at each end.
   - No dasharray / dashoffset geometry is used.
*/
function polarPoint(cx,cy,r,percent){
    const angle=((percent/100)*360)-90;
    const radians=angle*Math.PI/180;

    return {
        x:cx + (r*Math.cos(radians)),
        y:cy + (r*Math.sin(radians))
    };
}

function getArcStrokeWidthInUserUnits(path){
    const computed=window.getComputedStyle(path);
    const strokePx=parseFloat(computed.strokeWidth)||0;
    const ctm=path.getScreenCTM();

    if(!ctm) return strokePx;

    /* Convert the non-scaling screen stroke back into SVG user units so the
       cap compensation remains correct as the responsive SVG changes size. */
    const scaleX=Math.hypot(ctm.a,ctm.b)||1;
    const scaleY=Math.hypot(ctm.c,ctm.d)||1;
    const scale=(scaleX+scaleY)/2;

    return strokePx/scale;
}

function setCircleTrim(path,start,end){
    if(!path) return;

    const clamp=value=>Math.max(0,Math.min(100,Number(value)||0));
    const requestedStart=clamp(start);
    const requestedEnd=clamp(end);
    const requestedSpan=Math.max(0,requestedEnd-requestedStart);

    if(requestedSpan<=0){
        path.setAttribute("d","");
        return;
    }

    const cx=50;
    const cy=50;
    const r=44;
    const circumference=2*Math.PI*r;
    const strokeWidth=getArcStrokeWidthInUserUnits(path);

    /* Two round caps add half a stroke-width each along the tangent.
       Subtract their combined visual contribution from the centreline length. */
    const capPercent=(strokeWidth/circumference)*100;
    const centrelineSpan=Math.max(0,requestedSpan-capPercent);

    /* A fixed-width round stroke has a minimum visible mark equal to its cap
       diameter. For values below that threshold, use a zero-length round path:
       this is the SVG-defined minimum round-cap mark and avoids inventing
       distorted stroke geometry. */
    if(centrelineSpan<=0){
        const point=polarPoint(cx,cy,r,requestedStart);
        path.setAttribute("d",`M ${point.x} ${point.y} l 0 0`);
        return;
    }

    /* Keep the visible result centred on the requested angular interval:
       half of the cap compensation is removed from each geometric endpoint. */
    const halfCapPercent=capPercent/2;
    const trimStart=requestedStart+halfCapPercent;
    const trimEnd=requestedEnd-halfCapPercent;
    const span=trimEnd-trimStart;

    /* At a true 100%, there should be no visible endpoint/cap seam.
       Render a closed two-arc circle instead. */
    if(requestedSpan>=99.9999){
        const top=polarPoint(cx,cy,r,0);
        const bottom=polarPoint(cx,cy,r,50);

        path.setAttribute(
            "d",
            `M ${top.x} ${top.y} ` +
            `A ${r} ${r} 0 1 1 ${bottom.x} ${bottom.y} ` +
            `A ${r} ${r} 0 1 1 ${top.x} ${top.y} Z`
        );
        return;
    }

    const startPoint=polarPoint(cx,cy,r,trimStart);
    const endPoint=polarPoint(cx,cy,r,trimEnd);
    const largeArcFlag=span>50 ? 1 : 0;

    path.setAttribute(
        "d",
        `M ${startPoint.x} ${startPoint.y} ` +
        `A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`
    );
}

function refreshInspectionDetailPreview(){
    if(typeof appState==="undefined" || !appState.inspectionDetail) return;

    const results=appState.inspectionDetail.results || {};
    const values={
        premium:Number(results.premiumPercent || 0),
        standard:Number(results.standardPercent || 0),
        reject:Number(results.rejectPercent || 0)
    };

    updateFisheriesNotification(
        Number(results.deadPercent || 0),
        Number(results.criticalWeakPercent || 0)
    );

    Object.entries(values).forEach(([key,value])=>{
        const safe=Math.max(0,Math.min(100,Number.isFinite(value)?value:0));
        const label=document.querySelector(`[data-home-percent="${key}"]`);

        const progress=document.querySelector(`[data-home-progress="${key}"]`);
        if(progress){
            setCircleTrim(progress,0,safe);
        }

        if(label) label.innerHTML=`<span class="donutPercentNumber">${safe.toFixed(2)}</span><span class="donutPercentUnit">%</span>`;
    });

    const premiumBySize=Math.max(0,Math.min(100,Number(results.premiumBySize || 0)));
    const standardBySize=Math.max(0,Math.min(100,Number(results.standardBySize || 0)));
    const hasBySizeData=premiumBySize>0 || standardBySize>0;

    const premiumSizeDetail=document.querySelector("[data-summary-premium-size]");
    if(premiumSizeDetail){
        premiumSizeDetail.innerHTML=`<span class="sizePercentNumber">${premiumBySize.toFixed(2)}</span><span class="sizePercentUnit">%</span>`;
    }

    const standardSizeDetail=document.querySelector("[data-summary-standard-size]");
    if(standardSizeDetail){
        standardSizeDetail.innerHTML=`<span class="sizePercentNumber">${standardBySize.toFixed(2)}</span><span class="sizePercentUnit">%</span>`;
    }

    setLinearProgress(
        document.querySelector("[data-summary-premium-bar]"),
        hasBySizeData ? premiumBySize : 0
    );

    setLinearProgress(
        document.querySelector("[data-summary-standard-bar]"),
        hasBySizeData ? standardBySize : 0
    );
}

/* ===== Linear percentage rendering =====
   Straight progress bars use direct 0–100 width geometry.
   Border radius is visual styling only and remains inside this width.
*/
function setLinearProgress(element,value){
    if(!element) return;

    const safe=Math.max(0,Math.min(100,Number(value)||0));
    element.style.width=`${safe}%`;
}

function refreshInspectionSummaryPreview(){
    if(typeof appState==="undefined" || !appState.inspectionSummary) return;

    const inputs=appState.inspectionSummary.inputs || {};
    const results=appState.inspectionSummary.results || {};

    const samples=Math.max(0,Number(results.numberOfSamples || 0));

    const setText=(selector,value)=>{
        const el=document.querySelector(selector);
        if(el) el.textContent=value;
    };

    const vesselSource =
        appState?.landingInformation?.inputs ||
        appState?.landingInfo?.inputs ||
        appState?.inspectionSummary?.inputs ||
        {};
    const boatName =
        vesselSource.boatName ??
        vesselSource.vesselName ??
        vesselSource.boat ??
        appState?.boatName ??
        appState?.vesselName ??
        "";
    const cfv =
        vesselSource.cfv ??
        vesselSource.cfvNumber ??
        vesselSource.vesselNumber ??
        appState?.cfv ??
        "";
    const fishReceipt =
        vesselSource.fishReceipt ??
        vesselSource.fishReceiptNumber ??
        vesselSource.receiptNumber ??
        appState?.fishReceipt ??
        "";

    setText("[data-summary-boat-name]", boatName || "Boat Name");
    document.querySelector("[data-summary-boat-name]")?.toggleAttribute("data-empty-state", !boatName);
    setText("[data-summary-cfv]", cfv || "123456");
    document.querySelector("[data-summary-cfv]")?.toggleAttribute("data-empty-state", !cfv);
    setText("[data-summary-fish-receipt]", fishReceipt || "1234567");
    document.querySelector("[data-summary-fish-receipt]")?.toggleAttribute("data-empty-state", !fishReceipt);

    setText("[data-summary-samples]",String(samples));
    setText("[data-summary-net-landed]",net.toLocaleString(undefined,{maximumFractionDigits:1}));
    const crabSummary=document.querySelector("[data-summary-crab-percent]");
    if(crabSummary){
        crabSummary.innerHTML=`<span class="summaryMetricNumber">${percentCrab.toFixed(2)}</span><span class="summaryMetricUnit">%</span>`;
    }
}

function refreshHomePreview(){
    refreshInspectionDetailPreview();
    refreshInspectionSummaryPreview();
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

    document.querySelectorAll("[data-complete-step]").forEach(control=>{
        control.addEventListener("click",(event)=>{
            event.stopPropagation();
            const step=Number(control.dataset.completeStep);
            if(completedSteps.has(step)){
                completedSteps.delete(step);
            }else{
                completedSteps.add(step);
            }
            updateCompletionUI();
        });
    });

    updateCompletionUI();
    refreshHomePreview();
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

let activityTravelData = null;

const activityState = {
    work: {
        origin: "",
        destination: "",
        arrivalTime: "",
        inspectionStart: "",
        inspectionEnd: ""
    },
    returnTravel: {
        enabled: false,
        destination: ""
    }
};

function activityEscape(value){
    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;");
}

function activityParseTime(value){
    if(!value || !/^\d{2}:\d{2}$/.test(value)) return null;
    const [h,m]=value.split(":").map(Number);
    if(h<0||h>23||m<0||m>59) return null;
    return h*60+m;
}

function activityFormatTime(totalMinutes){
    if(totalMinutes===null || !Number.isFinite(totalMinutes)) return "—";
    const mins=((Math.round(totalMinutes)%1440)+1440)%1440;
    const h=Math.floor(mins/60);
    const m=mins%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function activityDuration(start,end){
    if(start===null || end===null) return 0;
    let diff=end-start;
    if(diff<0) diff+=1440;
    return diff;
}

function activityFormatDuration(minutes){
    const mins=Math.max(0,Math.round(minutes||0));
    const h=Math.floor(mins/60),m=mins%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function activityRoute(origin,destination){
    if(!activityTravelData || !origin || !destination) return null;
    const n=activityTravelData.locations.length;
    const oi=activityTravelData.index.get(origin);
    const di=activityTravelData.index.get(destination);
    if(oi===undefined || di===undefined) return null;
    const pos=oi*n+di;
    return {
        distance: activityTravelData.distanceKm[pos] || 0,
        time: activityTravelData.timeMin[pos] || 0
    };
}

function activityLocationRow(label,id,value,placeholder,disabled=false){
    return `<div class="formRow activitySelectRow${disabled?" activityDisabledRow":""}">
        <label for="${id}">${label}</label>
        <span class="activitySelectField activitySearchField">
            <input
                id="${id}"
                type="text"
                list="activityLocationOptions"
                autocomplete="off"
                spellcheck="false"
                placeholder="${activityEscape(placeholder)}"
                value="${activityEscape(value||"")}"
                ${disabled?"disabled":""}>
        </span>
    </div>`;
}

function activityLocationDatalist(){
    const locations=activityTravelData?.locations || [];
    return `<datalist id="activityLocationOptions">
        ${locations.map(name=>`<option value="${activityEscape(name)}"></option>`).join("")}
    </datalist>`;
}

function activityTimeRow(label,id,value){
    return `<div class="formRow">
        <label for="${id}">${label}</label>
        <span class="numberField activityTimeField">
            <input id="${id}" type="time" step="60" value="${activityEscape(value||"")}">
        </span>
    </div>`;
}

function activityComputed(){
    const inbound=activityRoute(activityState.work.origin,activityState.work.destination);

    const arrival=activityParseTime(activityState.work.arrivalTime);
    const inspectionStart=activityParseTime(activityState.work.inspectionStart);
    const inspectionEnd=activityParseTime(activityState.work.inspectionEnd);

    const wait=activityDuration(arrival,inspectionStart);
    const baseInspection=activityDuration(inspectionStart,inspectionEnd);
    const inspectionTotal=baseInspection;

    const travelStart=(arrival!==null && inbound)
        ? arrival-inbound.time
        : null;

    const returnRoute=activityState.returnTravel.enabled
        ? activityRoute(activityState.work.destination,activityState.returnTravel.destination)
        : null;

    const returnStart=activityState.returnTravel.enabled ? inspectionEnd : null;
    const returnEnd=(returnStart!==null && returnRoute)
        ? returnStart+returnRoute.time
        : null;

    return {
        inbound,
        arrival,
        inspectionStart,
        inspectionEnd,
        wait,
        baseInspection,
        inspectionTotal,
        travelStart,
        returnRoute,
        returnStart,
        returnEnd
    };
}

function activitySheet(title,rows,extraClass=""){
    return `<div class="activityDataSheet ${extraClass}">
        <div class="resultsHeading dataSheetHeading">
            <span class="resultsHeadingIcon">◉</span>
            <span>${title}</span>
        </div>
        <div class="resultsTableWrap">
            <table class="resultsTable activitySlipTable">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Hrs / Kms</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row=>`
                        <tr>
                            <td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td>${row[2]}</td>
                            <td>${row[3]}</td>
                        </tr>`).join("")}
                </tbody>
            </table>
        </div>
    </div>`;
}

function workActivitySheet(c){
    return activitySheet("Work Activity",[
        [
            "Wait Time",
            activityState.work.arrivalTime || "—",
            activityState.work.inspectionStart || "—",
            activityFormatDuration(c.wait)
        ],
        [
            "Inspection Time",
            activityState.work.inspectionStart || "—",
            activityState.work.inspectionEnd || "—",
            activityFormatDuration(c.inspectionTotal)
        ],
        [
            "Travel Time",
            activityFormatTime(c.travelStart),
            activityState.work.arrivalTime || "—",
            c.inbound ? activityFormatDuration(c.inbound.time) : "—"
        ],
        [
            "Mileage",
            "—",
            "—",
            c.inbound ? `${c.inbound.distance} km` : "—"
        ],
        [
            "Expenses",
            "—",
            "—",
            "—"
        ]
    ]);
}

function returnTravelSheet(c){
    const disabled=!activityState.returnTravel.enabled;
    return activitySheet(
        "Return Travel",
        [
            [
                "Travel Time",
                disabled ? "—" : activityFormatTime(c.returnStart),
                disabled ? "—" : activityFormatTime(c.returnEnd),
                disabled || !c.returnRoute ? "—" : activityFormatDuration(c.returnRoute.time)
            ],
            [
                "Mileage",
                "—",
                "—",
                disabled || !c.returnRoute ? "—" : `${c.returnRoute.distance} km`
            ],
            [
                "Expenses",
                "—",
                "—",
                "—"
            ]
        ],
        disabled ? "activityDataSheetDisabled" : ""
    );
}

function activityRenderResults(){
    const c=activityComputed();

    const distancePreview=document.getElementById("activityTravelDistancePreview");
    if(distancePreview){
        distancePreview.textContent=c.inbound ? `${c.inbound.distance} km` : "— km";
    }

    const timePreview=document.getElementById("activityTravelTimePreview");
    if(timePreview){
        timePreview.textContent=c.inbound ? `${c.inbound.time} min` : "— min";
    }

    const container=document.getElementById("activityLiveResults");
    if(container){
        container.innerHTML=workActivitySheet(c)+returnTravelSheet(c);
    }
}


function activityCompactDuration(minutes){const mins=Math.max(0,Math.round(Number(minutes)||0));if(mins<60)return `${mins} min`;const h=Math.floor(mins/60),m=mins%60;return m?`${h} hr ${m} min`:`${h} hr`;}
function setActivityDurationValue(selector,minutes,hasEntry){
 const totalMinutes=Math.max(0,Math.round(Number(minutes)||0));
 const hours=Math.floor(totalMinutes/60);
 const remainingMinutes=totalMinutes%60;
 document.querySelectorAll(selector).forEach(el=>{
  el.dataset.emptyState=String(!hasEntry);
  if(!hasEntry){
   el.textContent='No Entry Yet';
   return;
  }
  const parts=[];
  if(hours>0){
   parts.push(`<span class="activityDurationNumber">${hours}</span> <span class="activityDurationUnit">hr</span>`);
  }
  if(remainingMinutes>0||hours===0){
   parts.push(`<span class="activityDurationNumber">${remainingMinutes}</span> <span class="activityDurationUnit">min</span>`);
  }
  el.innerHTML=parts.join(' ');
 });
}
function refreshActivitySlipPreview(){
 const c=activityComputed();
 const inboundTravel=c.inbound?Math.max(0,Number(c.inbound.time)||0):0;
 const returnTravel=activityState.returnTravel.enabled&&c.returnRoute?Math.max(0,Number(c.returnRoute.time)||0):0;
 const wait=Math.max(0,Number(c.wait)||0);
 const inspection=Math.max(0,Number(c.inspectionTotal)||0);
 const travel=inboundTravel+returnTravel;
 const total=travel+wait+inspection;
 const hasTravel=Boolean(c.inbound)||(activityState.returnTravel.enabled&&Boolean(c.returnRoute));
 const hasWait=c.arrival!==null&&c.inspectionStart!==null;
 const hasInspection=c.inspectionStart!==null&&c.inspectionEnd!==null;
 const hasTotal=hasTravel||hasWait||hasInspection;
 const set=(s,v)=>document.querySelectorAll(s).forEach(el=>el.textContent=v);
 const setEmptyState=(s,empty)=>document.querySelectorAll(s).forEach(el=>el.dataset.emptyState=String(empty));
 set('[data-activity-origin]',activityState.work.origin||'Home Port');
 setEmptyState('[data-activity-origin]',!activityState.work.origin);
 set('[data-activity-destination]',activityState.work.destination||'Work Site');
 setEmptyState('[data-activity-destination]',!activityState.work.destination);
 set('[data-activity-distance]',c.inbound?`${c.inbound.distance} km`:'0 km');
 setEmptyState('[data-activity-distance]',!c.inbound);
 setActivityDurationValue('[data-activity-travel-time]',travel,hasTravel);
 setEmptyState('.activityTravelTimeRow',!hasTravel);
 setActivityDurationValue('[data-activity-wait-time]',wait,hasWait);
 setEmptyState('.activityWaitTimeRow',!hasWait);
 setActivityDurationValue('[data-activity-inspection-time]',inspection,hasInspection);
 setEmptyState('.activityInspectionTimeRow',!hasInspection);
 set('[data-activity-total-time]',hasTotal?activityCompactDuration(total):'0 hr 0 min');
 setEmptyState('.activityTotalValue',!hasTotal);
 if(typeof renderIcons==='function')renderIcons();
}

function renderActivitySlipWorkspace(){
    if(!activityTravelData){
        setWorkspaceContent(`
            <div class="workspaceModule activityModule">
                <section class="moduleCard">
                    <header class="moduleCardHeader">
                        <div class="moduleCardIcon" data-icon="activity"></div>
                        <div>
                            <h2 class="moduleCardTitle">Activity Slip</h2>
                            <p class="moduleCardSubtitle">Travel, wait & inspection time</p>
                        </div>
                    </header>
                    <div class="moduleCardBody">
                        <div class="activityLoading">Loading offline travel data…</div>
                    </div>
                </section>
            </div>`);
        if(typeof renderIcons==="function")renderIcons();
        loadActivityTravelData();
        return;
    }

    const c=activityComputed();

    setWorkspaceContent(`
        <div class="workspaceModule activityModule">
            <section class="moduleCard">
                <header class="moduleCardHeader">
                    <div class="moduleCardIcon" data-icon="activity"></div>
                    <div>
                        <h2 class="moduleCardTitle">Activity Slip</h2>
                        <p class="moduleCardSubtitle">Travel, wait & inspection time</p>
                    </div>
                </header>

                <div class="moduleCardBody">
                    ${activityLocationDatalist()}

                    <div class="activitySection activityTravelSection">
                        <div class="sectionLabel activitySectionLabel">Travel</div>
                        <div class="inputList">
                            ${activityLocationRow("Origin","activityOrigin",activityState.work.origin,"Search origin")}
                            ${activityLocationRow("Destination","activityDestination",activityState.work.destination,"Search destination")}
                        </div>

                        <div class="activityRoutePreview">
                            <div>
                                <span>Travel Distance</span>
                                <strong id="activityTravelDistancePreview">${c.inbound?`${c.inbound.distance} km`:"— km"}</strong>
                            </div>
                            <div>
                                <span>Travel Time</span>
                                <strong id="activityTravelTimePreview">${c.inbound?`${c.inbound.time} min`:"— min"}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="activitySection activityWorkSection">
                        <div class="sectionLabel activitySectionLabel">Work Activity</div>

                        <div class="inputList">
                            ${activityTimeRow("Arrival Time","activityArrival",activityState.work.arrivalTime)}
                            ${activityTimeRow("Inspection Start","activityInspectionStart",activityState.work.inspectionStart)}
                            ${activityTimeRow("Inspection End","activityInspectionEnd",activityState.work.inspectionEnd)}
                        </div>

                        <div class="moduleActions activityWorkActions">
                            <button type="button" class="clearButton" id="clearActivityWork">Clear</button>
                        </div>
                    </div>

                    <div class="activitySection activityReturnSection">
                        <div class="activityReturnToggleRow">
                            <div>
                                <strong>Return Travel</strong>
                                <span>Enable only when this record includes travel home.</span>
                            </div>

                            <label class="activitySwitch">
                                <input id="activityReturnEnabled" type="checkbox"${activityState.returnTravel.enabled?" checked":""}>
                                <span class="activitySwitchTrack"><span class="activitySwitchThumb"></span></span>
                            </label>
                        </div>

                        <div class="activityReturnInputs${activityState.returnTravel.enabled?"":" disabled"}">
                            ${activityLocationRow(
                                "Destination",
                                "activityReturnDestination",
                                activityState.returnTravel.destination,
                                "Search return destination",
                                !activityState.returnTravel.enabled
                            )}
                        </div>
                    </div>

                    <div id="activityLiveResults" class="activityResults">
                        ${workActivitySheet(c)+returnTravelSheet(c)}
                    </div>

                </div>
            </section>
        </div>
    `);

    if(typeof renderIcons==="function")renderIcons();
    bindActivitySlipWorkspace();
}

async function loadActivityTravelData(){
    try{
        const response=await fetch("./data/travel/travel-matrix.json");
        const raw=await response.json();
        raw.index=new Map(raw.locations.map((name,i)=>[name,i]));
        activityTravelData=raw;
        renderActivitySlipWorkspace();
    }catch(error){
        console.error("Unable to load offline travel database.",error);
        const content=document.querySelector(".activityLoading");
        if(content) content.textContent="Unable to load the offline travel database.";
    }
}

function bindActivitySlipWorkspace(){
    const bindValue=(id,handler)=>{
        const el=document.getElementById(id);
        if(!el)return;
        el.addEventListener("change",()=>{
            handler(el.value);
            activityRenderResults();
            refreshActivitySlipPreview();
        });
        el.addEventListener("input",()=>{
            handler(el.value);
            activityRenderResults();
            refreshActivitySlipPreview();
        });
    };

    bindValue("activityOrigin",v=>{
        activityState.work.origin=v;
        if(!activityState.returnTravel.destination){
            activityState.returnTravel.destination=v;
        }
    });

    bindValue("activityDestination",v=>activityState.work.destination=v);
    bindValue("activityArrival",v=>activityState.work.arrivalTime=v);
    bindValue("activityInspectionStart",v=>activityState.work.inspectionStart=v);
    bindValue("activityInspectionEnd",v=>activityState.work.inspectionEnd=v);
    bindValue("activityReturnDestination",v=>activityState.returnTravel.destination=v);

    const toggle=document.getElementById("activityReturnEnabled");
    if(toggle){
        toggle.addEventListener("change",()=>{
            activityState.returnTravel.enabled=toggle.checked;

            if(toggle.checked && !activityState.returnTravel.destination){
                activityState.returnTravel.destination=activityState.work.origin || "";
            }

            renderActivitySlipWorkspace();
            refreshActivitySlipPreview();
        });
    }

    const clear=document.getElementById("clearActivityWork");
    if(clear){
        clear.addEventListener("click",()=>{
            activityState.work.arrivalTime="";
            activityState.work.inspectionStart="";
            activityState.work.inspectionEnd="";
            renderActivitySlipWorkspace();
            refreshActivitySlipPreview();
        });
    }

    refreshActivitySlipPreview();
}

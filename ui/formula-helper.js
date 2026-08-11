let activeFormulaTrigger = null;
let formulaCloseTimer = null;

function colorizeFormulaText(text){
    if(!text) return "";
    const escaped = String(text)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    return escaped
        .replace(/\bA\b/g,'<span class="formulaVar formulaVarA">A</span>')
        .replace(/\bB\b/g,'<span class="formulaVar formulaVarB">B</span>');
}

function renderVariableDefinitions(text){
    if(!text) return "";
    return String(text).split("\n").map(line=>{
        const match=line.match(/^([AB])\s*=\s*(.*)$/);
        if(!match) return `<div>${colorizeFormulaText(line)}</div>`;
        const cls=match[1]==="A"?"formulaVarA":"formulaVarB";
        return `<div class="formulaVariableLine"><span class="formulaVar ${cls}">${match[1]}</span><span> = ${match[2]}</span></div>`;
    }).join("");
}

function renderCurrentCalculation(details){
    if(details.currentHtml) return details.currentHtml;
    return String(details.current || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");
}

function showFormulaHelp(details, trigger){
    const dialog=document.getElementById("formulaDialog");
    if(!dialog || !details) return;
    if(formulaCloseTimer){clearTimeout(formulaCloseTimer);formulaCloseTimer=null;}
    if(activeFormulaTrigger) activeFormulaTrigger.classList.remove("formulaSelected");
    activeFormulaTrigger=trigger || document.activeElement;
    if(activeFormulaTrigger && activeFormulaTrigger.classList.contains("resultCellButton")){
        activeFormulaTrigger.classList.add("formulaSelected");
    }

    document.getElementById("formulaDialogTitle").textContent=details.title || "Calculation";
    const parts=[];
    if(details.formula) parts.push(`<p class="formulaEquation">${colorizeFormulaText(details.formula)}</p>`);
    if(details.variables) parts.push(`<div class="formulaVariables">${renderVariableDefinitions(details.variables)}</div>`);
    if(details.current) parts.push(`<p class="formulaCurrent"><strong>Current Calculation</strong><br>${renderCurrentCalculation(details)}</p>`);
    if(details.note) parts.push(`<p class="formulaNote">${details.note}</p>`);
    document.getElementById("formulaDialogBody").innerHTML=parts.join("");

    dialog.classList.remove("formulaClosing");
    dialog.showModal();
    requestAnimationFrame(()=>dialog.classList.add("formulaOpen"));
}


function showReviewOverlay(step){
    const dialog=document.getElementById("formulaDialog");
    if(!dialog) return;

    if(formulaCloseTimer){
        clearTimeout(formulaCloseTimer);
        formulaCloseTimer=null;
    }

    if(activeFormulaTrigger){
        activeFormulaTrigger.classList.remove("formulaSelected");
        activeFormulaTrigger=null;
    }

    let title="Review Form";
    let body="";

    if(step===0){
        title="Inspection Detail";
        body=`<div class="reviewOnlyResults">
            <div class="resultsHeading dataSheetHeading"><span class="resultsHeadingIcon">◉</span><span>Dockside Grading Summary</span></div>
            ${gradingResultsTable()}
        </div>`;
    }else if(step===1){
        title="Inspection Summary";
        body=`<div class="reviewOnlyResults inspectionResults">${inspectionResultsTable()}</div>`;
    }else if(step===2){
        title="Activity Slip";
        const computed=activityComputed();
        body=`<div class="reviewOnlyResults activityResults">${workActivitySheet(computed)}${returnTravelSheet(computed)}</div>`;
    }

    document.getElementById("formulaDialogTitle").textContent=title;
    document.getElementById("formulaDialogBody").innerHTML=body;

    dialog.classList.add("reviewDialogMode");
    dialog.classList.remove("formulaClosing");
    dialog.showModal();
    requestAnimationFrame(()=>dialog.classList.add("formulaOpen"));
}

function closeFormulaHelp(){
    const dialog=document.getElementById("formulaDialog");
    if(!dialog || !dialog.open) return;

    /* Selection ends the instant the user closes the helper. */
    if(activeFormulaTrigger){
        activeFormulaTrigger.classList.remove("formulaSelected");
        activeFormulaTrigger=null;
    }

    dialog.classList.remove("formulaOpen");
    dialog.classList.add("formulaClosing");
    formulaCloseTimer=setTimeout(()=>{
        dialog.close();
        dialog.classList.remove("formulaClosing");
        dialog.classList.remove("reviewDialogMode");
        formulaCloseTimer=null;
    },800);
}

function initializeFormulaHelp(){
    const dialog=document.getElementById("formulaDialog"),
          close=document.getElementById("formulaDialogClose");
    if(!dialog||!close)return;
    close.addEventListener("click",closeFormulaHelp);
    dialog.addEventListener("cancel",e=>{e.preventDefault();closeFormulaHelp();});
    dialog.addEventListener("click",e=>{if(e.target===dialog)closeFormulaHelp();});
}
document.addEventListener("DOMContentLoaded",initializeFormulaHelp);

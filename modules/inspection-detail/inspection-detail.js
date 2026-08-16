function gradingInputRow(label,key,step,color){return `<div class="formRow gradingTimelineRow gradingTimeline-${color}" data-grading-step="${step}"><div class="gradingTimelineLabel"><span class="gradingStepCircle">${step}</span><label for="grading-${key}">${label}</label></div><span class="numberField"><input id="grading-${key}" type="number" inputmode="decimal" min="0" step="0.1" value="${appState.inspectionDetail.inputs[key].toFixed(1)}" data-grading-input="${key}"><span class="fieldUnit">lbs</span></span></div>`;}
function gradingFormulaDetails(key){
 const i=appState.inspectionDetail.inputs,r=appState.inspectionDetail.results,d=gradingFormulaDefinitions[key];
 const vars={premiumPercent:"A = Total Premium Weight\nB = Total Net Lbs. Graded",standardPercent:"A = Total Standard Weight\nB = Total Net Lbs. Graded",criticalWeakPercent:"A = Total Critical Weak Weight\nB = Total Net Lbs. Graded",softShellPercent:"A = Total Soft Shell Weight\nB = Total Net Lbs. Graded",deadPercent:"A = Total Dead Weight\nB = Total Net Lbs. Graded",undersizePercent:'A = Total Less than 3.74" Weight\nB = Total Net Lbs. Graded',barnacleTubewormPercent:"A = Total Barnacle / Tubeworm Weight\nB = Total Net Lbs. Graded",premiumBySize:"A = Premium Weight\nB = Premium + Standard Weight",standardBySize:"A = Standard Weight\nB = Premium + Standard Weight",totalReject:"A = Sum of all reject-category weights",totalNetLbsGraded:"A = Sum of all graded category weights",rejectPercent:"A = Sum of displayed reject percentages"}[key];
 const cur={totalNetLbsGraded:`${i.premium.toFixed(1)} + ${i.standard.toFixed(1)} + ${i.criticalWeak.toFixed(1)} + ${i.softShell.toFixed(1)} + ${i.dead.toFixed(1)} + ${i.undersize.toFixed(1)} + ${i.barnacleTubeworm.toFixed(1)} = ${r.totalNetLbsGraded.toFixed(1)} lbs`,totalReject:`${i.criticalWeak.toFixed(1)} + ${i.softShell.toFixed(1)} + ${i.dead.toFixed(1)} + ${i.undersize.toFixed(1)} + ${i.barnacleTubeworm.toFixed(1)} = ${r.totalReject.toFixed(1)} lbs`,premiumPercent:`${i.premium.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.premiumPercent.toFixed(2)}%`,standardPercent:`${i.standard.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.standardPercent.toFixed(2)}%`,criticalWeakPercent:`${i.criticalWeak.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.criticalWeakPercent.toFixed(2)}%`,softShellPercent:`${i.softShell.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.softShellPercent.toFixed(2)}%`,deadPercent:`${i.dead.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.deadPercent.toFixed(2)}%`,undersizePercent:`${i.undersize.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.undersizePercent.toFixed(2)}%`,barnacleTubewormPercent:`${i.barnacleTubeworm.toFixed(1)} ÷ ${r.totalNetLbsGraded.toFixed(1)} × 100 = ${r.barnacleTubewormPercent.toFixed(2)}%`,premiumBySize:`${i.premium.toFixed(1)} ÷ (${i.premium.toFixed(1)} + ${i.standard.toFixed(1)}) × 100 = ${r.premiumBySize.toFixed(2)}%`,standardBySize:`${i.standard.toFixed(1)} ÷ (${i.premium.toFixed(1)} + ${i.standard.toFixed(1)}) × 100 = ${r.standardBySize.toFixed(2)}%`,rejectPercent:`${r.rejectPercent.toFixed(2)}%`}[key];
 const variableValues={premiumPercent:{A:i.premium.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},standardPercent:{A:i.standard.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},criticalWeakPercent:{A:i.criticalWeak.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},softShellPercent:{A:i.softShell.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},deadPercent:{A:i.dead.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},undersizePercent:{A:i.undersize.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},barnacleTubewormPercent:{A:i.barnacleTubeworm.toFixed(1),B:r.totalNetLbsGraded.toFixed(1)},premiumBySize:{A:i.premium.toFixed(1),B:(i.premium+i.standard).toFixed(1)},standardBySize:{A:i.standard.toFixed(1),B:(i.premium+i.standard).toFixed(1)}}[key]||{};
 const displayFormula={premiumPercent:"A ÷ B × 100",standardPercent:"A ÷ B × 100",criticalWeakPercent:"A ÷ B × 100",softShellPercent:"A ÷ B × 100",deadPercent:"A ÷ B × 100",undersizePercent:"A ÷ B × 100",barnacleTubewormPercent:"A ÷ B × 100",premiumBySize:"A ÷ B × 100",standardBySize:"A ÷ B × 100"}[key]||d.formula;
 const currentHtml={
   premiumPercent:`<span class="formulaValue formulaVarA">${i.premium.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.premiumPercent.toFixed(2)}%`,
   standardPercent:`<span class="formulaValue formulaVarA">${i.standard.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.standardPercent.toFixed(2)}%`,
   criticalWeakPercent:`<span class="formulaValue formulaVarA">${i.criticalWeak.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.criticalWeakPercent.toFixed(2)}%`,
   softShellPercent:`<span class="formulaValue formulaVarA">${i.softShell.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.softShellPercent.toFixed(2)}%`,
   deadPercent:`<span class="formulaValue formulaVarA">${i.dead.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.deadPercent.toFixed(2)}%`,
   undersizePercent:`<span class="formulaValue formulaVarA">${i.undersize.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.undersizePercent.toFixed(2)}%`,
   barnacleTubewormPercent:`<span class="formulaValue formulaVarA">${i.barnacleTubeworm.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${r.totalNetLbsGraded.toFixed(1)}</span> × 100 = ${r.barnacleTubewormPercent.toFixed(2)}%`,
   premiumBySize:`<span class="formulaValue formulaVarA">${i.premium.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${(i.premium+i.standard).toFixed(1)}</span> × 100 = ${r.premiumBySize.toFixed(2)}%`,
   standardBySize:`<span class="formulaValue formulaVarA">${i.standard.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${(i.premium+i.standard).toFixed(1)}</span> × 100 = ${r.standardBySize.toFixed(2)}%`
 }[key]||null; return {...d,formula:displayFormula,variables:vars,current:cur,currentHtml,variableValues};
}
function fbtn(text,key){return `<button type="button" class="resultCellButton" data-grading-formula="${key}">${text}</button>`;}
function gradingBreakdownPercent(value,key,colorClass){
 const safe=Math.max(0,Math.min(100,Number(value)||0));
 return `<div class="gradingBreakdownPercent gradingBreakdown-${colorClass}">
  ${fbtn(`${safe.toFixed(2)}%`,key)}
  <div class="gradingBreakdownTrack" aria-hidden="true">
   <span class="gradingBreakdownFill" style="width:${safe}%"></span>
  </div>
 </div>`;
}

function gradingBreakdownRow(label,weight,percent,percentKey,bySize,bySizeKey,colorClass){
 return `<div class="gradingBreakdownRow">
  <div class="gradingBreakdownGrade">${label}</div>
  <div class="gradingBreakdownWeight">${Number(weight).toFixed(1)} <span>lbs</span></div>
  <div class="gradingBreakdownNetPercent">${gradingBreakdownPercent(percent,percentKey,colorClass)}</div>
  <div class="gradingBreakdownBySize">${bySizeKey ? fbtn(`${Number(bySize).toFixed(2)}%`,bySizeKey) : ""}</div>
 </div>`;
}

function gradingResultsTable(){
 const i=appState.inspectionDetail.inputs;
 const r=appState.inspectionDetail.results;
 const rejectHasData=r.totalReject!==0;
 const netHasData=r.totalNetLbsGraded!==0;

 return `<div class="gradingBreakdown">
  <div class="gradingBreakdownHeader">
   <div>Category</div>
   <div>Net Lbs. Graded</div>
   <div>% of Net Lbs.</div>
   <div>% by Size</div>
  </div>

  <div class="gradingBreakdownRows">
   ${gradingBreakdownRow("Premium",i.premium,r.premiumPercent,"premiumPercent",r.premiumBySize,"premiumBySize","premium")}
   ${gradingBreakdownRow("Standard",i.standard,r.standardPercent,"standardPercent",r.standardBySize,"standardBySize","standard")}
   ${gradingBreakdownRow("Critical Weak",i.criticalWeak,r.criticalWeakPercent,"criticalWeakPercent",0,null,"critical")}
   ${gradingBreakdownRow("Soft Shell",i.softShell,r.softShellPercent,"softShellPercent",0,null,"soft")}
   ${gradingBreakdownRow("Dead",i.dead,r.deadPercent,"deadPercent",0,null,"reject")}
   ${gradingBreakdownRow('Less than 3.74"',i.undersize,r.undersizePercent,"undersizePercent",0,null,"reject")}
   ${gradingBreakdownRow("Barn. / Tubeworm",i.barnacleTubeworm,r.barnacleTubewormPercent,"barnacleTubewormPercent",0,null,"reject")}
  </div>
 </div>

 <div class="gradingTotalsPanel">
  <div class="gradingTotalRow gradingTotalReject">
   <div class="gradingTotalIcon gradingTotalRejectIcon${rejectHasData ? " gradingTotalIconComplete" : ""}" data-icon="${rejectHasData ? "complete" : "incomplete"}" aria-hidden="true"></div>
   <div class="gradingTotalIdentity">
    <div class="gradingSummaryLabel">Total Rejects Graded</div>
    <div class="gradingTotalValue gradingRejectValue">${fbtn(`${r.totalReject.toFixed(1)} lbs`,"totalReject")}</div>
   </div>
   <div class="gradingTotalMetric">
    <span class="gradingRejectPercent">${fbtn(`${r.rejectPercent.toFixed(2)}%`,"rejectPercent")}</span>
    <span>of net lbs.</span>
   </div>
   <div class="gradingTotalMetric gradingTotalMetricSpacer" aria-hidden="true"></div>
  </div>

  <div class="gradingTotalsDivider" aria-hidden="true"></div>

  <div class="gradingTotalRow gradingTotalNet">
   <div class="gradingTotalIcon gradingTotalNetIcon${netHasData ? " gradingTotalIconComplete" : ""}" data-icon="${netHasData ? "complete" : "incomplete"}" aria-hidden="true"></div>
   <div class="gradingTotalIdentity">
    <div class="gradingSummaryLabel">Total Net Lbs. Graded</div>
    <div class="gradingTotalValue gradingNetWeight">${fbtn(`${r.totalNetLbsGraded.toFixed(1)} lbs`,"totalNetLbsGraded")}</div>
   </div>
   <div class="gradingTotalMetric">
    <span>${r.percentLbsGraded.toFixed(2)}%</span>
    <span>of net lbs.</span>
   </div>
   <div class="gradingTotalMetric">
    <span>${r.percentBySizeTotal.toFixed(2)}%</span>
    <span>by size</span>
   </div>
  </div>
 </div>`;
}

function renderInspectionDetailWorkspace(){setWorkspaceContent(`<div class="workspaceModule"><section class="moduleCard"><header class="moduleCardHeader"><div class="moduleCardIcon" data-icon="grading"></div><div><h2 class="moduleCardTitle">Inspection Detail</h2><p class="moduleCardSubtitle">Grade sample quality & percentages</p></div></header><div class="moduleCardBody"><div class="inputList">${gradingInputRow("Gross Lbs. Graded","grossGraded",1,"blue")}${gradingInputRow("Premium","premium",2,"green")}${gradingInputRow("Standard","standard",3,"green")}${gradingInputRow("Critical Weak","criticalWeak",4,"orange")}${gradingInputRow("Soft Shell","softShell",5,"orange")}${gradingInputRow("Dead","dead",6,"red")}${gradingInputRow('Less than 3.74"',"undersize",7,"red")}${gradingInputRow("Barn. / Tubeworm","barnacleTubeworm",8,"red")}</div><div class="moduleActions"><button type="button" class="clearButton" id="clearGrading">Clear</button></div><div class="resultsHeading dataSheetHeading"><span class="resultsHeadingIcon">◉</span><span>Dockside Grading Summary</span></div><div id="gradingLiveResults">${gradingResultsTable()}</div></div></section></div>`);refreshGradingSummaryIcons();bindGradingSummaryWorkspace();}
function refreshGradingSummaryIcons(){
 const container=document.getElementById("gradingLiveResults");
 if(!container || typeof loadSvgIcon!=="function") return;

 container.querySelectorAll(".gradingTotalIcon[data-icon]").forEach(icon=>{
  loadSvgIcon(icon,icon.dataset.icon);
 });
}

function refreshGradingResultsOnly(){
 const p=document.getElementById("gradingLiveResults");
 if(p){
  p.innerHTML=gradingResultsTable();
  refreshGradingSummaryIcons();
  bindGradingFormulaButtons();
 }
}
function bindGradingFormulaButtons(){document.querySelectorAll("[data-grading-formula]").forEach(b=>b.addEventListener("click",()=>showFormulaHelp(gradingFormulaDetails(b.dataset.gradingFormula),b)));}
function bindGradingSummaryWorkspace(){document.querySelectorAll("[data-grading-input]").forEach(input=>{input.addEventListener("focus",e=>e.target.select());input.addEventListener("input",e=>{setAppNumberAndRefresh("inspectionDetail",e.target.dataset.gradingInput,e.target.value);refreshGradingResultsOnly();});});const clear=document.getElementById("clearGrading");if(clear)clear.addEventListener("click",()=>{commitAppStateChange(()=>{Object.keys(appState.inspectionDetail.inputs).forEach(k=>appState.inspectionDetail.inputs[k]=0);});renderInspectionDetailWorkspace();});bindGradingFormulaButtons();}

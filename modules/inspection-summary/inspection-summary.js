function inspectionInputRow(label,key,decimals=1,unit="lbs"){return `<div class="formRow"><label for="inspection-${key}">${label}</label><span class="numberField"><input id="inspection-${key}" type="number" inputmode="decimal" min="0" step="${decimals===0?1:.1}" value="${decimals===0?appState.inspectionSummary.inputs[key].toFixed(0):appState.inspectionSummary.inputs[key].toFixed(1)}" data-inspection-input="${key}">${unit?`<span class="fieldUnit">${unit}</span>`:""}</span></div>`;}
function inspectionFormulaDetails(key){const i=appState.inspectionSummary.inputs,gi=appState.inspectionDetail.inputs,gr=appState.inspectionDetail.results,r=appState.inspectionSummary.results,d=inspectionFormulaDefinitions[key];const vars={numberOfSamples:"A = Actual / Hailed Weight",percentCrab:"A = Total Net Lbs. Graded\nB = Gross Lbs. Graded",netPoundsLanded:"A = Gross Pounds Landed\nB = % of Crab",barnacleWeight:"A = Net Pounds Landed\nB = Barnacle / Tubeworm %",netPoundsLessBarnacles:"A = Net Pounds Landed\nB = Barnacle Weight",averagePanWeight:"A = Gross Pounds Landed\nB = Total Number of Pans"}[key];const cur={numberOfSamples:i.hailedWeight<2000?`${i.hailedWeight.toFixed(1)} lbs is under 2,000 lbs → 2 samples`:`${i.hailedWeight.toFixed(1)} ÷ 900 = ${(i.hailedWeight/900).toFixed(2)} → ${r.numberOfSamples} samples`,percentCrab:`${gr.totalNetLbsGraded.toFixed(1)} ÷ ${gi.grossGraded.toFixed(1)} × 100 = ${r.percentCrab.toFixed(2)}%`,netPoundsLanded:`${i.grossLanded.toFixed(1)} × (${r.percentCrab.toFixed(2)} ÷ 100) = ${r.netPoundsLanded} lbs`,barnacleWeight:`${r.netPoundsLanded} × 0.24 × ${gr.barnacleTubewormPercent.toFixed(2)}% = ${r.barnacleWeight} lbs`,netPoundsLessBarnacles:`${r.netPoundsLanded} − ${r.barnacleWeight} = ${r.netPoundsLessBarnacles} lbs`,averagePanWeight:`${i.grossLanded.toFixed(1)} ÷ ${i.totalPans.toFixed(0)} = ${r.averagePanWeight.toFixed(1)} lbs/pan`}[key];const variableValues={percentCrab:{A:gr.totalNetLbsGraded.toFixed(1),B:gi.grossGraded.toFixed(1)},netPoundsLanded:{A:i.grossLanded.toFixed(1),B:r.percentCrab.toFixed(2)},barnacleWeight:{A:String(r.netPoundsLanded),B:gr.barnacleTubewormPercent.toFixed(2)},netPoundsLessBarnacles:{A:String(r.netPoundsLanded),B:String(r.barnacleWeight)},averagePanWeight:{A:i.grossLanded.toFixed(1),B:i.totalPans.toFixed(0)},numberOfSamples:{A:i.hailedWeight.toFixed(1)}}[key]||{};
const displayFormula={percentCrab:"A ÷ B × 100",netPoundsLanded:"A × (B ÷ 100)",barnacleWeight:"(A × 0.24 × B) ÷ 100",netPoundsLessBarnacles:"A − B",averagePanWeight:"A ÷ B",numberOfSamples:"A ÷ 45 × 5%"}[key]||d.formula;
const currentHtml={
 percentCrab:`<span class="formulaValue formulaVarA">${gr.totalNetLbsGraded.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${gi.grossGraded.toFixed(1)}</span> × 100 = ${r.percentCrab.toFixed(2)}%`,
 netPoundsLanded:`<span class="formulaValue formulaVarA">${i.grossLanded.toFixed(1)}</span> × (<span class="formulaValue formulaVarB">${r.percentCrab.toFixed(2)}</span> ÷ 100) = ${r.netPoundsLanded} lbs`,
 barnacleWeight:`(<span class="formulaValue formulaVarA">${r.netPoundsLanded}</span> × 0.24 × <span class="formulaValue formulaVarB">${gr.barnacleTubewormPercent.toFixed(2)}</span>) ÷ 100 = ${r.barnacleWeight} lbs`,
 netPoundsLessBarnacles:`<span class="formulaValue formulaVarA">${r.netPoundsLanded}</span> − <span class="formulaValue formulaVarB">${r.barnacleWeight}</span> = ${r.netPoundsLessBarnacles} lbs`,
 averagePanWeight:`<span class="formulaValue formulaVarA">${i.grossLanded.toFixed(1)}</span> ÷ <span class="formulaValue formulaVarB">${i.totalPans.toFixed(0)}</span> = ${r.averagePanWeight.toFixed(1)} lbs/pan`,
 numberOfSamples:i.hailedWeight<2000
   ? `<span class="formulaValue formulaVarA">${i.hailedWeight.toFixed(1)}</span> lbs is under 2,000 lbs → 2 samples`
   : `<span class="formulaValue formulaVarA">${i.hailedWeight.toFixed(1)}</span> ÷ 900 = ${(i.hailedWeight/900).toFixed(2)} → ${r.numberOfSamples} samples`
}[key]||null;
return {...d,formula:displayFormula,variables:vars,current:cur,currentHtml,variableValues};}
function ibtn(text,key){return `<button type="button" class="resultCellButton" data-inspection-formula="${key}">${text}</button>`;}
function inspectionResultsTable(){
 const i=appState.inspectionSummary.inputs,r=appState.inspectionSummary.results;
 const header=`<thead><tr><th>Category</th><th>Results</th></tr></thead>`;
 const samplingPlan=`<div class="inspectionDataSheet inspectionDataSheet-sampling"><div class="resultsHeading dataSheetHeading"><span class="resultsHeadingIcon" aria-hidden="true">◉</span><span>Sampling Plan</span></div><div class="resultsTableWrap"><table class="resultsTable inspectionResultsTable">${header}<tbody>
 <tr><td>Total Number of Pans</td><td class="inspectionResultValue">${i.totalPans.toFixed(0)}</td></tr>
 <tr><td>Average Weight / Pan</td><td class="inspectionResultValue">${ibtn(r.averagePanWeight.toFixed(1)+' lbs','averagePanWeight')}</td></tr>
 <tr><td>Actual / Hailed Weight (lbs)</td><td class="inspectionResultValue">${i.hailedWeight.toFixed(1)} lbs</td></tr>
 <tr><td># Samples from Sampling Plan</td><td class="inspectionResultValue">${ibtn(r.numberOfSamples,'numberOfSamples')}</td></tr>
 </tbody></table></div></div>`;
 const landedPounds=`<div class="inspectionDataSheet inspectionDataSheet-landed"><div class="resultsHeading dataSheetHeading"><span class="resultsHeadingIcon" aria-hidden="true">◉</span><span>Landed Pounds Summary</span></div><div class="resultsTableWrap"><table class="resultsTable inspectionResultsTable">${header}<tbody>
 <tr><td>Gross Pounds Landed</td><td class="inspectionResultValue">${i.grossLanded.toFixed(1)} lbs</td></tr>
 <tr><td>Percentage of Crab</td><td class="inspectionResultValue">${ibtn(r.percentCrab.toFixed(2)+'%','percentCrab')}</td></tr>
 <tr><td>Net Pounds Landed</td><td class="inspectionResultValue">${ibtn(r.netPoundsLanded.toFixed(0)+' lbs','netPoundsLanded')}</td></tr>
 <tr><td>Barnacle Weight</td><td class="inspectionResultValue">${ibtn(r.barnacleWeight.toFixed(0)+' lbs','barnacleWeight')}</td></tr>
 <tr><td>Net Pounds (Less Barnacles)</td><td class="inspectionResultValue">${ibtn(r.netPoundsLessBarnacles.toFixed(0)+' lbs','netPoundsLessBarnacles')}</td></tr>
 </tbody></table></div></div>`;
 return samplingPlan+landedPounds;
}

function inspectionEscape(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function inspectionTextRow(label,key,placeholder="",options={}){
 const value=appState.inspectionSummary.inputs[key]||"";
 const mode=options.inputMode?` inputmode="${options.inputMode}"`:"";
 const cap=options.autocapitalize?` autocapitalize="${options.autocapitalize}"`:"";
 const spell=options.spellcheck===false?` spellcheck="false"`:"";
 const required=!String(value).trim();
 return `<div class="formRow inspectionIdentityRow"><label for="inspection-${key}">${label}<span class="requiredMarker${required ? "" : " complete"}" aria-hidden="true">*</span></label><span class="activitySelectField inspectionIdentityField"><input id="inspection-${key}" type="text" autocomplete="off"${mode}${cap}${spell} placeholder="${inspectionEscape(placeholder)}" value="${inspectionEscape(value)}" data-inspection-text="${key}"></span></div>`;
}
function inspectionTimelineInputRow(label,key,step,unit="lbs"){
 const value=appState.inspectionSummary.inputs[key];
 const display=key==="totalPans" ? Number(value).toFixed(0) : Number(value).toFixed(1);
 const stepValue=key==="totalPans" ? "1" : "0.1";
 const unitMarkup=unit ? `<span class="fieldUnit">${unit}</span>` : "";
 return `<div class="formRow gradingTimelineRow inspectionTimelineRow gradingTimeline-blue" data-inspection-step="${step}">
  <div class="gradingTimelineLabel">
   <span class="gradingStepCircle">${step}</span>
   <label for="inspection-${key}">${label}</label>
  </div>
  <span class="numberField">
   <input id="inspection-${key}" type="number" inputmode="decimal" min="0" step="${stepValue}" value="${display}" data-inspection-input="${key}">
   ${unitMarkup}
  </span>
 </div>`;
}

function renderInspectionSummaryWorkspace(){
 setWorkspaceContent(`<div class="workspaceModule inspectionModule"><section class="moduleCard"><header class="moduleCardHeader"><div><h2 class="moduleCardTitle">Inspection Summary</h2><p class="moduleCardSubtitle">Sampling plan & landed pounds summary</p></div></header><div class="moduleCardBody"><section class="vesselInfoPanel">
 <div class="vesselInfoHeader">
  <div class="vesselInfoIcon" data-icon="anchor" aria-hidden="true"></div>
  <div>
   <h3>Vessel Information</h3>
   <p>Enter vessel details for this landing</p>
  </div>
 </div>
 <div class="vesselInfoFields">
  ${inspectionTextRow("Boat Name","boatName","Type vessel name...",{autocapitalize:"words"})}
  <div class="vesselFieldHint">Start typing to see your saved vessels <span>0 / 100</span></div>
  ${inspectionTextRow("CFV / VRN","cfv","Enter CFV or VRN number...",{inputMode:"numeric",spellcheck:false})}
  <div class="vesselFieldHint">Start typing to see your saved vessels <span>0 / 20</span></div>
  ${inspectionTextRow("Fish Receipt Number","fishReceiptNumber","Enter fish receipt number...",{inputMode:"numeric",spellcheck:false})}
  <div class="vesselFieldHint">Unique to this landing (not saved) <span>0 / 20</span></div>
 </div>
 <div class="vesselInfoNotice">
  <div class="vesselInfoNoticeIcon" data-icon="info" aria-hidden="true"></div>
  <div>Vessel name and CFV / VRN will be saved to your library for faster entry next time.</div>
 </div>
</section><div class="inputList inspectionOperationalInputs inspectionTimelineInputs">${inspectionTimelineInputRow("Gross Pounds Landed","grossLanded",1,"lbs")}${inspectionTimelineInputRow("Total # of Pans","totalPans",2,"")}${inspectionTimelineInputRow("Actual / Hailed Weight","hailedWeight",3,"lbs")}</div><div class="moduleActions"><button type="button" class="clearButton" id="clearInspection">Clear</button></div><div id="inspectionLiveResults" class="inspectionResults">${inspectionResultsTable()}</div></div></section></div>`);
 if(typeof renderIcons==='function')renderIcons();bindInspectionWorkspace();
}
function bindInspectionFormulaButtons(){document.querySelectorAll("[data-inspection-formula]").forEach(b=>b.addEventListener("click",()=>showFormulaHelp(inspectionFormulaDetails(b.dataset.inspectionFormula),b)));}
function refreshInspectionResultsOnly(){const p=document.getElementById("inspectionLiveResults");if(p){p.innerHTML=inspectionResultsTable();bindInspectionFormulaButtons();}}
function bindInspectionWorkspace(){
 document.querySelectorAll("[data-inspection-input]").forEach(input=>{input.addEventListener("focus",e=>e.target.select());input.addEventListener("input",e=>{setAppNumberAndRefresh("inspectionSummary",e.target.dataset.inspectionInput,e.target.value);refreshInspectionResultsOnly();});});
 document.querySelectorAll("[data-inspection-text]").forEach(input=>{input.addEventListener("input",e=>{const key=e.target.dataset.inspectionText;commitAppStateChange(()=>{appState.inspectionSummary.inputs[key]=e.target.value;});const marker=e.target.closest(".inspectionIdentityRow")?.querySelector(".requiredMarker");if(marker){marker.classList.toggle("complete",Boolean(e.target.value.trim()));}});});
 const clear=document.getElementById("clearInspection");if(clear)clear.addEventListener("click",()=>{commitAppStateChange(()=>{appState.inspectionSummary.inputs.boatName="";appState.inspectionSummary.inputs.cfv="";appState.inspectionSummary.inputs.fishReceiptNumber="";["grossLanded","totalPans","hailedWeight"].forEach(k=>appState.inspectionSummary.inputs[k]=0);});renderInspectionSummaryWorkspace();});
 bindInspectionFormulaButtons();
}

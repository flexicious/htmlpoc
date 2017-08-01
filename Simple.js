var currentPreferences = {};
myCompanyNameSpace.SAMPLE_CONFIGS_DETAIL_URLS["simple"] = '';//"http://www.flexicious.com/resources/Ultimate/docs/SimpleGrid.htm";

myCompanyNameSpace.simple_creationComplete = function(evt) {
    var grid = evt.target;
    grid.setDataProvider(myCompanyNameSpace.FlexiciousMockGenerator.instance().getFlatOrgList());
    grid.addEventListener(this,flexiciousNmsp.FlexDataGrid.EVENT_LOADPREFERENCES, function(event) {
        setTimeout(function(){
            ////Callback when the preference data is loaded from the server.
            grid.setPreferences(currentPreferences["preferences"]);
            grid.setSelectedKeys(currentPreferences["seletedKeys"] ? currentPreferences["seletedKeys"] : []);
            grid.validateNow();
            grid.setVerticalScrollPosition(currentPreferences["verticalScrollPosition"]);
            flexiciousNmsp.UIUtils.showMessage("Preferences Loaded!");
        },100);
    });
    
    grid.addEventListener(this,flexiciousNmsp.FlexDataGrid.EVENT_PERSISTPREFERENCES, function(event) {
        setTimeout(function(){
            ////Callback when the preference data is loaded from the server.
            currentPreferences["preferences"]=grid.getPreferences();
            currentPreferences["verticalScrollPosition"] = grid.getVerticalScrollPosition();
            currentPreferences["seletedKeys"] = grid.getSelectedKeys();
            flexiciousNmsp.UIUtils.showMessage("Preferences Saved!");
        },1000);
    });

    //Called when the user clicks on "clear preferences" in the preferences dialog box
    grid.addEventListener(this,flexiciousNmsp.FlexDataGrid.EVENT_CLEARPREFERENCES, function(event) {
            //here you will call a server method to clear preferences, for this demo, we are going to mock this.
            setTimeout(function(){
                ////Callback when the preference data is loaded from the server.
                currentPreferences = {};
                flexiciousNmsp.UIUtils.showMessage("Preferences Cleared!");
            },100);
        }
    );
    grid.loadPreferences();
}

myCompanyNameSpace.SAMPLE_CONFIGS["simple"] = {
    id:"grid",
    enablePrint:false,
    enablePreferencePersistence:true,
    enableExport:false,
    enableCopy:false,
    preferencePersistenceKey:"simpleGrid",
    preferencePersistenceMode:"server",
    enableMultiColumnSort:true,
    horizontalScrollPolicy:"auto",
    footerDrawTopBorder:true,
    enablePdf:false,
    headerRowHeight:"100",
    onCreationComplete: myCompanyNameSpace.simple_creationComplete,
    level: {
        selectedKeyField:"id",
        enablePaging:true,
        pageSize:"50",
        enableFilters:true,
        enableFooters:false,
        initialSortField:"id",
        initialSortAscending:true,
        columns: [
            {
                id:"colId",
                dataField:"id",
                headerText:"ID",
                filterControl:"TextInput",
                filterWaterMark:"Search",
                columnLockMode:"left",
                filterIcon:"http://www.htmltreegrid.com/demo/flexicious/css/images/search_clear.png",
                enableFilterAutoComplete:true,
                clearFilterOnIconClick:true
            },
            {
                id:"colLegalName", dataField:"legalName", sortCaseInsensitive:true, headerText:"Legal Name of the Organization",
                headerWordWrap:true, truncateToFit:true, columnLockMode:"left",
				filterControl:"MultiSelectComboBox", filterComboBoxBuildFromGrid:true
            },
            {
                id:"colLine1", dataField:"headquarterAddress.line1", headerText:"Line 1", footerLabel:"Count:",
                footerOperation:"count"
            },
            {
                id:"colLine2", dataField:"headquarterAddress.line2", headerText:"Line 2"
            },
            {
                id:"colCity", dataField:"headquarterAddress.city.name", headerText:"City", filterControl:"MultiSelectComboBox",
                filterComboBoxWidth:"150", filterComboBoxBuildFromGrid:true
            },
            {
                id:"colState", dataField:"headquarterAddress.state.name", headerText:"State", filterControl:"MultiSelectComboBox",
                filterComboBoxWidth:"150", filterComboBoxBuildFromGrid:true
            },
            {
                id:"colCountry", dataField:"headquarterAddress.country.name", headerText:"Country", filterControl:"MultiSelectComboBox",
                filterComboBoxWidth:"150", filterComboBoxBuildFromGrid:true
            },
            {
                headerAlign:"right", id:"colAnnRev", dataField:"annualRevenue", headerText:"Annual Revenue",
                headerWordWrap:true, textAlign:"right", footerLabel:"Avg:", footerOperation:"average", footerAlign:"center",
                footerOperationPrecision:"2", labelFunction:flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
                filterControl:"NumericRangeBox", sortNumeric:true, footerFormatter:new flexiciousNmsp.CurrencyFormatter()
            },
            {
                headerAlign:"right", id:"colNumEmp", headerWordWrap:true, sortNumeric:true, dataField:"numEmployees",footerAlign:"right",
                headerText:"Num Employees", textAlign:"right", footerLabel:"Avg:", footerOperation:"average", footerOperationPrecision:"2",
                labelFunction:flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction
            },
            {
                headerAlign:"right", id:"colEPS", headerWordWrap:true, sortNumeric:true, dataField:"earningsPerShare",footerAlign:"right",
                headerText:"EPS", textAlign:"right", footerLabel:"Avg:", footerOperation:"average", footerFormatter:new flexiciousNmsp.CurrencyFormatter(),
                labelFunction:flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction
            },
            {
                headerAlign:"right", id:"colStockPrice", headerWordWrap:true, sortNumeric:true, dataField:"lastStockPrice",footerAlign:"right",
                headerText:"Stock Price", footerFormatter:new flexiciousNmsp.CurrencyFormatter(), textAlign:"right", footerLabel:"Avg:",
                footerOperation:"average", footerOperationPrecision:"2", labelFunction:flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction
            }

        ]
    }

}
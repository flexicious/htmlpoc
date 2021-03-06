/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function(window)
{
    "use strict";
    var MultiSelectComboBox, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;

    /**
     * A MultiSelectComboBox that implements IMultiSelectDataBoundControl (IFilterControl) and IMultiSelectDataBoundControl (IDataBoundControl)
     * which enables it to be used within the filtering/binding infrasturcture.
     * @class MultiSelectComboBox
     * @constructor
     * @namespace flexiciousNmsp
     * @extends UIComponent
     */
    MultiSelectComboBox=function(tag){
        flexiciousNmsp.TextInput.apply(this,[tag]);
        //BEGIN FILTER PROPERTIES
        /**
         * Whether or not there is an active search
         * @property hasSearch
         * @type Boolean
         * @default false
         */
        this.hasSearch = false;
        /**
         * Whether or not this control has been registered. This should not be set by your code.
         * @property registered
         * @type Boolean
         * @default false
         */
        this.registered = false;
        /**
         * This is usually automatically set, you don't have to manually set it,
         * unless you're sending strings as Date objects. When set, will attempt
         * to first convert the current value to the type you specified and then
         * do the conversion.
         * Values : auto,string,number,boolean,date
         * @property filterComparisionType
         * @type String
         * @default auto
         */
        this.filterComparisionType = "auto";
        /**
         * The field to search on, usually same as the data field.
         * @property searchField
         * @type String
         * @default null
         */
        this.searchField = null;
        /**
         * The filter operation to apply to the comparison
         * See the FilterExpression class for a list.
         * Please note, for CheckBoxList and MultiSelectComboBox, this field
         * defaults to "InList" and is ignored when set.
         * Valid values are : "Equals,NotEquals,BeginsWith,EndsWith,Contains,DoesNotContain,GreaterThan,LessThan,GreaterThanEquals,LessThanEquals,InList,NotInList,Between"
         * @property filterOperation
         * @type String
         * @default Equals
         */
        this.filterOperation = null;
        /**
         * The event that the filter triggers on. Defaults to "change", or if the
         * filterRenderer supports com.flexicious.controls.interfaces.IDelayedChange, then
         * the delayedChange event.
         * @property filterTriggerEvent
         * @type String
         * @default change
         */
        this.filterTriggerEvent = "change";
        /**
         * The grid that the filter belongs to - can be null
         * if filter is used outside the grid
         * @property grid
         * @type TreeGrid
         */
        this.grid = null;
        /**
         * The grid column that the filter belongs to - can be null
         * if filter is used outside the grid
         * @property grid
         * @type TreeGridColumn
         * @return
         */
        this.gridColumn = null;
        //END FILTER PROPERTIES


        /**
         * A List of strings that map to the dataField value of this control,
         * representing the selected items within this control
         * @property selectedValues
         * @type Array
         */
        this.selectedValues=[];
        /**
         * The row currently highlighted on basis of either the keyboard or mouse inputs.
         * @property highlightedRowIndex
         * @type Number
         * @default -1
         */
        this.highlightedRowIndex=-1;

        /**
         * The icon that is displayed outside the textbox, based on the outsideIconPosition property.
         * [Style(name="outsideIcon", type="Class" , inherit="no")]
         * @property outsideIcon
         * @type String
         * @default flxConstants.IMAGE_PATH+'/downArrowIcon.png'
         */
        this.outsideIcon =  flxConstants.IMAGE_PATH+'/downArrowIcon.png';
        /**
         * Width of the inside and outside icons
         * @property iconHeight
         * @type Integer
         * @default 19
         */
        this.iconHeight=19;
        /**
         * Width of the inside and outside icons
         * @property iconWidth
         * @type Integer
         * @default 16
         */
        this.iconWidth=16;
        /**
         *  Name of the field in the items in the <code>dataProvider</code>
         *  Array to use as the value of drop-down list.
         *  By default, the control uses a property named <code>data</code>
         *  on each Array object and displays it.
         *  <p>However, if the <code>dataProvider</code> items do not contain
         *  a <code>data</code> property, you can set the <code>dataField</code>
         *  property to use a different property.</p>.
         *  This is also used as the search field.
         * @property dataField
         * @type String
         * @default data
         */
        this.dataField = "data";
        /**
         * Width of the dropdown. If -1, the popup will take the width of the control.
         * @property dropdownWidth
         * @type Number
         * @default -1
         */
        this.dropdownWidth=-1;
        /**
         *  Name of the field in the items in the <code>dataProvider</code>
         *  Array to display as the label in the TextInput portion and drop-down list.
         *  By default, the control uses a property named <code>label</code>
         *  on each Array object and displays it.
         *  <p>However, if the <code>dataProvider</code> items do not contain
         *  a <code>label</code> property, you can set the <code>labelField</code>
         *  property to use a different property.</p>
         *
         * @property labelField
         * @type String
         * @default label
         */
        this.labelField = "label";
        /**
         * User-supplied function to run on each item to determine its label.
         *  By default the control uses a property named <code>label</code>
         *  on each <code>dataProvider</code> item to determine its label.
         *  However, some data sets do not have a <code>label</code> property,
         *  or do not have another property that can be used for displaying
         *  as a label.
         *  <p>An example is a data set that has <code>lastName</code> and
         *  <code>firstName</code> fields but you want to display full names.
         *  You use <code>labelFunction</code> to specify a callback function
         *  that uses the appropriate fields and return a displayable String.</p>
         *
         *  <p>The labelFunction takes a single argument which is the item
         *  in the dataProvider and returns a String:</p>
         *  <pre>
         *  myLabelFunction(item:Object):String
         *  </pre>
         * @property labelFunction
         * @type Function
         * @default null
         */
        this.labelFunction = null;
        /**
         * Text of the "All" item. Defaults to "All"
         * @property addAllItemText
         * @type String
         * @default flxConstants.DEFAULT_ALL_ITEM_TEXT
         */
        this.addAllItemText=flxConstants.DEFAULT_ALL_ITEM_TEXT;

        /**
         * IF set to true, popup will always be visible, and text box wont.
         * @property alwaysVisible
         * @type Boolean
         * @default false
         */
        this.alwaysVisible = false;

        /**
         * The default width of the mscb
         * @type {Number}
         */
        this.defaultWidth = 100;

        this._addAllItem = true;

        this._previousValue=null;

        this._previousAllUnchecked=null;

        /**
         * The Div that contains all the checkboxes.
         * @property popup
         * @type UIComponent
         * @default null
         */
        this.popup=null;

		this.popupheight = 0;
		
        this.addEventListener(this,flxConstants.EVENT_CLICK,
            function(e){
                if(e.triggerEvent.target==this.getTextBox()){
                    this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.TextInput.OUTSIDE_ICON_CLICK))
                }
            }
        );

        this.addEventListener(this,flxConstants.EVENT_KEY_UP,function(e){
            var children;
            if(e.triggerEvent.target == this.getTextBox()){
                if(e.keyCode==flxConstants.KEYBOARD_SPACE){
                    if(!this.popup){
                        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("outsideIconClick"))
                    }else{
                        children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,uiUtil.doLower(flexiciousNmsp.TriStateCheckBox.typeName));
                        if(this.highlightedRowIndex>=0&&this.highlightedRowIndex<this.getDataProvider().length){
                            var cb=children[this.highlightedRowIndex];
                            cb.component.clickHandler(e);
                        }
                    }
                }else if(e.keyCode==flxConstants.KEYBOARD_ENTER){
                    if(this.popup){
                        this.onOkButton();
                    }
                }else if(e.keyCode==flxConstants.KEYBOARD_ESCAPE){
                    if(this.popup){
                        this.restoreStateAndDestroyPopup();
                    }
                }else if(e.keyCode==flxConstants.KEYBOARD_UP && this.getDataProvider().length>0){
                    if(this.popup){
                        children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,uiUtil.doLower(flexiciousNmsp.TriStateCheckBox.typeName));
                        if(this.highlightedRowIndex>0)
                            this.highlightRow(children[this.highlightedRowIndex-1]);
                    }
                }
                else if(e.keyCode==flxConstants.KEYBOARD_DOWN&& this.getDataProvider().length>0){
                    if(this.popup){
                        if(this.popup){
                            children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,uiUtil.doLower(flexiciousNmsp.TriStateCheckBox.typeName));
                            if(this.highlightedRowIndex<this.getDataProvider().length-1)
                                this.highlightRow(children[this.highlightedRowIndex+1]);
                        }
                    }
                }
            }
        });
        this.addEventListener(this,flexiciousNmsp.TextInput.OUTSIDE_ICON_CLICK,function(e){
            this.showPopup();
        });

    };
    flexiciousNmsp.MultiSelectComboBox = MultiSelectComboBox; //add to name space
    MultiSelectComboBox.prototype = new flexiciousNmsp.TextInput(); //setup hierarchy
    MultiSelectComboBox.prototype.typeName = MultiSelectComboBox.typeName = 'MultiSelectComboBox';//for quick inspection
    MultiSelectComboBox.prototype.getClassNames=function(){
        return ["MultiSelectComboBox","UIComponent","IFilterControl","IMultiSelectFilterControl","ISelectFilterControl"];
    };

    MultiSelectComboBox.prototype.showPopup=function(parent){
        if(this.popup){
            this.destroyPopup();
            return;
        }
        this._previousValue = this.getValue().slice();
        this._previousAllUnchecked = this.allUnchecked;

        flexiciousNmsp.ComboBox.addAllItemToDataProvider(this);

        var container = new flexiciousNmsp.UIComponent("div");
        container.domElement.className = "multiSelectComboBoxPopup";

        var checkBoxContainer = new flexiciousNmsp.UIComponent("div");
        checkBoxContainer.setWidth("100%");
        

        //now build from dataprovider
        var dp=this.getDataProvider();
        if(dp && dp.length>0){
			
            var checkBoxContainer = new flexiciousNmsp.UIComponent("div");
            checkBoxContainer.setWidth("100%");
            checkBoxContainer.domElement.style.overflowY = "auto";
            checkBoxContainer.domElement.style.overflowX = "hidden";
			checkBoxContainer.domElement.style.whiteSpace = "nowrap";
			checkBoxContainer.domElement.style.maxHeight = (250 || this.popupHeight)+"px";

            for (var i = 0; i < dp.length; i++) {
                var item = dp[i];
                var row = new flexiciousNmsp.UIComponent("div");
                row.domElement.className = "checkBoxRow";
                var cb = new flexiciousNmsp.TriStateCheckBox();
                var lbl = this.itemToLabel(item, false);
                cb.allowUserToSelectMiddle=false;
                cb.delayDuration=100;
                cb.domElement.innerHTML=lbl;
                cb.domElement.plainInnerHTML=this.itemToLabel(item, true);
                cb.addEventListener(this,flxConstants.EVENT_MOUSE_OVER,function(e){
                    this.highlightRow((e.triggerEvent.currentTarget||e.triggerEvent.srcElement));
                });
                //cb.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);//by default everything is checked
                cb.addEventListener(this,"delayedChange",function(e){
                    var cbox=e.target;
                    var children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,
                        uiUtil.doLower(flexiciousNmsp.TriStateCheckBox.typeName));
                    var cbIndex = children.indexOf(cbox.domElement);
                    var cbItem = this.getDataProvider()[cbIndex];
                    var cbVal = uiUtil.resolveExpression(cbItem ,this.dataField);
                    if(cbVal === undefined || cbVal == null){
                        cbVal = ""; 
                    }
                    var wasAllUnchecked=this.allUnchecked;
                    if(cbox.domElement.plainInnerHTML == this.addAllItemText)
                        this.allUnchecked=cbox.getSelectedState()==flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
                    else
                        this.allUnchecked=false;

                    if(this.selectedValues.length==0 && !wasAllUnchecked){
                        //this means nothing was selected before.
                        if(cbox.domElement.plainInnerHTML == this.addAllItemText){
                            //cannot do any thing here, since nothing is selected.
                        }else{
                            for (var i = this.getAddAllItem()?1:0; i < this.getDataProvider().length; i++) {
                                var item = this.getDataProvider()[i];
                                var itemVal=uiUtil.resolveExpression(item,this.dataField);
                                if(itemVal!=cbVal){
                                    this.selectedValues.push(itemVal);
                                }
                            }
                        }
                    }else{
                        if(cbox.domElement.plainInnerHTML == this.addAllItemText){
                            this.selectedValues=[];
                        }else{
                            if(cbox.getSelectedState()==flexiciousNmsp.TriStateCheckBox.STATE_CHECKED && this.selectedValues.indexOf(cbVal)==-1){
                                this.selectedValues.push(cbVal);
                            }else if(cbox.getSelectedState()==flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED && this.selectedValues.indexOf(cbVal)!=-1){
                                this.selectedValues.splice(this.selectedValues.indexOf(cbVal),1);
                            }
                        }
                    }
                    var okB = uiUtil.adapter.findElementWithClassName(this.popup.domElement,"okButton");
                    if(okB){
                        okB.style.display=this.allUnchecked?"none":"";

                    }
                    this.updateCheckBoxes();
                });
                row.addChild(cb);
                checkBoxContainer.addChild(row);
            }
            container.addChild(checkBoxContainer);
        }
        var okCancel=new flexiciousNmsp.UIComponent("div");
        okCancel.domElement.className="okCancelDiv";
        okCancel.domElement.innerHTML="<div class='okCancel'><span class='okButton'>Ok</span><span class='cancelButton'>Cancel</span></div>";
        if(!this.alwaysVisible)
            container.addChild(okCancel);
        var pt=new flexiciousNmsp.Point(0,0);

        pt=this.localToGlobal(pt);
//            if(this.domElement.parentNode.component){
//                parent=this.domElement.parentNode.component.level.grid.getDomContainer();
//                pt=this.domElement.parentNode.component.level.grid.globalToLocal(pt);
//            }else
        {
            if(!parent)
                parent=flexiciousNmsp.DisplayList.instance().documentComponent.domElement.body;
            else{
                pt = parent.globalToLocal(pt);
            }

            //pt=new flexiciousNmsp.Point(pt.x , pt.y);
            var parentContainer = new flexiciousNmsp.UIComponent("div");
            parentContainer.addChild(container);
            container=parentContainer;
        }
        uiUtil.addChild(parent,container);
        container.setWidth((this.dropdownWidth===-1)?this.getWidth():this.dropdownWidth);
        //okCancel.setWidth(this.domElement.parentNode.offsetWidth-2);

        container.domElement.className = "flexiciousGrid";
        uiUtil.positionComponent(this.domElement,container.domElement);
        container.domElement.style.zIndex = "2000";
        //container.move(pt.x,pt.y + this.getHeight());
        //container.domElement.style.position = "fixed";
        this.popup=container;
        this.popup.addEventListener(this,flxConstants.EVENT_CLICK,
            function(e){
                if(e.triggerEvent.target.className=="okButton"){
                    this.onOkButton();
                }
                else if(e.triggerEvent.target.className=="cancelButton"){
                    this.restoreStateAndDestroyPopup();
                }else if(e.triggerEvent.target==this.getTextBox()){
                    this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("outsideIconClick"))
                }
            }
        );

        this.updateCheckBoxes();
        if(!this.alwaysVisible)
            flexiciousNmsp.DisplayList.instance().documentComponent.addEventListener(this,flxConstants.EVENT_MOUSE_DOWN, this.onDocumentMouseUp);
        else if(this.getAddAllItem())
            this.allUnchecked=false;

        /// else
            //this.domElement.style.visibility="hidden";
    };
    //==================IFilterControl Methods===============================/
    MultiSelectComboBox.prototype.clear = function () {
        this.setValue([])
    };
    /**
     * Generic function that returns the value of a IFilterControl
     */
    MultiSelectComboBox.prototype.getValue = function () {
        return this.selectedValues;
    };
    /**
     * Generic function that sets the value of a IFilterControl
     * @param val
     */
    MultiSelectComboBox.prototype.setValue = function (val) {
        this.selectedValues=val;
        if(this.popup){
            this.updateCheckBoxes();
        }else
            this.setLabel();
    };
    //==================End IFilterControl Methods===============================/
    /**
     * Flag, when set will cause the associated control to have
     * an Filter.ALL_ITEM Item value, which can then be used by the filtering
     * infrastructure to ignore the column in the search
     * @return
     *
     */
    MultiSelectComboBox.prototype.getAddAllItem = function () {
        return this._addAllItem;
    };
    /**
     *
     */
    MultiSelectComboBox.prototype.setAddAllItem = function (value) {
        this._addAllItem = value;
        this._addAllItemDirty = true;
        this.invalidateDisplayList();

    };

    /**
     * Updates the value of the current check boxes from selectedValues and dataProvider
     */
    MultiSelectComboBox.prototype.updateCheckBoxes=function(){
        var children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,uiUtil.doLower(flexiciousNmsp.TriStateCheckBox.typeName));
        for (var i = 0; i < children.length; i++) {
            var cb = children[i];
            var item=this.getDataProvider()[i];
            if(this.allUnchecked){
                cb.component.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED);
            }
            else if(this.selectedValues.length==0 &&  this.getAddAllItem()){
                cb.component.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
            }
            else if(i==0 && this.getAddAllItem()){
                cb.component.setSelectedState(this.selectedValues.length>=this.getDataProvider().length-1?flexiciousNmsp.TriStateCheckBox.STATE_CHECKED:this.selectedValues.length>0?flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE:flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED);
            }
            else{
                let cbVal = uiUtil.resolveExpression(item, this.dataField);
                if(cbVal === undefined || cbVal == null){
                    cbVal="";
                }
                cb.component.setSelectedState(this.selectedValues.includes(cbVal) ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED)
            }

        }
        this.setLabel();
    };

    MultiSelectComboBox.prototype.highlightRow=function(row){
        var children= uiUtil.adapter.findElementsWithClassName(this.popup.domElement,"checkBoxRow");
        if(this.highlightedRowIndex!==-1){
            uiUtil.detachClass(children[this.highlightedRowIndex],"hover");
        }
        this.highlightedRowIndex=children.indexOf(row.parentNode);
        uiUtil.attachClass(children[this.highlightedRowIndex],"hover");
    };
    MultiSelectComboBox.prototype.onOkButton=function(){
        if(this.allUnchecked)return;
        this.destroyPopup();
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flxConstants.EVENT_CHANGE));
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flxConstants.EVENT_VALUE_COMMIT));
    };
    MultiSelectComboBox.prototype.destroyPopup=function(force){
        if(this.alwaysVisible && !force)return;
        this.removeChild(this.popup);
        this.popup=null;
        var that = this;
        setTimeout(function(){
            flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListenerKeepDomListener(flxConstants.EVENT_MOUSE_DOWN,that.onDocumentMouseUp);
        },100);
    };
    MultiSelectComboBox.prototype.onDocumentMouseUp=function(e){
        if(this.owns(e.triggerEvent.target)){

        }  else{
            this.restoreStateAndDestroyPopup();
        }
    };
    MultiSelectComboBox.prototype.getDataProvider = function () {
        return this._dataProvider;
    };
    MultiSelectComboBox.prototype.setDataProvider=function(value){
        this._dataProvider=value;
        if(this.getAddAllItem()) //if dataprovider.implementsOrExtends('updated after all item.implementsOrExtends('added.
        {
            this._addAllItemDirty=true;
        }
        this.invalidateDisplayList();
    };
    /**
     *  Returns the String that the item renderer displays for the given data object.
     */
    MultiSelectComboBox.prototype.itemToLabel=function(data, isLabel){
        if(this.labelFunction!=null){
            return this.labelFunction(data, isLabel);
        }
        return flexiciousNmsp.ComboBox.itemToLabel(this,data);
    };
    MultiSelectComboBox.prototype.updateDisplayList=function(w,h){
        flexiciousNmsp.ComboBox.setSelectedItemFromValue(this);
        flexiciousNmsp.TextInput.prototype.updateDisplayList.apply(this)
        var outsideIconImg=this.getOutsideIcon();
        outsideIconImg.style.top= "1px";
        outsideIconImg.style.display="none";
        outsideIconImg=this.getInsideIcon();
        outsideIconImg.style.top= "1px";
    };

    MultiSelectComboBox.prototype.setLabel=function(){
        var labels=[];
        if(this.getAddAllItem() && (this.selectedValues.length==0|| (this.selectedValues.length==1&& this.selectedValues[0]==this.addAllItemText) )
            //||  (this.getDataProvider().length==(this.selectedValues.length+1))
            ){
            this.getTextBox().value=this.addAllItemText;
        }
        else if(this.getDataProvider() && this.getDataProvider().length>0){
            for (var i = 0; i < this.getDataProvider().length; i++) {
                var item = this.getDataProvider()[i];
                let cbVal = uiUtil.resolveExpression(item, this.dataField);
                if(cbVal === undefined || cbVal ==null){
                    cbVal = "";
                }
                if (this.selectedValues.includes(cbVal) && (cbVal != this.addAllItemText))
                    labels.push(this.itemToLabel(item, true));
            }
            labels.sort();
            this.getTextBox().value=labels.join(",");
            this.getTextBox().title=this.getTextBox().value;
        }


    };
    MultiSelectComboBox.prototype.setSelectedItem=function(val){

    };
    MultiSelectComboBox.prototype.owns=function(elem){
        return flexiciousNmsp.UIComponent.prototype.owns.apply(this,[elem]) || (this.popup &&this.popup.owns(elem))
    };

    MultiSelectComboBox.prototype.kill=function(){
        flexiciousNmsp.TextInput.prototype.kill.apply(this);
        if(this.popup){
            this.popup.kill();
            this.popup=null;
        }
    };
    /**
     * Initializes the auto complete and watermark plugins
     */
    MultiSelectComboBox.prototype.initialize=function(){
        flexiciousNmsp.TextInput.prototype.initialize.apply(this);
        this.getTextBox().readOnly=true;
        if(!this.getHeight()){
            this.setActualSize(this.defaultWidth,flxConstants.DEFAULT_MSCB_HEIGHT);//defaults
        }
        this.setLabel();
    };

    /**
     * Returns true if the all item is selected
     * false otherwise
     * @return
        *
     */
    MultiSelectComboBox.prototype.getIsAllSelected=function() {
        if(this.selectedValues && (this.selectedValues.length==1 )&&this.getDataProvider().length>0
            && (this.selectedValues[0]==this.getDataProvider()[0][this.dataField])){
            return true;
        }
        if(this.selectedValues.length==0 && this.getAddAllItem())return true;//by default everything is selected.
        for (var i = 0; i < this.getDataProvider().length; i++) {
            var item=this.getDataProvider()[i];
            if(!this.isItemSelected(item) && (this.getDataProvider().indexOf(item)!=0)){
                return false;
            }
        }
        return true;


    };
    MultiSelectComboBox.prototype.isItemSelected=function(item) {
        var itemKey = uiUtil.resolveExpression(item,this.dataField);
        var v=this.selectedValues;
        return (v.indexOf(itemKey)!=-1);
    };

    MultiSelectComboBox.prototype.getSelectedItems=function(item) {
        var result=[];
        var items=this.getDataProvider();
        if( typeof items !== 'undefined' && items !== null ) {
            for (var i = 0; i < items.length; i++) {
                var item=items[i];
                if(this.isItemSelected(item)){
                    result.push(item);
                }
            }
        }
        return result;
    };
    MultiSelectComboBox.prototype.restoreStateAndDestroyPopup = function() {
        this.setValue(this._previousValue);
        this.allUnchecked = this._previousAllUnchecked;
        this.destroyPopup();
    };

}(window));
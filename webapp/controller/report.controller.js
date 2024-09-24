sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/core/library"
],
function (Controller, JSONModel, Spreadsheet, exportLibrary, MessageToast, Sorter, CoreLibrary ) {
    "use strict";

    var EdmType             = exportLibrary.EdmType;
    var oFilterCompany      = [];
    var oFilterTpContrato   = [];
    var oFilters            = [];
    var vFilterDtFromIniCont;
    var vFilterDtToIniCont;
    var vFilterDtFromFimValid;
    var vFilterDtToFimValid;
    var vFilterDtFromProximoFim;
    var vFilterDtToProximoFim;

    const SortOrder = CoreLibrary.SortOrder;

    return Controller.extend("com.fidelidademundial.zcheckavalfree.controller.report", {
        onInit: function () {
            oFilterCompany.push("FS01");
            oFilterCompany.push("FIIS");

            oFilterTpContrato.push("AA");
            oFilterTpContrato.push("AE");

            //Initial sorting
/*             var oTabSort = new sap.ui.model.Sorter("dt_ini_contrato");
            var vTab = this.getView().byId("TabCont");
            vTab.getBinding().filter(oTabSort); */
        },

		OrdenaContratos: function(oEvent) {
			//const oCurrentColumn = oEvent.getParameter("column");
/*             const sOrder = oEvent.getParameter("sortOrder");
            oCurrentColumn.setSortOrder(sOrder);
            const oSorter = new Sorter(oCurrentColumn.getSortProperty(), sOrder === SortOrder.Descending); */

            //var oTabSort = new sap.ui.model.Filter("empresa", sap.ui.model.FilterOperator.BT, oFilterCompany[i].toString());
   /*          var oTabSort = new sap.ui.model.Sorter("dt_ini_contrato",SortOrder.Descending);
            var vTab = this.getView().byId("TabCont");
            vTab.getBinding().filter(oTabSort); */

		},

        OnClearCont: function () {
            var vTab = this.getView().byId("TabCont");
            var oModel = new sap.ui.model.json.JSONModel();
            var results = [];
            oModel.setData(results);
            vTab.setModel(oModel);
        },

        handleCompanyChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            if (!isSelected) {
                var index = oFilterCompany.indexOf(changedItem.getText());
                oFilterCompany.splice(index, 1);
            }
            else {
                oFilterCompany.push(changedItem.getText());
            }

        },

        handleTpContratoChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            if (!isSelected) {
                var index = oFilterTpContrato.indexOf(changedItem.getText());
                oFilterTpContrato.splice(index, 1);
            }
            else {
                oFilterTpContrato.push(changedItem.getText());
            }

        },

        OnSearchCont: function () {

            var vTab = this.getView().byId("TabCont");
                        var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_RE_CHECK_AVAL_SRV", true);

            var sContrato = this.getView().byId("txtBuscaContrato");

            ///////////////////////////////////////////////////////////////////
            oFilters = [];

            /// Empresas
            for (var i = 0; i < oFilterCompany.length; i++) {
                var oTabFilter = new sap.ui.model.Filter("empresa", sap.ui.model.FilterOperator.BT, oFilterCompany[i].toString());
                oFilters.push(oTabFilter);
            }
            /// Contratos
                if (sContrato.mProperties.value.toString() != "")
                {
                var oTabFilter = new sap.ui.model.Filter("contrato", sap.ui.model.FilterOperator.Contains, sContrato.mProperties.value.toString());
                oFilters.push(oTabFilter);
                };

            /// Tipo de Contrato
            for (var i = 0; i < oFilterTpContrato.length; i++) {
                var oTabFilter = new sap.ui.model.Filter("tp_contrato", sap.ui.model.FilterOperator.BT, oFilterTpContrato[i].toString());
                oFilters.push(oTabFilter);
            }

            /// Dt Ini Contrato
            var vCboDtIniCont = this.getView().byId("cboDtIniCont");
            var sFromIniCont   = vCboDtIniCont.mProperties.dateValue,
                sToIniCont     = vCboDtIniCont.mProperties.secondDateValue;


            if (sFromIniCont != null)
            {

                if (sFromIniCont != null)
                { vFilterDtFromIniCont = this.ConvertDate(sFromIniCont); }
                else
                { vFilterDtFromIniCont = "19000101"; }

                if (sToIniCont != null)
                    { vFilterDtToIniCont = this.ConvertDate(sToIniCont); }
                    else
                    { vFilterDtToIniCont = "99991231"; }

                //var oTabFilter = new sap.ui.model.Filter("dt_ini_contrato", sap.ui.model.FilterOperator.BT, vFilterDtFromIniCont, vFilterDtToIniCont );
                var oTabFilter = new sap.ui.model.Filter("dt_ini_contrato", sap.ui.model.FilterOperator.BT, sFromIniCont, sToIniCont );
                oFilters.push(oTabFilter);

            }

            /// Dt Fim Validade
            var vCboDtFimValid = this.getView().byId("cboDtFimValid");
            var sFromFimValid   = vCboDtFimValid.mProperties.dateValue,
                sToFimValid     = vCboDtFimValid.mProperties.secondDateValue;


            if (sFromFimValid != null)
            {

                if (sFromFimValid != null)
                { vFilterDtFromFimValid = this.ConvertDate(sFromFimValid); }
                else
                { vFilterDtFromFimValid = "19000101"; }

                if (sToFimValid != null)
                    { vFilterDtToFimValid = this.ConvertDate(sToFimValid); }
                    else
                    { vFilterDtToFimValid = "99991231"; }

                var oTabFilter = new sap.ui.model.Filter("dt_fim_valid", sap.ui.model.FilterOperator.BT, sFromFimValid, sToFimValid );
                oFilters.push(oTabFilter);

            }

            /// Dt Próximo Fim
            var vCboDtProximoFim = this.getView().byId("cboDtProximoFim");
            var sFromProximoFim   = vCboDtProximoFim.mProperties.dateValue,
                sToProximoFim     = vCboDtProximoFim.mProperties.secondDateValue;


            if (sFromProximoFim != null)
            {

                if (sFromProximoFim != null)
                { vFilterDtFromProximoFim = this.ConvertDate(sFromProximoFim); }
                else
                { vFilterDtFromProximoFim = "19000101"; }

                if (sToProximoFim != null)
                    { vFilterDtToProximoFim = this.ConvertDate(sToProximoFim); }
                    else
                    { vFilterDtToProximoFim = "99991231"; }

                var oTabFilter = new sap.ui.model.Filter("dt_proximo_fim", sap.ui.model.FilterOperator.BT, sFromProximoFim, sToProximoFim );
                oFilters.push(oTabFilter);

            }

            /// DATAS
            var vRadioDATAS = this.getView().byId("rbgDATAS");
            var vDATASVal = vRadioDATAS.getSelectedButton().getText();

            if ( vDATASVal != "Todos" )
            {
                if ( vDATASVal == "Atualizadas" )
                { vDATASVal = 'OK'; }
                else
                { vDATASVal = 'NOK'; }

                var oTabFilter = new sap.ui.model.Filter("status_data", sap.ui.model.FilterOperator.EQ, vDATASVal );
                oFilters.push(oTabFilter);
            }
            ;


            /// TAXAS
            var vRadioTAXAS = this.getView().byId("rbgTAXAS");
            var vTAXASVal = vRadioTAXAS.getSelectedButton().getText();

            if ( vTAXASVal != "Todos" )
            {
                if ( vTAXASVal == "Atualizadas" )
                { vTAXASVal = 'OK'; }
                else
                { vTAXASVal = 'NOK'; }

                var oTabFilter = new sap.ui.model.Filter("status_taxa", sap.ui.model.FilterOperator.EQ, vTAXASVal );
                oFilters.push(oTabFilter);
            }
            ;

            ///////////////////////////////////////////////////////////////////

            var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();

            vTab.getBinding().filter(oFilters);

            oGlobalBusyDialog.close();

/*             var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();

            oModel.read("/ZI_RE_CHECK_AVAL", {

                success: function (oData, response) {
                    this.WriteData(oData, vTab);
                    oGlobalBusyDialog.close();
                }.bind(this),
                error: function (err) {
                    sap.ui.core.BusyIndicator.hide();
                },
                filters: oFilters
            }
            ); */

        },

        WriteData: function (results, oTab) {

            var oModel = new sap.ui.model.json.JSONModel();
            //oModel.setData(results);
            oTab.setModel(oModel.results);
            oFilters = [];

        },

        handleContract: function (evt) {

            // Empresa
            var vBUKRS = evt.getSource().getBindingContext().getObject("empresa");

            // Contrato
            var vCONT = evt.getSource().getBindingContext().getObject("contrato");

            var finalUrl = window.location.href.split("#")[0] + "#REContract-manageContract?CompanyCode="+vBUKRS+"&RealEstateContract="+vCONT+"&REContract="+vCONT+"&DynproNoFirstScreen=1";
            sap.m.URLHelper.redirect(finalUrl, false);

        },

        AjustarContratos: function () {
            MessageToast.show("Função indisponível no momento!");
        }, 

        onChangeTabCont: function () {

            var vTab = this.getView().byId("TabCont");
            var vTotRegs = vTab.getBinding().getLength();
            var vTotRegsS = 0,
                vTotRegsE = 0;

            var vlblQtd = this.getView().byId("lblTotal");
            var vlblQtdS = this.getView().byId("lblSucessos");
            var vlblQtdE = this.getView().byId("lblErros");
            vlblQtd.setProperty("text", vTotRegs + " contrato(s) encontrado(s).");

            if ( vTotRegs > 0 )
            {
            vTotRegsS = vTab.getContextByIndex(0).getProperty("text_suc").toString();
            vTotRegsE = vTab.getContextByIndex(0).getProperty("text_err").toString();
            vlblQtdS.setProperty("visible", true);
            vlblQtdE.setProperty("visible", true);
            }
            else
            {
                vlblQtdS.setProperty("visible", false);
                vlblQtdE.setProperty("visible", false);                
            }

            vlblQtdS.setProperty("text", vTotRegsS);
            vlblQtdE.setProperty("text", vTotRegsE);

        },   

        ConvertDate: function (date) {

            var vConvDate;

            var vDay    = date.getDate().toString();
            if ( vDay < 10)
            { vDay = "0" + vDay };

            var vMonth  = ( date.getMonth() + 1 ).toString();
            { vMonth = "0" + vMonth };

            var vYear   = date.getFullYear().toString();

            vConvDate = vYear + vMonth + vDay;

            return vConvDate;

        },

        onExportCont: function() {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            //if (!this._oTable) {
                this._oTable = this.byId("TabCont");
            //}

            oTable = this._oTable;
            oRowBinding = oTable.getBinding("rows");
            aCols = this.createColumnConfigCont();

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oRowBinding,
                fileName: 'avaliacoes_contratos.xlsx',
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function() {
                oSheet.destroy();
            });
        },

        createColumnConfigCont: function() {
            var aCols = [];

            aCols.push({
                label: 'Empresa',
                property: 'empresa',
                type: EdmType.String
            });

            aCols.push({
                label: 'Tipo',
                property: 'tp_contrato',
                type: EdmType.String
            });

            aCols.push({
                label: 'Contrato',
                property: 'contrato',
                type: EdmType.String
            });

            aCols.push({
                label: 'Denominação',
                property: 'denominacao',
                type: EdmType.String
            });

            aCols.push({
                label: 'Início Contrato',
                property: 'dt_ini_contrato',
                type: EdmType.String
            });

            aCols.push({
                label: 'Fim Validade',
                property: 'dt_fim_valid',
                type: EdmType.String
            });

            aCols.push({
                label: 'Próximo Fim',
                property: 'dt_proximo_fim',
                type: EdmType.String
            });

            aCols.push({
                label: 'DATAS',
                property: 'status_data',
                type: EdmType.String
            });

            aCols.push({
                label: 'Início Análise',
                property: 'dt_ini_analise',
                type: EdmType.String
            });

            aCols.push({
                label: 'Fim Provável',
                property: 'dt_fim_provavel',
                type: EdmType.String
            });

            aCols.push({
                label: 'Fim Absoluto',
                property: 'dt_fim_absoluto',
                type: EdmType.String
            });

            aCols.push({
                label: 'Tx Jur. Avaliação',
                property: 'taxa_juros',
                type: EdmType.String
            });

            aCols.push({
                label: 'TAXAS',
                property: 'status_taxa',
                type: EdmType.String
            });

            aCols.push({
                label: 'Vida (meses)',
                property: 'meses_calc',
                type: EdmType.String
            });

            aCols.push({
                label: 'Tx Jur. Referência',
                property: 'taxa_juros_calc',
                type: EdmType.String
            });

            return aCols;
        }

    });
});

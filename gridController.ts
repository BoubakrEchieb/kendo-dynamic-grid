module Paie {
    "use strict";
    export class GridController {
        dropdownOptions: kendo.ui.DropDownListOptions;
        gridDataSource: kendo.data.DataSource;
        gridOptions: kendo.ui.GridOptions;
        dropDownListSelectedValue;
        name = "grid controller";
        dataArray: any[] = [];
        $service: IService;
        static $inject = ["Service"];
        constructor(private Service: IService) {
            this.$service = Service;
            this.dropdownOptions = {
                dataSource: [
                    {
                        valeur: "1",
                        text: "salarié"
                    },
                    {
                        valeur: "2",
                        text: "Variable"
                    },
                ],
                dataValueField: "valeur",
                dataTextField: "text"
            };
        }
        public getData(): void {
            let _self = this;
            if (_self.dropDownListSelectedValue == 1) {
                this.$service.read("api/Salarie/GetAll")
                    .then((result) => {
                        _self.initGrid(result);
                    }, (error): any => {
                        alert("Error");
                    });
            } else {
                this.$service.read("api/Variable/GetAll")
                    .then((result) => {
                        _self.initGrid(result);
                    }, (error): any => {
                        alert("Error");
                    });
            }
        }
        private initGrid(result) {
            console.log(result);
            let _self = this;
            this.dataArray = [];
            let gridColumns: any[] = [];
            gridColumns.push({ template: "<input type='checkbox' class='checkbox'/>", title: "#", width: "60px" });
            this.dataArray = result.data;
            let counter = 0;
            for (let property in this.dataArray[0]) {
                if (counter == 8) break;
                if (property.indexOf("Id") != -1)
                    gridColumns.push({
                        field: property,
                        title: property,
                        hidden: true
                    });
                else
                    gridColumns.push({
                        field: property,
                        title: property
                    });
                counter++;
            }
            _self.gridDataSource = new kendo.data.DataSource({
                data: this.dataArray,
                pageSize: 7,
                serverFiltering: false,
                serverSorting: false,
            });
            _self.gridOptions = {
                dataSource: _self.gridDataSource,
                //define dataBound event handler
                dataBound: function (e) {
                    $(".checkbox").bind("change", function (e) {
                        var grid = $("#grid").data("kendoGrid");
                        var row = $(e.target).closest("tr");
                        let checked = $(this).closest(".checkbox").is(":checked");
                        if (checked) {
                            //-select the row
                            row.addClass("k-state-selected");
                        } else {
                            //-remove selection
                            row.removeClass("k-state-selected");
                        }
                    });
                },
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                resizable: true,
                selectable: true,
                columns: gridColumns
            }
            let grid = $("#grid").kendoGrid(_self.gridOptions).data("kendoGrid");
            // read data
            $("#grid").data("kendoGrid").dataSource.read();
            let data = $("#grid").data().kendoGrid.dataSource.data();
        }
        public send(): void {
            var dataToSend = [];
            var grid = $("#grid").data("kendoGrid")
            var ds = grid.dataSource.data();
            for (var i = 0; i < ds.length; i++) {
                var row = grid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var checkbox = $(row).find(".checkbox");
                if (checkbox.is(":checked")) {
                    dataToSend.push(this.dataArray[i]);
                    row.addClass("k-state-selected");
                }
            }
        }
        public selectAll() {
            var grid = $("#grid").data("kendoGrid")
            var ds = grid.dataSource.data();
            for (var i = 0; i < ds.length; i++) {
                var row = grid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var checkbox = $(row).find(".checkbox");
                if (!checkbox.is(":checked")) {
                    checkbox.attr('checked', 'checked');
                }
            }
        }
    }
    angular.module("MyApp")
        .controller("GridController", GridController);
}
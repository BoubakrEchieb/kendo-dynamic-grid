var Paie;
(function (Paie) {
    "use strict";
    var GridController = (function () {
        function GridController(Service) {
            this.Service = Service;
            this.name = "grid controller";
            this.dataArray = [];
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
        GridController.prototype.getData = function () {
            var _self = this;
            if (_self.dropDownListSelectedValue == 1) {
                this.$service.read("api/Salarie/GetAll")
                    .then(function (result) {
                    _self.initGrid(result);
                }, function (error) {
                    alert("Error");
                });
            }
            else {
                this.$service.read("api/Variable/GetAll")
                    .then(function (result) {
                    _self.initGrid(result);
                }, function (error) {
                    alert("Error");
                });
            }
        };
        GridController.prototype.initGrid = function (result) {
            console.log(result);
            var _self = this;
            this.dataArray = [];
            var gridColumns = [];
            gridColumns.push({ template: "<input type='checkbox' class='checkbox'/>", title: "#", width: "60px" });
            this.dataArray = result.data;
            var counter = 0;
            for (var property in this.dataArray[0]) {
                if (counter == 8)
                    break;
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
                        var checked = $(this).closest(".checkbox").is(":checked");
                        if (checked) {
                            //-select the row
                            row.addClass("k-state-selected");
                        }
                        else {
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
            };
            var grid = $("#grid").kendoGrid(_self.gridOptions).data("kendoGrid");
            // read data
            $("#grid").data("kendoGrid").dataSource.read();
            var data = $("#grid").data().kendoGrid.dataSource.data();
        };
        GridController.prototype.send = function () {
            var dataToSend = [];
            var grid = $("#grid").data("kendoGrid");
            var ds = grid.dataSource.data();
            for (var i = 0; i < ds.length; i++) {
                var row = grid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var checkbox = $(row).find(".checkbox");
                if (checkbox.is(":checked")) {
                    dataToSend.push(this.dataArray[i]);
                    row.addClass("k-state-selected");
                }
            }
        };
        GridController.prototype.selectAll = function () {
            var grid = $("#grid").data("kendoGrid");
            var ds = grid.dataSource.data();
            for (var i = 0; i < ds.length; i++) {
                var row = grid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var checkbox = $(row).find(".checkbox");
                if (!checkbox.is(":checked")) {
                    checkbox.attr('checked', 'checked');
                }
            }
        };
        GridController.$inject = ["Service"];
        return GridController;
    }());
    Paie.GridController = GridController;
    angular.module("MyApp")
        .controller("GridController", GridController);
})(Paie || (Paie = {}));

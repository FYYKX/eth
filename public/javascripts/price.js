$(function () {
    $("#price").DataTable({
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;
            total_amount = api
                .column(3)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);
            $(api.column(3).footer()).html(total_amount);

            total_value = api
                .column(5)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);
            $(api.column(5).footer()).html(total_value);

            $(api.column(4).footer()).html((total_value / total_amount).toFixed(8));
        }
    });
});

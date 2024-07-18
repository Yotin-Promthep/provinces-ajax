$(document).ready(function () {
    // Load Provinces
    $.ajax({
        url: "json/provinces.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            data.forEach(function (province) {
                $('#province').append(new Option(province.provinceNameTh, province.provinceCode));
            });
        }
    });

    // Load Districts based on selected Province
    $('#province').change(function () {
        const provinceId = $(this).val();
        // console.log(provinceId);
        $('#district').prop('disabled', provinceId === '');
        $('#district').empty().append(new Option('Select District', ''));

        if (provinceId) {
            $.ajax({
                url: "json/districts.json",
                beforeSend: function () { //We add this before send to disable the button once we submit it so that we prevent the multiple click
                    ajaxLoader("#employees-list", "show");
                },
                method: "GET",
                dataType: "json",
                success: function (data) {
                    const filteredDistricts = data.filter(district => district.provinceCode === parseInt(provinceId));
                    // Debugging line to check the filtered districts
                    filteredDistricts.forEach(function (district) {
                        $('#district').append(new Option(district.districtNameTh, district.districtCode));
                    });
                    $("#employees-list").html(html);
                },
                complete: function() {
                    ajaxLoader("#employees-list", "hide");
                }
            });
        }

        // Reset and disable Subdistrict and Postal Code dropdowns
        $('#subdistrict').prop('disabled', true).empty().append(new Option('Select Subdistrict', ''));
        $('#postalCode').prop('disabled', true).empty().append(new Option('Select Postal Code', ''));
    });

    // Load Subdistricts based on selected District
    $('#district').change(function () {
        const districtId = $(this).val();

        $('#subdistrict').prop('disabled', districtId === '');
        $('#subdistrict').empty().append(new Option('Select Subdistrict', ''));

        if (districtId) {
            $.ajax({
                url: "json/subdistricts.json",
                method: "GET",
                dataType: "json",
                success: function (data) {
                    const filteredSubdistricts = data.filter(subdistrict => subdistrict.districtCode === parseInt(districtId));

                    filteredSubdistricts.forEach(function (subdistrict) {
                        $('#subdistrict').append(new Option(subdistrict.subdistrictNameTh, subdistrict.postalCode));
                    });
                }
            });
        }

        // Reset and disable Postal Code dropdown
        $('#postalCode').prop('disabled', true).empty().append(new Option('Select Postal Code', ''));
    });

    // Load Postal Code based on selected Subdistrict
    $('#subdistrict').change(function () {
        const postalCode = $(this).val();
        $('#postalCode').prop('disabled', postalCode === '');
        $('#postalCode').empty().append(new Option(postalCode, postalCode));
    });
});

/**
 * Ajax loader function
 *
 * @param {string} selector - The trigger element
 * @param {string} action - The action (show|hide) you want to apply of this function
 * @return {any}
 */
function ajaxLoader(selector, action) {
    var $class = "ajax-loader";

    $html = '<div class="' + $class + '"><div></div><div></div><div></div><div></div></div>';

    if (action == "show") {
        $($html).insertBefore(selector);
    } else if (action == "hide") {
        $("." + $class).hide();
    }

}
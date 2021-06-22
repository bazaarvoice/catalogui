$(document).ready(function() {
    var counter = 1;
    $('tr td table').each(function() {
        var expanel_id = 'expanel-' + counter;
        $(this).parent().parent().prev("tr").children("td.details-control").children("button").attr("aria-controls", expanel_id);
        $(this).parent().parent().attr("id", expanel_id);
        counter++;
        // Toggle the state properties
        $("button").click(function() {
            var state = $(this).attr("aria-expanded");
            if (state === "true") {
                $(this).attr("aria-expanded", 'false');
            } else {
                $(this).attr("aria-expanded", 'true');
            }
            $(this).parent().parent().next("tr").toggleClass("hidden");
        });
    });

    hide_columns_on_load(disabled_cols)
    $("#product_button_all").click(function() {
        if ($(this).prop('checked') == true) {
            $('.product_cb').prop('checked', true);
        } else {
            $('.product_cb').prop('checked', false);
        }
    })

    $("i.down").click(function() { ArrowClick($(this), ":desc") })
    $("i.up").click(function() { ArrowClick($(this), ":asc") })
    $("div.page").on('click', function(e) {
        if (e.target == this && $('#myModal:hidden').length == 0) {
            $('div#myModal').hide();
        }
    });
    $("#closemodal").on('click', function(e) {
        $('div#myModal').hide();
    })
});

function ArrowClick(elem, meth) {
    $("#first_details")[0].scrollIntoView();
    $(".arw").removeClass("active");
    elem.addClass("active");
    val = elem.attr("value")
    url = elem.attr("url").replace("/?", "");
    if (url.search("&sort=") > 0) {
        if (url.search(val + ":asc") > 0 && meth == ":asc") {
            url = url.replace(/&sort=.*:asc/gm, "");
        } else if (url.search(val + ":desc") > 0 && meth == ":desc") {
            url = url.replace(/&sort=.*:desc/gm, "");
        } else {
            url = url.replace(/&sort=.*:asc/gm, "").replace(/&sort=.*:desc/gm, "") + "&sort=" + val + meth;
            elem.addClass("active");
        }
    } else {
        url += "&sort=" + val + meth;
        elem.addClass("active");
    }
    document.location.search = url;
}

function HideColumn(elem, button) {
    if ($(elem).is(":hidden")) {
        $(elem).show()
        $(button).removeClass('btn_column_hidden');
        disabled_buttons($(elem).eq(0).attr('class'))
    } else {
        $(elem).hide()
        $(button).addClass('btn_column_hidden');
        disabled_buttons($(elem).eq(0).attr('class'))
    }
}
disabled_cols = []
if (sessionStorage.getItem('cols')) {
    disabled_cols = JSON.parse(sessionStorage.getItem('cols'));
} else {
    disabled_cols = ["p_desc", "p_act", "p_dis", "p_purl", "p_que"]
}

function hide_columns_on_load(disabled_cols) {
    for (var i = 0; i < disabled_cols.length; i++) {
        $("." + disabled_cols[i]).hide()
        $("#btn_" + disabled_cols[i]).prop('checked', false); 
    }
}

function disabled_buttons(column_class) {
    var btn_id = "btn_" + column_class
    var btn_class = "." + column_class

    if ($("#" + btn_id).length > 0 && $(btn_class).eq(0).is(":hidden")) {
        disabled_cols.push(column_class)
    } else {
        for (var i = 0; i < disabled_cols.length; i++) {
            if (disabled_cols[i] === column_class) {
                disabled_cols.splice(i, 1);
            }
        }
    }
    sessionStorage.setItem('cols', JSON.stringify(disabled_cols));
}


function modal_open(product) {
    $("#modal_name").text(product.Name)
    $("#modal_ID").text(product.Id)
    $("#modal_brand_name").text(product.BrandName)
    $("#modal_category_ID").text(product.CategoryId)
    $("#modal_image").attr("src", product.ImageUrl)
    $("#modal_family").text(formatArray(product.FamilyIds))
    $("#modal_state").text(product.Active)
    $("#modal_state2").text(product.Disabled)
    $("#modal_EAN").text(formatArray(product.EANs))
    $("#modal_UPC").text(formatArray(product.UPCs))
    $("#modal_Avg").text(parseFloat(product.AverageRating).toFixed(2))
    //$("#modal_Recommended").text(product.ReviewStatistics.RecommendedCount)
    $("#modal_Total_Reviews").text(product.TotalReviewCount)
    $("#modal_Last_Submitted").text(product.LastSubmissionTime)
    //$("#modal_Helpful").text(product.ReviewStatistics.HelpfulVoteCount)
    $("#modal_Desc").text(product.Description)
    //$("#modal_ISBN").text(formatArray(product.ISBNs))
    $("#modal_MPN").text(formatArray(product.MPNs))

    var modal = document.getElementById('myModal');
    modal.style.display = "block";
}

function formatArray(array) {
    formated_array = ""
    for (i = 0; i < array.length; i++) {
        formated_array += (i + 1 % 2 == 0) ? array[i] + "\n" : array[i] + ", "
    }
    return formated_array
}

function scroll_to_Top() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function pre_fill(data) {
    $('#options').show()
    sort = (data.sort)
    counter = 0;
    if (data.env) {
        $('input[value="' + data.env+ '"]').attr('checked', true);
    } else {
        $('input[value="stg"]').attr('checked', true);
    }
    if (sort) {
        if (sort.search("asc") > 0) {
            sort = sort.replace(":asc", "")
            $('i.up[value="' + sort + '"]').addClass("active");
        } else if (sort.search("desc") > 0) {
            sort = sort.replace(":desc", "")
            $('i.down[value="' + sort + '"]').addClass("active");
        }
        $("#first_details")[0].scrollIntoView();
    }
    if (data.filters) {
        data.filters.forEach(function(filter) {
            if (filter) {
                counter += 1
                if (filter.startsWith("act")) {
                    $('input[value=' + filter + ']').prop('checked', true);
                } else {
                    $('input[value=' + filter + ']').attr('checked', true);
                }
            }
            if (!counter) {
                $('input[value="rev_"]').attr('checked', true);
                $('input[value="que_"]').attr('checked', true);
                $('input[value="ans_"]').attr('checked', true);
            }

        })
    } else {
        $('input[value="rev_"]').attr('checked', true);
        $('input[value="que_"]').attr('checked', true);
        $('input[value="ans_"]').attr('checked', true);
    }
}
const names = {
    ImageUrl: "Image URL",
    ReviewCount: "# of Reviews",
    AverageRating: "Average Rating",
    QestionCount: "# of Questions",
    AnswerCount: "# of Answers",
    LastSubmission: "Last Submission Time",
    Name: "Product Name",
    Id: "Product External ID ",
    Active: "Product Status (active)",
    Disabled: "Product Status (disabled)",
    BrandName: "Brand Name",
    BrandId: "Brand ID",
    CategoryId: "Category ID",
    Description: "Description",
    UPCs: "UPC(s)",
    EANs: "EAN(s)",
    MPNs: "MPN(s)",
    ModelNumbers: "Model Numbers",
    FamilyIds: "Families",
    PDP: "Product Page URL",

}
const sortable = {
    ReviewCount: "TotalReviewCount",
    AverageRating: "AverageOverallRating",
    QestionCount: "TotalQuestionCount",
    AnswerCount: "TotalAnswerCount",
    CategoryId: "CategoryId",
    Active: "IsActive",
    Disabled: "IsDisabled",
    Name: "Name",
    Id: "Id"
}
const filters = {
    types: {
        "0": "None",
        "1": "At least one",
        "10": "10 +",
        "50": "50 +",
        "100": "100+"
    },
    content: {
        Reviews: "rev_",
        Questions: "que_",
        Answers: "ans_",
    }
}
module.exports = {
    formatFilters: function(filters = []) {
        filter_to_query = filter = ""
        activeFilters = []
        filters.forEach(function(filt) {
            if (filt) {
                if (!(typeof filt == "string")) filt = filt[0]
                if (filt.toLowerCase().startsWith("rev") && !filt.toLowerCase().endsWith("_")) {
                    parts = filt.split("_")
                    if (parts[1] > 0) {
                        if (parts[1] == 1) parts[1] = 0;
                        filter_to_query += "&filter=TotalReviewCount:gt:" + parts[1];
                    } else {
                        filter_to_query += "&filter=TotalReviewCount:eq:" + parts[1];
                    }
                } else if (filt.toLowerCase().startsWith("que") && !filt.toLowerCase().endsWith("_")) {
                    parts = filt.split("_")
                    if (parts[1] > 0) {
                        filter_to_query += "&filter=TotalQuestionCount:gt:" + parts[1];
                    } else {
                        filter_to_query += "&filter=TotalQuestionCount:eq:" + parts[1];
                    }
                } else if (filt.toLowerCase().startsWith("ans") && !filt.toLowerCase().endsWith("_")) {
                    parts = filt.split("_")
                    if (parts[1] > 0) {
                        filter_to_query += "&filter=TotalAnswerCount:gt:" + parts[1];
                    } else {
                        filter_to_query += "&filter=TotalAnswerCount:eq:" + parts[1];
                    }

                } else if (filt.toLowerCase().startsWith("act") && !filt.toLowerCase().endsWith("_")) {
                    if (filt.endsWith("false")) activeFilters.push("&filter=IsActive:eq:false")
                    if (filt.endsWith("true")) activeFilters.push("&filter=IsActive:eq:true")

                }
            }
        })
        if (activeFilters.length == 1) filter = activeFilters[0]
        return filter_to_query + filter
    },
    formatData: function(result) {
        data = {}
        data.Limit = result.Limit
        data.Offset = result.Offset
        data.TotalResults = result.TotalResults
        data.products = []
        data.names = names
        data.sortable = sortable
        data.filters = filters
        if (result) {
            result.Results.forEach(function(product) {
                product_to_add = {
                    ImageUrl: product.ImageUrl,
                    ReviewCount: product.ReviewStatistics.TotalReviewCount,
                    AverageRating: product.ReviewStatistics.AverageOverallRating ? product.ReviewStatistics.AverageOverallRating.toFixed(1) : null,
                    QestionCount: product.TotalQuestionCount,
                    AnswerCount: product.TotalAnswerCount,
                    LastSubmission: product.ReviewStatistics.LastSubmissionTime,
                    Name: product.Name,
                    Id: product.Id,
                    Active: product.Active,
                    Disabled: product.Disabled,
                    BrandName: product.Brand.Name,
                    BrandId: product.Brand.Id,
                    CategoryId: product.CategoryId,
                    Description: product.Description,
                    UPCs: product.UPCs,
                    EANs: product.EANs,
                    MPNs: product.ManufacturerPartNumbers,
                    ModelNumbers: product.ModelNumbers,
                    FamilyIds: product.FamilyIds,
                    PDP: product.ProductPageUrl,

                }
                data.products.push(product_to_add)
            })
        }

        return data
    }

}
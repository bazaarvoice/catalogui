const request = require('request')
const appKey = "catalogui"
module.exports = {
    getProducts: async function(client, environment, count_per_page = 20, page = 0, filter = "", search="",sort="") {
        url = `https://hagrid-${environment=="prod"?"bazaar":"uat"}-use1.prod.bazaarvoice.com/data/products.json?apiVersion=5.4&clientName=${client}&offset=${count_per_page*page}&limit=${count_per_page}&appKey=${appKey}&stats=reviews,questions&excludeFamily=true${filter}${search}${sort}`
        console.log(url)
        return new Promise(function(resolve, reject) {
            request({ url, timeout: 5000, json: true }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(body)
                }
            });
        });
    },
    getSingleProduct: async function(client, environment, product_id) {
        url = `https://catalog-${environment=="prod"?"bazaar":"uat"}.prod.us-east-1.nexus.bazaarvoice.com/2/clients/${client}/products/${product_id}?apikey=${apikey}`
        return new Promise(function(resolve, reject) {
            request({ url, timeout: 5000, json: true }, (err, res, body) => {
                if (err) {
                    reject(err)

                } else {
                    resolve(body)
                }
            });
        });
    },
    updateSingleProduct: async function(client, environment, product) {
        url = `https://catalog-${environment=="prod"?"bazaar":"uat"}.prod.us-east-1.nexus.bazaarvoice.com/2/clients/${client}/products/${product.externalID}?apikey=${apikey}`
        return new Promise(function(resolve, reject) {
            request({ url, timeout: 5000, method: 'PUT', json: product }, (err, res, body) => {
                if (err) {
                    reject(err)

                } else {
                    resolve(body)
                }
            });
        });
    },
    updateSingleProduct: async function(client, environment, product) {
        url = `https://catalog-${environment=="prod"?"bazaar":"uat"}.prod.us-east-1.nexus.bazaarvoice.com/2/clients/${client}/products/${product.externalID}?apikey=${apikey}`
        console.log(product)
        return new Promise(function(resolve, reject) {
            request({ url, timeout: 5000, method: 'PUT', json: product }, (err, res, body) => {
                console.log(res)
                if (err) {
                    reject(err)

                } else {
                    resolve(body)
                }
            });
        });
    },

}


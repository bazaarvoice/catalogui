const app = require('express')()
const express = require("express");
const catalogAPI = require('./functions/catalog_requests');
const other = require('./functions/other');
const path = require('path');


app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));

app.set('view engine', 'ejs')
app.set('views', './views')


app.get('/', async (req, res) => {
    products = filters_raw = get_search=get_sort=page= details=""
    if (req.query.client && req.query.env) {
        page = req.query.page?parseInt(req.query.page):1
        if (req.query.sort) get_sort = `&sort=${req.query.sort}`
        if (req.query.search) get_search = `&search=${req.query.search}`
        filters_raw = [req.query.filter_ac, req.query.filter_in, req.query.filter_r, req.query.filter_q, req.query.filter_a]
        filters = other.formatFilters(filters_raw)
        count_per_page = req.query.count > 100 ? 100 : req.query.count
        products = await catalogAPI.getProducts(req.query.client, req.query.env, count_per_page, page-1, filters, get_search, get_sort)      
    }
    details = other.formatData(products)
    url = req.url.replace(/&page=[0-9]+/gm,"");
    res.render('home', { products: products,details, data: { client: req.query.client, env: req.query.env, page, url, filters: filters_raw, sort: req.query.sort} })
})

app.listen(8080)
console.log('listening on port 8080')
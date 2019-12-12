const express = require('express');
const router = express.Router();
const axios = require('axios');
const Joi = require('@hapi/joi');

const postSchema = Joi.array().min(1).items(Joi.object({
    name: Joi.string().min(1).required().trim(),
    quantity: Joi.number().integer().min(1).required(),
    currency: Joi.string().valid('RUB', 'USD', 'EUR').required(),
    price: Joi.number().precision(2).min(.01).required(),
})).required();

router.get('/', async (req, res, next) => {
    try {
        res.render('index', {title: 'Secreate'});
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const validate = postSchema.validate(req.body);

        if (validate.error) {
            return res.status(400).send(validate.error);
        }

        const items = validate.value;

        const {data: {Valute}} = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');

        const total = {
            'RUB': 0,
            'USD': 0,
            'EUR': 0,
        };

        for (const item of items) {
            const itemValute = Valute[item.currency] || {Value: 1};
            const itemCost = (itemValute.Value * item.price * item.quantity);
            for (const currency of Object.keys(total)) {
                const totalValute = Valute[currency] || {Value: 1};
                total[currency] += (itemCost / totalValute.Value);
                total[currency] = Math.round(total[currency] * 100) / 100;
            }
        }

        res.json(total);
    } catch (err) {
        console.error('catch.err:', err);
        next(err);
    }
});

module.exports = router;

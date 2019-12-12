
const app = new Vue({
    el: '#app',
    data: {
        items: [],
        total: {
          RUB: null,
          USD: null,
          EUR: null,
        },
        editIndex: null,
        invalids: {
            name: false,
            quantity: false,
            currency: false,
            price: false,
        },
        calcError: null,
    },
    methods: {
        isValid: function () {
            const elements = document.querySelectorAll('.form-control');
            elements.forEach(element => {
                if (element.name) {
                    this.invalids[element.name] = !element.validity.valid;
                }
            });
            return Object.values(this.invalids).every(val => val === false);
        },
        onAdd: function () {
            this.editIndex = this.items.push({name: null, quantity: null, currency: null, price: null}) - 1;
        },
        onEdit: function (index) {
            this.editIndex = index;
        },
        onSave: function (index) {
            if (this.isValid()) {
                this.editIndex = null;
            }
        },
        onDel: function (index) {
            this.items.splice(index, 1);
            this.editIndex = null;
        },
        onCalc: async function () {
            if (this.isValid()) {
                try {
                    this.calcError = null;
                    Object.keys(this.total).forEach(key => this.total[key] = null);
                    const res = await axios.post('/', this.items);
                    this.total = res.data;
                } catch (e) {
                    this.calcError = e.toString();
                    console.error('onCalc.e:', e);
                }
            }
        }
    }
});

import productList from "./productlist.js";

let FilterOptionsLists = {};
productList.categories.forEach((i) => (FilterOptionsLists[i] = [])); // form filterList
let SelectedProducts = productList.phones;
let filterError = false;
let Cart = []


function buildFilter() {
    let filterContainer = document.querySelector(".filter-container");
    let filterBox = document.querySelector(".filter-box");
    let filterRow = document.querySelector(".filter-checkbox");

    //   ! Зробити щоб категорія товару вибиралася автоматично а не було phones
    productList.categories.forEach((category) => { // forming filter with all categories with their values
        let filterBowClone = filterBox.cloneNode(true);
        filterBowClone.firstElementChild.firstElementChild.textContent = category;

        let optionsList = []; // make list that contains all option of current filter category
        productList.phones.forEach((phone) => {
            if (!optionsList.includes(phone[category])) optionsList.push(phone[category]);
        });
        optionsList.sort((a, b) => b - a);

        optionsList.forEach((filterOption) => { // forming filterRow according to filterOption
            let filterRowClone = filterRow.cloneNode(true);

            filterRowClone.children[1].textContent = filterOption; // Checkbox label text
            filterRowClone.children[1].htmlFor = category + '_' + filterOption;
            filterRowClone.children[0].id = category + '_' + filterOption;

            filterRowClone.children[0].name = category + '_' + filterOption;
            filterBowClone.append(filterRowClone);

            filterRowClone.children[0].addEventListener("click", updateOnCheckboxClick); //function for updating checkboxes counters and states
        });

        filterBowClone.children[1].remove();
        filterBox.remove();
        filterContainer.append(filterBowClone);
    });
}
buildFilter();


//   product builder
function buildProductList() {
    let productContainer = document.querySelector('.product__container');
    let productBox = document.querySelector('.product__box');
    let productImg = document.querySelector('.product__img');
    let productName = document.querySelector('.product__name');
    let productPrice = document.querySelector('.product__price');
    let productActions = document.querySelector('.product__actions');

    for (let i = 1; i < productContainer.children.length; i++) {
        productContainer.children[i].remove();
    }
    console.log(productContainer.children.length);

    SelectedProducts.forEach(product => {
        // let productBoxClone = productBox.cloneNode(true);
        let productImgClone = productImg.cloneNode(true);
        let productNameClone = productName.cloneNode(true);
        let productPriceClone = productPrice.cloneNode(true);
        let productActionsClone = productActions.cloneNode(true);

        productImgClone.firstElementChild.setAttribute('src', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSFkuXSLa5TrDQHqAiq_uzv7X7I0kCpKfRkXJIhjgqvkrRDq2HZ_TI2h0f04dK5eRiIDGrEvtOiiA&usqp=CAc');
        productNameClone.textContent = product.name;
        productPriceClone.textContent = product.price;

        productActionsClone.firstElementChild.dataset.productId = product.id;
        productActionsClone.firstElementChild.addEventListener('click', addToCart);

        function addToCart(e) {
            if (!Cart.includes(e.currentTarget.dataset.productId)) {
                Cart.push(e.currentTarget.dataset.productId);
                document.querySelector('.cart-counter').textContent = Cart.length;
            }
            console.log(Cart);

        }

        let productBoxClone = document.createElement('div');
        productBoxClone.classList.add('product__box');
        productBoxClone.append(productImgClone);
        productBoxClone.append(productNameClone);
        productBoxClone.append(productPriceClone);
        productBoxClone.append(productActionsClone);

        productContainer.append(productBoxClone);

    })
    productBox.remove();
}
buildProductList();



function calcFilterCountlinkers() {
    let checkboxes = document.querySelectorAll(".filter-checkbox__input");
    let checkboxesCounters = document.querySelectorAll(".filter-checkbox__product-counter");

    checkboxes.forEach((checkbox, checkboxIndex) => {
        let filterCategory = checkbox.name.split('_')[0];
        let filterOption = checkbox.name.split('_')[1];
        let filterCounterUnChecked = 0;
        let filterCounterChecked = 0;

        if (FilterOptionsLists[filterCategory].indexOf(filterOption) != -1) { //make checkbox unchecked for calculating filterCounterUnChecked
            FilterOptionsLists[filterCategory].splice(
                FilterOptionsLists[filterCategory].indexOf(filterOption),
                1
            );
        }
        productList.phones.forEach((product) => { // counting resulting products amount if current checkbox unchecked
            let productCheck = true;
            for (let category in FilterOptionsLists) {
                if (category === 'textFilter') {
                    let productName = product["name"].split(' ').join('').toLowerCase();
                    let filterTextParameter = FilterOptionsLists[category].split(' ').join('').toLowerCase();
                    if (!productName.includes(filterTextParameter)) {
                        productCheck = false;
                        break;
                    }
                } else
                if (!FilterOptionsLists[category].length) {
                    continue;
                    console.log();

                } else if (!FilterOptionsLists[category].includes(product[category])) {
                    productCheck = false;
                    break;
                }
            }
            if (productCheck) filterCounterUnChecked++;
        });

        FilterOptionsLists[filterCategory].push(filterOption);
        productList.phones.forEach((product) => { // counting resulting products amount if current checkbox checked
            let productCheck = true;
            for (let category in FilterOptionsLists) {
                if (category === 'textFilter') {
                    let productName = product["name"].split(' ').join('').toLowerCase();
                    let filterTextParameter = FilterOptionsLists[category].split(' ').join('').toLowerCase();
                    if (!productName.includes(filterTextParameter)) {
                        productCheck = false;
                        break;
                    }
                } else
                if (!FilterOptionsLists[category].length) {
                    continue;
                    console.log();

                } else if (!FilterOptionsLists[category].includes(product[category])) {
                    productCheck = false;
                    break;
                }
            }
            if (productCheck) filterCounterChecked++;
        });

        if (checkboxes[checkboxIndex].hasAttribute("disabled")) { //reset  all disabled attributes 
            checkboxes[checkboxIndex].removeAttribute("disabled");
        }
        filterError = false; //reset filterError

        if (filterCounterChecked <= 0) { // cheking for disabled options and options that thanks user activities makes resulting product list empty 
            if (checkboxes[checkboxIndex].checked) {
                checkboxesCounters[checkboxIndex].textContent = "-";
                filterError = true
            } else {
                checkboxes[checkboxIndex].setAttribute("disabled", "");
                checkboxesCounters[checkboxIndex].textContent = 0;
            }

        } else if (filterCounterChecked < filterCounterUnChecked) {
            checkboxesCounters[checkboxIndex].textContent = filterCounterChecked;
        } else if (filterCounterChecked == filterCounterUnChecked) {
            let isOptionInSortedList = false;
            for (let prod of SelectedProducts) {
                if (prod[filterCategory] == filterOption) {
                    isOptionInSortedList = true;
                    break;
                }
            }

            if (isOptionInSortedList) {
                checkboxesCounters[checkboxIndex].textContent = filterCounterChecked;
            } else {
                checkboxesCounters[checkboxIndex].textContent = 0;
                if (!checkboxes[checkboxIndex].checked) {
                    checkboxes[checkboxIndex].setAttribute("disabled", "");
                }
            }
        } else if (filterCounterChecked > filterCounterUnChecked) {
            checkboxesCounters[checkboxIndex].textContent =
                filterCounterChecked - filterCounterUnChecked;
        }

        if (!checkboxes[checkboxIndex].checked) { // return initial filter list parameters
            FilterOptionsLists[filterCategory].splice(
                FilterOptionsLists[filterCategory].indexOf(filterOption),
                1
            );
        }
    });
}
calcFilterCountlinkers();

function updateOnCheckboxClick(e) {
    let currentCheckbox = e.currentTarget;
    let selectedCategory = currentCheckbox.name.split('_')[0];
    let selectedOption = currentCheckbox.name.split('_')[1];

    if (FilterOptionsLists[selectedCategory].indexOf(selectedOption) == -1) { // updating filter list(list with filter categories and their options)
        FilterOptionsLists[selectedCategory].push(selectedOption);
    } else {
        FilterOptionsLists[selectedCategory].splice(
            FilterOptionsLists[selectedCategory].indexOf(selectedOption),
            1
        );
    }

    function filterProducts() {
        SelectedProducts = [];
        productList.phones.forEach((product) => {
            let productCheck = true;
            for (let category in FilterOptionsLists) {
                if (category === 'textFilter') {
                    let productName = product["name"].split(' ').join('').toLowerCase();
                    let filterTextParameter = FilterOptionsLists[category].split(' ').join('').toLowerCase();
                    if (!productName.includes(filterTextParameter)) {
                        productCheck = false;
                        break;
                    }
                } else
                if (!FilterOptionsLists[category].length) {
                    continue;
                    console.log();

                } else if (!FilterOptionsLists[category].includes(product[category])) {
                    productCheck = false;
                    break;
                }
            }
            if (productCheck) SelectedProducts.push(product);
        });
    }

    if (currentCheckbox.checked) { // making resulting product list 
        filterProducts();
    } else {
        if (!FilterOptionsLists[selectedCategory].length) { // updating sortedList when unchecked last option in current category
            filterProducts();
        } else { // delete from sortedList elements that have deleted option
            SelectedProducts = SelectedProducts.filter(
                (it) => it[selectedCategory] != selectedOption
            );
        }
    }
    calcFilterCountlinkers();
    buildProductList()
    console.log(SelectedProducts);

}


{ //  close filter block
    let filterToggleIcons = document.querySelectorAll(".filter-toggle");
    filterToggleIcons.forEach((icon) => icon.addEventListener("click", switchFilterBox));

    function switchFilterBox(e) {
        let filterToggleIcon = e.currentTarget;
        let filterBoxChildren = filterToggleIcon.parentElement.parentElement.children;
        filterToggleIcon.classList.toggle("rotate180");

        for (let filterBoxChild of filterBoxChildren) {
            if (filterBoxChild.classList.contains("filter-checkbox"))
                filterBoxChild.classList.toggle("displayNone");
        }
    }
}

{ //  clear search   
    let eraseButton = document.querySelector(".search-erase");
    let searchInput = document.querySelector(".search input");

    eraseButton.addEventListener("click", resetSearchText);
    searchInput.addEventListener("keyup", resetSearchText);


    function resetSearchText(e) {
        if (e.type === 'click') {
            searchInput.value = '';
            FilterOptionsLists['textFilter'] = '';
            calcFilterCountlinkers();
        } else if ((e.type === 'keyup') && e.keyCode == 27) {
            searchInput.value = '';
            FilterOptionsLists['textFilter'] = '';
        }
    }
}

{ //search filter
    let searchBlock = document.querySelector('.search input');
    searchBlock.addEventListener('keyup', sortByTextFilter);

    function sortByTextFilter(e) {
        let textFilter = e.currentTarget.value;
        FilterOptionsLists['textFilter'] = textFilter;
        console.log(FilterOptionsLists);
        SelectedProducts = [];
        productList.phones.forEach((product) => {
            let productCheck = true;
            for (let category in FilterOptionsLists) {
                if (category === 'textFilter') {
                    let productName = product["name"].split(' ').join('').toLowerCase();
                    let filterTextParameter = FilterOptionsLists[category].split(' ').join('').toLowerCase();

                    if (!productName.includes(filterTextParameter)) {
                        productCheck = false;
                        break;
                    }
                } else if (!FilterOptionsLists[category].length) {
                    continue;

                } else if (!FilterOptionsLists[category].includes(product[category])) {
                    productCheck = false;
                    break;
                }
            }
            if (productCheck) SelectedProducts.push(product);
            calcFilterCountlinkers();
        });
    }

}
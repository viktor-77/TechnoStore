import productList from "./productlist.js";

let FilterOptionsList = {};
productList.categories.forEach((i) => (FilterOptionsList[i] = [])); // form filterList
let SelectedProducts = productList.phones;
let filterError = false;
let Cart = [
   {
      id: 6,
      price: '35000',
      color: "green",
      memory: '64',
      RAM: '4',
      diagonal: '6',
      imgSrc: "https://i.citrus.world/imgcache/size_180/uploads/shop/f/4/f4b167fdf1663cf7ee3bc93ca4d70d45.jpg",
      brend: "iphone",
      name: "xiomi",
   }, {
      id: 7,
      brend: "iphone",
      price: '21500',
      color: "grey",
      imgSrc: "https://i.citrus.world/imgcache/size_180/uploads/shop/0/4/045b5daa7a904e30aa14f8cbaf8e6d8d.jpg",
      memory: '32',
      RAM: '3',
      diagonal: '6',
      name: "iphone10",
   },
   {
      id: 6,
      price: '35000',
      color: "green",
      memory: '64',
      RAM: '4',
      diagonal: '6',
      imgSrc: "https://i.citrus.world/imgcache/size_180/uploads/shop/f/4/f4b167fdf1663cf7ee3bc93ca4d70d45.jpg",
      brend: "iphone",
      name: "xiomi",
   }, {
      id: 7,
      brend: "iphone",
      price: '21500',
      color: "grey",
      imgSrc: "https://i.citrus.world/imgcache/size_180/uploads/shop/0/4/045b5daa7a904e30aa14f8cbaf8e6d8d.jpg",
      memory: '32',
      RAM: '3',
      diagonal: '6',
      name: "iphone10",
   },
];


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
         filterRowClone.children[0].addEventListener("click", onCheckboxClick); //function for updating checkboxes counters and states
      });
      filterBowClone.children[1].remove();
      filterBox.remove();
      filterContainer.append(filterBowClone);
   });
}
buildFilter();
function buildProductList() { //calcFilterCountlinkers calls this function
   let productContainer = document.querySelector('.product__container');
   let productCartIndicator = document.querySelector('.cart-active');
   let productImg = document.querySelector('.product__img');
   let productName = document.querySelector('.product__name');
   let productPrice = document.querySelector('.product__price');
   let productActions = document.querySelector('.product__actions');
   while (productContainer.children.length) {
      productContainer.removeChild(productContainer.firstElementChild);
   }
   SelectedProducts.forEach(product => {
      let productCartIndicatorClone = productCartIndicator.cloneNode(true);
      let productImgClone = productImg.cloneNode(true);
      let productNameClone = productName.cloneNode(true);
      let productPriceClone = productPrice.cloneNode(true);
      let productActionsClone = productActions.cloneNode(true);
      if (!Cart.includes(+product.id)) {
         if (!productCartIndicatorClone.classList.contains('displayNone')) {
            productCartIndicatorClone.classList.add('displayNone');
         }
         if (productActionsClone.firstElementChild.firstElementChild.classList.contains('displayNone')) {
            productActionsClone.firstElementChild.firstElementChild.classList.remove('displayNone');
         }
         if (!productActionsClone.firstElementChild.children[1].classList.contains('displayNone')) {
            productActionsClone.firstElementChild.children[1].classList.add('displayNone');
         }
      } else {
         if (productCartIndicatorClone.classList.contains('displayNone')) {
            productCartIndicatorClone.classList.remove('displayNone');
         }
         if (!productActionsClone.firstElementChild.firstElementChild.classList.contains('displayNone')) {
            productActionsClone.firstElementChild.firstElementChild.classList.add('displayNone');
         }
         if (productActionsClone.firstElementChild.children[1].classList.contains('displayNone')) {
            productActionsClone.firstElementChild.children[1].classList.remove('displayNone');
         }
      }
      productImgClone.firstElementChild.setAttribute('src', product.imgSrc);
      productNameClone.textContent = product.name;
      productPriceClone.textContent = product.price;
      productActionsClone.firstElementChild.dataset.productId = product.id;
      productActionsClone.firstElementChild.addEventListener('click', toggleProductToCart);
      function toggleProductToCart(e) {
         e.currentTarget.parentElement.parentElement.classList.remove('product__box_active');
         if (!Cart.includes(+e.currentTarget.dataset.productId)) {
            Cart.push(+e.currentTarget.dataset.productId);
            document.querySelector('.cart-counter').classList.remove('displayNone');
            document.querySelector('.cart-counter').textContent = Cart.length;
            if (!e.currentTarget.parentElement.parentElement.classList.contains('product__box_active')) {
               e.currentTarget.parentElement.parentElement.classList.add('product__box_active');
            }
         } else {
            Cart.splice(Cart.indexOf(+e.currentTarget.dataset.productId), 1);
            if (!Cart.length) {
               document.querySelector('.cart-counter').classList.add('displayNone');
            }
            document.querySelector('.cart-counter').textContent = Cart.length;
         }
         e.currentTarget.parentElement.parentElement.children[0].classList.toggle('displayNone');
         e.currentTarget.children[0].classList.toggle('displayNone');
         e.currentTarget.children[1].classList.toggle('displayNone');
         console.log(Cart);
      }
      let productBoxClone = document.createElement('div');
      productBoxClone.classList.add('product__box');
      if (Cart.includes(product.id)) {
         productBoxClone.classList.add('product__box_active');
      }
      productBoxClone.append(productCartIndicatorClone);
      productBoxClone.append(productImgClone);
      productBoxClone.append(productNameClone);
      productBoxClone.append(productPriceClone);
      productBoxClone.append(productActionsClone);
      productContainer.append(productBoxClone);
   })
}
buildProductList();
function calcFilterCounter() {
   let checkboxes = document.querySelectorAll(".filter-checkbox__input");
   let checkboxesCounters = document.querySelectorAll(".filter-checkbox__product-counter");
   checkboxes.forEach((checkbox, checkboxIndex) => {
      let filterCategory = checkbox.name.split('_')[0];
      let filterOption = checkbox.name.split('_')[1];
      let filterCounterUnChecked = 0;
      let filterCounterChecked = 0;
      if (FilterOptionsList[filterCategory].indexOf(filterOption) != -1) { //make checkbox unchecked for calculating filterCounterUnChecked
         FilterOptionsList[filterCategory].splice(
            FilterOptionsList[filterCategory].indexOf(filterOption),
            1
         );
      }
      productList.phones.forEach((product) => { // counting resulting products amount if current checkbox unchecked
         let productCheck = true;
         for (let category in FilterOptionsList) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = FilterOptionsList[category].split(' ').join('').toLowerCase();
               if (!productName.includes(filterTextParameter)) {
                  productCheck = false;
                  break;
               }
            } else
               if (!FilterOptionsList[category].length) {
                  continue;
               } else if (!FilterOptionsList[category].includes(product[category])) {
                  productCheck = false;
                  break;
               }
         }
         if (productCheck) filterCounterUnChecked++;
      });
      FilterOptionsList[filterCategory].push(filterOption);
      productList.phones.forEach((product) => { // counting resulting products amount if current checkbox checked
         let productCheck = true;
         for (let category in FilterOptionsList) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = FilterOptionsList[category].split(' ').join('').toLowerCase();
               if (!productName.includes(filterTextParameter)) {
                  productCheck = false;
                  break;
               }
            } else
               if (!FilterOptionsList[category].length) {
                  continue;
               } else if (!FilterOptionsList[category].includes(product[category])) {
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
         FilterOptionsList[filterCategory].splice(
            FilterOptionsList[filterCategory].indexOf(filterOption),
            1
         );
      }
   });
}
calcFilterCounter();
function onCheckboxClick(e) {
   let currentCheckbox = e.currentTarget;
   let selectedCategory = currentCheckbox.name.split('_')[0];
   let selectedOption = currentCheckbox.name.split('_')[1];
   function updateFilterOnCheckboxClick() {
      if (FilterOptionsList[selectedCategory].indexOf(selectedOption) == -1) { // updating filter list(list with filter categories and their options)
         FilterOptionsList[selectedCategory].push(selectedOption);
      } else {
         FilterOptionsList[selectedCategory].splice(
            FilterOptionsList[selectedCategory].indexOf(selectedOption),
            1
         );
      }
   }
   updateFilterOnCheckboxClick();
   function getFilteredProductList() {
      function filterProducts() {
         SelectedProducts = [];
         productList.phones.forEach((product) => {
            let productCheck = true;
            for (let category in FilterOptionsList) {
               if (category === 'textFilter') {
                  let productName = product["name"].split(' ').join('').toLowerCase();
                  let filterTextParameter = FilterOptionsList[category].split(' ').join('').toLowerCase();
                  if (!productName.includes(filterTextParameter)) {
                     productCheck = false;
                     break;
                  }
               } else
                  if (!FilterOptionsList[category].length) {
                     continue;
                  } else if (!FilterOptionsList[category].includes(product[category])) {
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
         if (!FilterOptionsList[selectedCategory].length) { // updating sortedList when unchecked last option in current category
            filterProducts();
         } else { // delete from sortedList elements that have deleted option
            SelectedProducts = SelectedProducts.filter(
               (it) => it[selectedCategory] != selectedOption
            );
         }
      }
   }
   getFilteredProductList();
   console.log(SelectedProducts);
   calcFilterCounter();
   buildProductList();
}


{ //  closing filter bar
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

{ //search filter
   let searchBlock = document.querySelector('.search input');
   searchBlock.addEventListener('keyup', sortByTextFilter);

   function sortByTextFilter(e) {
      FilterOptionsList['textFilter'] = e.currentTarget.value;
      SelectedProducts = [];
      productList.phones.forEach((product) => {
         let productCheck = true;
         for (let category in FilterOptionsList) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = FilterOptionsList[category].split(' ').join('').toLowerCase();

               if (!productName.includes(filterTextParameter)) {
                  productCheck = false;
                  break;
               }
            } else if (!FilterOptionsList[category].length) {
               continue;

            } else if (!FilterOptionsList[category].includes(product[category])) {
               productCheck = false;
               break;
            }
         }
         if (productCheck) SelectedProducts.push(product);
      });
      calcFilterCounter();
      buildProductList();
   }

}

{ //  clear search   
   let eraseButton = document.querySelector(".search-erase");
   let searchInput = document.querySelector(".search input");

   eraseButton.addEventListener("click", resetSearchText);
   searchInput.addEventListener("keyup", resetSearchText);


   function resetSearchText(e) {
      if ((e.type === 'click') || ((e.type === 'keyup') && e.keyCode == 27)) {
         searchInput.value = '';
         FilterOptionsList['textFilter'] = '';
      }
      calcFilterCounter();
      buildProductList();
   }
}

{ //Cart

   for (let product of Cart) {
      let productBox = document.createElement('div');
      productBox.classList.add('cart__product', 'product');

      let productImg = document.createElement('div');
      productImg.classList.add('product__img');
      productImg.insertAdjacentHTML("afterbegin",
         `<img src="${product.imgSrc}" alt = "product-img" >`);

      let productName = document.createElement('div');
      productName.classList.add('product__name');
      productName.innerText = product.name;

      let productPrice = document.createElement('div');
      productPrice.classList.add('product__price');
      productPrice.innerText = product.price;

      productBox.prepend(productImg, productName, productPrice);
      productBox.insertAdjacentHTML('beforeend',
         `<div class="product__delete">
            <i class="fa-solid fa-trash-can"></i>
            <i class="fa-solid fa-trash-can-xmark"></i>
         </div>`);
      productBox.insertAdjacentHTML('beforeend',
         `<div class="product__change">
            <div class="product__minus">
            <i class="fa-solid fa-minus"></i>
            </div>
            <input class="product__input" type="text" pattern="[1-9]" value="1" min="1">
            <div class="product__plus">
               <i class="fa-solid fa-plus"></i>
            </div>
            <div class="product__total">
               n * ${product.price}
            </div>
         </div>`);

      document.querySelector('.cart__header').after(productBox);

      document.querySelector('.product__input').addEventListener('keydown', deleteExtraSymbol);
      function deleteExtraSymbol(e) {
         if (e.key == '+' || e.key == 'ArrowUp') {
            e.preventDefault();
            ++e.currentTarget.value;
            return;
         }
         if (e.key == '-' || e.key == 'ArrowDown') {
            e.preventDefault();
            if (e.currentTarget.value > 1) --e.currentTarget.value;
            return;
         }
         if (!(e.key == '0' || e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' ||
            e.key == '5' || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9' ||
            e.key == 'Backspace' || e.key == 'Delete' || e.key == 'ArrowLeft' || e.key == 'ArrowRight')) {
            e.preventDefault();
            return;
         }
      }
      document.querySelector('.product__input').addEventListener('keyup', shiftZero);
      function shiftZero(e) {
         if (e.key == '0' && (e.currentTarget.value.indexOf('0') == 0)) {
            e.currentTarget.value = +e.currentTarget.value;
            e.currentTarget.selectionEnd = 0;
         }
      }
      document.querySelector('.product__input').addEventListener('keyup', countCheck);
      function countCheck(e) {
         if (e.currentTarget.value < 1) e.currentTarget.value = 1;
      }

      document.querySelector('.product__input').oncut = () => false;
      document.querySelector('.product__minus').addEventListener('click', function (e) {
         if (e.currentTarget.nextElementSibling.value > 1)
            e.currentTarget.nextElementSibling.value--;
      })
      document.querySelector('.product__plus').addEventListener('click', function (e) {
         e.currentTarget.previousElementSibling.value++;
      })
      document.querySelector('.product__delete').onclick = function () {
         Cart.splice(Cart.indexOf(product), 1);
         productBox.remove();
      }
   }

   document.querySelector('.cart__close').onclick = function closeCartOnIcon() {
      document.querySelector('.cart').classList.add('displayNone');
   }

   document.querySelector('.header__cart').onclick = function showCart() {
      document.querySelector('.cart').classList.remove('displayNone');

      addEventListener('keyup', function closeCartOnEsc(e) {
         if (e.keyCode == 27)
            document.querySelector('.cart').classList.add('displayNone');
      })
   }

}
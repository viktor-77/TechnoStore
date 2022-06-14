import productList from "./productlist.js";

let FilterOptionsList = {};
productList.categories.forEach((i) => (FilterOptionsList[i] = [])); // form filterList
let SelectedProducts = productList.phones;
let filterError = false;
let Cart = [];


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

function changeCartCounter() {
   if (Cart.length > 0) {
      document.querySelector('.cart-counter').innerText = Cart.length;

      if (document.querySelector('.cart-counter').classList.contains('displayNone')) {
         document.querySelector('.cart-counter').classList.remove('displayNone');
      }

      if (document.querySelector('.header-cart').classList.contains('disabled')) {
         document.querySelector('.header-cart').classList.remove('disabled')
      }

   } else {
      if (!document.querySelector('.header-cart').classList.contains('disabled')) {
         document.querySelector('.header-cart').classList.add('disabled')
      }

      if (!document.querySelector('.cart-counter').classList.contains('displayNone')) {
         document.querySelector('.cart-counter').classList.add('displayNone');
      }

      document.querySelector('.cart-counter').innerText = '';

      document.querySelector('.cart').classList.add('displayNone');
   }

   if (Cart.length == 1) {
      document.querySelector('.cart__container').style.height = '490px';
   } else {
      document.querySelector('.cart__container').style.height = '100%';
   }
}
function buildProductList() {
   document.querySelectorAll('.product__box').forEach(el => el.remove());

   for (let product of SelectedProducts) {
      let productBox = document.createElement('div');
      productBox.classList.add('product__box');
      productBox.dataset.productId = product.id;


      let cartActiveIndicator = document.createElement('div');
      cartActiveIndicator.classList.add('cart-active', 'displayNone');
      cartActiveIndicator.insertAdjacentHTML('afterbegin',
         `<i class="fa-solid fa-cart-shopping"></i>
         <i class="fa-solid fa-circle-check"></i>
      `);
      productBox.append(cartActiveIndicator);


      let productImg = document.createElement('div');
      productImg.classList.add('product__img');
      productImg.insertAdjacentHTML('afterbegin',
         `<img src="${product.imgSrc}" alt="product-img">`);
      productBox.append(productImg);


      let productName = document.createElement('div');
      productName.classList.add('product__name');
      productName.innerText = product.name;
      productBox.append(productName);


      let productPrice = document.createElement('div');
      productPrice.classList.add('product__price');
      productPrice.innerText = product.price;
      productBox.append(productPrice);


      let productActions = document.createElement('div');
      productActions.classList.add('product__actions');
      productActions.insertAdjacentHTML('afterbegin',
         `<div class="product__icon to-cart">
               <div class="add-cart">
                  <i class="fa-solid fa-cart-plus"></i>
               </div>
               <div class="remove-cart displayNone">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <i class="fa-solid fa-minus"></i>
               </div>
            </div>
            <div class="product__icon">
               <i class="selected fa-solid fa-heart"></i>
            </div>
            <div class="product__icon product-compare">
               <i class="product-copmpare fa-solid fa-scale-balanced"></i>
            </div>
         `);
      productBox.append(productActions);


      let productContainer = document.querySelector('.product__container');
      productContainer.prepend(productBox);


      productBox.querySelector('.to-cart').onclick = function addProductToCart(e) {
         if (!Cart.includes(product) && e.currentTarget.querySelector('.remove-cart').classList.contains('displayNone')) {
            Cart.push(product)
         } else
            Cart.splice(Cart.indexOf(product), 1);

         e.currentTarget.querySelector('.add-cart').classList.toggle('displayNone');
         productBox.querySelector('.cart-active').classList.toggle('displayNone');
         e.currentTarget.querySelector('.remove-cart').classList.toggle('displayNone');
         productBox.classList.toggle('product__box_active');
         changeCartCounter();
      }

      if (Cart.includes(product)) {
         productBox.querySelector('.add-cart').classList.toggle('displayNone');
         productBox.querySelector('.cart-active').classList.toggle('displayNone');
         productBox.querySelector('.remove-cart').classList.toggle('displayNone');
         productBox.classList.toggle('product__box_active');

      }
   }
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
   calcFilterCounter();
   buildProductList();
}


{ //filter bar
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



   //  ------------------
   let filterContainer = document.querySelector('.filter');
   if (filterContainer.addEventListener) {
      if ('onwheel' in document) {
         // IE9+, FF17+, Ch31+ 
         filterContainer.addEventListener("wheel", scrollOnPadding);
      } else if ('onmousewheel' in document) {
         // устаревший вариант события 
         filterContainer.addEventListener("mousewheel", scrollOnPadding);
      } else {
         // Firefox < 17 
         filterContainer.addEventListener("MozMousePixelScroll", scrollOnPadding);
      }
   } else {
      // IE8- 
      filterContainer.attachEvent("onmousewheel", scrollOnPadding);
   }

   filterContainer.addEventListener('mouseleave', function () {
      if (document.documentElement.style.position != "static") {
         let scrollHeight = - parseInt(document.documentElement.style.top);

         document.documentElement.style.position = "static";
         document.documentElement.scrollTo(0, scrollHeight);
      }
   })

   filterContainer.addEventListener('mouseover', function () {
      let scrollHeight = document.documentElement.scrollTop;
      if (document.documentElement.style.position != "fixed") {
         document.documentElement.style.position = "fixed";
         document.documentElement.style.top = - scrollHeight + 'px';
      }
   })

   function scrollOnPadding(e) {
      let delta = e.deltaY || e.detail || e.wheelDelta;

      document.querySelector('.filter-container').scrollTo(0,
         document.querySelector('.filter-container').scrollTop + delta);
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
   function closeCart() {
      document.querySelector('.cart').classList.add('displayNone');
      let scrollHeight = -parseInt(document.documentElement.style.top);

      document.documentElement.style.position = "static";
      document.documentElement.scrollTo(0, scrollHeight);
   }

   document.querySelector('.header-cart').addEventListener('mouseover', function () {
      if (!Cart.length && document.querySelector('.header-cart__empty').classList.contains('displayNone')) {
         document.querySelector('.header-cart__empty').classList.remove('displayNone');
      }

      if (Cart.length) {
         document.querySelector('.header-cart__icon').style.opacity = 0.8;
      }
   })

   document.querySelector('.header-cart').addEventListener('mouseleave', function () {
      if (!document.querySelector('.header-cart__empty').classList.contains('displayNone')) {
         document.querySelector('.header-cart__empty').classList.add('displayNone');
      }

      document.querySelector('.header-cart__icon').style.opacity = 1;
   })

   document.querySelector('.header-cart').onclick = function showCart() {
      if (Cart.length) {
         document.querySelectorAll('.cart__product').forEach(el => el.remove());
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
                  <div class="product__minus disabled">
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

            document.querySelector('.cart__product-container').prepend(productBox);

            document.querySelector('.product__input').addEventListener('keydown', onCartInput);
            function onCartInput(e) {
               if (e.key == '+' || e.key == 'ArrowUp') {
                  e.preventDefault();
                  ++e.currentTarget.value;

                  if (e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                     e.currentTarget.parentElement.querySelector('.product__minus').classList.remove('disabled');
                  }
                  return;
               }
               if (e.key == '-' || e.key == 'ArrowDown') {
                  e.preventDefault();
                  if (e.currentTarget.value > 1) --e.currentTarget.value;

                  if ((e.currentTarget.value == 1) &&
                     !e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                     e.currentTarget.parentElement.querySelector('.product__minus').classList.add('disabled');
                  }
                  return;
               }

               function deleteExtraSymbol() {
                  if (!(e.key == '0' || e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' ||
                     e.key == '5' || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9' ||
                     e.key == 'Backspace' || e.key == 'Delete' || e.key == 'ArrowLeft' || e.key == 'ArrowRight')) {
                     e.preventDefault();
                     return;
                  }
               }
               deleteExtraSymbol();
            }
            document.querySelector('.product__input').addEventListener('keyup', shiftZero);
            function shiftZero(e) {
               if (e.key == '0' && (e.currentTarget.value.indexOf('0') == 0)) {
                  e.currentTarget.value = +e.currentTarget.value;
                  e.currentTarget.selectionEnd = 0;
               }
            }
            document.querySelector('.product__input').addEventListener('keyup', checkInput);
            function checkInput(e) {
               if (e.currentTarget.value < 1) e.currentTarget.value = 1;

               if ((e.currentTarget.parentElement.querySelector('.product__input').value == 1) &&
                  !e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                  e.currentTarget.parentElement.querySelector('.product__minus').classList.add('disabled');
               } else if ((e.currentTarget.parentElement.querySelector('.product__input').value > 1)
                  && e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                  e.currentTarget.parentElement.querySelector('.product__minus').classList.remove('disabled');
               }
            }

            document.querySelector('.product__input').oncut = () => false;
            document.querySelector('.product__minus').addEventListener('click', function (e) {
               if (e.currentTarget.nextElementSibling.value > 1)
                  e.currentTarget.nextElementSibling.value--;

               if ((e.currentTarget.parentElement.querySelector('.product__input').value == 1) &&
                  !e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                  e.currentTarget.parentElement.querySelector('.product__minus').classList.add('disabled');
               }
            })
            document.querySelector('.product__plus').addEventListener('click', function (e) {
               e.currentTarget.previousElementSibling.value++;

               if (e.currentTarget.parentElement.querySelector('.product__minus').classList.contains('disabled')) {
                  e.currentTarget.parentElement.querySelector('.product__minus').classList.remove('disabled');
               }
            })
            document.querySelector('.product__delete').onclick = function deleteProductFromCart() {
               Cart.splice(Cart.indexOf(product), 1);
               productBox.remove();

               if (document.querySelector(`.product__box[data-product-id="${product.id}"]`)) {
                  document.querySelector(`.product__box[data-product-id="${product.id}"]`).querySelector('.add-cart').classList.toggle('displayNone');
               }
               if (document.querySelector(`.product__box[data-product-id="${product.id}"]`)) {
                  document.querySelector(`.product__box[data-product-id="${product.id}"]`).querySelector('.cart-active').classList.toggle('displayNone');
               }
               if (document.querySelector(`.product__box[data-product-id="${product.id}"]`)) {
                  document.querySelector(`.product__box[data-product-id="${product.id}"]`).querySelector('.remove-cart').classList.toggle('displayNone');
               }
               if (document.querySelector(`.product__box[data-product-id="${product.id}"]`)) {
                  document.querySelector(`.product__box[data-product-id="${product.id}"]`).classList.toggle('product__box_active');
               }

               changeCartCounter();
            }
         }

         document.querySelector('.cart').classList.remove('displayNone');
         document.documentElement.style.top = '-' + document.documentElement.scrollTop + 'px';
         document.documentElement.style.position = "fixed";

         addEventListener('keyup', function closeCartOnEsc(e) {
            if (e.keyCode == 27)
               closeCart();
         })
         document.querySelector('.cart').addEventListener('click', function closeCartOnClickOut(e) {
            if (e.target.classList.contains('cart')) {
               closeCart();
            }

         })
         document.querySelector('.cart__close').onclick = closeCart;
      }
   }
}

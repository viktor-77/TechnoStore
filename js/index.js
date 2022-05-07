import productList from "./productlist.js";

let filterOptionsLists = {};
productList.categories.forEach((i) => (filterOptionsLists[i] = []));   // form filterList
let selectedProducts = productList.phones;
let filterError = false;


function buildFilter() {
   let filterContainer = document.querySelector(".filter-container");
   let filterBox = document.querySelector(".filter-box");
   let filterRow = document.querySelector(".filter-checkbox");

   //   ! Зробити щоб категорія товару вибиралася автоматично а не було phones
   productList.categories.forEach((category) => { // forming filter with all categories with their values
      let filterBowClone = filterBox.cloneNode(true);
      filterBowClone.firstElementChild.firstElementChild.textContent = category;

      let optionsList = [];   // make list that contains all option of current filter category
      productList.phones.forEach((phone) => {
         if (!optionsList.includes(phone[category])) optionsList.push(phone[category]);
      });
      optionsList.sort((a, b) => b - a);

      optionsList.forEach((filterOption) => { // forming filterRow according to filterOption
         let filterRowClone = filterRow.cloneNode(true);

         filterRowClone.children[1].textContent = filterOption;    // Checkbox label text
         filterRowClone.children[1].htmlFor = category + '_' + filterOption;
         filterRowClone.children[0].id = category + '_' + filterOption;

         filterRowClone.children[0].name = category + '_' + filterOption;
         filterBowClone.append(filterRowClone);

         filterRowClone.children[0].addEventListener("click", updateOnCheckboxClick);  //function for updating checkboxes counters and states
      });

      filterBowClone.children[1].remove();
      filterBox.remove();
      filterContainer.append(filterBowClone);
   });
}
buildFilter();

function calcFilterCountlinkers() {
   let checkboxes = document.querySelectorAll(".filter-checkbox__input");
   let checkboxesCounters = document.querySelectorAll(".filter-checkbox__product-counter");

   checkboxes.forEach((checkbox, checkboxIndex) => {
      let filterCategory = checkbox.name.split('_')[0];
      let filterOption = checkbox.name.split('_')[1];
      let filterCounterUnChecked = 0;
      let filterCounterChecked = 0;

      if (filterOptionsLists[filterCategory].indexOf(filterOption) != -1) { //make checkbox unchecked for calculating filterCounterUnChecked
         filterOptionsLists[filterCategory].splice(
            filterOptionsLists[filterCategory].indexOf(filterOption),
            1
         );
      }
      productList.phones.forEach((product) => {  // counting resulting products amount if current checkbox unchecked
         let productCheck = true;
         for (let category in filterOptionsLists) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = filterOptionsLists[category].split(' ').join('').toLowerCase();
               if (!productName.includes(filterTextParameter)) {
                  productCheck = false; break;
               }
            }
            else
               if (!filterOptionsLists[category].length) {
                  continue; console.log();

               }
               else if (!filterOptionsLists[category].includes(product[category])) {
                  productCheck = false; break;
               }
         }
         if (productCheck) filterCounterUnChecked++;
      });

      filterOptionsLists[filterCategory].push(filterOption);
      productList.phones.forEach((product) => {  // counting resulting products amount if current checkbox checked
         let productCheck = true;
         for (let category in filterOptionsLists) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = filterOptionsLists[category].split(' ').join('').toLowerCase();
               if (!productName.includes(filterTextParameter)) {
                  productCheck = false; break;
               }
            }
            else
               if (!filterOptionsLists[category].length) {
                  continue; console.log();

               }
               else if (!filterOptionsLists[category].includes(product[category])) {
                  productCheck = false; break;
               }
         }
         if (productCheck) filterCounterChecked++;
      });

      if (checkboxes[checkboxIndex].hasAttribute("disabled")) {   //reset  all disabled attributes 
         checkboxes[checkboxIndex].removeAttribute("disabled");
      }
      filterError = false;  //reset filterError

      if (filterCounterChecked <= 0) {  // cheking for disabled options and options that thanks user activities makes resulting product list empty 
         if (checkboxes[checkboxIndex].checked) {
            checkboxesCounters[checkboxIndex].textContent = "-";
            filterError = true
         } else {
            checkboxes[checkboxIndex].setAttribute("disabled", "");
            checkboxesCounters[checkboxIndex].textContent = 0;
         }

      }
      else if (filterCounterChecked < filterCounterUnChecked) {
         checkboxesCounters[checkboxIndex].textContent = filterCounterChecked;
      }
      else if (filterCounterChecked == filterCounterUnChecked) {
         let isOptionInSortedList = false;
         for (let prod of selectedProducts) {
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
      }
      else if (filterCounterChecked > filterCounterUnChecked) {
         checkboxesCounters[checkboxIndex].textContent =
            filterCounterChecked - filterCounterUnChecked;
      }

      if (!checkboxes[checkboxIndex].checked) {  // return initial filter list parameters
         filterOptionsLists[filterCategory].splice(
            filterOptionsLists[filterCategory].indexOf(filterOption),
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

   if (filterOptionsLists[selectedCategory].indexOf(selectedOption) == -1) {  // updating filter list(list with filter categories and their options)
      filterOptionsLists[selectedCategory].push(selectedOption);
   } else {
      filterOptionsLists[selectedCategory].splice(
         filterOptionsLists[selectedCategory].indexOf(selectedOption),
         1
      );
   }

   function filterProducts() {
      selectedProducts = [];
      productList.phones.forEach((product) => {
         let productCheck = true;
         for (let category in filterOptionsLists) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = filterOptionsLists[category].split(' ').join('').toLowerCase();
               if (!productName.includes(filterTextParameter)) {
                  productCheck = false; break;
               }
            }
            else
               if (!filterOptionsLists[category].length) {
                  continue; console.log();

               }
               else if (!filterOptionsLists[category].includes(product[category])) {
                  productCheck = false; break;
               }
         }
         if (productCheck) selectedProducts.push(product);
      });
   }

   if (currentCheckbox.checked) {  // making resulting product list 
      filterProducts();
   }
   else {
      if (!filterOptionsLists[selectedCategory].length) { // updating sortedList when unchecked last option in current category
         filterProducts();
      }
      else {   // delete from sortedList elements that have deleted option
         selectedProducts = selectedProducts.filter(
            (it) => it[selectedCategory] != selectedOption
         );
      }
   }
   calcFilterCountlinkers();
   console.log(selectedProducts);

}


{    //  close filter block
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

{   //  clear search   
   let eraseButton = document.querySelector(".search-erase");
   let searchInput = document.querySelector(".search input");

   eraseButton.addEventListener("click", resetSearchText);
   searchInput.addEventListener("keyup", resetSearchText);


   function resetSearchText(e) {
      if (e.type === 'click') {
         searchInput.value = '';
         filterOptionsLists['textFilter'] = '';
         calcFilterCountlinkers();
      }
      else if ((e.type === 'keyup') && e.keyCode == 27) {
         searchInput.value = '';
         filterOptionsLists['textFilter'] = '';
      }
   }
}

{ //search filter
   let searchBlock = document.querySelector('.search input');
   searchBlock.addEventListener('keyup', sortByTextFilter);

   function sortByTextFilter(e) {
      let textFilter = e.currentTarget.value;
      filterOptionsLists['textFilter'] = textFilter;
      console.log(filterOptionsLists);
      selectedProducts = [];
      productList.phones.forEach((product) => {
         let productCheck = true;
         for (let category in filterOptionsLists) {
            if (category === 'textFilter') {
               let productName = product["name"].split(' ').join('').toLowerCase();
               let filterTextParameter = filterOptionsLists[category].split(' ').join('').toLowerCase();

               if (!productName.includes(filterTextParameter)) {
                  productCheck = false; break;
               }
            }
            else if (!filterOptionsLists[category].length) {
               continue; console.log();

            }
            else if (!filterOptionsLists[category].includes(product[category])) {
               productCheck = false; break;
            }
         }
         if (productCheck) selectedProducts.push(product);
         calcFilterCountlinkers();
      });
   }

}



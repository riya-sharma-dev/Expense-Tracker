// Updating data means changing the values inside the object or array. Re-rendering means showing the updated data on the screen again.

// Update = existing data ko new state mein save/change karna.
// item.amount = value
//        ↓
// Data Update

// updateUI()
// showTransactions()
//        ↓
// UI Re-render

let incomeCounter = document.querySelector(".incomeCounter")
let expenseCounter = document.querySelector(".expenseCounter")
let totalCounter = document.querySelector(".totalCounter")

let amtInput = document.querySelector(".amtInput")

let list = document.querySelector(".list-container")

let addBtn = document.querySelector(".add")

let incomeBtn = document.querySelector("#incomeBtn")
let expenseBtn = document.querySelector("#expenseBtn")

let note = document.querySelector("#Note")

let category = document.querySelector("#opt")


let formCon = document.querySelector(".form-con")
let closeBtn = document.querySelector(".closeView")

let saveBtn = document.querySelector('#saveBtn')



let data = JSON.parse(localStorage.getItem("data")) || []

let editId = null

// amount formatting

amtInput.addEventListener("input", function () {

    // I remove the rupee symbol and commas before converting because Number("₹5,000") returns NaN. By cleaning the value first, I get a valid numeric string like "5000", which can be safely converted into a number.
        let value = amtInput.value.replace(/₹|,/g, "")

     if (!isNaN(value) && value !== "") {

        amtInput.value =  "₹" + Number(value).toLocaleString("en-IN")

    }

//     I used !isNaN(value) to ensure the user entered a valid number.
// I used value !== "" to prevent empty input from being formatted.
})


function showTransactions(arr = data){
 list.innerHTML = ""

 // empty state 
 if(data.length === 0){
    list.innerHTML = ` <div class =" dataimg">  <img src="No data-rafiki.png"  ></div>`
    return

 }else if(arr.length === 0){
    let search = document.querySelector('#searchTran').value

    if(search){
        list.innerHTML = `<div class =" dataimg">
          <img src="No data-rafiki.png" > <h3> Ups! Not found...</h3>
           <h3>please add new entries </h3>
        
        </div>`
        return
    }
    else if(currentFilter !== 'All'){
 list.innerHTML = `<div class =" dataimg">
          <img src="No data-rafiki.png" > 
             <h3>No Transactions in this category</h3>
        
        </div>`
 return
    }
 }

let lastDate =""

 arr.forEach(function(i,index){
    let newLi = document.createElement('li')
    newLi.classList.add("transLi")

    let amt =  document.createElement('span')

    amt.textContent = "₹" + Number(i.amount)
.toLocaleString('en-IN')

    let remove = document.createElement('button')
    remove.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
    remove.id="delete"

    remove.addEventListener("click", function(){
       data = data.filter((item)=> item.id  !== i.id)
      updateUI()
    })


    let edit = document.createElement('button')
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.id ="edit"
    

edit.addEventListener('click', function(){

    amtInput.value = i.amount
    note.value = i.Note
    category.value = i.category
    transactionType.value = i.account

    editId = i.id


    // "currently ye wala object edit ho raha hai"
//     ek tracker ki tarah kaam karta hai.
// Save button ko pata chal jata:
// abhi kaunsi object edit mode me hai

formCon.classList.add('show')

})

// date grouping 
let currentDate =
new Date(i.createdAt).toLocaleDateString('en-IN',{
    day:"numeric",
    month:"short",
    year:"numeric"

})

if (currentDate !== lastDate) {
      let  dateHeading = document.createElement('h3')
      dateHeading.textContent = currentDate
        dateHeading.classList.add('date')

list.appendChild(dateHeading)

      
//         👉 lastDate ko if ke andar isliye update karte hain kyunki:

// “sirf tab update hona chahiye jab naya date actually print ho”
    }

  lastDate = currentDate
let tranNote = document.createElement('p')
tranNote.textContent = i.Note


    let categoryText = document.createElement('p')
    categoryText.textContent =  i.category
categoryText.classList.add("cate")


let accountType = document.createElement('span')
accountType.textContent = i.account

let typeGrp = document.createElement('div')
typeGrp.id ='typeGrp'

let btnGrp = document.createElement('div')
btnGrp.id ="btnGrp"

btnGrp.appendChild(remove)
btnGrp.appendChild(edit)

typeGrp.appendChild(tranNote)
typeGrp.appendChild(accountType)


newLi.appendChild(amt)    
newLi.appendChild(categoryText)

newLi.appendChild(typeGrp)

newLi.appendChild(btnGrp)


list.appendChild(newLi)

 })

 
}

// reusable function
function updateUI(){

   localStorage.setItem("data", JSON.stringify(data))
   showTransactions(searchFun())
   updateCounter()

}




// addBtn

addBtn.addEventListener('click', function(){
     formCon.classList.add("show")
})

closeBtn.addEventListener('click', function(){
    formCon.classList.remove("show")
})



// filterBtn 

let filterBtn = document.querySelector('#filterBtn')

currentFilter = "All"

function checkFilter(){
    if(currentFilter === "Travel"){
        return data.filter((i) => i.category === 'Travel')
    }
    else if(currentFilter === "Food"){
        return data.filter((i)=> i.category === 'Food')

    }
    else if(currentFilter === "Shopping"){
        return data.filter((i)=> i.category === 'Shopping')

    }
    else if(currentFilter === "Other"){
        return data.filter((i)=> i.category === 'Other')

    }
    else if(currentFilter === "Salary"){
        return data.filter((i)=> i.category === 'Salary')

    }else{
        return data
    }
}

filterBtn.addEventListener('change', ()=>{
    currentFilter = filterBtn.value
    showTransactions(searchFun())
})



let searchTran = document.querySelector('#searchTran')

function searchFun(){
    let filter = checkFilter()

let search = searchTran.value.toLowerCase()

if (search) {
     return filter.filter((i)=> i.category.toLowerCase().includes(search)
      || i.Note.toLowerCase().includes(search)
      || i.account.toLowerCase().includes(search)
)
}else{
    return filter
}

}


searchTran.addEventListener('input',()=>{
    showTransactions(searchFun())
})



// Income type

let currenType = "Income"

incomeBtn.addEventListener('click', function () {
    
    currenType = "Income"

    incomeBtn.classList.add('activeBtn')
    expenseBtn.classList.remove('activeBtn')
})


expenseBtn.addEventListener('click', function(){
currenType = 'Expense'
  
     incomeBtn.classList.remove('activeBtn')
     expenseBtn.classList.add('activeBtn')
})

// total caluclation   
// We use forEach loop on data
// so we can calculate income, expense,
// and total for multiple transactions.

function updateCounter(){

 let income = 0
 let expense = 0

 data.forEach(function(i){
    if (i.type === 'Income') {
    // income =  income + Number(i.amount)
        income += Number(i.amount)
        
    } else if(i.type === 'Expense') {
    
        // expense = expense + Number(i.amount)
        expense += Number(i.amount)
    } 
 })

     let total = income - expense
 incomeCounter.textContent = "₹" + Number(income).toLocaleString("en-In")
expenseCounter.textContent = "₹" + Number(expense).toLocaleString("en-In")
totalCounter.textContent = "₹" + Number(total).toLocaleString("en-In")


}

// account type select and toggel

let accountInput = document.querySelector(".accountInput")
let accountOptions = document.querySelector(".accountOptions")


accountInput.addEventListener("click", function(){
console.log('clicked');

   accountOptions.classList.toggle("show")

})



// We also use forEach on accountBtns
// to add click events on every button
// without writing repeated code.

let accountBtns = document.querySelectorAll(".accountOptions button")
let transactionType = document.querySelector('#trantype')

accountBtns.forEach(function(btn){
    
    btn.addEventListener('click',function(){
        transactionType.value = btn.textContent
    })
})



saveBtn.addEventListener("click", function(e){
      e.preventDefault()
//     Why do we use preventDefault()?"
// preventDefault() is a method of the event object. It prevents the browser's default action. In a form submission, the browser normally reloads the page. Page reload causes JavaScript variables to reset and the entire script runs again. To handle the form with JavaScript and avoid unnecessary reloads, we use event.preventDefault().

    console.log("load");
    

    let value = amtInput.value.replace(/₹|,/g, "")
    //   we will also replace these from value so that we can store pure numeric in data

    let catValue = category.value
  let   noteValue = note.value
  let account = transactionType.value
  // we use value only in input not string

   

  if(value === "") return alert("please give amount") 
if(isNaN(value)) return alert('Only Numbers are allowed')


  if( catValue === "") return alert("please select category")
  if( account === "") return alert("please select specific assest ")
    
   if(editId){
    // edit mode on 
    // I used find() to get the transaction whose id matches editId.
    let item = data.find((i)=> i.id === editId)

     item.amount = value
item.category = catValue
item.Note = noteValue
item.account = account
   item.type = currenType

   }
   else{
    // new transactions add
    data.unshift({
        amount: value,
        account: account,
        type: currenType,
        category: catValue,
         Note: noteValue, 
         id: Date.now(),
        createdAt: new Date().toISOString()
    
    })
    }

    editId = null;
   updateUI()

    amtInput.value =""
    category.value =""
    note.value =""
transactionType.value =""


  formCon.classList.remove('show')

})



showTransactions()
updateCounter()
console.log(data);

// “Data Change → Storage Update → UI Refresh”


// "Why is id better than index?"
// Index can change when items are added, removed, filtered, or sorted. But id stays the same for that transaction, so it is more reliable for update and delete operations.

    // I used filter because every transaction has a unique id. I can directly remove the matching item by id and get a new array. With splice, I would need the index first. Filter makes the delete logic simpler and easier to manage


// C → Create
// R → Read
// U → Update
// D → Delete

// Matlab:

// data ke saath basic operations.

// 1. Create

// Naya transaction add karna.

// 2. Read

// Data ko screen pe dikhana.

// 3. Update

// Edit karna.

// 4. Delete

// Remove karna.


// "What causes the UI to re-render?"


// The UI is re-rendered by showTransactions() and updateCounter() because they update the DOM with the latest data.


// "What is the role of localStorage?"


// localStorage is used only to persist data. It does not update the UI.

// Ye distinction bahut important hai. 💪

// Storage ≠ UI

// localStorage → save data
// showTransactions → show data
// updateCounter → show calculated values
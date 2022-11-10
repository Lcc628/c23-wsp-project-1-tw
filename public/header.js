
function setHeader() {
    document.querySelector('.header').innerHTML = `
    <div class="logo"><h1>Logo testing</h1></div>
    
    <div class="searchBar">
    <input type="search" id="gsearch" name="gsearch"><button>Search</button>
    
    </div>
    
    <div class="shopping-cart">
    <i class="bi bi-cart3"></i>
    <span>購物車</span>
    </div>
  `
}

setHeader()
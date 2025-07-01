/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/* Menu hidden */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header') 
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== SWIPER POPULAR ===============*/
const swiperPopular = new Swiper('.popular__swiper', {
   loop: true,
   grabCursor: true,
   slidesPerView: 'auto',
   centeredSlides: 'auto',
})

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== CART FUNCTIONALITY ===============*/
const cart = document.getElementById('cart'),
      cartToggle = document.getElementById('cart-toggle'),
      cartClose = document.getElementById('cart-close'),
      cartCount = document.querySelector('.cart__count'),
      cartBody = document.querySelector('.cart__body'),
      cartTotal = document.querySelector('.cart__total-price')

// Toggle cart
if(cartToggle) {
  cartToggle.addEventListener('click', (e) => {
    e.preventDefault()
    cart.classList.add('show')
  })
}

// Close cart
if(cartClose) {
  cartClose.addEventListener('click', () => {
    cart.classList.remove('show')
  })
}

let cartItems = []

// Add to cart buttons
const addToCartButtons = document.querySelectorAll('.products__button')

addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const card = this.closest('.products__card'),
          title = card.querySelector('.products__name').textContent,
          price = card.querySelector('.products__price').textContent,
          imgSrc = card.querySelector('.products__img').src,
          category = card.dataset.category

    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.title === title)

    if(existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        title,
        price,
        imgSrc,
        category,
        quantity: 1
      })
    }

    updateCart()
    showCart()
  })
})

// Update cart function
function updateCart() {
  // Update cart count
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update cart body
  if(cartItems.length === 0) {
    cartBody.innerHTML = `
      <div class="cart__empty">
        <i class="ri-shopping-cart-line"></i>
        <p>Your cart is empty</p>
      </div>
    `
    cartTotal.textContent = '$0.00'
  } else {
    let cartHTML = ''
    let total = 0

    cartItems.forEach((item, index) => {
      const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity
      total += itemTotal

      cartHTML += `
        <div class="cart__item">
          <img src="${item.imgSrc}" alt="${item.title}" class="cart__item-img">
          <div class="cart__item-content">
            <h4 class="cart__item-name">${item.title}</h4>
            <span class="cart__item-price">${item.price}</span>
            <div class="cart__item-actions">
              <button class="cart__item-qty-btn minus" data-index="${index}">-</button>
              <span class="cart__item-qty">${item.quantity}</span>
              <button class="cart__item-qty-btn plus" data-index="${index}">+</button>
              <button class="cart__item-remove" data-index="${index}"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>
        </div>
      `
    })

    cartBody.innerHTML = cartHTML
    cartTotal.textContent = `$${total.toFixed(2)}`

    // Add event listeners to quantity buttons
    document.querySelectorAll('.cart__item-qty-btn').forEach(button => {
      button.addEventListener('click', function() {
        const index = this.dataset.index
        if(this.classList.contains('minus')) {
          if(cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1
          } else {
            cartItems.splice(index, 1)
          }
        } else if(this.classList.contains('plus')) {
          cartItems[index].quantity += 1
        }
        updateCart()
      })
    })

    // Add event listeners to remove buttons
    document.querySelectorAll('.cart__item-remove').forEach(button => {
      button.addEventListener('click', function() {
        const index = this.dataset.index
        cartItems.splice(index, 1)
        updateCart()
      })
    })
  }

  // Update checkout total
  updateCheckoutTotal()
}

// Show cart function
function showCart() {
  cart.classList.add('show')
}

/*=============== CHECKOUT FUNCTIONALITY ===============*/
const checkoutModal = document.getElementById('checkout-modal'),
      checkoutBtn = document.getElementById('checkout-btn'),
      checkoutClose = document.getElementById('checkout-close'),
      checkoutForm = document.getElementById('checkout-form'),
      orderSummary = document.getElementById('order-summary'),
      checkoutTotal = document.getElementById('checkout-total'),
      confirmationModal = document.getElementById('confirmation-modal'),
      confirmationClose = document.getElementById('confirmation-close'),
      confirmationMessage = document.getElementById('confirmation-message')

// Open checkout modal
if(checkoutBtn) {
  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if(cartItems.length > 0) {
      updateOrderSummary()
      checkoutModal.classList.add('show')
    }
  })
}

// Close checkout modal
if(checkoutClose) {
  checkoutClose.addEventListener('click', () => {
    checkoutModal.classList.remove('show')
  })
}

// Update order summary in checkout
function updateOrderSummary() {
  let summaryHTML = ''
  let total = 0

  cartItems.forEach(item => {
    const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity
    total += itemTotal

    summaryHTML += `
      <div class="order-item">
        <span>${item.quantity}x ${item.title}</span>
        <span>$${(itemTotal).toFixed(2)}</span>
      </div>
    `
  })

  orderSummary.innerHTML = summaryHTML
  checkoutTotal.textContent = `$${total.toFixed(2)}`
}

// Update checkout total
function updateCheckoutTotal() {
  if(cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price.replace('$', '')) * item.quantity)
    }, 0)
    checkoutTotal.textContent = `$${total.toFixed(2)}`
  } else {
    checkoutTotal.textContent = '$0.00'
  }
}

// Handle checkout form submission
if(checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const address = document.getElementById('address').value
    
    // Create order confirmation message
    let message = `Thank you, ${name}! Your order has been placed and will be delivered to ${address}. `
    message += `We'll contact you at ${phone} when your order is on its way. `
    message += `Your total is ${checkoutTotal.textContent}.`
    
    confirmationMessage.textContent = message
    checkoutModal.classList.remove('show')
    confirmationModal.classList.add('show')
    
    // Clear cart
    cartItems = []
    updateCart()
    checkoutForm.reset()
  })
}

// Close confirmation modal
if(confirmationClose) {
  confirmationClose.addEventListener('click', () => {
    confirmationModal.classList.remove('show')
  })
}

/*=============== PRODUCT FILTER ===============*/
const filterButtons = document.querySelectorAll('.filter__btn')

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'))
    // Add active class to clicked button
    this.classList.add('active')

    const filterValue = this.dataset.filter
    const productCards = document.querySelectorAll('.products__card')

    productCards.forEach(card => {
      if(filterValue === 'all' || card.dataset.category === filterValue) {
        card.style.display = 'block'
      } else {
        card.style.display = 'none'
      }
    })
  })
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 300,
})

sr.reveal(`.home__data, .popular__container, .footer`)
sr.reveal(`.home__board`, {delay: 700, distance: '100px', origin: 'right'})
sr.reveal(`.home__pizza`, {delay: 1400, distance: '100px', origin: 'bottom', rotate: {z: -90}})
sr.reveal(`.home__ingredient`, {delay: 2000, interval: 100})
sr.reveal(`.about__data, .recipe__list, .contact__data`, {origin: 'right'})
sr.reveal(`.about__img, .recipe__img, .contact__image`, {origin: 'left'})
sr.reveal(`.products__card,`, {interval: 100})

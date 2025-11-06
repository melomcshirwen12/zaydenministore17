// 🔐 Login + Sign Up System (with Remember Me)
function toggleForm() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    title.textContent = 'Welcome Back 🛒';
    subtitle.textContent = 'Please log in to continue';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    title.textContent = 'Create Your Account 🛍️';
    subtitle.textContent = 'Join Zayden Mini Store today';
  }
}
function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember').checked;

  const savedUser = localStorage.getItem('zaydenUser');
  const savedPass = localStorage.getItem('zaydenPass');

  if (user === savedUser && pass === savedPass) {
    document.body.classList.add('logged-in');
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('welcome-user').textContent = `Welcome, ${user} 👋`;
    showSection('home');

    if (remember) {
      localStorage.setItem('rememberZayden', 'true');
    } else {
      localStorage.removeItem('rememberZayden');
    }
  } else {
    alert('Invalid username or password ❌');
  }
  return false;
}
function handleSignup(e) {
  e.preventDefault();
  const user = document.getElementById('new-username').value.trim();
  const pass = document.getElementById('new-password').value.trim();

  if (user && pass) {
    localStorage.setItem('zaydenUser', user);
    localStorage.setItem('zaydenPass', pass);
    alert('Account created successfully! ✅ Please log in.');
    toggleForm();
  } else {
    alert('Please fill in all fields.');
  }
  return false;
}
function logout() {
  document.body.classList.remove('logged-in');
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('logout-btn').style.display = 'none';
  document.getElementById('welcome-user').textContent = '';
  localStorage.removeItem('rememberZayden');
}
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('zaydenUser');
  const remembered = localStorage.getItem('rememberZayden');

  if (user && remembered === 'true') {
    document.body.classList.add('logged-in');
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('welcome-user').textContent = `Welcome, ${user} 👋`;
    showSection('home');
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').style.display = 'none';
  }, 2000);
});
const products = [
  { id: 1, name: 'Apple', category: 'Fruits', price: 1.5, image: "apple.jpg" },
  { id: 2, name: 'Banana', category: 'Fruits', price: 1.2, image: "banana.jpg"},
  { id: 3, name: 'Carrot', category: 'Vegetables', price: 0.8, image: "carrot.jpg" },
  { id: 4, name: 'Milk', category: 'Dairy', price: 2.5, image: "milk.jpg" },
  { id: 5, name: 'Chips', category: 'Snacks', price: 1.8, image: "chips.jpg" },
  { id: 6, name: 'Strawberry', category: 'Fruits', price: 1.3, image: "strawberry.jpg" },
  { id: 7, name: 'Orange', category: 'Fruits', price: 1.1, image: "orange.jpg" },
  { id: 8, name: 'Cola', category: 'Snacks', price: 0.9, image: "cola.jpg" },
  { id: 9, name: 'Squash', category: 'Vegetables', price: 2.1, image: "squash.jpg" },
  { id: 10,name: 'Grapes', category: 'Fruits', price: 2.5, image: "grapes.jpg" },

];

let cart = [];
let selectedCategory = 'All';

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('active');
}

function showSection(section) {
  document.getElementById('home-section').style.display = section === 'home' ? 'block' : 'none';
  document.getElementById('cart-section').style.display = section === 'cart' ? 'block' : 'none'; 
  if (section === 'cart') updateCart();
}

function displayProducts(items) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  items.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    list.appendChild(div);
  });
}

function displayCategories() {
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const container = document.getElementById('categories');
  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'category-btn' + (cat === 'All' ? ' active' : '');
    btn.onclick = () => {
      selectedCategory = cat;
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts();
    };
    container.appendChild(btn);
  });
}

function filterProducts() {
  let filtered = products;
  if (selectedCategory !== 'All') {
    filtered = products.filter(p => p.category === selectedCategory);
  }
  const search = document.getElementById('search').value.toLowerCase();
  filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  displayProducts(filtered);
}

function searchProducts() {
  filterProducts();
}
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  // ✅ Update the counter right away
  updateCartCount();

  // 🌀 Add bounce animation
  const cartIcon = document.getElementById('floating-cart');
  cartIcon.classList.add('bounce');
  setTimeout(() => cartIcon.classList.remove('bounce'), 500);

  alert(`${product.name} added to cart!`);
}
function updateCart() {
  const cartContainer = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty 🛒</p>';
    totalAmount.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-thumb">
      <div class="item-info">
        <strong>${item.name}</strong><br>
        $${item.price.toFixed(2)} × ${item.qty} = $${itemTotal.toFixed(2)}
      </div>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  totalAmount.textContent = total.toFixed(2);
}

function updateCartCount() {
  // Calculate total quantity of all items in cart
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  // Find both counters (top nav and floating icon)
  const navCount = document.getElementById('cart-count');
  const floatCount = document.getElementById('floating-cart-count');

  // Update both if they exist
  if (navCount) navCount.textContent = total;
  if (floatCount) floatCount.textContent = total;
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
  document.getElementById('cart-count').textContent = cart.reduce((a,b)=>a+b.qty,0);
}

function checkout() {
  if (cart.length === 0) return alert('Your cart is empty!');

  cart = [];
  updateCartCount();
  updateCart();

  showSection('thankyou');
document.getElementById('thankyou-section').classList.add('active');
showConfetti();

}


function goHome() {
  showSection('home');
}
  function showSection(section) {
  const home = document.getElementById('home-section');
  const cartSec = document.getElementById('cart-section');
  const thankyou = document.getElementById('thankyou-section');
  const floatingCart = document.getElementById('floating-cart');

  // Show or hide main sections
  home.style.display = section === 'home' ? 'block' : 'none';
  cartSec.style.display = section === 'cart' ? 'block' : 'none';
  thankyou.style.display = section === 'thankyou' ? 'flex' : 'none';

  // Update cart content if in cart section
  if (section === 'cart') updateCart();

  // Always update cart count
  updateCartCount();

  // 🔥 Hide floating cart when on Thank You section
  if (section === 'thankyou') {
    floatingCart.classList.add('hidden');
  } else {
    floatingCart.classList.remove('hidden');
  }
}

function removeFromCart(id) {
  const index = cart.findIndex(i => i.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
    updateCartCount();
  }
}
function showConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti-container');
  document.body.appendChild(confetti);

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti');
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = ['#4caf50', '#ffcc33', '#ff9800'][Math.floor(Math.random() * 3)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    confetti.appendChild(piece);
  }

  setTimeout(() => confetti.remove(), 4000);
}
// Keep user logged in if saved
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('zaydenUser')) {
    document.body.classList.add('logged-in');
    document.getElementById('login-section').style.display = 'none';
    showSection('home');
  }
});

window.onload = () => {
  displayCategories();
  displayProducts(products);
  updateCartCount(); // 👈 very important
};

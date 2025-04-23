// Image Gallery
function changeImage(src) {
    document.getElementById('main-product-image').src = src;
}

// Quantity Selector
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

// Size Selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Wishlist Toggle
document.querySelector('.wishlist-btn').addEventListener('click', function() {
    const icon = this.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        icon.style.color = '#e41e31';
    } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = '';
    }
});

// Add to Cart Animation
document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    this.innerHTML = '✓ Added to Cart';
    this.style.background = '#28a745';
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        this.style.background = '';
    }, 2000);
}); 
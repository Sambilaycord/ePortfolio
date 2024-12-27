// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoConstrainedview({ 
            behavior: 'smooth' 
        });
    });
});

// Navbar color change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#1a1a1a';
        navbar.style.transition = 'background-color 0.3s ease';
    } else {
        navbar.style.backgroundColor = 'transparent';
    }
});

// Skill boxes animation on scroll
const skillBoxes = document.querySelectorAll('.skill-box');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

skillBoxes.forEach(box => {
    observer.observe(box);
});

// Typewriter effect for introduction
const typewriter = document.querySelector('.typewriter-animation');
const text = typewriter.textContent;
typewriter.textContent = '';

let i = 0;
function type() {
    if (i < text.length) {
        typewriter.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
    }
}
type();

// Project cards hover effect
const projectCards = document.querySelectorAll('.card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Form validation for contact form (if you add one)
function validateForm(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!email || !message) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // If validation passes, you can submit the form
    event.target.submit();
}

// Dark/Light mode toggle
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark);
    
    // Update colors
    if (isDark) {
        body.style.backgroundColor = '#1a1a1a';
        body.style.color = '#ffffff';
    } else {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#000000';
    }
}

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    toggleTheme();
}
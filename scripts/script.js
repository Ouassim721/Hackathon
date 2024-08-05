const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const logo = document.getElementById('logo');
    
    if (window.scrollY > 50) { // Adjust this value as needed
        navbar.classList.add('scrolled');
        logo.src = '/images/logo1.png'; // New logo when scrolled
    } else {
        navbar.classList.remove('scrolled');
        logo.src = '/images/logo2.png'; // Original logo
    }
});


const toggleButton = document.querySelector('.navbar-toggler');
        const navbar = document.getElementById('navbar');

        toggleButton.addEventListener('click', function() {
            navbar.classList.add('show');
        });

        // Close the menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && !toggleButton.contains(e.target)) {
                navbar.classList.remove('show');
            }
        });
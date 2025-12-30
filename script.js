// script.js

document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');

            pages.forEach(page => {
                page.style.display = 'none'; // Hide all sections
            });

            document.getElementById(sectionId).style.display = 'block'; // Show selected section
        });
    });

    // Show the hero section by default
    document.getElementById('hero').style.display = 'block';
});

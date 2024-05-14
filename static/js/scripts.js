// Get references to the necessary elements
const topNav = document.getElementById('top-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const header = document.getElementById('header');
const sidebar = document.querySelector('.sidebar');
const closeIcon = document.createElement('span');
closeIcon.innerHTML = '&times;';
closeIcon.classList.add('close-icon');

// Add transition classes initially
header.classList.add('transition');
sidebar.classList.add('transition');

// Add a click event listener to the hamburger menu
hamburgerMenu.addEventListener('click', toggleSidebar);

// Function to toggle the sidebar
function toggleSidebar() {
  // Check if the screen width is less than 768px
  if (window.innerWidth < 768) {
    // Toggle the display of the header and sidebar
    header.style.display = header.style.display === 'none' ? 'block' : 'none';
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';


    // Add or remove the close icon
    if (sidebar.style.display === 'block') {
      sidebar.appendChild(closeIcon);
      closeIcon.addEventListener('click', toggleSidebar);
    } else {
      closeIcon.removeEventListener('click', toggleSidebar);
      sidebar.removeChild(closeIcon);
    }
  }
}

// Add an event listener to the document for click events
document.addEventListener('click', function(event) {
  // Check if the screen width is less than 768px
  if (window.innerWidth < 768) {
    // Check if the click target is not the sidebar or its children
    if (!sidebar.contains(event.target) && event.target !== hamburgerMenu) {
      // Close the sidebar
      header.style.display = 'none';
      sidebar.style.display = 'none';
      closeIcon.removeEventListener('click', toggleSidebar);
      sidebar.removeChild(closeIcon);
    }
  }
});









document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS with your user ID
  emailjs.init("YOUR_USER_ID");

  // Add event listener to the form submission
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Send the email
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(function(response) {
        console.log('Email sent successfully', response);
        // Optionally, display a success message to the user
      }, function(error) {
        console.error('Email send failed', error);
        // Optionally, display an error message to the user
      });
  });
});




// Code for resume view and download

// Get the modal
var modal = document.getElementById("resume-modal");

// Get the button that opens the modal
var viewBtn = document.getElementById("view-btn");

// Get the iframe element
var resumeIframe = document.getElementById("resume-iframe");

// When the user clicks the View button, open the modal
viewBtn.onclick = function() {
  modal.style.display = "block";
  // Set the source of the iframe to the URL of your resume
  resumeIframe.src = "https://drive.google.com/file/d/1AzlUXk1nsRXD71NXWjcpKnROnOJTDBtp/view?usp=drive_link";
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    resumeIframe.src = "../static/pdf/Resume.pdf"; // Clear iframe source
  }
}

// Close modal when clicking on the close icon
var closeBtn = document.createElement("span");
closeBtn.innerHTML = "&times;"; // Cross icon symbol
closeBtn.classList.add("close-modal");
closeBtn.onclick = function() {
  modal.style.display = "none";
  resumeIframe.src = "../static/pdf/Resume.pdf"; // Clear iframe source
};
document.getElementsByClassName("view-resume-content")[0].appendChild(closeBtn);





 
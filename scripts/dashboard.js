document.getElementById('addHomeBtn').addEventListener('click', function() {
  document.getElementById('addHomeModal').style.display = 'flex';
});
document.getElementById('cancelAddHomeBtn').addEventListener('click', function() {
  document.getElementById('addHomeModal').style.display = 'none';
});
document.getElementById('addHomeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Add home logic
  const address = document.getElementById('addHomeAddress').value;
  const year = document.getElementById('addHomeYear').value;
  const value = document.getElementById('addHomeValue').value;
  const bedrooms = document.getElementById('addHomeBedrooms').value;
  const bathrooms = document.getElementById('addHomeBathrooms').value;
  // TODO: Send data to server and update UI
  console.log({ address, year, value, bedrooms, bathrooms });
  document.getElementById('addHomeModal').style.display = 'none';
});
// Navigation
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', function() {
    const target = this.getAttribute('data-target');
    
    // Special handling for builder panel - it opens a modal instead
    if (target === 'panel-builder') {
      // The modal functionality is handled in the main HTML file
      return;
    }
    
    document.querySelectorAll('.section-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(target).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
  });
});
// Accordion
document.querySelectorAll('.accordion-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const panel = this.nextElementSibling;
    panel.classList.toggle('active');
    this.classList.toggle('active');
  });
});
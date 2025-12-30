// Load and display projects from JSON
async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    const projects = await response.json();
    const container = document.getElementById('projects-container');
    
    if (!projects || projects.length === 0) {
      container.innerHTML = '<p class="no-data">No projects yet. Add your first project!</p>';
      return;
    }
    
    container.innerHTML = ''; // Clear loading message
    
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          ${project.technologies && project.technologies.length > 0 ? 
            `<div class="tech-tags">
              ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>` : ''
          }
          <a href="${project.page || '#'}" class="btn-outline">View Project</a>
        </div>
      `;
      container.appendChild(projectCard);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-container').innerHTML = 
      '<p class="error">Unable to load projects. Please check your internet connection.</p>';
  }
}

// Load and display certificates from JSON
async function loadCertificates() {
  try {
    const response = await fetch('data/certificates.json');
    const certificates = await response.json();
    const container = document.getElementById('certificates-container');
    
    if (!certificates || certificates.length === 0) {
      container.innerHTML = '<p class="no-data">No certificates yet. Add your first certificate!</p>';
      return;
    }
    
    container.innerHTML = ''; // Clear loading message
    
    certificates.forEach(cert => {
      const certCard = document.createElement('div');
      certCard.className = 'certificate-card';
      certCard.innerHTML = `
        <div class="certificate-image" onclick="openCertificate('${cert.image}')">
          <img src="${cert.image}" alt="${cert.name}">
          <div class="certificate-overlay">👁️ View</div>
        </div>
        <div class="certificate-info">
          <h4>${cert.name}</h4>
          <p><strong>Issued by:</strong> ${cert.issuer}</p>
          <p><strong>Date:</strong> ${new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          ${cert.credentialUrl && cert.credentialUrl !== '#' ? 
            `<a href="${cert.credentialUrl}" target="_blank" class="btn-small">Verify Credential</a>` : ''
          }
        </div>
      `;
      container.appendChild(certCard);
    });
  } catch (error) {
    console.error('Error loading certificates:', error);
    document.getElementById('certificates-container').innerHTML = 
      '<p class="error">Unable to load certificates. Please check your internet connection.</p>';
  }
}

// Open certificate in fullscreen
function openCertificate(imageSrc) {
  const fullscreen = document.createElement('div');
  fullscreen.className = 'fullscreen-certificate';
  fullscreen.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(155,92,255,0.5);
  `;
  
  fullscreen.appendChild(img);
  fullscreen.onclick = () => fullscreen.remove();
  
  document.body.appendChild(fullscreen);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadCertificates();
});

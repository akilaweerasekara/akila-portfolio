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
      
      // Determine icon based on type
      let typeIcon = '📄';
      if (cert.type === 'pdf') typeIcon = '📊';
      if (cert.type === 'link') typeIcon = '🔗';
      
      // Create card content
      certCard.innerHTML = `
        <div class="certificate-image" onclick="handleCertificateClick('${cert.type}', '${cert.file || cert.image}', '${cert.credentialUrl}', '${cert.name.replace(/'/g, "\\'")}')">
          <img src="${cert.image}" alt="${cert.name}" onerror="this.src='images/pdf-icon.png'">
          <div class="certificate-overlay">
            ${typeIcon} ${cert.type === 'pdf' ? 'View PDF' : 'View Certificate'}
          </div>
          ${cert.type === 'pdf' ? '<div class="pdf-badge">PDF</div>' : ''}
        </div>
        <div class="certificate-info">
          <h4>${cert.name}</h4>
          <p><strong>Issued by:</strong> ${cert.issuer}</p>
          <p><strong>Date:</strong> ${new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <div class="certificate-actions">
            ${cert.type === 'pdf' ? 
              `<button onclick="openPdfViewer('${cert.file}', '${cert.name.replace(/'/g, "\\'")}')" class="btn-small">📖 View PDF</button>` : 
              ''
            }
            ${cert.type === 'link' && cert.credentialUrl && cert.credentialUrl !== '#' ? 
              `<a href="${cert.credentialUrl}" target="_blank" class="btn-small">🔗 Verify Online</a>` : 
              ''
            }
            ${cert.type === 'image' ? 
              `<button onclick="openCertificateModal('${cert.image}', '${cert.name.replace(/'/g, "\\'")}')" class="btn-small">👁️ View</button>` : 
              ''
            }
          </div>
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

// Handle certificate click based on type
function handleCertificateClick(type, fileUrl, credentialUrl, name) {
  if (type === 'pdf') {
    openPdfViewer(fileUrl, name);
  } else if (type === 'link' && credentialUrl && credentialUrl !== '#') {
    window.open(credentialUrl, '_blank');
  } else if (type === 'image') {
    openCertificateModal(fileUrl, name);
  }
}

// Open image certificate in modal
function openCertificateModal(imageSrc, name) {
  const modal = document.createElement('div');
  modal.className = 'certificate-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;
  
  const header = document.createElement('div');
  header.style.cssText = `
    width: 90%;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: white;
  `;
  
  header.innerHTML = `
    <h3 style="color: #9b5cff;">${name}</h3>
    <button onclick="this.parentElement.parentElement.remove()" 
            style="background: #9b5cff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
      ✕ Close
    </button>
  `;
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.cssText = `
    max-width: 90%;
    max-height: 80vh;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(155,92,255,0.3);
  `;
  
  const downloadBtn = document.createElement('a');
  downloadBtn.href = imageSrc;
  downloadBtn.download = name.replace(/\s+/g, '-') + '.jpg';
  downloadBtn.innerHTML = '📥 Download Image';
  downloadBtn.style.cssText = `
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background: #9b5cff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  `;
  
  modal.appendChild(header);
  modal.appendChild(img);
  modal.appendChild(downloadBtn);
  document.body.appendChild(modal);
  
  // Close on ESC key
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

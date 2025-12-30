// PDF.js library for PDF thumbnail generation
// We'll use a free PDF thumbnail service as fallback

async function generatePdfThumbnail(pdfUrl, pageNumber = 1) {
  // Method 1: Try PDF.js if available
  if (typeof pdfjsLib !== 'undefined') {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('PDF.js failed:', error);
      return getFallbackThumbnail(pdfUrl);
    }
  }
  
  // Method 2: Use a free PDF thumbnail service
  return getFallbackThumbnail(pdfUrl);
}

function getFallbackThumbnail(pdfUrl) {
  // Use a free online service to get PDF thumbnail
  // Option 1: PDF.co API (free tier available)
  // Option 2: Convert PDF URL to image URL using a service
  // For now, return a placeholder with PDF icon
  return 'images/pdf-icon.png'; // You'll need to add this icon image
}

// Display PDF in modal viewer
function openPdfViewer(pdfUrl, certificateName) {
  const modal = document.createElement('div');
  modal.className = 'pdf-modal';
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
    max-width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: white;
  `;
  
  header.innerHTML = `
    <h3 style="color: #9b5cff;">${certificateName}</h3>
    <button onclick="this.parentElement.parentElement.remove()" 
            style="background: #9b5cff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
      ✕ Close
    </button>
  `;
  
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    width: 90%;
    max-width: 900px;
    height: 80vh;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(155,92,255,0.3);
  `;
  iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  
  const downloadBtn = document.createElement('a');
  downloadBtn.href = pdfUrl;
  downloadBtn.download = certificateName.replace(/\s+/g, '-') + '.pdf';
  downloadBtn.innerHTML = '📥 Download PDF';
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
  modal.appendChild(iframe);
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

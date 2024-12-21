(function() {
  // Get configuration from the script tag
  const script = document.currentScript;
  const websiteId = script.getAttribute('data-website-id');
  
  if (!websiteId) {
    console.error('Widget Error: No website ID provided');
    return;
  }

  // Create and append widget styles
  const style = document.createElement('style');
  style.textContent = `
    .chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);

  // Create widget container
  const container = document.createElement('div');
  container.className = 'chat-widget-container';
  document.body.appendChild(container);

  // Initialize widget
  const widget = document.createElement('iframe');
  widget.style.border = 'none';
  widget.style.width = '400px';
  widget.style.height = '600px';
  widget.style.display = 'none'; // Start hidden
  
  // Get the base URL from the script src
  const scriptUrl = new URL(script.src);
  const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;
  widget.src = `${baseUrl}/widget/${websiteId}`;
  container.appendChild(widget);

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #0066FF;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  `;

  toggleBtn.onmouseover = () => {
    toggleBtn.style.transform = 'scale(1.1)';
  };
  toggleBtn.onmouseout = () => {
    toggleBtn.style.transform = 'scale(1)';
  };

  toggleBtn.onclick = () => {
    if (widget.style.display === 'none') {
      widget.style.display = 'block';
      toggleBtn.style.display = 'none';
    }
  };

  // Add close button to iframe
  widget.onload = () => {
    const closeBtn = widget.contentDocument.querySelector('[data-close-widget]');
    if (closeBtn) {
      closeBtn.onclick = () => {
        widget.style.display = 'none';
        toggleBtn.style.display = 'flex';
      };
    }
  };

  container.appendChild(toggleBtn);
})();
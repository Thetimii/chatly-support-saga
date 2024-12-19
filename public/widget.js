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

  // Load React and other dependencies
  const script1 = document.createElement('script');
  script1.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
  
  const script2 = document.createElement('script');
  script2.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';

  // Initialize widget after dependencies are loaded
  script2.onload = () => {
    const widget = document.createElement('iframe');
    widget.style.border = 'none';
    widget.style.width = '400px';
    widget.style.height = '600px';
    widget.src = `https://simplesupportbot.com/widget/${websiteId}`;
    container.appendChild(widget);
  };

  document.head.appendChild(script1);
  document.head.appendChild(script2);
})();
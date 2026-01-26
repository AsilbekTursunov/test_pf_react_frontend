/**
 * Simple notification system
 * Shows error notifications to users
 */

/**
 * Show error notification
 * @param {string} message - Error message to display
 */
export function showErrorNotification(message) {
  // Create notification element
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #dc3545;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  `

  // Add animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  // Add message
  notification.textContent = message

  const closeNotification = () => {
    notification.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => {
      notification.remove()
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 300)
  }

  // Add to DOM
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(closeNotification, 5000)
}

/**
 * Show success notification
 * @param {string} message - Success message to display
 */
export function showSuccessNotification(message) {
  // Create notification element
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  `

  // Add animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  // Add message
  notification.textContent = message

  const closeNotification = () => {
    notification.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => {
      notification.remove()
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 300)
  }

  // Add to DOM
  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(closeNotification, 3000)
}

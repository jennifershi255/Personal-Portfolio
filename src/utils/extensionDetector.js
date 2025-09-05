// Extension detection for ONLY the specific problematic extensions
export const detectExtensions = () => {
  const detectedExtensions = [];

  // Debug: Log what we're checking for
  console.log('🔍 Checking for problematic extensions...');

  // ONLY check for the extensions that actually break the glowing border:
  
  // 1. Simplify Copilot
  const simplifyChecks = [
    document.querySelector('[data-simplify]'),
    window.simplify,
    document.documentElement.classList.contains('simplify'),
    document.querySelector('[class*="simplify"]'),
    document.querySelector('[id*="simplify"]'),
    // Check for injected scripts or styles
    document.querySelector('script[src*="simplify"]'),
    document.querySelector('link[href*="simplify"]')
  ];
  
  if (simplifyChecks.some(check => check)) {
    detectedExtensions.push('Simplify Copilot');
    console.log('🚨 Simplify Copilot detected');
  }

  // 2. Apollo.io - only if it's actively interfering
  const apolloChecks = [
    window.apollo,
    document.querySelector('[data-apollo]'),
    document.querySelector('.apollo-extension'),
    document.querySelector('[class*="apollo"]'),
    document.querySelector('[id*="apollo"]'),
    document.querySelector('script[src*="apollo"]'),
    document.querySelector('link[href*="apollo"]')
  ];
  
  if (apolloChecks.some(check => check)) {
    detectedExtensions.push('Apollo.io');
    console.log('🚨 Apollo.io detected');
  }

  // 3. Additional check - look for any extension that modifies CSS animations
  // This is a fallback in case the specific detection fails
  const hasAnimationInterference = () => {
    try {
      const testEl = document.createElement('div');
      testEl.style.animation = 'spin 1s linear infinite';
      document.body.appendChild(testEl);
      const computedStyle = window.getComputedStyle(testEl);
      const hasAnimation = computedStyle.animationName !== 'none';
      document.body.removeChild(testEl);
      return !hasAnimation;
    } catch (e) {
      return false;
    }
  };

  // Debug logging
  console.log('Simplify checks:', simplifyChecks.map(c => !!c));
  console.log('Apollo checks:', apolloChecks.map(c => !!c));

  return detectedExtensions;
};

export const disableGlowingBorder = () => {
  // Create a style element to disable the animation
  const style = document.createElement('style');
  style.id = 'disable-glow-animation';
  style.textContent = `
    .banner .namecard::before,
    .banner .namecard::after {
      display: none !important;
      animation: none !important;
    }
    
    /* Optional: Add a simple static border as fallback */
    .banner .namecard {
      border: 2px solid rgba(183, 187, 255, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🛡️ Extensions detected - Glowing border animation disabled for compatibility');
};

export const enableGlowingBorder = () => {
  // Remove the disable style if it exists
  const disableStyle = document.getElementById('disable-glow-animation');
  if (disableStyle) {
    disableStyle.remove();
  }
  
  console.log('✨ No extensions detected - Glowing border animation enabled');
};

export const initExtensionDetection = () => {
  // Manual override for testing - you can set this in console
  window.forceDisableGlow = false; // Set to true to manually disable
  window.forceEnableGlow = false;  // Set to true to manually enable

  // Wait for DOM to be ready
  const checkExtensions = () => {
    // Check for manual overrides first
    if (window.forceDisableGlow) {
      console.log('🔧 Manual override: Glowing border disabled');
      disableGlowingBorder();
      return;
    }
    
    if (window.forceEnableGlow) {
      console.log('🔧 Manual override: Glowing border enabled');
      enableGlowingBorder();
      return;
    }

    const extensions = detectExtensions();
    
    if (extensions.length > 0) {
      console.log('🔍 Detected problematic extensions:', extensions.join(', '));
      disableGlowingBorder();
    } else {
      console.log('✅ No problematic extensions detected - enabling glowing border');
      enableGlowingBorder();
    }
  };

  // Check immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkExtensions);
  } else {
    checkExtensions();
  }

  // Also check after a delay to catch extensions that load later
  setTimeout(checkExtensions, 1000);
  setTimeout(checkExtensions, 3000);

  // Add console helpers for manual testing
  window.testGlowingBorder = () => {
    console.log('🧪 Testing glowing border detection...');
    checkExtensions();
  };
  
  console.log('🛠️ Debug commands available:');
  console.log('- window.forceDisableGlow = true (disable glow)');
  console.log('- window.forceEnableGlow = true (enable glow)');
  console.log('- window.testGlowingBorder() (rerun detection)');
};

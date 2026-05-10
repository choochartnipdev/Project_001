/**
 * Antigravity Project - Main Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Antigravity Premium Dashboard Initialized');
    
    // Smooth appearance of elements
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });
});

/**
 * Simulate the Index Testing process
 */
function testIndex() {
    const btn = document.querySelector('#indexTestCard .btn');
    const statusLabel = document.querySelector('#indexTestCard .status-label');
    const resultsSection = document.getElementById('resultsSection');
    
    // Update button state
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> กำลังทดสอบ...';
    statusLabel.textContent = 'กำลังทำงาน...';
    
    // Simulate loading
    setTimeout(() => {
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = 'เริ่มการทดสอบ';
        statusLabel.textContent = 'ทดสอบเสร็จสมบูรณ์';
        
        // Add a "Complete" notification effect
        showNotification('การทดสอบ Index เสร็จสิ้น!', 'success');
    }, 1500);
}

/**
 * Close results area
 */
function closeResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.add('hidden');
}

/**
 * Simple notification helper
 */
function showNotification(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="bi bi-info-circle-fill"></i>
        <span>${message}</span>
    `;
    
    // Styling the toast via JS for simplicity or add to CSS
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: type === 'success' ? '#10b981' : '#6d28d9',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease-out'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for the toast dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .spin {
        display: inline-block;
        animation: rotate 1s linear infinite;
    }
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

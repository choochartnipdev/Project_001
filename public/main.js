/**
 * Antigravity ERP - Supabase Logic
 */

// Configuration - โปรดตั้งค่าใน .env (หรือแก้ไขตรงนี้สำหรับทดสอบ)
const SUPABASE_URL = ''; // ใส่ URL จาก .env
const SUPABASE_ANON_KEY = ''; // ใส่ Key จาก .env

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Antigravity ERP Client Initialized');
    
    if (!supabase || !SUPABASE_URL) {
        showNotification('โปรดตั้งค่า Supabase URL และ Key ใน main.js ก่อนใช้งาน', 'warning');
    }

    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('itemImage');
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');

    // Handle Image Preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!supabase) return showNotification('Supabase client not initialized', 'error');

        const submitBtn = document.getElementById('submitBtn');
        const itemName = document.getElementById('itemName').value;
        const file = imageInput.files[0];

        if (!file) return showNotification('โปรดเลือกไฟล์รูปภาพ', 'warning');

        try {
            setLoading(true);
            
            // 1. Upload to Supabase Storage (Bucket: 'uploads')
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName);

            // 3. Save to Database (Table: 'items') via Backend or Direct
            // ในที่นี้เราจะยิงไปที่ Backend API ที่เราสร้างไว้ใน /api/index.js
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: itemName, imageUrl: publicUrl })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'บันทึกข้อมูลไม่สำเร็จ');

            // 4. Success
            showNotification('บันทึกข้อมูลสินค้าสำเร็จ!', 'success');
            addToResults(itemName, publicUrl);
            form.reset();
            previewContainer.classList.add('hidden');

        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    });
});

function setLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> กำลังอัปโหลด...';
    } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send-fill"></i> บันทึกข้อมูล';
    }
}

function addToResults(name, url) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('uploadResults');
    resultsSection.classList.remove('hidden');

    const card = document.createElement('div');
    card.className = 'upload-card';
    card.innerHTML = `
        <img src="${url}" alt="${name}">
        <div class="upload-info">
            <h5>${name}</h5>
            <p>บันทึกสำเร็จเมื่อ: ${new Date().toLocaleTimeString()}</p>
            <a href="${url}" target="_blank" style="color: #8b5cf6; font-size: 0.75rem;">ดูรูปขยาย <i class="bi bi-box-arrow-up-right"></i></a>
        </div>
    `;
    resultsContent.prepend(card);
}

function closeResults() {
    document.getElementById('resultsSection').classList.add('hidden');
}

function showNotification(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="bi bi-info-circle-fill"></i> <span>${message}</span>`;
    
    Object.assign(toast.style, {
        position: 'fixed', bottom: '2rem', right: '2rem',
        background: type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#dc2626',
        color: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', display: 'flex',
        alignItems: 'center', gap: '0.75rem', zIndex: '1000'
    });

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

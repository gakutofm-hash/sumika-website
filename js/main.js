// ===========================
// ギャラリー描画（トップページ）
// ===========================
function renderTopGallery() {
  const grid = document.getElementById('top-gallery-grid');
  if (!grid) return;

  const items = loadGalleryItems();
  const preview = items.slice(0, 6);

  if (preview.length === 0) {
    grid.innerHTML = '<div class="gallery__empty">準備中です。近日公開予定。</div>';
    return;
  }

  grid.innerHTML = preview.map(item => `
    <div class="gallery__item">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}">
    </div>
  `).join('');
}

// ===========================
// ギャラリーデータ管理
// ===========================
function loadGalleryItems() {
  try {
    const stored = localStorage.getItem('gallery_items');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  // gallery-data.js の初期データにフォールバック
  if (typeof GALLERY_DATA !== 'undefined') return GALLERY_DATA;
  return [];
}

function saveGalleryItems(items) {
  localStorage.setItem('gallery_items', JSON.stringify(items));
}

// ===========================
// ギャラリーページ描画
// ===========================
function renderGalleryPage() {
  const grid = document.getElementById('gallery-page-grid');
  if (!grid) return;

  const items = loadGalleryItems();

  if (items.length === 0) {
    grid.innerHTML = '<div class="gallery__empty">ギャラリーは準備中です。近日公開予定。</div>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="gallery__item">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}">
      ${item.caption ? `<p style="padding:8px 0; font-size:12px; color:#666;">${escapeHtml(item.caption)}</p>` : ''}
    </div>
  `).join('');
}

// ===========================
// 管理画面
// ===========================
function renderAdminGallery() {
  const grid = document.getElementById('admin-gallery-grid');
  if (!grid) return;

  const items = loadGalleryItems();

  if (items.length === 0) {
    grid.innerHTML = '<p style="color:#999; font-size:13px;">まだ画像がありません。下のフォームから追加してください。</p>';
    return;
  }

  grid.innerHTML = items.map((item, index) => `
    <div class="admin-gallery-item">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}">
      <button class="admin-gallery-item__delete" onclick="deleteGalleryItem(${index})" title="削除">×</button>
    </div>
  `).join('');
}

function addGalleryItem() {
  const srcInput = document.getElementById('add-src');
  const altInput = document.getElementById('add-alt');
  const captionInput = document.getElementById('add-caption');

  const src = srcInput ? srcInput.value.trim() : '';
  if (!src) {
    alert('画像のURLまたはパスを入力してください。');
    return;
  }

  const items = loadGalleryItems();
  items.push({
    id: Date.now(),
    src: src,
    alt: altInput ? altInput.value.trim() : '',
    caption: captionInput ? captionInput.value.trim() : ''
  });
  saveGalleryItems(items);

  if (srcInput) srcInput.value = '';
  if (altInput) altInput.value = '';
  if (captionInput) captionInput.value = '';

  renderAdminGallery();
  alert('追加しました！');
}

function deleteGalleryItem(index) {
  if (!confirm('この画像を削除しますか？')) return;
  const items = loadGalleryItems();
  items.splice(index, 1);
  saveGalleryItems(items);
  renderAdminGallery();
}

// ===========================
// オーダーフォーム送信
// ===========================
function handleOrderSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  // バリデーション
  const name = data.get('name');
  const email = data.get('email');
  const item = data.get('item');

  if (!name || !email || !item) {
    alert('必須項目をご入力ください。');
    return;
  }

  // メール送信（Formspree を使用）
  // ※ action属性に Formspree の URL を設定してください
  // 設定方法: https://formspree.io でフォームを作成し、
  // form の action に "https://formspree.io/f/YOUR_FORM_ID" を設定
  form.submit();
}

// ===========================
// ユーティリティ
// ===========================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===========================
// 初期化
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  renderTopGallery();
  renderGalleryPage();
  renderAdminGallery();

  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }

  const addBtn = document.getElementById('add-gallery-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addGalleryItem);
  }
});

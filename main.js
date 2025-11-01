const PRODUCTS = [

  {
    id: 'p001',
    name: 'Espresso',
    price: 15000,
    category: 'minuman',
    img: 'https://translate.google.com/website?sl=en&tl=id&hl=id&client=imgs&u=https://paxandbeneficia.com/cdn/shop/articles/espresso.webp?crop%3Dcenter%26height%3D606%26v%3D1694780744%26width%3D840'
  },
  {
    id: 'p002',
    name: 'Cappuccino',
    price: 22000,
    category: 'minuman',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p003',
    name: 'Nasi Goreng',
    price: 25000,
    category: 'makanan',
    img: 'https://asset.kompas.com/crops/VcgvggZKE2VHqIAUp1pyHFXXYCs=/202x66:1000x599/1200x800/data/photo/2023/05/07/6456a450d2edd.jpg'
  },
  {
    id: 'p004',
    name: 'Mie Ayam',
    price: 18000,
    category: 'makanan',
    img: 'https://cove-blog-id.sgp1.cdn.digitaloceanspaces.com/cove-blog-id/2023/02/mie-ayam-jakarta.webp'
  },
  {
    id: 'p005',
    name: 'Bottled Water',
    price: 6000,
    category: 'lainnya',
    img: 'https://menu.ayanihotel.com/wp-content/uploads/2023/02/Bottled-water-1.jpg'
  },
  {
    id: 'p006',
    name: 'Sandwich',
    price: 20000,
    category: 'makanan',
    img: 'https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2025/05/clubsandwich-1200x675.jpg?im=Resize,width=570;'
  },
  {
    id: 'p007',
    name: 'Tea',
    price: 8000,
    category: 'minuman',
    img: 'https://www.cafedumonde.co.uk/media/2750/leaf-tea.jpeg?width=1080&height=810&v=1d9b89dfb43a170'
  },
  {
    id: 'p008',
    name: 'Roti Bakar',
    price: 12000,
    category: 'makanan',
    img: 'https://www.frisianflag.com/storage/app/media/uploaded-files/roti-bakar-keju-cokelat.jpg'
  }
];

let cart = {}; 

function formatRupiah(n){
  const rounded = Math.round(n);
  return rounded.toLocaleString('id-ID');
}

const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');

function renderCatalog(filterText = '', category = '') {
  catalogGrid.innerHTML = '';
  const q = filterText.trim().toLowerCase();
  const list = PRODUCTS.filter(p => {
    if (category && p.category !== category) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    catalogGrid.innerHTML = '<div style="grid-column:1/-1;color:var(--muted);padding:16px">Tidak ada produk.</div>';
    return;
  }

  const svgFallback = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">' +
      '<rect width="100%" height="100%" fill="#f7fafc"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="22" font-family="Arial, Helvetica, sans-serif">Gambar tidak tersedia</text>' +
    '</svg>'
  );

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const imgEl = document.createElement('img');
    imgEl.src = p.img;
    imgEl.alt = p.name;
    imgEl.loading = 'lazy';
    imgEl.onerror = function() {
      this.onerror = null; 
      this.src = svgFallback;
    };

    const metaDiv = document.createElement('div');
    metaDiv.className = 'meta';
    metaDiv.innerHTML = `<h3>${p.name}</h3><span>Rp ${formatRupiah(p.price)}</span>`;

    const pInfo = document.createElement('p');
    pInfo.style.fontSize = '0.82rem';
    pInfo.style.color = 'var(--muted)';
    pInfo.textContent = `ID: ${p.id} • ${p.category}`;

    const btn = document.createElement('button');
    btn.className = 'btn-add';
    btn.dataset.id = p.id;
    btn.textContent = 'Tambah';
    btn.addEventListener('click', () => addItemToCart(p.id));

    card.appendChild(imgEl);
    card.appendChild(metaDiv);
    card.appendChild(pInfo);
    card.appendChild(btn);

    catalogGrid.appendChild(card);
  });
}

  catalogGrid.querySelectorAll('.btn-add').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      addItemToCart(id);
    });
  });

const txBody = document.getElementById('txBody');
const totalAmountEl = document.getElementById('totalAmount');
const totalItemsEl = document.getElementById('totalItems');

function addItemToCart(productId){
  const product = PRODUCTS.find(p => p.id === productId);
  if(!product) return;
  if(cart[productId]) cart[productId].qty += 1;
  else cart[productId] = { product: product, qty: 1 };
  renderCart();
}

function changeQty(productId, delta){
  if(!cart[productId]) return;
  cart[productId].qty += delta;
  if(cart[productId].qty <= 0) delete cart[productId];
  renderCart();
}

function removeItem(productId){
  if(cart[productId]) delete cart[productId];
  renderCart();
}

function emptyCart(){
  cart = {};
  renderCart();
}

function calculateTotals(){
  let total = 0;
  let items = 0;
  Object.values(cart).forEach(entry => {
    const sub = entry.product.price * entry.qty;
    total += sub;
    items += entry.qty;
  });
  return { total: Math.round(total), items };
}

function renderCart(){
  txBody.innerHTML = '';
  const entries = Object.values(cart);
  if(entries.length === 0){
    txBody.innerHTML = '<tr><td colspan="4" style="padding:18px;color:var(--muted)">Belum ada item. Klik "Tambah" pada katalog.</td></tr>';
  } else {
    entries.forEach(entry => {
      const id = entry.product.id;
      const tr = document.createElement('tr');
      const subtotal = entry.product.price * entry.qty;
      tr.innerHTML = `
        <td>
          <div style="font-weight:600">${entry.product.name}</div>
          <div style="font-size:0.8rem;color:var(--muted)">Rp ${formatRupiah(entry.product.price)} / pcs</div>
        </td>
        <td>
          <div class="qty">
            <button data-id="${id}" class="dec">−</button>
            <div style="min-width:28px;text-align:center">${entry.qty}</div>
            <button data-id="${id}" class="inc">+</button>
          </div>
        </td>
        <td style="text-align:right">Rp ${formatRupiah(subtotal)}</td>
        <td style="text-align:center"><button class="remove" data-id="${id}">Hapus</button></td>
      `;
      txBody.appendChild(tr);
    });

    txBody.querySelectorAll('.inc').forEach(b => b.addEventListener('click', e => changeQty(e.currentTarget.dataset.id, +1)));
    txBody.querySelectorAll('.dec').forEach(b => b.addEventListener('click', e => changeQty(e.currentTarget.dataset.id, -1)));
    txBody.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e => removeItem(e.currentTarget.dataset.id)));
  }

  const totals = (() => {
    let items = 0;
    Object.values(cart).forEach(entry => items += entry.qty);
    return { items };
  })();
  totalItemsEl.textContent = totals.items;
}

document.getElementById('calcBtn').addEventListener('click', () => {
  const totals = calculateTotals();
  totalAmountEl.textContent = formatRupiah(totals.total);
  totalItemsEl.textContent = totals.items;
  document.getElementById('totalAmount').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 250 });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if(confirm('Kosongkan semua item transaksi?')) emptyCart();
});

document.getElementById('checkout').addEventListener('click', () => {
  const { total, items } = calculateTotals();
  if(items === 0){ alert('Transaksi kosong. Tambah produk terlebih dahulu.'); return; }
  const name = prompt('Nama pelanggan (optional):', '');
  const msg = `Struk: ${items} item • Total Rp ${formatRupiah(total)}\n${name ? 'Pelanggan: ' + name + '\n' : ''}Lanjutkan pembayaran?`;
  if(confirm(msg)) {
    alert('Pembayaran dicatat. Terima kasih!');
    emptyCart();
  }
});

document.getElementById('print').addEventListener('click', () => {
  const { total, items } = calculateTotals();
  const lines = ['*** RINGKASAN TRANSAKSI ***', `Items: ${items}`, `Total: Rp ${formatRupiah(total)}`, '', 'Detail:'];
  Object.values(cart).forEach(e => lines.push(`${e.product.name} x${e.qty} = Rp ${formatRupiah(e.product.price * e.qty)}`));
  const text = lines.join('\n');
  const w = window.open('', '_blank', 'width=600,height=600');
  w.document.write('<pre style="font-family:monospace;padding:16px;">' + text + '</pre>');
  w.document.title = 'Ringkasan Transaksi';
});

searchInput.addEventListener('input', () => renderCatalog(searchInput.value, categoryFilter.value));
categoryFilter.addEventListener('change', () => renderCatalog(searchInput.value, categoryFilter.value));

document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const calcBtn = $('calcBtn');
  const clearBtn = $('clearBtn');
  const checkout = $('checkout');
  const printBtn = $('print');
  const calcNote = $('calcNote');

  let totalComputed = false;
  let lastTotals = { total: 0, items: 0, timestamp: null };

  function markComputed(totals) {
    totalComputed = true;
    lastTotals = { ...totals, timestamp: new Date() };
    if (calcNote) {
      const t = lastTotals.timestamp;
      calcNote.textContent = `Terakhir dihitung: ${t.toLocaleTimeString()} (${t.toLocaleDateString()})`;
    }
    if (checkout) checkout.disabled = false;

    if ($('totalAmount')) $('totalAmount').textContent = formatRupiah(lastTotals.total);
    if ($('totalItems')) $('totalItems').textContent = lastTotals.items;
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      try {
        const totals = calculateTotals();
        markComputed(totals);
        console.log('[INFO] Total dihitung:', totals);
      } catch (err) {
        console.error('Error menghitung total:', err);
        alert('Terjadi error saat menghitung total. Cek console.');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Kosongkan semua item transaksi?')) {
        emptyCart();
        totalComputed = false;
        lastTotals = { total: 0, items: 0, timestamp: null };
        if (calcNote) calcNote.textContent = 'Belum dihitung';
        if ($('totalAmount')) $('totalAmount').textContent = '-';
        if (checkout) checkout.disabled = true;
      }
    });
  }

  if (checkout) {
    checkout.addEventListener('click', () => {
      try {
        const currentTotals = calculateTotals();

        if (!totalComputed) {
          const proceed = confirm('Total belum dihitung. Lanjut bayar dengan perhitungan otomatis sekarang? (OK = hitung & bayar)');
          if (!proceed) return;
          markComputed(currentTotals);
        }

        const { total, items } = totalComputed ? lastTotals : currentTotals;
        if (items === 0) { alert('Transaksi kosong. Tambah produk terlebih dahulu.'); return; }

        const name = prompt('Nama pelanggan (optional):', '');
        const msg = `Struk: ${items} item • Total Rp ${formatRupiah(total)}\n${name ? 'Pelanggan: ' + name + '\n' : ''}Lanjutkan pembayaran?`;
        if (confirm(msg)) {
          alert('Pembayaran dicatat. Terima kasih!');
          emptyCart();

          totalComputed = false;
          lastTotals = { total: 0, items: 0, timestamp: null };
          if (calcNote) calcNote.textContent = 'Belum dihitung';
          if ($('totalAmount')) $('totalAmount').textContent = '-';
          if (checkout) checkout.disabled = true;
        }
      } catch (err) {
        console.error('Error saat checkout:', err);
        alert('Terjadi error saat proses checkout. Cek console.');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      try {
        const { total, items } = calculateTotals();
        const lines = ['*** RINGKASAN TRANSAKSI ***', `Items: ${items}`, `Total: Rp ${formatRupiah(total)}`, '', 'Detail:'];
        Object.values(cart).forEach(e => lines.push(`${e.product.name} x${e.qty} = Rp ${formatRupiah(e.product.price * e.qty)}`));
        const text = lines.join('\n');
        const w = window.open('', '_blank', 'width=600,height=600');
        w.document.write('<pre style="font-family:monospace;padding:16px;">' + text + '</pre>');
        w.document.title = 'Ringkasan Transaksi';
      } catch (err) {
        console.error('Error saat print:', err);
        alert('Gagal membuat ringkasan. Cek console.');
      }
    });
  }

  if ($('search')) $('search').addEventListener('input', () => renderCatalog($('search').value, $('categoryFilter').value));
  if ($('categoryFilter')) $('categoryFilter').addEventListener('change', () => renderCatalog($('search').value, $('categoryFilter').value));

  renderCatalog();
  renderCart();
  if (checkout) checkout.disabled = true;
});

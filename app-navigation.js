const SHARED_BACKOFFICE_CATEGORIES = [
  { key: "inventory", label: "Persediaan", modules: [
    { title: "Master Barang", icon: "🏷️", href: "menu.html", roles: ["super_admin", "admin_organisasi", "admin_toko"] },
    { title: "Stok", icon: "📦", href: "stok.html", roles: ["admin_organisasi", "admin_toko", "staff_gudang"] },
    { title: "Pembelian", icon: "🛒", href: "pembelian.html", roles: ["admin_organisasi", "admin_toko", "staff_gudang"] },
  ] },
  { key: "customers", label: "Pelanggan", modules: [
    { title: "Pelanggan & Promo POS", icon: "♙", href: "pos-penjualan.html?section=customers", roles: ["super_admin", "admin_organisasi", "admin_toko", "kepala_toko", "asisten_toko", "merchandiser"] },
  ] },
  { key: "suppliers", label: "Pemasok", modules: [
    { title: "Data Pemasok", icon: "🚚", href: "menu.html?tab=supplier", roles: ["super_admin", "admin_organisasi", "admin_toko"] },
    { title: "Pembelian", icon: "🧾", href: "pembelian.html", roles: ["admin_organisasi", "admin_toko", "staff_gudang"] },
  ] },
  { key: "company", label: "Perusahaan", modules: [
    { title: "Daftar Toko", icon: "🏬", href: "daftar-toko.html", roles: ["super_admin", "admin_organisasi"] },
    { title: "Pengguna", icon: "👥", href: "pengguna.html", roles: ["super_admin", "admin_organisasi", "admin_toko"] },
  ] },
  { key: "design", label: "Desain", modules: [
    { title: "Pengaturan Struk Thermal", icon: "🖨️", href: "pos-penjualan.html?section=design", roles: ["super_admin", "admin_organisasi", "admin_toko", "kepala_toko", "asisten_toko", "merchandiser"] },
  ] },
  { key: "reports", label: "Laporan", modules: [
    { title: "Ringkasan Operasional", icon: "📊", href: "dashboard.html#operational-summary", roles: ["super_admin", "admin_organisasi", "admin_toko", "kepala_toko", "asisten_toko", "merchandiser", "kasir", "staff_gudang"] },
    { title: "Rekap Shift & Harian", icon: "🧾", href: "pos-penjualan.html", roles: ["super_admin", "admin_organisasi", "admin_toko", "kepala_toko", "asisten_toko", "merchandiser"] },
  ] },
];

const SHARED_PAGE_CATEGORY = {
  "menu.html": "inventory",
  "stok.html": "inventory",
  "pembelian.html": "inventory",
  "daftar-toko.html": "company",
  "pengguna.html": "company",
  "pos-penjualan.html": "customers",
};

function initSharedNavigation() {
  const header = document.querySelector(".page-topbar, .pos-shell > .topbar");
  if (!header || document.getElementById("sharedCategoryNav")) return;
  document.body.classList.add("has-shared-navigation");

  if (header.classList.contains("page-topbar")) {
    const brand = document.createElement("div");
    brand.className = "shared-brand";
    brand.innerHTML = '<span class="shared-brand-mark">S</span><span>SmarterERP</span>';
    header.prepend(brand);
  }

  const categoryNav = document.createElement("nav");
  categoryNav.id = "sharedCategoryNav";
  categoryNav.className = "shared-category-nav";
  categoryNav.setAttribute("aria-label", "Kategori backoffice");
  const moduleToolbar = document.createElement("nav");
  moduleToolbar.id = "sharedModuleToolbar";
  moduleToolbar.className = "shared-module-toolbar";
  moduleToolbar.setAttribute("aria-label", "Modul kategori aktif");
  header.after(categoryNav, moduleToolbar);

  const role = sessionStorage.getItem("smarterp_role");
  const page = window.location.pathname.split("/").pop();
  const searchParams = new URLSearchParams(window.location.search);
  const queryCategory = searchParams.get("section") || (searchParams.get("tab") === "supplier" ? "suppliers" : null);
  let activeCategory = queryCategory || SHARED_PAGE_CATEGORY[page] || "inventory";

  function render() {
    categoryNav.innerHTML = SHARED_BACKOFFICE_CATEGORIES.map(category => `
      <button class="shared-category-tab ${category.key === activeCategory ? "active" : ""}" type="button"
        aria-pressed="${category.key === activeCategory}" data-category="${category.key}">${category.label}</button>
    `).join("");
    const category = SHARED_BACKOFFICE_CATEGORIES.find(item => item.key === activeCategory) || SHARED_BACKOFFICE_CATEGORIES[0];
    const modules = category.modules.filter(module => !role || module.roles.includes(role));
    moduleToolbar.innerHTML = modules.length
      ? modules.map(module => `<a class="shared-module-shortcut" href="${module.href}"><span class="icon" aria-hidden="true">${module.icon}</span><span>${module.title}</span></a>`).join("")
      : '<span class="shared-module-empty">Tidak ada modul untuk role akun ini.</span>';
  }

  categoryNav.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    render();
  });
  render();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initSharedNavigation);
else initSharedNavigation();
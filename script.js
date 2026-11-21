// 1. Data Kategori Sampah & Cara Pengolahan
const dataKategori = [
    {
        tipe: "organik",
        label: "Organik (Hijau)",
        judul: "Sampah Mudah Terurai",
        contoh: "Sisa makanan, kulit buah, sayuran busuk, daun kering, ranting.",
        pengolahan: [
            "Olah menjadi pupuk kompos atau pupuk organik cair (POC).",
            "Gunakan metode lubang biopori di halaman rumah.",
            "Manfaatkan sebagai pakan maggot BSF untuk penguraian cepat."
        ]
    },
    {
        tipe: "anorganik",
        label: "Anorganik (Kuning)",
        judul: "Sampah Layak Daur Ulang",
        contoh: "Botol plastik, kardus, kertas HVS, kaleng aluminium, botol kaca.",
        pengolahan: [
            "Cuci bersih dan keringkan wadah bekas makanan/minuman.",
            "Pipihkan botol plastik atau kardus agar hemat ruang.",
            "Setorkan ke Bank Sampah terdekat untuk ditukar poin/saldo."
        ]
    },
    {
        tipe: "b3",
        label: "Limbah B3 (Merah)",
        judul: "Bahan Berbahaya & Beracun",
        contoh: "Baterai bekas, lampu neon, kaleng aerosol, elektronik rusak, obat kedaluwarsa.",
        pengolahan: [
            "Jangan dicampur dengan sampah rumah tangga biasa.",
            "Simpan dalam wadah tertutup dan jauhkan dari jangkauan anak.",
            "Serahkan ke dropbox khusus limbah elektronik/B3 dari dinas lingkungan."
        ]
    }
];

// 2. Data Lokasi Bank Sampah
const dataBankSampah = [
    { nama: "Bank Sampah Induk Gesit", kota: "Jakarta Selatan", alamat: "Jl. Menteng Atas No. 12", jam: "08.00 - 16.00 WIB" },
    { nama: "Bank Sampah Bersinar", kota: "Bandung", alamat: "Jl. Terusan Buah Batu No. 45", jam: "08.00 - 15.00 WIB" },
    { nama: "Bank Sampah Induk Surabaya", kota: "Surabaya", alamat: "Jl. Ngagel Timur No. 26", jam: "08.00 - 16.30 WIB" },
    { nama: "Bank Sampah Gemah Ripah", kota: "Yogyakarta", alamat: "Badegan, Bantul", jam: "08.00 - 14.00 WIB" }
];

// Render Kartu Kategori Sampah
function renderKategori(filter = "semua") {
    const container = document.getElementById("kategori-container");
    container.innerHTML = "";

    const hasil = filter === "semua" 
        ? dataKategori 
        : dataKategori.filter(item => item.tipe === filter);

    hasil.forEach(item => {
        const listLangkah = item.pengolahan.map(step => `<li>${step}</li>`).join("");
        container.innerHTML += `
            <div class="card ${item.tipe}">
                <span class="badge ${item.tipe}">${item.label}</span>
                <h3>${item.judul}</h3>
                <p><strong>Contoh:</strong> ${item.contoh}</p>
                <ul>${listLangkah}</ul>
            </div>
        `;
    });
}

function filterKategori(tipe, btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderKategori(tipe);
}

// 3. Fitur EcoLens (Deteksi Foto Sampah)
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadPlaceholder = document.getElementById("upload-placeholder");
let uploadedFileName = "";

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        uploadedFileName = file.name.toLowerCase();
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.hidden = false;
            uploadPlaceholder.hidden = true;
        };
        reader.readAsDataURL(file);
    }
});

function analisisFotoSampah() {
    const resultBox = document.getElementById("scanResult");
    const mockChoice = document.getElementById("mockObject").value;

    if (!uploadedFileName && mockChoice === "auto") {
        alert("Silakan unggah foto sampah terlebih dahulu!");
        return;
    }

    let kategoriTerdeteksi = "anorganik";

    if (mockChoice !== "auto") {
        kategoriTerdeteksi = mockChoice;
    } else {
        // Deteksi pintar berdasarkan kata kunci nama file foto
        if (uploadedFileName.match(/daun|makan|buah|sayur|nasi|organik/)) {
            kategoriTerdeteksi = "organik";
        } else if (uploadedFileName.match(/baterai|lampu|obat|kabel|hp|b3|racun/)) {
            kategoriTerdeteksi = "b3";
        } else {
            kategoriTerdeteksi = "anorganik";
        }
    }

    const detail = dataKategori.find(k => k.tipe === kategoriTerdeteksi);
    resultBox.hidden = false;
    resultBox.innerHTML = `
        <span class="badge ${detail.tipe}">Terdeteksi: ${detail.label}</span>
        <h4>Rekomendasi Penanganan:</h4>
        <p>${detail.pengolahan[0]} ${detail.pengolahan[1]}</p>
    `;
}

// 4. Render & Cari Lokasi Bank Sampah
function renderBankSampah(list) {
    const container = document.getElementById("bank-container");
    container.innerHTML = "";

    list.forEach(bank => {
        container.innerHTML += `
            <div class="card">
                <span class="badge organik">${bank.kota}</span>
                <h3>${bank.nama}</h3>
                <p>📍 ${bank.alamat}</p>
                <p>🕒 Buka: ${bank.jam}</p>
            </div>
        `;
    });
}

function cariBankSampah() {
    const keyword = document.getElementById("searchBank").value.toLowerCase();
    const filtered = dataBankSampah.filter(b => 
        b.kota.toLowerCase().includes(keyword) || b.nama.toLowerCase().includes(keyword)
    );
    renderBankSampah(filtered);
}

// 5. Pencatatan Kontribusi Daur Ulang (Tersimpan di LocalStorage)
let riwayatKontribusi = JSON.parse(localStorage.getItem("ecosort_data")) || [];

document.getElementById("formKontribusi").addEventListener("submit", function (e) {
    e.preventDefault();
    const jenis = document.getElementById("jenisSampah").value;
    const barang = document.getElementById("namaBarang").value;
    const berat = parseFloat(document.getElementById("beratSampah").value);

    riwayatKontribusi.unshift({ jenis, barang, berat });
    localStorage.setItem("ecosort_data", JSON.stringify(riwayatKontribusi));

    this.reset();
    updateTrackerUI();
});

function updateTrackerUI() {
    const listEl = document.getElementById("riwayatList");
    let totalBerat = 0;
    listEl.innerHTML = "";

    riwayatKontribusi.forEach(item => {
        totalBerat += item.berat;
        listEl.innerHTML += `
            <li>
                <span><strong>[${item.jenis}]</strong> ${item.barang}</span>
                <span>${item.berat} kg</span>
            </li>
        `;
    });

    document.getElementById("totalBerat").textContent = `${totalBerat.toFixed(1)} kg`;
    document.getElementById("totalPoin").textContent = `${Math.round(totalBerat * 100)} Poin`;
}

// Jalankan saat halaman pertama dibuka
renderKategori();
renderBankSampah(dataBankSampah);
updateTrackerUI();
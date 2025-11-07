document.addEventListener('DOMContentLoaded', function () {
	const PRICE = {
		Jogjakarta: 320000,
		Surabaya: 540000,
		Semarang: 240000
	};

	const namaEl = document.getElementById('nama');
	const tujuanEl = document.getElementById('tujuan');
	const jumlahEl = document.getElementById('jumlah');
	const memberEl = document.getElementById('member');
	const btnHitung = document.getElementById('btnHitung');
	const btnBayar = document.getElementById('btnBayar');
	const btnReset = document.getElementById('btnReset');
	const errorsEl = document.getElementById('errors');
	const hasilEl = document.getElementById('hasil');
	const receiptArea = document.getElementById('receiptArea');

	const r_nama = document.getElementById('r_nama');
	const r_tujuan = document.getElementById('r_tujuan');
	const r_harga = document.getElementById('r_harga');
	const r_jumlah = document.getElementById('r_jumlah');
	const r_subtotal = document.getElementById('r_subtotal');
	const r_diskon = document.getElementById('r_diskon');
	const r_total = document.getElementById('r_total');

	function formatRupiah(number) {
		return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
	}

	function validate() {
		const errs = [];
		if (!namaEl.value || !namaEl.value.trim()) errs.push('Nama harus diisi.');
		if (!tujuanEl.value) errs.push('Tujuan harus dipilih.');
		const qty = Number(jumlahEl.value);
		if (!Number.isFinite(qty) || qty < 1) errs.push('Jumlah tiket harus angka dan minimal 1.');
		return errs;
	}

	function getDiscountRate(member) {
		if (member === 'gold') return 0.20;
		if (member === 'silver') return 0.10;
		return 0;
	}

	function calculate() {
		errorsEl.textContent = '';
		receiptArea.innerHTML = '';

		const errs = validate();
		if (errs.length) {
			hasilEl.hidden = true;
			errorsEl.innerHTML = errs.join('<br>');
			return null;
		}

		const nama = namaEl.value.trim();
		const tujuan = tujuanEl.value;
		const harga = PRICE[tujuan] || 0;
		const jumlah = Number(jumlahEl.value);
		const subtotal = harga * jumlah;
		const rate = getDiscountRate(memberEl.value);
		const diskon = Math.round(subtotal * rate);
		const total = subtotal - diskon;

		r_nama.textContent = 'Nama : ' + nama;
		r_tujuan.textContent = 'Tujuan : ' + tujuan;
		r_harga.textContent = 'Harga per tiket : ' + formatRupiah(harga);
		r_jumlah.textContent = 'Jumlah tiket : ' + jumlah;
		r_subtotal.textContent = 'Subtotal : ' + formatRupiah(subtotal);
		r_diskon.textContent = 'Diskon (' + Math.round(rate * 100) + '%) : ' + formatRupiah(diskon);
		r_total.textContent = 'Total Bayar : ' + formatRupiah(total);

		hasilEl.hidden = false;

		return { nama, tujuan, harga, jumlah, subtotal, diskon, total, member: memberEl.value };
	}

	btnHitung.addEventListener('click', function () {
		calculate();
	});

	btnBayar.addEventListener('click', function () {
		const data = calculate();
		if (!data) return;

		let bayar = prompt('Masukkan jumlah pembayaran (angka):', '0');
		if (bayar === null) return; 

		
		bayar = String(bayar).replace(/[^0-9]/g, '');
		const bayarNum = Number(bayar);
		if (!Number.isFinite(bayarNum) || bayarNum <= 0) {
			alert('Nominal pembayaran tidak valid.');
			return;
		}

		if (bayarNum < data.total) {
			alert('Pembayaran kurang. Silakan masukkan nominal >= Total Bayar.');
			return;
		}

		const kembalian = bayarNum - data.total;
		const lines = [];
		lines.push('====== BUKTI PEMBAYARAN ======');
		lines.push('Nama       : ' + data.nama);
		lines.push('Tujuan     : ' + data.tujuan);
		lines.push('Harga/Tiket: ' + formatRupiah(data.harga));
		lines.push('Jumlah     : ' + data.jumlah);
		lines.push('Subtotal   : ' + formatRupiah(data.subtotal));
		lines.push('Diskon     : ' + formatRupiah(data.diskon) + ' (' + Math.round(getDiscountRate(data.member) * 100) + '%)');
		lines.push('Total Bayar: ' + formatRupiah(data.total));
		lines.push('Dibayar    : ' + formatRupiah(bayarNum));
		lines.push('Kembalian  : ' + formatRupiah(kembalian));
		lines.push('==============================');

		receiptArea.innerHTML = '<div class="receipt">' + lines.join('\n') + '</div>';
		alert('Pembayaran berhasil. Bukti pembayaran ditampilkan di bawah.');
	});

	btnReset.addEventListener('click', function () {
		namaEl.value = '';
		tujuanEl.value = '';
		jumlahEl.value = 1;
		memberEl.value = 'none';
		errorsEl.textContent = '';
		hasilEl.hidden = true;
		receiptArea.innerHTML = '';
	});
});
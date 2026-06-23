import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Download, RotateCcw, BadgeCheck, Coffee, Wallet, Landmark, Store, PieChart, Layers } from 'lucide-react';

const initialState = {
  name: '', salaryType: 'Bulanan', salaryAmount: '',
  dailyFood: '', dailyCigarette: '',
  electricity: '', wifi: '', lpg: '', arisan: '', spp: '', pocketMoneyDaily: '', gasWeekly: '',
  motorcycleTax: '', carTax: '', ukt: '',
  businessType: 'Tidak Ada',
  padiSeasons: '2', padiSacks: '', padiPrice: '', padiFertilizer: '', padiSeed: '', padiMedicine: '', padiTractor: '', padiHarvest: '', padiPlanting: '', padiRent: '', padiTax: '',
  businessOmset: '', mebelOmsetType: 'Bulanan', mebelWorkers: '', prodCost1: '', prodCost2: '', prodCost3: '', opCost1: '', opCost2: '', nonOpCost1: '', nonOpCost2: ''
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const totalSteps = 6;

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleReset = () => { setFormData(initialState); setStep(1); };

  const parseNum = (val) => Number(val) || 0;

  // Step 1
  const getMonthlySalary = () => {
    const amount = parseNum(formData.salaryAmount);
    if (formData.salaryType === 'Harian') return amount * 24;
    if (formData.salaryType === 'Mingguan') return amount * 4;
    return amount;
  };
  const annualIncome = getMonthlySalary() * 12;

  // Step 2
  const getWeeklyConsumption = () => (parseNum(formData.dailyFood) + parseNum(formData.dailyCigarette)) * 7;
  const annualConsumption = getWeeklyConsumption() * 52;

  // Step 3
  const getMonthlyRoutine = () => parseNum(formData.electricity) + parseNum(formData.wifi) + parseNum(formData.lpg) + (parseNum(formData.arisan) * 4) + parseNum(formData.spp) + (parseNum(formData.pocketMoneyDaily) * 30) + (parseNum(formData.gasWeekly) * 4);

  // Step 4
  const getAnnualPersonal = () => (getMonthlyRoutine() * 12) + parseNum(formData.motorcycleTax) + parseNum(formData.carTax) + parseNum(formData.ukt);

  // Step 5
  const getBusinessFinancials = () => {
    let annualOmset = 0, annualExpense = 0;
    if (formData.businessType === 'Pertanian Padi') {
      const musim = parseNum(formData.padiSeasons) || 1;
      const omsetMusim = parseNum(formData.padiSacks) * 50 * parseNum(formData.padiPrice);
      const expenseMusim = parseNum(formData.padiFertilizer) + parseNum(formData.padiSeed) + parseNum(formData.padiMedicine) + parseNum(formData.padiTractor) + parseNum(formData.padiHarvest) + parseNum(formData.padiPlanting) + parseNum(formData.padiRent) + parseNum(formData.padiTax);
      annualOmset = omsetMusim * musim;
      annualExpense = expenseMusim * musim;
    } else if (formData.businessType === 'Peternakan') {
      annualOmset = parseNum(formData.businessOmset);
      annualExpense = parseNum(formData.prodCost1) + parseNum(formData.prodCost2) + parseNum(formData.prodCost3) + parseNum(formData.opCost1) + parseNum(formData.opCost2) + parseNum(formData.nonOpCost1) + parseNum(formData.nonOpCost2);
    } else if (formData.businessType === 'Mebel') {
      let monthlyOmset = parseNum(formData.businessOmset) * (formData.mebelOmsetType === 'Mingguan' ? 4 : 1);
      const monthlyProdCost = parseNum(formData.prodCost1) + parseNum(formData.prodCost2);
      const monthlyOpCost = (parseNum(formData.opCost1) * parseNum(formData.mebelWorkers) * 4) + parseNum(formData.opCost2);
      const monthlyNonOpCost = parseNum(formData.nonOpCost1) + parseNum(formData.nonOpCost2);
      annualOmset = monthlyOmset * 12;
      annualExpense = (monthlyProdCost + monthlyOpCost + monthlyNonOpCost) * 12;
    }
    return { annualOmset, annualExpense };
  };

  const businessData = getBusinessFinancials();
  const totalPemasukanTahunan = annualIncome + businessData.annualOmset;
  const totalPengeluaranKeseluruhan = annualConsumption + getAnnualPersonal() + businessData.annualExpense;
  const neraca = totalPemasukanTahunan - totalPengeluaranKeseluruhan;

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Kategori,Nilai\n" +
      `Nama,${formData.name}\n` +
      `Pemasukan Gaji Tahunan,${annualIncome}\n` +
      `Konsumsi Tahunan,${annualConsumption}\n` +
      `Pengeluaran Pribadi Tahunan,${getAnnualPersonal()}\n` +
      `Omset Usaha Tahunan,${businessData.annualOmset}\n` +
      `Pengeluaran Usaha Tahunan,${businessData.annualExpense}\n` +
      `TOTAL PEMASUKAN,${totalPemasukanTahunan}\n` +
      `TOTAL PENGELUARAN,${totalPengeluaranKeseluruhan}\n` +
      `NERACA (SURPLUS/DEFISIT),${neraca}\n`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "hasil_sensus_ekonomi.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // Shared Tailwind Classes
  const inputClass = "w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm text-slate-800 text-base";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-2";
  const h2Class = "text-2xl font-bold text-slate-800 flex items-center gap-3 mb-6";
  const h4Class = "text-sm font-bold text-indigo-600 uppercase tracking-wider mt-8 mb-4";
  const subBoxClass = "mt-8 p-5 bg-indigo-50/80 border border-indigo-100 rounded-2xl border-l-4 border-l-indigo-500";
  const subTextClass = "flex justify-between items-center text-sm font-medium text-indigo-900 mb-2 last:mb-0";
  const subValueClass = "font-bold text-base";

  return (
    <div className="min-h-screen bg-mesh py-8 px-4 sm:py-12 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-5">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Sistem Penunjang SE
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Aplikasi Pendataan Mandiri 100% Client-Side</p>
        </div>

        {/* Progress Bar */}
        {step < 6 && (
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-10">
            <div className="bg-indigo-600 h-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className={h2Class}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0"><BadgeCheck className="text-white w-5 h-5" /></div>
                Profil & Pemasukan
              </h2>
              <div className="space-y-5">
                <div><label className={labelClass}>Nama Lengkap</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Masukkan nama Anda" /></div>
                <div><label className={labelClass}>Tipe Gaji</label><select name="salaryType" value={formData.salaryType} onChange={handleChange} className={inputClass}><option>Harian</option><option>Mingguan</option><option>Bulanan</option></select></div>
                <div><label className={labelClass}>Nominal Gaji</label><input type="number" name="salaryAmount" value={formData.salaryAmount} onChange={handleChange} className={inputClass} placeholder="Contoh: 3000000" /></div>
              </div>
              <div className={subBoxClass}>
                <div className={subTextClass}><span>Gaji Bulanan</span><span className={subValueClass}>Rp {getMonthlySalary().toLocaleString('id-ID')}</span></div>
                <div className={subTextClass}><span>Gaji Tahunan</span><span className={subValueClass}>Rp {annualIncome.toLocaleString('id-ID')}</span></div>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className={h2Class}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0"><Coffee className="text-white w-5 h-5" /></div>
                Konsumsi Mingguan
              </h2>
              <p className="text-slate-500 text-sm mb-5 font-medium">Masukkan rata-rata pengeluaran Anda dalam sehari.</p>
              <div className="space-y-5">
                <div><label className={labelClass}>Biaya Makan (Per Hari)</label><input type="number" name="dailyFood" value={formData.dailyFood} onChange={handleChange} className={inputClass} placeholder="Contoh: 50000" /></div>
                <div><label className={labelClass}>Biaya Rokok (Per Hari)</label><input type="number" name="dailyCigarette" value={formData.dailyCigarette} onChange={handleChange} className={inputClass} placeholder="Kosongkan jika tidak ada" /></div>
              </div>
              <div className={subBoxClass}>
                <div className={subTextClass}><span>Total Mingguan</span><span className={subValueClass}>Rp {getWeeklyConsumption().toLocaleString('id-ID')}</span></div>
                <div className={subTextClass}><span>Estimasi Tahunan</span><span className={subValueClass}>Rp {annualConsumption.toLocaleString('id-ID')}</span></div>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className={h2Class}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0"><Wallet className="text-white w-5 h-5" /></div>
                Pengeluaran Rutin (Bulanan)
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div><label className={labelClass}>Listrik</label><input type="number" name="electricity" value={formData.electricity} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>WiFi / Paket Data</label><input type="number" name="wifi" value={formData.wifi} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>LPG</label><input type="number" name="lpg" value={formData.lpg} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Arisan (Per Minggu)</label><input type="number" name="arisan" value={formData.arisan} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>SPP Anak</label><input type="number" name="spp" value={formData.spp} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Uang Saku (Per Hari)</label><input type="number" name="pocketMoneyDaily" value={formData.pocketMoneyDaily} onChange={handleChange} className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>Bensin (Per Minggu)</label><input type="number" name="gasWeekly" value={formData.gasWeekly} onChange={handleChange} className={inputClass} /></div>
              </div>
              <div className={subBoxClass}>
                <div className={subTextClass}><span>Total Rutin Bulanan</span><span className={subValueClass}>Rp {getMonthlyRoutine().toLocaleString('id-ID')}</span></div>
                <div className={subTextClass}><span>Estimasi Rutin Tahunan</span><span className={subValueClass}>Rp {(getMonthlyRoutine() * 12).toLocaleString('id-ID')}</span></div>
              </div>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className={h2Class}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0"><Landmark className="text-white w-5 h-5" /></div>
                Tahunan Pribadi
              </h2>
              <div className="space-y-5">
                <div><label className={labelClass}>Pajak Motor</label><input type="number" name="motorcycleTax" value={formData.motorcycleTax} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Pajak Mobil</label><input type="number" name="carTax" value={formData.carTax} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>UKT / Pendidikan</label><input type="number" name="ukt" value={formData.ukt} onChange={handleChange} className={inputClass} /></div>
              </div>
              <div className={subBoxClass}>
                <div className={subTextClass}><span>Total Tahunan Pribadi</span><span className={subValueClass}>Rp {getAnnualPersonal().toLocaleString('id-ID')}</span></div>
              </div>
            </motion.div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className={h2Class}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0"><Store className="text-white w-5 h-5" /></div>
                Sektor Usaha
              </h2>
              <div className="mb-6">
                <label className={labelClass}>Jenis Usaha</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} className={inputClass}>
                  <option>Tidak Ada</option><option>Pertanian Padi</option><option>Peternakan</option><option>Mebel</option>
                </select>
              </div>

              <AnimatePresence mode="wait">
                {formData.businessType === 'Pertanian Padi' && (
                  <motion.div key="padi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div><label className={labelClass}>Jumlah Musim Panen (Per Tahun)</label><input type="number" name="padiSeasons" value={formData.padiSeasons} onChange={handleChange} className={inputClass} placeholder="2" /></div>
                    <h4 className={h4Class}>Omset (Per Musim)</h4>
                    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Jumlah Sak</label><input type="number" name="padiSacks" value={formData.padiSacks} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Harga per Kg</label><input type="number" name="padiPrice" value={formData.padiPrice} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Biaya Produksi</h4>
                    <div className="grid grid-cols-3 gap-4"><div><label className={labelClass}>Pupuk</label><input type="number" name="padiFertilizer" value={formData.padiFertilizer} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Benih</label><input type="number" name="padiSeed" value={formData.padiSeed} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Obat</label><input type="number" name="padiMedicine" value={formData.padiMedicine} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Biaya Operasional</h4>
                    <div className="grid grid-cols-3 gap-4"><div><label className={labelClass}>Traktor</label><input type="number" name="padiTractor" value={formData.padiTractor} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Panen</label><input type="number" name="padiHarvest" value={formData.padiHarvest} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Tanam</label><input type="number" name="padiPlanting" value={formData.padiPlanting} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Non-Operasional</h4>
                    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Sewa Lahan</label><input type="number" name="padiRent" value={formData.padiRent} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Pajak</label><input type="number" name="padiTax" value={formData.padiTax} onChange={handleChange} className={inputClass} /></div></div>
                  </motion.div>
                )}

                {formData.businessType === 'Peternakan' && (
                  <motion.div key="peternakan" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div><label className={labelClass}>Omset (Per Tahun)</label><input type="number" name="businessOmset" value={formData.businessOmset} onChange={handleChange} className={inputClass} /></div>
                    <h4 className={h4Class}>Biaya Produksi (Per Tahun)</h4>
                    <div className="grid grid-cols-3 gap-4"><div><label className={labelClass}>Bibit</label><input type="number" name="prodCost1" value={formData.prodCost1} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Pakan</label><input type="number" name="prodCost2" value={formData.prodCost2} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Obat</label><input type="number" name="prodCost3" value={formData.prodCost3} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Biaya Operasional (Per Tahun)</h4>
                    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Upah Kandang</label><input type="number" name="opCost1" value={formData.opCost1} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Listrik</label><input type="number" name="opCost2" value={formData.opCost2} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Non-Operasional (Per Tahun)</h4>
                    <div><label className={labelClass}>Sewa Kandang / Lahan</label><input type="number" name="nonOpCost1" value={formData.nonOpCost1} onChange={handleChange} className={inputClass} /></div>
                  </motion.div>
                )}

                {formData.businessType === 'Mebel' && (
                  <motion.div key="mebel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div className="flex gap-4">
                      <div className="flex-1"><label className={labelClass}>Tipe Omset</label><select name="mebelOmsetType" value={formData.mebelOmsetType} onChange={handleChange} className={inputClass}><option>Mingguan</option><option>Bulanan</option></select></div>
                      <div className="flex-[2]"><label className={labelClass}>Nominal Omset</label><input type="number" name="businessOmset" value={formData.businessOmset} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <h4 className={h4Class}>Biaya Produksi (Per Bulan)</h4>
                    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Kayu</label><input type="number" name="prodCost1" value={formData.prodCost1} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Lain-lain</label><input type="number" name="prodCost2" value={formData.prodCost2} onChange={handleChange} className={inputClass} /></div></div>
                    <h4 className={h4Class}>Biaya Operasional</h4>
                    <div className="flex gap-4"><div className="flex-1"><label className={labelClass}>Jml Pekerja</label><input type="number" name="mebelWorkers" value={formData.mebelWorkers} onChange={handleChange} className={inputClass} /></div><div className="flex-[2]"><label className={labelClass}>Upah (Per Minggu)</label><input type="number" name="opCost1" value={formData.opCost1} onChange={handleChange} className={inputClass} /></div></div>
                    <div><label className={labelClass}>Listrik Mesin (Per Bulan)</label><input type="number" name="opCost2" value={formData.opCost2} onChange={handleChange} className={inputClass} /></div>
                    <h4 className={h4Class}>Non-Operasional (Per Bulan)</h4>
                    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Sewa</label><input type="number" name="nonOpCost1" value={formData.nonOpCost1} onChange={handleChange} className={inputClass} /></div><div><label className={labelClass}>Pajak</label><input type="number" name="nonOpCost2" value={formData.nonOpCost2} onChange={handleChange} className={inputClass} /></div></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {formData.businessType !== 'Tidak Ada' && (
                <div className={subBoxClass}>
                  <div className={subTextClass}><span>Estimasi Omset Tahunan</span><span className="font-bold text-emerald-600">Rp {businessData.annualOmset.toLocaleString('id-ID')}</span></div>
                  <div className={subTextClass}><span>Estimasi Pengeluaran</span><span className="font-bold text-rose-600">Rp {businessData.annualExpense.toLocaleString('id-ID')}</span></div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-5">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800">Dashboard & Export</h2>
                <p className="text-slate-500 font-medium mt-1">Ringkasan Sensus Ekonomi Anda</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Gaji Tahunan</div><div className="text-xl font-extrabold text-slate-800">Rp {annualIncome.toLocaleString('id-ID')}</div></div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Omset Usaha</div><div className="text-xl font-extrabold text-emerald-600">Rp {businessData.annualOmset.toLocaleString('id-ID')}</div></div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Konsumsi</div><div className="text-xl font-extrabold text-rose-600">Rp {annualConsumption.toLocaleString('id-ID')}</div></div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Rutin Pribadi</div><div className="text-xl font-extrabold text-rose-600">Rp {getAnnualPersonal().toLocaleString('id-ID')}</div></div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl sm:col-span-2"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Pengeluaran Usaha</div><div className="text-xl font-extrabold text-rose-600">Rp {businessData.annualExpense.toLocaleString('id-ID')}</div></div>
              </div>

              <div className={`p-6 rounded-3xl mb-8 ${neraca >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-red-600'} text-white shadow-xl`}>
                <div className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Neraca (Surplus/Defisit)</div>
                <div className="text-3xl font-black">Rp {neraca.toLocaleString('id-ID')}</div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleDownload} className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Unduh Data (CSV)
                </button>
                <button onClick={handleReset} className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Isi Sensus Baru
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 6 && (
          <div className="flex justify-between gap-4 mt-10">
            <button onClick={handlePrev} disabled={step === 1} className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border border-slate-200 transition-all ${step === 1 ? 'opacity-50 bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm active:scale-95'}`}>
              <ChevronLeft className="w-5 h-5" /> Kembali
            </button>
            <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl py-3.5 font-bold transition-all active:scale-95">
              Lanjut <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

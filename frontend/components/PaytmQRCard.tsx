export function PaytmQRCard() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#00BAF2]/30 bg-gradient-to-r from-[#002252] to-[#001738] p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white p-1 shadow-inner">
          {/* Stylized Paytm QR representation */}
          <div className="flex size-full flex-col justify-between rounded-lg bg-[#001738] p-1 text-[8px] font-mono font-bold text-[#00BAF2]">
            <div className="flex justify-between">
              <span className="size-2.5 rounded-sm bg-[#00BAF2]" />
              <span className="size-2.5 rounded-sm bg-[#00BAF2]" />
            </div>
            <div className="text-center text-[7px] font-black text-white">Paytm</div>
            <div className="flex justify-between">
              <span className="size-2.5 rounded-sm bg-[#00BAF2]" />
              <span className="size-2.5 rounded-sm bg-white" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">पेटीएम ऑल-इन-वन क्यूआर (All-in-One QR)</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              0% शुल्क (₹2,000 तक)
            </span>
          </div>
          <p className="text-xs text-blue-200/80">
            Google Pay, PhonePe, Paytm, BHIM या किसी भी UPI ऐप से भुगतान स्वीकार करें।
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-xl border border-[#00BAF2]/30 bg-[#001738] px-3.5 py-1.5 text-center">
          <span className="block text-[10px] text-blue-300">दैनिक बैंक निपटान</span>
          <span className="block text-xs font-bold text-emerald-400">सुबह 7:00 बजे ऑटो-क्रेडिट</span>
        </div>
      </div>
    </div>
  );
}


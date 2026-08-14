import React from 'react';
import { Printer, X, Download } from 'lucide-react';

export default function PrintModal({ printItem, onClose, kiosk = false }) {
  if (!printItem) return null;

  const handleDirectPrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = printItem.imageUrl;
    a.download = `${printItem.type || 'creative'}_print_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4 ${
      kiosk ? 'overflow-hidden' : 'overflow-y-auto'
    }`}>

      <div className="hidden print:block print:w-full print:h-full print:p-8 print:bg-white print:text-black">
        <div className="text-center mb-6 border-b-2 border-ochre pb-4">
          <h1 className="text-3xl font-serif font-bold text-charcoal">{printItem.title}</h1>
          <p className="text-sm text-forest mt-1">{printItem.metadata}</p>
        </div>

        <div className="flex justify-center my-6">
          <img src={printItem.imageUrl} alt={printItem.title} className="max-h-[600px] object-contain rounded-xl border border-charcoal" />
        </div>

        <div className="text-center text-xs text-forest mt-8 border-t border-forest/20 pt-4">
          Сгенерировано в сервисе Творчество Прикамья • Печать высокого качества
        </div>
      </div>

      <div className={`relative paper-card border border-forest/15 rounded-2xl max-w-2xl w-full overflow-hidden print:hidden ${
        kiosk ? 'max-h-[90dvh]' : ''
      }`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/15 bg-linen/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-burgundy flex items-center justify-center text-linen">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink">Печать</h2>
              <p className="text-xs text-forest">Скачайте файл или отправьте на принтер</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-forest hover:text-ink hover:bg-linen transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-linen border border-forest/15">
            <img
              src={printItem.imageUrl}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover border border-forest/20 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-sm text-ink">{printItem.title}</h3>
              <p className="text-xs text-forest mt-1 line-clamp-2">{printItem.metadata}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDirectPrint}
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-linen border border-ochre/40 hover:border-ochre text-charcoal transition-colors group"
            >
              <Printer className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Печать на принтере</span>
              <span className="text-[11px] text-forest text-center">Открыть диалоговое окно печати браузера</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-linen border border-forest/25 hover:border-forest text-charcoal transition-colors group"
            >
              <Download className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Скачать HD PNG</span>
              <span className="text-[11px] text-forest text-center">Сохранить файл изображения в максимальном качестве</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

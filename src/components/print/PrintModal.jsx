import React, { useState } from 'react';
import { sendToTelegramBot, sendToEmail, getTelegramQrCodeUrl, getTelegramConfig } from '../../services/telegramService';
import { Send, Mail, Printer, CheckCircle, X, QrCode, AlertCircle, Download, ExternalLink } from 'lucide-react';

export default function PrintModal({ printItem, onClose }) {
  const [activeTab, setActiveTab] = useState('telegram'); // 'telegram' | 'email' | 'direct'
  const [telegramRecipient, setTelegramRecipient] = useState('@my_family_print');
  const [emailAddress, setEmailAddress] = useState('family.print@example.com');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  if (!printItem) return null;

  const botConfig = getTelegramConfig();
  const qrUrl = getTelegramQrCodeUrl(botConfig.botUsername, 'print_job_1');

  const handleSendTelegram = async (e) => {
    e.preventDefault();
    if (!telegramRecipient.trim()) return;

    setIsSending(true);
    setSendStatus(null);

    const res = await sendToTelegramBot({
      imageBase64: printItem.imageUrl,
      recipient: telegramRecipient,
      title: printItem.title,
      metadata: printItem.metadata
    });

    setIsSending(false);
    setSendStatus(res);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailAddress.trim()) return;

    setIsSending(true);
    setSendStatus(null);

    const res = await sendToEmail({
      imageBase64: printItem.imageUrl,
      email: emailAddress,
      title: printItem.title,
      metadata: printItem.metadata
    });

    setIsSending(false);
    setSendStatus(res);
  };

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
    <div className="fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="hidden print:block print:w-full print:h-full print:p-8 print:bg-white print:text-black">
        <div className="text-center mb-6 border-b-2 border-ochre pb-4">
          <h1 className="text-3xl font-serif font-bold text-charcoal">{printItem.title}</h1>
          <p className="text-sm text-forest mt-1">{printItem.metadata}</p>
        </div>

        <div className="flex justify-center my-6">
          <img src={printItem.imageUrl} alt={printItem.title} className="max-h-[600px] object-contain rounded-xl border border-charcoal" />
        </div>

        <div className="text-center text-xs text-forest mt-8 border-t border-forest/20 pt-4">
          Сгенерировано в сервисе Прикамья (OpenRoad Engine) • Печать высокого качества
        </div>
      </div>

      <div className="relative paper-card border border-forest/15 rounded-2xl max-w-2xl w-full overflow-hidden print:hidden">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/15 bg-linen/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-burgundy flex items-center justify-center text-linen">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink">Отправка на печать</h2>
              <p className="text-xs text-forest">Выберите удобный способ отправки макета</p>
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

          <div className="grid grid-cols-3 gap-2 bg-linen p-1.5 rounded-xl border border-forest/15 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('telegram'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                activeTab === 'telegram'
                  ? 'bg-forest text-linen'
                  : 'text-forest hover:text-ink'
              }`}
            >
              <Send className="w-4 h-4" />
              Telegram-бот (Основной)
            </button>

            <button
              onClick={() => { setActiveTab('email'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                activeTab === 'email'
                  ? 'bg-burgundy text-linen'
                  : 'text-forest hover:text-ink'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email (Резервный)
            </button>

            <button
              onClick={() => { setActiveTab('direct'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                activeTab === 'direct'
                  ? 'bg-ochre text-ink font-bold'
                  : 'text-forest hover:text-ink'
              }`}
            >
              <Printer className="w-4 h-4" />
              Скачать / Печать
            </button>
          </div>

          {activeTab === 'telegram' && (
            <div className="space-y-4">
              <form onSubmit={handleSendTelegram} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1.5">
                    Telegram username или телефон для отправки в бот печати:
                  </label>
                  <input
                    type="text"
                    value={telegramRecipient}
                    onChange={(e) => setTelegramRecipient(e.target.value)}
                    placeholder="@username или +79000000000"
                    className="w-full px-4 py-3 rounded-xl bg-linen border border-forest/25 text-ink text-sm focus:outline-none focus:border-ochre"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-forest hover:bg-charcoal text-linen font-bold text-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Отправка в Telegram...' : 'Отправить в Telegram-бот печати'}
                </button>
              </form>

              <div className="p-4 rounded-xl bg-linen border border-forest/15 flex items-center gap-4">
                <img src={qrUrl} alt="Telegram Bot QR Code" className="w-24 h-24 rounded-xl border border-forest/20" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> Сканировать со смартфона
                  </div>
                  <p className="text-forest">
                    Откройте камеру или Telegram для прямого перехода в бот <span className="text-ink font-mono">@{botConfig.botUsername}</span>
                  </p>
                  <a
                    href={`https://t.me/${botConfig.botUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-charcoal hover:text-ochre hover:underline pt-1"
                  >
                    Открыть бота напрямую <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Ваш Email адрес для отправки макета на печать:
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-linen border border-forest/25 text-ink text-sm focus:outline-none focus:border-ochre"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-burgundy hover:bg-burgundy/90 text-linen font-bold text-sm transition-colors disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                {isSending ? 'Отправка почтой...' : 'Отправить файл макета на Email'}
              </button>
            </form>
          )}

          {activeTab === 'direct' && (
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
          )}

          {sendStatus && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
              sendStatus.success
                ? 'bg-forest/10 border-forest/30 text-charcoal'
                : 'bg-burgundy/10 border-burgundy/30 text-burgundy'
            }`}>
              {sendStatus.success ? (
                <CheckCircle className="w-5 h-5 text-forest flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-burgundy flex-shrink-0" />
              )}
              <div>
                <div className="font-bold">{sendStatus.message}</div>
                {sendStatus.botDeepLink && (
                  <a
                    href={sendStatus.botDeepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-ochre mt-1 inline-block"
                  >
                    Перейти по прямой ссылке в Telegram
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

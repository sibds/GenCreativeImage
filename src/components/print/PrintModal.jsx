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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Printable Document Frame (Visible during browser print dialog) */}
      <div className="hidden print:block print:w-full print:h-full print:p-8 print:bg-white print:text-black">
        <div className="text-center mb-6 border-b-2 border-amber-800 pb-4">
          <h1 className="text-3xl font-serif font-bold text-amber-900">{printItem.title}</h1>
          <p className="text-sm text-slate-600 mt-1">{printItem.metadata}</p>
        </div>

        <div className="flex justify-center my-6">
          <img src={printItem.imageUrl} alt={printItem.title} className="max-h-[600px] object-contain rounded-xl border border-amber-900" />
        </div>

        <div className="text-center text-xs text-slate-500 mt-8 border-t border-slate-300 pt-4">
          Сгенерировано в сервисе Прикамья (OpenRoad Engine) • Печать высокого качества
        </div>
      </div>

      {/* Modal Dialog for UI */}
      <div className="relative bg-slate-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden print:hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Отправка на печать</h2>
              <p className="text-xs text-slate-400">Выберите удобный способ отправки макета</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Image & Title Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <img
              src={printItem.imageUrl}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-sm text-white">{printItem.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{printItem.metadata}</p>
            </div>
          </div>

          {/* Delivery Channel Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('telegram'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                activeTab === 'telegram'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4 text-sky-300" />
              Telegram-бот (Основной)
            </button>

            <button
              onClick={() => { setActiveTab('email'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-300" />
              Email (Резервный)
            </button>

            <button
              onClick={() => { setActiveTab('direct'); setSendStatus(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                activeTab === 'direct'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4 text-amber-950" />
              Скачать / Печать
            </button>
          </div>

          {/* Tab 1: Telegram Bot Dispatch */}
          {activeTab === 'telegram' && (
            <div className="space-y-4">
              <form onSubmit={handleSendTelegram} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telegram username или телефон для отправки в бот печати:
                  </label>
                  <input
                    type="text"
                    value={telegramRecipient}
                    onChange={(e) => setTelegramRecipient(e.target.value)}
                    placeholder="@username или +79000000000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-sky-500/30 text-white text-sm focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Отправка в Telegram...' : 'Отправить в Telegram-бот печати'}
                </button>
              </form>

              {/* QR Code Section for Scanning with Telegram Mobile app */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <img src={qrUrl} alt="Telegram Bot QR Code" className="w-24 h-24 rounded-xl border border-rose-500/30" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> Сканировать со смартфона
                  </div>
                  <p className="text-slate-400">
                    Откройте камеру или Telegram для прямого перехода в бот <span className="text-white font-mono">@{botConfig.botUsername}</span>
                  </p>
                  <a
                    href={`https://t.me/${botConfig.botUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:underline pt-1"
                  >
                    Открыть бота напрямую <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Email Dispatch */}
          {activeTab === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ваш Email адрес для отправки макета на печать:
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                {isSending ? 'Отправка почтой...' : 'Отправить файл макета на Email'}
              </button>
            </form>
          )}

          {/* Tab 3: Direct Print & Download */}
          {activeTab === 'direct' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDirectPrint}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 text-amber-300 transition-all group"
              >
                <Printer className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Печать на принтере</span>
                <span className="text-[11px] text-slate-400 text-center">Открыть диалоговое окно печати браузера</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 transition-all group"
              >
                <Download className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Скачать HD PNG</span>
                <span className="text-[11px] text-slate-400 text-center">Сохранить файл изображения в максимальном качестве</span>
              </button>
            </div>
          )}

          {/* Notification status message */}
          {sendStatus && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
              sendStatus.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}>
              {sendStatus.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <div className="font-bold">{sendStatus.message}</div>
                {sendStatus.botDeepLink && (
                  <a
                    href={sendStatus.botDeepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-amber-300 mt-1 inline-block"
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

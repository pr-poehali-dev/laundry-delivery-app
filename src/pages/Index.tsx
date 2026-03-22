/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Icon from "@/components/ui/icon";

/* ──────────── DATA ──────────── */
const SERVICES = [
  {
    id: 1,
    title: "Химчистка верхней одежды",
    emoji: "🧥",
    gradient: "from-violet-600 to-purple-500",
    items: [
      { name: "Пальто", price: 1800 },
      { name: "Куртка", price: 1400 },
      { name: "Пуховик", price: 2200 },
      { name: "Шуба", price: 4500 },
      { name: "Плащ", price: 1600 },
    ],
  },
  {
    id: 2,
    title: "Чистка ковров",
    emoji: "🏡",
    gradient: "from-cyan-500 to-blue-500",
    items: [
      { name: "Ковёр до 4 м²", price: 900 },
      { name: "Ковёр 4–8 м²", price: 1600 },
      { name: "Ковёр 8–15 м²", price: 2800 },
      { name: "Ковёр >15 м²", price: 3800 },
      { name: "Ковровая дорожка", price: 700 },
    ],
  },
  {
    id: 3,
    title: "Деловые костюмы",
    emoji: "👔",
    gradient: "from-pink-600 to-rose-500",
    items: [
      { name: "Пиджак", price: 950 },
      { name: "Брюки", price: 650 },
      { name: "Костюм (2 пред.)", price: 1500 },
      { name: "Жилет", price: 550 },
      { name: "Смокинг", price: 2200 },
    ],
  },
  {
    id: 4,
    title: "Спецодежда и рабочая",
    emoji: "🦺",
    gradient: "from-orange-500 to-amber-400",
    items: [
      { name: "Комбинезон", price: 1100 },
      { name: "Спецкуртка", price: 900 },
      { name: "Спецбрюки", price: 700 },
      { name: "Халат", price: 500 },
      { name: "Медицинский костюм", price: 650 },
    ],
  },
];

const TIME_SLOTS = ["9:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–21:00"];

const ORDER_STATUSES = [
  { id: 1, label: "Заказ принят", icon: "CheckCircle", done: true, time: "14:32" },
  { id: 2, label: "Курьер выехал", icon: "Truck", done: true, time: "15:10" },
  { id: 3, label: "В чистке", icon: "Sparkles", done: true, time: "16:45" },
  { id: 4, label: "Готово к доставке", icon: "Package", done: false, time: "" },
  { id: 5, label: "Доставлено", icon: "Home", done: false, time: "" },
];

const MONTHS_RU = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

/* ──────────── MAIN ──────────── */
export default function App() {
  const [tab, setTab] = useState<"home"|"catalog"|"cart"|"track"|"profile">("home");
  const [cart, setCart] = useState<{serviceId:number;itemName:string;price:number;qty:number}[]>([]);
  const [expandedService, setExpandedService] = useState<number|null>(null);
  const [addedAnim, setAddedAnim] = useState<string|null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart"|"delivery"|"confirm">("cart");
  const [selectedDate, setSelectedDate] = useState<number|null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string|null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<{from:"user"|"support";text:string}[]>([
    { from:"support", text:"👋 Привет! Я готов помочь. Напишите ваш вопрос." }
  ]);
  const [profileTab, setProfileTab] = useState<"info"|"orders"|"support">("info");

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const deliveryCost = 350;
  const totalItems = cart.reduce((s,i) => s+i.qty, 0);
  const totalPrice = cart.reduce((s,i) => s+i.price*i.qty, 0);

  const addToCart = (serviceId:number, itemName:string, price:number) => {
    setCart(prev => {
      const ex = prev.find(i => i.serviceId===serviceId && i.itemName===itemName);
      if (ex) return prev.map(i => i.serviceId===serviceId && i.itemName===itemName ? {...i,qty:i.qty+1} : i);
      return [...prev,{serviceId,itemName,price,qty:1}];
    });
    setAddedAnim(itemName);
    setTimeout(()=>setAddedAnim(null),900);
  };

  const removeFromCart = (serviceId:number, itemName:string) => {
    setCart(prev => {
      const ex = prev.find(i => i.serviceId===serviceId && i.itemName===itemName);
      if (!ex) return prev;
      if (ex.qty===1) return prev.filter(i => !(i.serviceId===serviceId && i.itemName===itemName));
      return prev.map(i => i.serviceId===serviceId && i.itemName===itemName ? {...i,qty:i.qty-1} : i);
    });
  };

  const getQty = (serviceId:number, itemName:string) =>
    cart.find(i => i.serviceId===serviceId && i.itemName===itemName)?.qty ?? 0;

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory(prev=>[...prev,{from:"user",text:chatMsg}]);
    setChatMsg("");
    setTimeout(()=>{
      setChatHistory(prev=>[...prev,{from:"support",text:"Спасибо! Оператор ответит в течение 5 минут. Среднее время — 2 мин."}]);
    },1200);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const adjustedFirstDay = getFirstDayOfMonth(calYear, calMonth);

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setCheckoutStep("cart");
    setSelectedDate(null);
    setSelectedSlot(null);
    setTab("track");
  };

  return (
    <div className="min-h-screen bg-background font-nunito flex justify-center">
      <div className="w-full max-w-sm min-h-screen flex flex-col relative overflow-hidden">

        {/* Glow orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 max-w-sm overflow-hidden" style={{left:"50%",transform:"translateX(-50%)"}}>
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-20 left-10 w-64 h-64 rounded-full bg-pink-600/15 blur-3xl" />
        </div>

        <div className="flex-1 overflow-y-auto pb-24 relative z-10">
          {tab==="home"    && <HomeTab setTab={setTab} />}
          {tab==="catalog" && <CatalogTab services={SERVICES} expandedService={expandedService} setExpandedService={setExpandedService} addToCart={addToCart} removeFromCart={removeFromCart} getQty={getQty} addedAnim={addedAnim} />}
          {tab==="cart"    && <CartTab cart={cart} totalPrice={totalPrice} deliveryCost={deliveryCost} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} removeFromCart={removeFromCart} addToCart={addToCart} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} daysInMonth={daysInMonth} adjustedFirstDay={adjustedFirstDay} calMonth={calMonth} calYear={calYear} setCalMonth={setCalMonth} setCalYear={setCalYear} today={today} placeOrder={placeOrder} />}
          {tab==="track"   && <TrackTab orderPlaced={orderPlaced} />}
          {tab==="profile" && <ProfileTab profileTab={profileTab} setProfileTab={setProfileTab} chatOpen={chatOpen} setChatOpen={setChatOpen} chatHistory={chatHistory} chatMsg={chatMsg} setChatMsg={setChatMsg} sendChat={sendChat} />}
        </div>

        <BottomNav tab={tab} setTab={setTab} totalItems={totalItems} />

        {addedAnim && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
            <div className="glass-strong rounded-2xl px-5 py-3 flex items-center gap-2 shadow-2xl">
              <span className="text-lg">✅</span>
              <span className="text-sm font-bold text-white">Добавлено в корзину</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────── HOME ──────────── */
function HomeTab({ setTab }: { setTab:(t:any)=>void }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black gradient-text">Мобильная прачечная</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center">
          <span className="text-xl">🔔</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-6 animate-fade-in stagger-1">
        <img src="https://cdn.poehali.dev/projects/bf98e752-a3f3-498a-8b1c-b801034defad/files/90784008-b6c6-49ee-b33c-0eb73bb22e98.jpg" alt="Прачечная" className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-800/60 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-400/20 rounded-full px-3 py-1 w-fit mb-2">🚀 Доставка от 2 часов</span>
          <h2 className="text-white font-black text-xl leading-tight">Профессиональная<br/>химчистка</h2>
          <button onClick={()=>setTab("catalog")} className="mt-3 bg-brand-gradient text-white font-bold text-sm rounded-2xl px-5 py-2.5 w-fit shadow-lg shadow-violet-500/40 active:scale-95 transition-transform">
            Выбрать услугу →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in stagger-2">
        {[["⭐","4.9","Рейтинг"],["🧺","2000+","Заказов"],["⚡","2 ч","Доставка"]].map(([e,v,l])=>(
          <div key={l} className="glass rounded-2xl p-3 text-center">
            <div className="text-xl mb-1">{e}</div>
            <div className="font-black text-white text-sm">{v}</div>
            <div className="text-muted-foreground text-xs">{l}</div>
          </div>
        ))}
      </div>

      {/* Services quick */}
      <h3 className="font-black text-white text-lg mb-3 animate-fade-in stagger-3">Наши услуги</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          {emoji:"🧥",title:"Верхняя одежда",from:"от 1 400 ₽",gradient:"from-violet-600 to-purple-500",d:"stagger-3"},
          {emoji:"🏡",title:"Ковры",from:"от 900 ₽",gradient:"from-cyan-500 to-blue-500",d:"stagger-4"},
          {emoji:"👔",title:"Костюмы",from:"от 550 ₽",gradient:"from-pink-600 to-rose-500",d:"stagger-5"},
          {emoji:"🦺",title:"Спецодежда",from:"от 500 ₽",gradient:"from-orange-500 to-amber-400",d:"stagger-6"},
        ].map(s=>(
          <div key={s.title} className={`service-card glass rounded-2xl p-4 cursor-pointer animate-fade-in ${s.d}`} onClick={()=>setTab("catalog")}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg`}>{s.emoji}</div>
            <div className="font-bold text-white text-sm leading-tight">{s.title}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.from}</div>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div className="bg-brand-gradient-2 rounded-3xl p-5 mb-4 animate-fade-in stagger-4 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-7xl opacity-20 animate-spin-slow">✨</div>
        <p className="text-xs font-bold text-pink-200 mb-1">АКЦИЯ</p>
        <h3 className="text-white font-black text-lg leading-tight">Первый заказ со скидкой <span className="text-yellow-300">20%</span></h3>
        <p className="text-pink-200 text-xs mt-1">Промокод: <span className="font-bold text-white">CLEAN20</span></p>
      </div>

      {/* Delivery */}
      <div className="glass rounded-2xl p-4 animate-fade-in stagger-5">
        <h3 className="font-bold text-white text-sm mb-3">🚗 Условия доставки</h3>
        <div className="space-y-2">
          {[["Забор вещей","350 ₽"],["Возврат вещей","350 ₽"],["Бесплатно от заказа","3 000 ₽"]].map(([k,v])=>(
            <div key={k} className="flex justify-between"><span className="text-muted-foreground text-xs">{k}</span><span className="text-white text-xs font-bold">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────── CATALOG ──────────── */
function CatalogTab({services,expandedService,setExpandedService,addToCart,removeFromCart,getQty,addedAnim}:any) {
  return (
    <div className="px-4 pt-6">
      <div className="mb-6 animate-fade-in">
        <h2 className="text-2xl font-black text-white">Каталог услуг</h2>
        <p className="text-muted-foreground text-xs mt-0.5">Нажмите на категорию, чтобы добавить</p>
      </div>
      <div className="space-y-3">
        {services.map((svc:any, idx:number)=>(
          <div key={svc.id} className={`animate-fade-in stagger-${Math.min(idx+1,6)}`}>
            <div className="service-card glass rounded-2xl p-4 cursor-pointer flex items-center justify-between" onClick={()=>setExpandedService(expandedService===svc.id?null:svc.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center text-2xl shadow-lg`}>{svc.emoji}</div>
                <div>
                  <div className="font-bold text-white text-sm">{svc.title}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{svc.items.length} позиций</div>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${expandedService===svc.id?"rotate-180":""}`}>
                <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
              </div>
            </div>
            {expandedService===svc.id && (
              <div className="mt-2 space-y-2 animate-slide-up">
                {svc.items.map((item:any)=>{
                  const qty = getQty(svc.id,item.name);
                  const isAdded = addedAnim===item.name;
                  return (
                    <div key={item.name} className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-semibold">{item.name}</div>
                        <div className={`font-black text-sm bg-gradient-to-r ${svc.gradient} bg-clip-text text-transparent`}>{item.price.toLocaleString()} ₽</div>
                      </div>
                      {qty===0 ? (
                        <button onClick={()=>addToCart(svc.id,item.name,item.price)} className={`bg-gradient-to-r ${svc.gradient} text-white text-xs font-bold rounded-xl px-4 py-2 shadow-lg active:scale-95 transition-all ${isAdded?"scale-95":""}`}>
                          + Добавить
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button onClick={()=>removeFromCart(svc.id,item.name)} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white font-bold active:scale-90 transition-transform">—</button>
                          <span className="text-white font-black text-sm w-4 text-center">{qty}</span>
                          <button onClick={()=>addToCart(svc.id,item.name,item.price)} className={`w-8 h-8 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center text-white font-bold active:scale-90 transition-transform`}>+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="h-4" />
    </div>
  );
}

/* ──────────── CART ──────────── */
function CartTab({cart,totalPrice,deliveryCost,checkoutStep,setCheckoutStep,removeFromCart,addToCart,selectedDate,setSelectedDate,selectedSlot,setSelectedSlot,daysInMonth,adjustedFirstDay,calMonth,calYear,setCalMonth,setCalYear,today,placeOrder}:any) {
  const isFree = totalPrice >= 3000;
  const finalDelivery = isFree ? 0 : deliveryCost;
  const finalTotal = totalPrice + finalDelivery * 2;

  if (cart.length===0 && checkoutStep==="cart") {
    return (
      <div className="px-4 pt-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4 animate-float">🧺</div>
        <h2 className="text-xl font-black text-white mb-2">Корзина пуста</h2>
        <p className="text-muted-foreground text-sm text-center">Добавьте услуги из каталога</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      {/* Steps */}
      <div className="flex items-center gap-1 mb-6 animate-fade-in">
        {["Корзина","Доставка","Подтверждение"].map((step,i)=>{
          const keys=["cart","delivery","confirm"];
          const isActive=checkoutStep===keys[i];
          const isDone=(checkoutStep==="delivery"&&i===0)||(checkoutStep==="confirm"&&i<=1);
          return (
            <div key={step} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className={`flex items-center gap-1.5 ${isActive||isDone?"opacity-100":"opacity-40"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${isActive?"bg-brand-gradient text-white":isDone?"bg-green-500 text-white":"glass text-muted-foreground"}`}>
                  {isDone?"✓":i+1}
                </div>
                <span className={`text-xs font-bold ${isActive?"text-white":"text-muted-foreground"}`}>{step}</span>
              </div>
              {i<2&&<div className="flex-1 h-px bg-border ml-1"/>}
            </div>
          );
        })}
      </div>

      {checkoutStep==="cart" && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-black text-white mb-4">Ваш заказ</h2>
          <div className="space-y-3 mb-5">
            {cart.map((item:any)=>(
              <div key={`${item.serviceId}-${item.itemName}`} className="glass rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-bold">{item.itemName}</div>
                  <div className="text-muted-foreground text-xs">{item.price.toLocaleString()} ₽ × {item.qty}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-sm">{(item.price*item.qty).toLocaleString()} ₽</span>
                  <button onClick={()=>removeFromCart(item.serviceId,item.itemName)} className="w-7 h-7 rounded-xl bg-red-500/20 flex items-center justify-center active:scale-90 transition-transform">
                    <Icon name="X" size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-4 mb-5 space-y-2">
            {[["Услуги",`${totalPrice.toLocaleString()} ₽`,"text-white"],["Забор",isFree?"Бесплатно":`${finalDelivery} ₽`,isFree?"text-green-400":"text-white"],["Возврат",isFree?"Бесплатно":`${finalDelivery} ₽`,isFree?"text-green-400":"text-white"]].map(([k,v,c])=>(
              <div key={k} className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className={`font-semibold ${c}`}>{v}</span></div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-white font-bold">Итого</span>
              <span className="font-black text-lg gradient-text">{finalTotal.toLocaleString()} ₽</span>
            </div>
          </div>
          {!isFree&&(
            <div className="glass rounded-2xl p-3 mb-4 flex items-center gap-3">
              <span className="text-lg">💡</span>
              <p className="text-xs text-muted-foreground">Добавьте ещё на <span className="text-white font-bold">{(3000-totalPrice).toLocaleString()} ₽</span> — доставка бесплатно!</p>
            </div>
          )}
          <button onClick={()=>setCheckoutStep("delivery")} className="w-full bg-brand-gradient text-white font-black text-base rounded-2xl py-4 shadow-lg shadow-violet-500/30 active:scale-98 transition-transform animate-pulse-glow">
            Выбрать доставку →
          </button>
        </div>
      )}

      {checkoutStep==="delivery" && (
        <DeliveryStep selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} daysInMonth={daysInMonth} adjustedFirstDay={adjustedFirstDay} calMonth={calMonth} calYear={calYear} setCalMonth={setCalMonth} setCalYear={setCalYear} today={today} onNext={()=>setCheckoutStep("confirm")} onBack={()=>setCheckoutStep("cart")} />
      )}

      {checkoutStep==="confirm" && (
        <ConfirmStep cart={cart} totalPrice={totalPrice} finalTotal={finalTotal} finalDelivery={finalDelivery} isFree={isFree} selectedDate={selectedDate} selectedSlot={selectedSlot} calMonth={calMonth} calYear={calYear} onBack={()=>setCheckoutStep("delivery")} onPlace={placeOrder} />
      )}
    </div>
  );
}

/* ──────────── DELIVERY STEP ──────────── */
function DeliveryStep({selectedDate,setSelectedDate,selectedSlot,setSelectedSlot,daysInMonth,adjustedFirstDay,calMonth,calYear,setCalMonth,setCalYear,today,onNext,onBack}:any) {
  const prevMonth=()=>{ if(calMonth===0){setCalMonth(11);setCalYear((y:number)=>y-1);}else setCalMonth((m:number)=>m-1); };
  const nextMonth=()=>{ if(calMonth===11){setCalMonth(0);setCalYear((y:number)=>y+1);}else setCalMonth((m:number)=>m+1); };
  const isPast=(day:number)=>new Date(calYear,calMonth,day)<new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const isToday=(day:number)=>calYear===today.getFullYear()&&calMonth===today.getMonth()&&day===today.getDate();
  const weekDays=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 glass rounded-xl flex items-center justify-center"><Icon name="ChevronLeft" size={18} className="text-white" /></button>
        <h2 className="text-xl font-black text-white">Дата доставки</h2>
      </div>

      <div className="glass rounded-3xl p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl glass flex items-center justify-center active:scale-90 transition-transform"><Icon name="ChevronLeft" size={16} className="text-white" /></button>
          <span className="text-white font-bold text-sm">{MONTHS_RU[calMonth]} {calYear}</span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl glass flex items-center justify-center active:scale-90 transition-transform"><Icon name="ChevronRight" size={16} className="text-white" /></button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d=><div key={d} className="text-center text-xs text-muted-foreground font-bold py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length:adjustedFirstDay}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const day=i+1;
            const past=isPast(day);
            const tod=isToday(day);
            const sel=selectedDate===day;
            return (
              <button key={day} disabled={past} onClick={()=>setSelectedDate(day)}
                className={`calendar-day aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all
                  ${past?"opacity-25 cursor-not-allowed text-muted-foreground":sel?"selected text-white":tod?"glass border border-violet-500 text-violet-400":"text-white hover:glass"}`}>
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="text-white font-bold text-sm mb-3">Время доставки</h3>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {TIME_SLOTS.map(slot=>(
          <button key={slot} onClick={()=>setSelectedSlot(slot)}
            className={`rounded-2xl py-3 text-sm font-bold transition-all active:scale-95 ${selectedSlot===slot?"bg-brand-gradient text-white shadow-lg shadow-violet-500/30":"glass text-muted-foreground"}`}>
            🕐 {slot}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-3 mb-5 flex items-start gap-3">
        <span className="text-lg mt-0.5">📦</span>
        <p className="text-xs text-muted-foreground">Курьер заберёт вещи и вернёт их в выбранный промежуток. Срок чистки 1–3 дня.</p>
      </div>

      <button disabled={!selectedDate||!selectedSlot} onClick={onNext}
        className={`w-full text-white font-black text-base rounded-2xl py-4 transition-all ${selectedDate&&selectedSlot?"bg-brand-gradient shadow-lg shadow-violet-500/30 active:scale-98 animate-pulse-glow":"bg-secondary opacity-50 cursor-not-allowed"}`}>
        Далее →
      </button>
    </div>
  );
}

/* ──────────── CONFIRM STEP ──────────── */
function ConfirmStep({cart,totalPrice,finalTotal,finalDelivery,isFree,selectedDate,selectedSlot,calMonth,calYear,onBack,onPlace}:any) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 glass rounded-xl flex items-center justify-center"><Icon name="ChevronLeft" size={18} className="text-white" /></button>
        <h2 className="text-xl font-black text-white">Подтверждение</h2>
      </div>
      <div className="glass rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-sm mb-3">📋 Состав заказа</h3>
        <div className="space-y-2">
          {cart.map((item:any)=>(
            <div key={`${item.serviceId}-${item.itemName}`} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.itemName} × {item.qty}</span>
              <span className="text-white font-semibold">{(item.price*item.qty).toLocaleString()} ₽</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-sm mb-3">🗓 Доставка</h3>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Дата</span><span className="text-white font-semibold">{selectedDate} {MONTHS_RU[calMonth]} {calYear}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Время</span><span className="text-white font-semibold">{selectedSlot}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Доставка (×2)</span><span className={isFree?"text-green-400 font-bold":"text-white font-semibold"}>{isFree?"Бесплатно":`${finalDelivery*2} ₽`}</span></div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-5 flex items-center justify-between">
        <span className="text-white font-bold">Итого к оплате</span>
        <span className="text-2xl font-black gradient-text">{finalTotal.toLocaleString()} ₽</span>
      </div>
      <button onClick={onPlace} className="w-full bg-brand-gradient text-white font-black text-base rounded-2xl py-4 shadow-xl shadow-violet-500/40 active:scale-98 transition-transform animate-pulse-glow">
        ✅ Подтвердить заказ
      </button>
    </div>
  );
}

/* ──────────── TRACK ──────────── */
function TrackTab({orderPlaced}:{orderPlaced:boolean}) {
  if (!orderPlaced) {
    return (
      <div className="px-4 pt-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4 animate-float">📦</div>
        <h2 className="text-xl font-black text-white mb-2">Нет активных заказов</h2>
        <p className="text-muted-foreground text-sm text-center">Оформите заказ в каталоге</p>
      </div>
    );
  }
  return (
    <div className="px-4 pt-6">
      <h2 className="text-2xl font-black text-white mb-1 animate-fade-in">Статус заказа</h2>
      <p className="text-muted-foreground text-sm mb-5 animate-fade-in">№ CU-2024-0387</p>

      <div className="glass rounded-3xl p-5 mb-5 animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-bold text-sm">Прогресс</span>
          <span className="text-violet-400 font-black text-sm">60%</span>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-3/5 bg-brand-gradient rounded-full" />
        </div>
        <p className="text-muted-foreground text-xs mt-2">Ваши вещи проходят чистку ✨</p>
      </div>

      <div className="glass rounded-3xl p-5 mb-5 animate-fade-in stagger-2">
        <div className="relative">
          <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent" />
          <div className="space-y-5">
            {ORDER_STATUSES.map((step,idx)=>(
              <div key={step.id} className={`flex items-start gap-4 transition-opacity ${!step.done&&idx>2?"opacity-40":""}`}>
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done?"bg-brand-gradient shadow-lg shadow-violet-500/40":"glass border border-border"}`}>
                  <Icon name={step.icon as any} size={14} className={step.done?"text-white":"text-muted-foreground"} fallback="Circle" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className={`text-sm font-bold ${step.done?"text-white":"text-muted-foreground"}`}>{step.label}</div>
                  {step.time&&<div className="text-xs text-muted-foreground mt-0.5">{step.time}</div>}
                  {idx===2&&step.done&&(
                    <div className="mt-2 glass rounded-xl px-3 py-1.5 inline-block">
                      <span className="text-xs text-violet-400 font-semibold">⏱ Готово через ~4 часа</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-fade-in stagger-3">
        <div className="glass rounded-2xl p-4">
          <div className="text-muted-foreground text-xs mb-1">Курьер</div>
          <div className="text-white font-bold text-sm">Алексей К.</div>
          <div className="text-muted-foreground text-xs">⭐ 4.95</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-muted-foreground text-xs mb-1">Возврат</div>
          <div className="text-white font-bold text-sm">Завтра</div>
          <div className="text-violet-400 text-xs font-semibold">15:00–18:00</div>
        </div>
      </div>
      <div className="h-4"/>
    </div>
  );
}

/* ──────────── PROFILE ──────────── */
function ProfileTab({profileTab,setProfileTab,chatOpen,setChatOpen,chatHistory,chatMsg,setChatMsg,sendChat}:any) {
  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-brand-gradient flex items-center justify-center text-3xl shadow-lg shadow-violet-500/40">👤</div>
        <div>
          <h2 className="text-white font-black text-xl">Иван Петров</h2>
          <p className="text-muted-foreground text-sm">ivan@email.com</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-violet-500/20 text-violet-400 rounded-full px-2 py-0.5 font-bold">Premium</span>
            <span className="text-xs text-muted-foreground">3 заказа</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 p-1 glass rounded-2xl animate-fade-in stagger-1">
        {[["info","Профиль"],["orders","Заказы"],["support","Поддержка"]].map(([key,label])=>(
          <button key={key} onClick={()=>setProfileTab(key)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${profileTab===key?"bg-brand-gradient text-white shadow-lg":"text-muted-foreground"}`}>{label}</button>
        ))}
      </div>

      {profileTab==="info" && (
        <div className="space-y-3 animate-fade-in">
          {[["📱","Телефон","89069844540"],["🏠","Адрес","ул. Усова 13А"],["🎂","Бонусы","320 баллов"],["📅","С нами с","Январь 2024"]].map(([icon,label,val])=>(
            <div key={String(label)} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div><div className="text-muted-foreground text-xs">{label}</div><div className="text-white font-semibold text-sm">{val}</div></div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          ))}
          <button className="w-full glass rounded-2xl p-4 text-red-400 font-bold text-sm mt-2 active:scale-98 transition-transform">Выйти из аккаунта</button>
        </div>
      )}

      {profileTab==="orders" && (
        <div className="space-y-3 animate-fade-in">
          {[
            {id:"CU-387",status:"В чистке",price:"4 800 ₽",date:"22 мар",color:"text-violet-400",badge:"🔄"},
            {id:"CU-301",status:"Доставлено",price:"2 100 ₽",date:"15 мар",color:"text-green-400",badge:"✅"},
            {id:"CU-245",status:"Доставлено",price:"5 600 ₽",date:"3 мар",color:"text-green-400",badge:"✅"},
          ].map(order=>(
            <div key={order.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>{order.badge}</span><span className="text-white font-bold text-sm">№ {order.id}</span></div>
                <span className="text-white font-black text-sm">{order.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${order.color}`}>{order.status}</span>
                <span className="text-muted-foreground text-xs">{order.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {profileTab==="support" && (
        <div className="space-y-3 animate-fade-in">
          {[
            {icon:"MessageCircle",label:"Онлайн-чат",sub:"Среднее время ответа: 2 мин",action:()=>setChatOpen(true)},
            {icon:"Phone",label:"Позвонить нам",sub:"+7 (800) 555-77-99",action:()=>{}},
            {icon:"HelpCircle",label:"FAQ",sub:"Частые вопросы",action:()=>{}},
          ].map(item=>(
            <button key={item.label} onClick={item.action} className="w-full glass rounded-2xl p-4 flex items-center justify-between active:scale-98 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center">
                  <Icon name={item.icon as any} size={18} className="text-white" fallback="Circle" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">{item.label}</div>
                  <div className="text-muted-foreground text-xs">{item.sub}</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col max-w-sm mx-auto" style={{left:"50%",transform:"translateX(-50%)"}}>
          <div className="flex-1 bg-background/70 backdrop-blur-sm" onClick={()=>setChatOpen(false)}/>
          <div className="glass-strong rounded-t-3xl flex flex-col" style={{maxHeight:"80vh"}}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center"><span className="text-lg">💬</span></div>
                <div>
                  <div className="text-white font-bold text-sm">Поддержка CleanUp</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/><span className="text-xs text-green-400">Онлайн</span></div>
                </div>
              </div>
              <button onClick={()=>setChatOpen(false)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
                <Icon name="X" size={16} className="text-white"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{maxHeight:"50vh"}}>
              {chatHistory.map((msg:any,i:number)=>(
                <div key={i} className={`flex ${msg.from==="user"?"justify-end":"justify-start"}`}>
                  <div className={`rounded-2xl px-4 py-3 max-w-[75%] text-sm ${msg.from==="user"?"bg-brand-gradient text-white rounded-tr-sm":"glass text-white rounded-tl-sm"}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="p-4 flex items-center gap-3">
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Написать сообщение..." className="flex-1 glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground outline-none border-0 focus:ring-1 focus:ring-violet-500"/>
              <button onClick={sendChat} className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-violet-500/40 active:scale-90 transition-transform">
                <Icon name="Send" size={16} className="text-white"/>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-4"/>
    </div>
  );
}

/* ──────────── BOTTOM NAV ──────────── */
function BottomNav({tab,setTab,totalItems}:{tab:string;setTab:(t:any)=>void;totalItems:number}) {
  const items=[
    {key:"home",icon:"Home",label:"Главная"},
    {key:"catalog",icon:"Grid3X3",label:"Каталог"},
    {key:"cart",icon:"ShoppingBag",label:"Корзина"},
    {key:"track",icon:"MapPin",label:"Статус"},
    {key:"profile",icon:"User",label:"Профиль"},
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bottom-nav-blur z-40">
      <div className="flex items-center justify-around px-2 py-3">
        {items.map(item=>{
          const active=tab===item.key;
          return (
            <button key={item.key} onClick={()=>setTab(item.key)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all active:scale-90 relative">
              {item.key==="cart"&&totalItems>0&&(
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-black z-10 animate-bounce-in">{totalItems}</div>
              )}
              <div className={`p-1.5 rounded-xl transition-all ${active?"bg-brand-gradient shadow-lg shadow-violet-500/40":""}`}>
                <Icon name={item.icon as any} size={20} className={active?"text-white":"text-muted-foreground"} fallback="Circle"/>
              </div>
              <span className={`text-[10px] font-bold transition-colors ${active?"text-white":"text-muted-foreground"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
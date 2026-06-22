(function(){

const WIDGET_HTML = `
<div id="epChatOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9998" onclick="window.epChat.close()"></div>
<div id="epChatWidget" style="position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Inter',system-ui,sans-serif">

  <!-- Toggle Button -->
  <button id="epChatToggle" onclick="window.epChat.toggle()" style="width:60px;height:60px;border-radius:50%;border:none;background:linear-gradient(135deg,#C4175A,#891AAE);color:#fff;cursor:pointer;box-shadow:0 6px 28px rgba(196,23,90,.35);display:flex;align-items:center;justify-content:center;transition:all .3s;position:relative">
    <svg id="epChatIconOpen" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
    <svg id="epChatIconClose" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    <span id="epChatBadge" style="position:absolute;top:-2px;right:-2px;width:18px;height:18px;border-radius:50%;background:#22c55e;border:2.5px solid #fff;display:block"></span>
  </button>

  <!-- Chat Window -->
  <div id="epChatWindow" style="display:none;position:absolute;bottom:76px;right:0;width:380px;max-height:540px;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.18);overflow:hidden;flex-direction:column;animation:epSlideUp .3s ease">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#C4175A,#891AAE);color:#fff;padding:18px 20px;display:flex;align-items:center;gap:12px">
      <div style="width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
      </div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:15px">e.paylaşım Destek</div>
        <div style="font-size:12px;opacity:.85;display:flex;align-items:center;gap:5px">
          <span style="width:7px;height:7px;border-radius:50%;background:#22c55e;display:inline-block"></span>
          <span id="epChatStatus">Çevrimiçi — ortalama yanıt 2 dk</span>
        </div>
      </div>
      <button onclick="window.epChat.close()" style="background:rgba(255,255,255,.15);border:none;color:#fff;width:32px;height:32px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px">&times;</button>
    </div>

    <!-- Messages -->
    <div id="epChatMessages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:280px;max-height:340px;background:#f8fafc"></div>

    <!-- Typing -->
    <div id="epTyping" style="display:none;padding:0 16px 8px">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;border-bottom-left-radius:4px;padding:10px 14px;display:inline-flex;gap:4px;align-self:flex-start">
        <span class="ep-dot" style="width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:epDot 1.2s infinite"></span>
        <span class="ep-dot" style="width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:epDot 1.2s infinite .2s"></span>
        <span class="ep-dot" style="width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:epDot 1.2s infinite .4s"></span>
      </div>
    </div>

    <!-- Quick Replies -->
    <div id="epQuickReplies" style="padding:0 16px;display:flex;flex-wrap:wrap;gap:6px"></div>

    <!-- Input -->
    <div id="epChatInput" style="padding:12px 16px;border-top:1px solid #e2e8f0;display:flex;align-items:center;gap:8px;background:#fff">
      <input id="epMsgInput" type="text" placeholder="Mesajınızı yazın..." style="flex:1;border:1.5px solid #e2e8f0;border-radius:12px;padding:10px 14px;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s" onkeydown="if(event.key==='Enter')window.epChat.send()"/>
      <button onclick="window.epChat.send()" style="width:40px;height:40px;border-radius:12px;border:none;background:linear-gradient(135deg,#C4175A,#891AAE);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
      </button>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:6px;font-size:10px;color:#94a3b8;background:#fff;border-top:1px solid #f1f5f9">Powered by <strong style="color:#C4175A">e.paylaşım</strong></div>
  </div>
</div>`;

const WIDGET_CSS = `
@keyframes epSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes epDot{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}
#epChatToggle:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(196,23,90,.4)}
#epMsgInput:focus{border-color:#C4175A !important}
#epChatMessages::-webkit-scrollbar{width:4px}
#epChatMessages::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
@media(max-width:480px){
  #epChatWindow{width:calc(100vw - 24px) !important;right:-12px !important;bottom:70px !important;max-height:70vh !important}
}
.ep-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.6;word-wrap:break-word;animation:epSlideUp .25s ease}
.ep-msg.bot{background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:4px;align-self:flex-start;color:#1a1a2e}
.ep-msg.user{background:linear-gradient(135deg,#C4175A,#891AAE);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
.ep-msg .ep-time{font-size:10px;opacity:.5;margin-top:3px;display:block}
.ep-qr{background:#fff;border:1.5px solid #e2e8f0;border-radius:100px;padding:7px 14px;font-size:12px;font-weight:500;color:#1a1a2e;cursor:pointer;transition:all .2s;font-family:inherit}
.ep-qr:hover{border-color:#C4175A;color:#C4175A;background:#FCE8F0}
`;

const FAQ = [
  {k:['kampanya','nasıl','oluştur','başla','aç'], a:'Kampanya oluşturmak çok kolay! "Hemen Başla" butonuna tıklayın, ücretsiz hesap oluşturun ve hediye hedefinizi belirleyin. 30 saniyede hazır!'},
  {k:['ödeme','güvenli','kredi','kart','ssl'], a:'Tüm ödemeler 256-bit SSL şifreleme ve 3D Secure ile korunur. Kredi kartı bilgileriniz PCI DSS standartlarına uygun işlenir ve sunucularımızda saklanmaz.'},
  {k:['hediye','kart','çeki','birikim','hedef','tamamlan'], a:'Kampanya hedefine ulaşılamazsa toplanan birikimler otomatik olarak e.paylaşım Hediye Kartı\'na dönüşür. Anlaşmalı mağazalarda süresiz kullanabilirsiniz. Hiçbir katkı boşa gitmez!'},
  {k:['ücret','fiyat','komisyon','para','maliyet'], a:'İlk kampanyanız tamamen ücretsizdir — komisyon dahil hiçbir ücret alınmaz! Sonraki kampanyalarda yalnızca başarıyla tamamlanan katkılardan %5 platform komisyonu kesilir. Aylık ücret veya abonelik yoktur.'},
  {k:['iade','iptal','geri'], a:'Kampanya iptal edilirse veya hedefe ulaşılamazsa, birikimler e.paylaşım Hediye Kartı\'na dönüşür. Detaylar için kullanım şartlarımızı inceleyebilirsiniz.'},
  {k:['kvkk','gizlilik','veri','kişisel'], a:'Kişisel verileriniz KVKK mevzuatına tam uygun şekilde işlenmektedir. Verileriniz Türkiye\'deki veri merkezlerinde güvenle saklanır.'},
  {k:['iletişim','telefon','email','adres','ulaş'], a:'Bize selma.sahinmolla@gmail.com adresinden veya bu canlı destek üzerinden ulaşabilirsiniz. Her zaman yardımcı olmaktan mutluluk duyarız!'},
  {k:['süre','ne kadar','zaman'], a:'Kampanya süresini siz belirlersiniz! 1 günden 90 güne kadar istediğiniz süreyi seçebilirsiniz.'},
  {k:['whatsapp','paylaş','link','sosyal'], a:'Kampanya linkinizi WhatsApp, SMS, Instagram ve tüm sosyal medya platformlarında tek tıkla paylaşabilirsiniz!'},
  {k:['temsilci','gerçek','insan','canlı','agent','yetki'], a:'Şu anda canlı temsilci hizmetimiz aktif değil. Detaylı destek için selma.sahinmolla@gmail.com adresine e-posta gönderebilirsiniz. En kısa sürede dönüş yapılacaktır.'},
];

let isOpen = false;
let greeted = false;

function getTime(){
  return new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
}

function addMsg(text,type){
  const c = document.getElementById('epChatMessages');
  const d = document.createElement('div');
  d.className = 'ep-msg ' + type;
  d.innerHTML = text + '<span class="ep-time">' + getTime() + '</span>';
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function showTyping(){
  document.getElementById('epTyping').style.display = 'block';
  const c = document.getElementById('epChatMessages');
  c.scrollTop = c.scrollHeight;
}

function hideTyping(){
  document.getElementById('epTyping').style.display = 'none';
}

function showQuickReplies(items){
  const c = document.getElementById('epQuickReplies');
  c.innerHTML = '';
  items.forEach(function(t){
    const b = document.createElement('button');
    b.className = 'ep-qr';
    b.textContent = t;
    b.onclick = function(){
      document.getElementById('epMsgInput').value = t;
      window.epChat.send();
      c.innerHTML = '';
    };
    c.appendChild(b);
  });
}

function findAnswer(text){
  var lower = text.toLowerCase();
  var best = null, bestScore = 0;
  for(var i=0;i<FAQ.length;i++){
    var score = 0;
    for(var j=0;j<FAQ[i].k.length;j++){
      if(lower.indexOf(FAQ[i].k[j]) !== -1) score++;
    }
    if(score > bestScore){bestScore = score; best = FAQ[i];}
  }
  return best;
}

function greet(){
  if(greeted) return;
  greeted = true;
  addMsg('Merhaba! 👋 <strong>e.paylaşım</strong> destek hattına hoş geldiniz. Size nasıl yardımcı olabilirim?','bot');
  setTimeout(function(){
    showQuickReplies(['Kampanya nasıl oluşturulur?','Ödeme güvenli mi?','Hediye Kartı nedir?','Fiyatlandırma','İletişim']);
  },600);
}

window.epChat = {
  toggle: function(){
    if(isOpen) this.close(); else this.open();
  },
  open: function(){
    isOpen = true;
    document.getElementById('epChatWindow').style.display = 'flex';
    document.getElementById('epChatOverlay').style.display = 'block';
    document.getElementById('epChatIconOpen').style.display = 'none';
    document.getElementById('epChatIconClose').style.display = 'block';
    document.getElementById('epChatBadge').style.display = 'none';
    document.getElementById('epMsgInput').focus();
    greet();
  },
  close: function(){
    isOpen = false;
    document.getElementById('epChatWindow').style.display = 'none';
    document.getElementById('epChatOverlay').style.display = 'none';
    document.getElementById('epChatIconOpen').style.display = 'block';
    document.getElementById('epChatIconClose').style.display = 'none';
  },
  send: function(){
    var input = document.getElementById('epMsgInput');
    var text = input.value.trim();
    if(!text) return;
    addMsg(text,'user');
    input.value = '';
    document.getElementById('epQuickReplies').innerHTML = '';

    showTyping();
    var delay = 800 + Math.random()*1200;
    setTimeout(function(){
      hideTyping();
      var match = findAnswer(text);
      if(match){
        addMsg(match.a,'bot');
      } else {
        addMsg('Teşekkürler! Bu konuda daha detaylı yardım için <strong>selma.sahinmolla@gmail.com</strong> adresine e-posta gönderebilirsiniz. Ayrıca aşağıdaki konulardan birini seçebilirsiniz.','bot');
        setTimeout(function(){
          showQuickReplies(['Kampanya Oluşturma','Ödeme Güvenliği','Hediye Kartı','İletişim']);
        },300);
      }
    },delay);
  }
};

// Inject
var style = document.createElement('style');
style.textContent = WIDGET_CSS;
document.head.appendChild(style);

var wrapper = document.createElement('div');
wrapper.innerHTML = WIDGET_HTML;
document.body.appendChild(wrapper);

// Auto-open prompt after 5 seconds
setTimeout(function(){
  if(!isOpen){
    var toggle = document.getElementById('epChatToggle');
    var tip = document.createElement('div');
    tip.id = 'epChatTip';
    tip.innerHTML = 'Merhaba! Yardıma mı ihtiyacınız var? 💬';
    tip.style.cssText = 'position:absolute;bottom:68px;right:0;background:#fff;color:#1a1a2e;padding:10px 16px;border-radius:12px;border-bottom-right-radius:4px;font-size:13px;font-weight:500;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.12);animation:epSlideUp .3s ease;cursor:pointer';
    tip.onclick = function(){ tip.remove(); window.epChat.open(); };
    toggle.parentElement.insertBefore(tip,toggle);
    setTimeout(function(){ if(tip.parentElement) tip.remove(); },8000);
  }
},5000);

})();

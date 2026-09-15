// Eve — Origin Fresh's AI shopping assistant
//
// LOCAL DEMO ONLY. See js/eve-config.js for why the API key lives in
// plain client-side JS here and what needs to change before this is
// safe to put in front of real users.
//
// Eve can search the catalog (js/eve-catalog.js), build a cart, and
// "place" a mock order — all via Claude's tool use, driven entirely from
// the browser. Interaction is voice-first: tap the mic, talk, she replies
// out loud and the cart updates live. A small text field is kept as a
// fallback for browsers without mic support (or blocked mic access).

(function () {
  const STORAGE_CART = 'eve_cart';

  const EVE_SYSTEM_PROMPT = `You are Eve, the shopping assistant for Origin Fresh — a direct-from-farm grocery delivery brand in India. You help customers find products, build their cart, and place or schedule an order, entirely through conversation.

The catalogue is large and real — hundreds of items across Fruits (Global and Indian), Veggies (Global and Indian), Herbs, and Dairy, pulled straight from Origin Fresh's own range. It includes everyday staples alongside imported specialty items, so there's almost always something worth finding.

Tone: warm, concise, a little farm-forward — like a knowledgeable friend at a good market, never pushy or salesy. Keep replies short: a sentence or two plus any product specifics that matter. This conversation is spoken aloud to the customer, so keep it natural to say out loud — short sentences, no lists, no markdown, no symbols like asterisks or bullet points. Prices are in Indian Rupees (₹), say them as "rupees".

Rules:
- Never invent a product, price, or availability. Always call search_catalog before recommending or adding anything you haven't just looked up in this conversation.
- The catalogue is big, so search_catalog only returns a handful of top matches at a time. If a search comes back with a "note" saying more matches exist, don't try to read them all out — ask a quick follow-up (which category, imported or Indian, a price range, etc.) and search again with that narrower query.
- When the customer wants to buy something, actually call add_to_cart — don't just say you will.
- Before calling place_order, briefly confirm the cart contents and total with the customer.
- After place_order succeeds, clearly state the order id/confirmation and delivery window.
- Origin Fresh delivers within 60 minutes by default, or the customer can ask to schedule delivery for later. Store locations: Anna Nagar and Besant Nagar, Chennai.`;

  const EVE_TOOLS = [
    {
      name: 'search_catalog',
      description:
        'Search the Origin Fresh product catalog by name, category, or keyword. Call this before recommending or adding any product — never assume what is in stock.',
      input_schema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Free-text search, e.g. a product name or keyword. Omit to browse a category broadly.'
          },
          category: {
            type: 'string',
            description:
              'Optional filter — one of: Fruits, Veggies, Herbs, Dairy. Or a finer tag: Global Fruits, Indian Fruits, Global Veggies, Indian Veggies, Kitchen Herbs.'
          }
        }
      }
    },
    {
      name: 'add_to_cart',
      description: "Add a product to the customer's cart, or increase its quantity if it's already in the cart.",
      input_schema: {
        type: 'object',
        properties: {
          product_id: { type: 'string', description: 'The id of the product, from search_catalog results.' },
          quantity: { type: 'integer', description: 'How many to add. Defaults to 1.', minimum: 1 }
        },
        required: ['product_id']
      }
    },
    {
      name: 'remove_from_cart',
      description: 'Remove a product from the cart entirely, or reduce its quantity.',
      input_schema: {
        type: 'object',
        properties: {
          product_id: { type: 'string' },
          quantity: { type: 'integer', description: 'How many to remove. Omit to remove all of this item.' }
        },
        required: ['product_id']
      }
    },
    {
      name: 'view_cart',
      description: 'Get the current contents of the cart and its total.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'place_order',
      description:
        'Place the order for everything currently in the cart. Only call this after the customer has explicitly confirmed they want to order. Clears the cart on success.',
      input_schema: {
        type: 'object',
        properties: {
          scheduled_for: {
            type: 'string',
            description:
              'Optional. When the customer wants delivery, in plain language, if not immediate 60-minute delivery.'
          },
          store: { type: 'string', description: 'Optional. Anna Nagar or Besant Nagar, if the customer specified one.' }
        }
      }
    }
  ];

  // ---------- cart state ----------

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    renderCartList();
  }

  function cartSummary(cart) {
    const items = cart
      .map((i) => {
        const p = EVE_CATALOG.find((p) => p.id === i.id);
        return p
          ? {
              id: p.id,
              name: p.name,
              quantity: i.quantity,
              unit: p.unit,
              price: p.price,
              subtotal: p.price * i.quantity
            }
          : null;
      })
      .filter(Boolean);
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    return { items, total };
  }

  // ---------- tools ----------

  const SEARCH_RESULT_CAP = 12;

  function toolSearchCatalog(input) {
    const { query, category } = input || {};
    let results = EVE_CATALOG;
    if (category) {
      const c = category.toLowerCase();
      results = results.filter((p) => p.category.toLowerCase() === c || p.tag.toLowerCase() === c);
    }
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
      );
    }
    const total = results.length;
    const truncated = total > SEARCH_RESULT_CAP;
    const page = results.slice(0, SEARCH_RESULT_CAP).map(({ id, name, category, price, unit, tag, description }) => ({
      id,
      name,
      category,
      price,
      unit,
      tag,
      description
    }));
    return {
      results: page,
      total_matches: total,
      note: truncated
        ? `Only showing the first ${SEARCH_RESULT_CAP} of ${total} matches — ask the customer a follow-up to narrow it down (category, price range, imported vs Indian, etc.) instead of listing everything.`
        : undefined
    };
  }

  function toolAddToCart(input) {
    const { product_id, quantity } = input || {};
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const product = EVE_CATALOG.find((p) => p.id === product_id);
    if (!product) return { error: `No product with id "${product_id}". Use search_catalog to find valid ids.` };
    const cart = getCart();
    const existing = cart.find((i) => i.id === product_id);
    if (existing) existing.quantity += qty;
    else cart.push({ id: product_id, quantity: qty });
    saveCart(cart);
    return { cart: cartSummary(cart) };
  }

  function toolRemoveFromCart(input) {
    const { product_id, quantity } = input || {};
    let cart = getCart();
    const existing = cart.find((i) => i.id === product_id);
    if (!existing) return { error: `"${product_id}" is not in the cart.` };
    if (quantity == null || quantity >= existing.quantity) {
      cart = cart.filter((i) => i.id !== product_id);
    } else {
      existing.quantity -= quantity;
    }
    saveCart(cart);
    return { cart: cartSummary(cart) };
  }

  function toolViewCart() {
    return { cart: cartSummary(getCart()) };
  }

  function toolPlaceOrder(input) {
    const { scheduled_for, store } = input || {};
    const cart = getCart();
    if (!cart.length) return { error: 'The cart is empty. Add something before placing an order.' };
    const summary = cartSummary(cart);
    const orderId = 'OF-' + Math.floor(10000 + Math.random() * 90000);
    saveCart([]);
    return {
      order_id: orderId,
      items: summary.items,
      total: summary.total,
      scheduled_for: scheduled_for || 'as soon as possible (within 60 minutes)',
      store: store || 'nearest store',
      status: 'confirmed'
    };
  }

  function executeTool(name, input) {
    switch (name) {
      case 'search_catalog':
        return toolSearchCatalog(input);
      case 'add_to_cart':
        return toolAddToCart(input);
      case 'remove_from_cart':
        return toolRemoveFromCart(input);
      case 'view_cart':
        return toolViewCart();
      case 'place_order':
        return toolPlaceOrder(input);
      default:
        return { error: `Unknown tool "${name}".` };
    }
  }

  // ---------- Claude API ----------

  async function callClaude(messages) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': EVE_CONFIG.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: EVE_CONFIG.model,
        max_tokens: 1024,
        system: EVE_SYSTEM_PROMPT,
        tools: EVE_TOOLS,
        messages
      })
    });
    if (!res.ok) {
      let detail = '';
      try {
        detail = (await res.json()).error?.message || '';
      } catch (e) {}
      throw new Error(detail || `request failed (${res.status})`);
    }
    return res.json();
  }

  let eveHistory = [];

  async function sendToEve(userText) {
    eveHistory.push({ role: 'user', content: userText });
    renderMessage('user', userText);
    setVoiceState('thinking');
    showThinkingIndicator();

    const spoken = [];
    try {
      let guard = 0;
      while (guard++ < 6) {
        const data = await callClaude(eveHistory);
        const content = data.content || [];
        eveHistory.push({ role: 'assistant', content });

        hideThinkingIndicator();
        const textParts = content
          .filter((b) => b.type === 'text')
          .map((b) => b.text)
          .join('\n\n');
        if (textParts) {
          renderMessage('assistant', textParts);
          spoken.push(textParts);
        }

        const toolUses = content.filter((b) => b.type === 'tool_use');
        if (!toolUses.length) break;

        const toolResults = toolUses.map((tu) => ({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(executeTool(tu.name, tu.input))
        }));
        eveHistory.push({ role: 'user', content: toolResults });
        showThinkingIndicator();
      }
    } catch (err) {
      hideThinkingIndicator();
      const msg =
        "Sorry, I couldn't reach the kitchen just now (" +
        (err.message || 'connection error') +
        '). Mind trying again in a moment?';
      renderMessage('assistant', msg);
      spoken.push(msg);
    }

    const toSay = spoken.join(' ');
    if (toSay) speak(toSay);
    else setVoiceState('idle');
  }

  // ---------- voice (speech-to-text / text-to-speech) ----------

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceSupported = !!SR;
  const ttsSupported = 'speechSynthesis' in window;
  let recognition = null;
  let voiceState = 'idle'; // idle | listening | thinking | speaking | disabled
  let listeningTranscript = '';

  if (voiceSupported) {
    recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // continuous:true stops the browser from auto-ending the session at the
    // first pause in speech (its default behavior, which was cutting people
    // off mid-sentence). With this on, she keeps listening — across pauses,
    // "um"s, whatever — until the customer taps the mic again to finish.
    recognition.continuous = true;
  }

  // ---- picking a female voice out of whatever the browser/OS ships ----
  // The Web Speech API doesn't expose a real gender field, so this is a
  // name-based best guess. It also nudges toward higher-quality network
  // voices (Google/neural/natural) when available, since those tend to
  // sound noticeably less robotic than the default local ones.
  const FEMALE_VOICE_HINTS = [
    'female',
    'zira',
    'samantha',
    'victoria',
    'karen',
    'moira',
    'tessa',
    'fiona',
    'susan',
    'heera',
    'veena',
    'allison',
    'ava',
    'serena',
    'kate',
    'emma',
    'amelia',
    'joanna',
    'salli',
    'kimberly',
    'ivy',
    'aria',
    'jenny',
    'natasha',
    'isla'
  ];
  let cachedVoices = [];
  function refreshVoices() {
    cachedVoices = (ttsSupported && window.speechSynthesis.getVoices()) || [];
  }
  if (ttsSupported) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickFemaleVoice() {
    if (!cachedVoices.length) refreshVoices();
    if (!cachedVoices.length) return { voice: null, confident: false };
    let best = null;
    let bestScore = -Infinity;
    for (const v of cachedVoices) {
      const name = v.name.toLowerCase();
      const looksFemale = FEMALE_VOICE_HINTS.some((h) => name.includes(h));
      const looksMale = /\bmale\b/.test(name) && !looksFemale;
      let score = 0;
      if (looksFemale) score += 5;
      if (looksMale) score -= 5;
      if (v.lang && v.lang.toLowerCase().startsWith('en-in')) score += 2;
      else if (v.lang && v.lang.toLowerCase().startsWith('en')) score += 1;
      if (name.includes('google') || name.includes('neural') || name.includes('natural')) score += 2;
      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    }
    const confident = !!best && FEMALE_VOICE_HINTS.some((h) => best.name.toLowerCase().includes(h));
    return { voice: best, confident };
  }

  // Eve speaks with a cloned ElevenLabs voice when js/eve-config.js has both
  // elevenLabsApiKey and elevenLabsVoiceId set. Otherwise (or if that call
  // fails for any reason — bad key, quota, network) she falls back to the
  // browser's built-in voice, picked to sound female, so she's never
  // silently mute.
  async function speak(text) {
    if (EVE_CONFIG.elevenLabsApiKey && EVE_CONFIG.elevenLabsVoiceId) {
      const ok = await speakWithElevenLabs(text);
      if (ok) return;
    }
    speakNative(text);
  }

  function speakNative(text) {
    if (!ttsSupported) {
      setVoiceState('idle');
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    // Picking/assigning a voice is best-effort and kept in its own try —
    // if it ever fails (odd platform, stale voice object), Eve should
    // still speak with whatever default voice the browser falls back to,
    // not go silent.
    try {
      const { voice, confident } = pickFemaleVoice();
      if (voice) utter.voice = voice;
      // When we couldn't confidently identify a female-sounding voice on
      // this system, nudge the pitch up a touch as a soft fallback signal.
      utter.pitch = confident ? 1 : 1.15;
    } catch (e) {
      utter.pitch = 1.15;
    }
    utter.onstart = () => setVoiceState('speaking');
    utter.onend = () => setVoiceState('idle');
    utter.onerror = () => setVoiceState('idle');
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      setVoiceState('idle');
    }
  }

  async function speakWithElevenLabs(text) {
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + EVE_CONFIG.elevenLabsVoiceId, {
        method: 'POST',
        headers: {
          'xi-api-key': EVE_CONFIG.elevenLabsApiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });
      if (!res.ok) throw new Error('ElevenLabs request failed (' + res.status + ')');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setVoiceState('speaking');
      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = () => reject(new Error('audio playback failed'));
        audio.play().catch(reject);
      });
      URL.revokeObjectURL(url);
      setVoiceState('idle');
      return true;
    } catch (e) {
      console.warn("Eve: couldn't use the cloned voice, falling back to the browser voice.", e);
      return false;
    }
  }

  // ---------- UI ----------

  let panelEl, messagesEl, cartItemsEl, cartTotalEl, micBtn, voiceStatusEl, formEl, inputEl, launcherBtn;
  let greetingText = '';
  let hasGreetedAloud = false;

  function esc(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.className = 'eve-panel';
    panel.id = 'evePanel';
    panel.innerHTML = `
      <div class="eve-panel__header">
        <div class="eve-panel__heading">
          <span class="eve-panel__orb"></span>
          <div>
            <strong>Eve</strong>
            <span>Your Origin Fresh shopping assistant</span>
          </div>
        </div>
        <button type="button" class="eve-panel__close" aria-label="Close chat">&times;</button>
      </div>
      <div class="eve-panel__messages" id="eveMessages"></div>
      <div class="eve-panel__cartlist" id="eveCartList">
        <div class="eve-panel__cartlist-head">
          <span>Your Cart</span>
          <span id="eveCartTotal"></span>
        </div>
        <div id="eveCartItems"></div>
      </div>
      <div class="eve-panel__voice">
        <button type="button" class="eve-mic" id="eveMic" aria-label="Tap to talk to Eve">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
        <p class="eve-panel__voice-status" id="eveVoiceStatus">Tap to talk</p>
      </div>
      <form class="eve-panel__fallback" id="eveForm">
        <input type="text" id="eveInput" placeholder="Or type instead..." autocomplete="off" />
        <button type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>`;
    document.body.appendChild(panel);
    return panel;
  }

  function renderMessage(role, text) {
    const row = document.createElement('div');
    row.className = 'eve-msg eve-msg--' + role;
    const bubble = document.createElement('div');
    bubble.className = 'eve-msg__bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showThinkingIndicator() {
    hideThinkingIndicator();
    const indicator = document.createElement('div');
    indicator.className = 'eve-msg eve-msg--assistant eve-msg--thinking';
    indicator.innerHTML =
      '<div class="eve-msg__bubble eve-msg__bubble--dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(indicator);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideThinkingIndicator() {
    const indicator = messagesEl.querySelector('.eve-msg--thinking');
    if (indicator) indicator.remove();
  }

  function renderCartList() {
    const { items, total } = cartSummary(getCart());
    cartTotalEl.textContent = items.length ? '₹' + total : '';
    if (!items.length) {
      cartItemsEl.innerHTML =
        '<p class="eve-panel__cartlist-empty">Your cart is empty. Ask Eve to find you something.</p>';
      return;
    }
    cartItemsEl.innerHTML = items
      .map(
        (i) => `
      <div class="eve-cart-item">
        <span class="eve-cart-item__name">${esc(i.name)}</span>
        <span class="eve-cart-item__qty">×${i.quantity}</span>
        <span class="eve-cart-item__price">₹${i.subtotal}</span>
      </div>`
      )
      .join('');
  }

  function setVoiceState(state) {
    voiceState = state;
    micBtn.classList.remove('is-listening', 'is-thinking', 'is-speaking');
    const busy = state === 'thinking' || state === 'speaking';
    launcherBtn.classList.toggle('is-talking', busy);
    micBtn.disabled = state === 'disabled' || !voiceSupported || busy;
    if (state === 'listening' || state === 'thinking' || state === 'speaking') {
      micBtn.classList.add('is-' + state);
    }
    const labels = {
      idle: voiceSupported ? 'Tap to talk' : 'Voice not supported here, type below',
      listening: 'Listening… tap again when you’re done',
      thinking: 'Thinking…',
      speaking: 'Speaking…',
      disabled: 'Add an API key to enable Eve'
    };
    voiceStatusEl.textContent = labels[state] || '';
    inputEl.disabled = busy;
    formEl.querySelector('button').disabled = busy;
  }

  function openPanel() {
    panelEl.classList.add('is-open');
    if (!hasGreetedAloud && ttsSupported && EVE_CONFIG.apiKey) {
      hasGreetedAloud = true;
      speak(greetingText);
    }
    if (!voiceSupported) inputEl.focus();
  }

  function closePanel() {
    panelEl.classList.remove('is-open');
  }

  function init() {
    launcherBtn = document.querySelector('.eve-launcher');
    if (!launcherBtn) return;

    panelEl = buildPanel();
    messagesEl = panelEl.querySelector('#eveMessages');
    cartItemsEl = panelEl.querySelector('#eveCartItems');
    cartTotalEl = panelEl.querySelector('#eveCartTotal');
    micBtn = panelEl.querySelector('#eveMic');
    voiceStatusEl = panelEl.querySelector('#eveVoiceStatus');
    formEl = panelEl.querySelector('#eveForm');
    inputEl = panelEl.querySelector('#eveInput');

    panelEl.querySelector('.eve-panel__close').addEventListener('click', closePanel);

    launcherBtn.addEventListener('click', () => {
      if (panelEl.classList.contains('is-open')) closePanel();
      else openPanel();
    });

    micBtn.addEventListener('click', () => {
      if (!EVE_CONFIG.apiKey || !voiceSupported) return;
      if (voiceState === 'idle') {
        listeningTranscript = '';
        try {
          recognition.start();
          setVoiceState('listening');
        } catch (e) {
          /* ignore double-start */
        }
      } else if (voiceState === 'listening') {
        // Tapping again while listening is how the customer says "I'm done" —
        // stop() ends the session, which fires onend below and submits
        // whatever was captured.
        try {
          recognition.stop();
        } catch (e) {}
      }
    });

    if (recognition) {
      // continuous mode delivers each finished phrase as its own final
      // result without ending the session, so we accumulate them here and
      // only act once the customer actually stops the mic (see onend).
      recognition.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i];
          if (result.isFinal) {
            const chunk = ((result[0] && result[0].transcript) || '').trim();
            if (chunk) listeningTranscript = (listeningTranscript ? listeningTranscript + ' ' : '') + chunk;
          }
        }
      };
      recognition.onerror = (e) => {
        // 'no-speech' just means nothing heard yet — not a real failure, and
        // onend (which always follows) is what decides what happens next.
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('Eve: speech recognition error', e.error);
        }
      };
      recognition.onend = () => {
        if (voiceState !== 'listening') return;
        const transcript = listeningTranscript.trim();
        listeningTranscript = '';
        if (transcript) sendToEve(transcript);
        else setVoiceState('idle');
      };
    }

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      sendToEve(text);
    });

    renderCartList();

    if (!EVE_CONFIG.apiKey) {
      renderMessage(
        'assistant',
        "Hi, I'm Eve! I'm not quite online yet, this demo needs an Anthropic API key added to js/eve-config.js before I can chat."
      );
      setVoiceState('disabled');
    } else {
      greetingText = voiceSupported
        ? "Hi, I'm Eve. Tap the mic, tell me what you're after, and tap it again when you're done talking. I'll find it, add it to your cart, and get it on its way."
        : "Hi, I'm Eve. Your browser doesn't support voice here, so just type what you're after and I'll take it from there.";
      renderMessage('assistant', greetingText);
      setVoiceState('idle');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

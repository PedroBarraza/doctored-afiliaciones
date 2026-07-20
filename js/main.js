// ============================================================
// CONFIG — único lugar para actualizar datos del canal comercial
// ============================================================
const SITE_CONFIG = {
  // TODO: reemplazar cuando definan el nombre comercial definitivo
  businessName: 'Osmedica',
  // Link de WhatsApp Business (shortlink). Si en el futuro tenés el
  // número directo, podés cambiar a: `https://wa.me/549XXXXXXXXXX`
  whatsappLink: 'https://wa.me/message/7TRUIC3KWVNUL1',
};

// Reemplaza los placeholders __WHATSAPP_LINK__ y __BUSINESS_NAME__
// insertados en el HTML, para que todo se controle desde acá.
document.querySelectorAll('a[href="__WHATSAPP_LINK__"]').forEach((el) => {
  el.setAttribute('href', SITE_CONFIG.whatsappLink);
});
document.querySelectorAll('.business-name').forEach((el) => {
  el.textContent = SITE_CONFIG.businessName;
});

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// FAQ accordion
// ============================================================
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ============================================================
// Quiz — recomendador de plan
// Sigue el árbol de 3 preguntas de la capacitación comercial:
// 1) ¿Relación de dependencia? 2) ¿Qué le importa? -> plan sugerido
// ============================================================
const quizCard = document.getElementById('quiz-card');
if (quizCard) {
  const steps = {
    1: quizCard.querySelector('[data-step="1"]'),
    2: quizCard.querySelector('[data-step="2"]'),
    result: quizCard.querySelector('[data-step="result"]'),
  };
  const resultPlanEl = document.getElementById('quiz-result-plan');
  const resultDescEl = document.getElementById('quiz-result-desc');
  const copyBtn = document.getElementById('quiz-copy');
  const restartBtn = document.getElementById('quiz-restart');

  const answers = { q1: null, q2: null };

  const PLAN_INFO = {
    '500': {
      name: 'Plan 500',
      desc: 'Se financia con el aporte que ya se descuenta de tu sueldo, sin costo mensual adicional. Requiere verificar que estés en relación de dependencia.',
    },
    '500+': {
      name: 'Plan 500+',
      desc: 'La misma cobertura y cartilla que el Plan 500, pero con una cuota mensual y sin necesitar relación de dependencia. Alta inmediata.',
    },
    '1000': {
      name: 'Plan 500 + upgrade a Plan 1000',
      desc: 'Arrancamos con el Plan 500 sin costo extra, y te mostramos cómo sumar más prestadores de guardia y descuentos en odontología con el Plan 1000.',
    },
    '2000': {
      name: 'Plan 500 + upgrade a Plan 2000',
      desc: 'Arrancamos con el Plan 500 sin costo extra, y te contamos cómo sumar habitación individual, implantes y asistencia al viajero con el Plan 2000.',
    },
    '3000': {
      name: 'Plan 500 + upgrade a Plan 3000',
      desc: 'Arrancamos con el Plan 500 sin costo extra, y te mostramos el Plan 3000: máxima cobertura, sin topes en estudios ni consultas.',
    },
  };

  function showStep(stepKey) {
    Object.values(steps).forEach((el) => { el.hidden = true; });
    steps[stepKey].hidden = false;
  }

  function computeResult() {
    if (answers.q1 === 'no') return PLAN_INFO['500+'];
    if (answers.q2 === 'ninguno') return PLAN_INFO['500'];
    if (answers.q2 === 'accesible') return PLAN_INFO['1000'];
    if (answers.q2 === 'premium') return PLAN_INFO['2000'];
    if (answers.q2 === 'top') return PLAN_INFO['3000'];
    return PLAN_INFO['500'];
  }

  quizCard.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      const value = btn.dataset.value;
      answers['q' + q] = value;

      if (q === '1' && value === 'si') {
        showStep(2);
        return;
      }
      if (q === '1' && value === 'no') {
        const plan = computeResult();
        renderResult(plan);
        return;
      }
      if (q === '2') {
        const plan = computeResult();
        renderResult(plan);
      }
    });
  });

  function renderResult(plan) {
    resultPlanEl.textContent = plan.name;
    resultDescEl.textContent = plan.desc;
    quizCard.dataset.lastMessage =
      `Hola! Hice el test de la web y me recomendó el ${plan.name}. Quiero más info para afiliarme a DoctoRed.`;
    showStep('result');
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const message = quizCard.dataset.lastMessage || 'Hola! Quiero afiliarme a DoctoRed.';
      try {
        await navigator.clipboard.writeText(message);
        copyBtn.textContent = '¡Copiado!';
        setTimeout(() => { copyBtn.textContent = 'Copiar resumen para WhatsApp'; }, 2000);
      } catch (err) {
        // Fallback silencioso si el navegador bloquea el portapapeles
        copyBtn.textContent = message;
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      answers.q1 = null;
      answers.q2 = null;
      showStep(1);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ГЛОБАЛЬНАЯ ЛОГИКА (UI, Меню, Иконки)
  // ==========================================

  // --- Инициализация иконок Lucide ---
  // Проверяем, подключена ли библиотека
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --- Мобильное меню (Бургер) ---
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const headerLinks = document.querySelectorAll('.header__link');

  if (burger && nav) {
      burger.addEventListener('click', () => {
          // Переключаем класс активности
          nav.classList.toggle('is-active');

          // Атрибуты доступности (ARIA)
          const isExpanded = nav.classList.contains('is-active');
          burger.setAttribute('aria-expanded', isExpanded);
      });

      // Закрываем меню при клике на любую ссылку внутри
      headerLinks.forEach(link => {
          link.addEventListener('click', () => {
              nav.classList.remove('is-active');
              burger.setAttribute('aria-expanded', 'false');
          });
      });
  }

  // --- Динамический год в футере ---
  const yearElement = document.getElementById('year');
  if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
  }

  // --- Эффект хедера при скролле ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
          // Делаем фон чуть более непрозрачным при скролле
          header.style.background = "rgba(245, 245, 247, 0.95)";
      } else {
          header.style.boxShadow = "none";
          header.style.background = "rgba(245, 245, 247, 0.8)";
      }
  });

  // ==========================================
  // 2. АНИМАЦИЯ HERO (SVG Liquid Effect)
  // ==========================================

  initSvgLiquid();
});

/**
* Функция для анимации SVG фильтра (эффект жидкости)
* Работает без внешних библиотек
*/
function initSvgLiquid() {
  // Ищем элементы фильтра в HTML
  const turbulence = document.querySelector('#liquidFilter feTurbulence');
  // const displacement = document.querySelector('#liquidFilter feDisplacementMap'); // Можно раскомментировать для доп. эффектов

  // Если фильтра нет в HTML, выходим, чтобы не было ошибок
  if (!turbulence) return;

  let frames = 0;

  // Функция анимации (цикл)
  function animate() {
      frames++;

      // Математика волн:
      // baseFrequency="x y" - частота шума по X и Y
      // Мы плавно меняем эти значения, используя sin/cos от времени (frames)

      const freqX = 0.01 + Math.sin(frames * 0.002) * 0.001;
      const freqY = 0.005 + Math.cos(frames * 0.005) * 0.001;

      // Применяем новые значения к SVG фильтру
      turbulence.setAttribute('baseFrequency', `${freqX} ${freqY}`);

      // Запрашиваем следующий кадр анимации
      requestAnimationFrame(animate);
  }

  // Запускаем цикл
  animate();
}
// ==========================================
    // 3. CONTACT FORM LOGIC (Validation & Captcha)
    // ==========================================

    const contactForm = document.getElementById('contact-form');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha-input');
    const phoneInput = document.getElementById('phone');
    const formSuccess = document.getElementById('form-success');
    const formBtn = document.querySelector('.form__btn');

    if (contactForm) {
        // 1. Генерация простой мат. капчи
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = num1 + num2;

        captchaQuestion.textContent = `${num1} + ${num2} = ?`;

        // 2. Валидация ввода телефона (только цифры)
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });

        // 3. Обработка отправки
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Проверка капчи
            if (parseInt(captchaInput.value) !== correctAnswer) {
                alert('Неверный ответ на пример! Попробуйте еще раз.');
                captchaInput.value = '';
                captchaInput.focus();
                return;
            }

            // Имитация отправки (AJAX)
            const originalBtnText = formBtn.textContent;
            formBtn.textContent = 'Отправка...';
            formBtn.disabled = true;

            setTimeout(() => {
                // Скрываем поля, показываем успех
                Array.from(contactForm.children).forEach(child => {
                    if (child.id !== 'form-success') child.style.display = 'none';
                });
                formSuccess.style.display = 'block';

                // Очистка формы
                contactForm.reset();
            }, 1500);
        });
    }

    // ==========================================
    // 4. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Проверяем, было ли уже согласие
    if (!localStorage.getItem('cookiesAccepted')) {
        // Показываем с небольшой задержкой
        setTimeout(() => {
            if(cookiePopup) cookiePopup.style.display = 'block';
        }, 2000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.style.display = 'none';
        });
    }
'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
/// Button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect(); // outputs the coordinate of section1 from the top of the viewport
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // returns height and width of current viewport the page occupied

  // Scrollingwindow.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behaviour: 'smooth',
  // }); // implementing smooth scrolling old way

  section1.scrollIntoView({
    behavior: 'smooth',
  }); // short way
});

/////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

////////// Event delegation
// 1st step: Add event listener to common parent element
// 2nd step: Determine what element originated the event from

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching with the id of the clicked element
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//////////// Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  // Removing active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));

  // activating tab
  clicked.classList.add('operations__tab--active');

  // activating clicked content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing "argument" into handler

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// implementing sticky nav

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// implementing sticky nav with Intersection observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickynav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/// Reveal Section on scrolling

const Sections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

Sections.forEach(function (sec) {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// lazy loading images

const images = document.querySelectorAll('img[data-src]');
const imgLoad = function (entries, observer) {
  const [entry] = entries;
  // console.log(!entry.isIntersecting);
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
images.forEach(img => imgObserver.observe(img));

// slider

const slides = document.querySelectorAll('.slide');
const leftBtn = document.querySelector('.slider__btn--left');
console.log(slides);
const rightBtn = document.querySelector('.slider__btn--right');

let currentSlide = 0;
const maxSlide = slides.length - 1;
console.log(maxSlide);
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

// functions
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}">`
    );
  });
};
createDots();
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};
activateDot(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translate(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const nextSlide = function () {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

//Event handlaers
rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', previousSlide);
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

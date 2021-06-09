'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Modal window  ////////////////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

/////////here "btnsOpenModel" is a 'NODE-LIST' and Node-list is not an array but nodelist have some properties/methods same as that of array!!////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(varr => varr.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////      --------->SMOOTH SCROLLING<-----------      ////////////////


btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //This will give the coordinate of section1 from the top left corner as ORIGIN of visible viewport page

  ///////<<<<------MODERN WAY OF SMOOTH SCROLLING ------------>>>////////
  section1.scrollIntoView({ behavior: 'smooth' });
});



/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////--------->PAGE NAVIGATION <-----------/////////////////////////////////////

////////SO EFFECTIVE SOLUTION IS BY <"EVENT DELEGATION">  --> IN this we -:
//1. ADD EVENT LISTENER to COMMON PARENT 
//2. DETERMINE WHAT ELEMENT ORIGINATED THE EVENT

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  // Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView( {behavior:'smooth'} );
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////.............TABBED COMPONENT.........///////////////////////////////////////



tabsContainer.addEventListener('click', function(e){
  //e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //Gaurd Clause
  if( !clicked ) return; //if clcked is undefined or NUll than this if condition will be executed and this function will be terminate
  //console.log(clicked);

  //Activating the tab
  tabs.forEach( t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content Area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////.........MENU FADE ANIMATION...........///////////////////////////////////

//Refractoring our code implementing DRY approach
const handleHover = function(e) {
  //console.log(this, e.currentTarget);

  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach( el => { 
      if( el !== link )
        el.style.opacity = this;
    });

    logo.style.opacity = this;

  }

}

//nav.addEventListener('mouseover', handleHover(e , .5)); Bhai ye ERROR dega ab because addEventListener mein hum function call nhi kr sktey arguments ke saath
/*
nav.addEventListener('mouseover', function(e){
  handleHover(e , .5);
});
*/
nav.addEventListener('mouseover', handleHover.bind(.5) ); 
//Another approach is by using BIND METHOD--->V.V.V.V.IMP
nav.addEventListener('mouseout', handleHover.bind(1) );



/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////................STICKY NAVIGATION................////////////////////////////////

//.....................................//IMPORTANT HAI SAMBHAL KR//....................................


//WE want NAVIGATION to be STICKY when the header completely finished

const navHeight = nav.getBoundingClientRect().height;


const stickyNav = function(entries){
  const [entry] = entries;
  //console.log(entries[0]);
  if(!entry.isIntersecting)
    nav.classList.add('sticky');
  
  else
    nav.classList.remove('sticky');

};

const headerObserver = new IntersectionObserver(stickyNav , {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////---------------->REVEAL SECTION<----------------/////////////////////////////////

const allSections = document.querySelectorAll('.section');
allSections.forEach(el => el.classList.add('section--hidden'));

const revealSection = function(entries, observer){
  const [entry] = entries;
  
  //yaha pr usshi section ko visible krna hai jiss section ko intersect kr rahe h hum
  if(!entry.isIntersecting) return;
  
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: .15,
});


allSections.forEach(el => sectionObserver.observe(el));

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////.............LAZY LOADING IMAGES............//////////////////////////////////////
//IMPORTANT
//This is really great for PERFORMANCE, this really impacts how our sites works on slower internet
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  
  if(!entry.isIntersecting) return;

  //replace src with data attribute
  entry.target.src = entry.target.dataset.src;
  //entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });


};

const imgObserver = new IntersectionObserver(loadImg , {
  root:null,
  threshold: 0,
  rootMargin: '90px',
});

imgTargets.forEach(img => imgObserver.observe(img));


////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////..............SLIDER..................///////////////////////////////////


const sliders = function() {
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
let maxSlide = slides.length;

const slider = document.querySelector('.slider');
//slider.style.transform = 'scale(.2) translateX(-1200px)';
//slider.style.overflow = 'visible';

//slides.forEach((s,i) => (s.style.transform = `translateX(${100*i}%)`));

// 1. slide at 0%
// 2. slide at 100%
// 3. slide at 200%
// 4. slide at 300%


///////////FUNCTIONS
const createDots = function () {
  slides.forEach( function( _, i) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"> </button>`);
  });
} 



const activateDot = function(slide){
  dotContainer.childNodes.forEach(ch => ch.classList.remove('dots__dot--active'))
  //e.target.classList.add('dots__dot--active');
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}



const goToSlide = function(slide){
  slides.forEach((s, i) => s.style.transform = `translateX(${(i-slide)*100}%)`);
}

//Next slide
const nextSlide = function() {
  if (curSlide === maxSlide - 1)
    curSlide = 0;
  else
    curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
}


//Previous Slide
const prevSlide = function() {
  if (curSlide == 0)
    curSlide = maxSlide - 1;
  else
    curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
}


// -----> INITIAL CONDITIONS <------ 
const init = function() {
   goToSlide(0);
   createDots();
   activateDot(0); // for begning to keep one dot in ACTIVE STATE
}
init();

// EVENT HANDLERS
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);


document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight')
    nextSlide();
  e.key === 'ArrowLeft' && prevSlide(); //short circuiting
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const [slide] = e.target.dataset.slide;
    activateDot(slide);
    //console.log(slide);
    goToSlide(slide);
  }
})
};

sliders();

////////////////////////////////////////////////////////////////////////////////////////////////////

// ||--> BEFORE UNLOAD <--|| iske through hum ek prompt attach kr sktey hai After a user has clicked the close button of the tab

window.addEventListener('beforeunload', function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue = ''; 
}); 

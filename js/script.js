'use strict';

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

function titleClickHandler() {
  console.log('Title was clicked');
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
    
  for (let activeLink of activeLinks) {           /* remove class 'active' from all article links */
    activeLink.classList.remove('active');
  }

  console.log('Clicked element:', clickedElement);
  clickedElement.classList.add('active');           /* add class 'active' to the clicked link */
                   
  const activeArticles = document.querySelectorAll('.posts .active');
  
  for (let activeArticle of activeArticles) {      /* remove class 'active' from all articles */
    activeArticle.classList.remove('active');
  }
                    /* get 'href' attribute from the clicked link */
                    /* find the correct article using the selector (value of 'href' attribute) 
                    /* add class 'active' to the correct article */

}
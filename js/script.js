'use strict';

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

function titleClickHandler() {
  console.log('Title was clicked');
}
'use strict';

const optTitleListSelector = '.titles',
optArticleSelector = '.post',
optTitleSelector = '.post-title',
optArticleTagsSelector = '.post-tags .list',
optArticleAuthorSelector = '.post-author',
optTagsListSelector = '.tags',
optCloudClassCount = '10',
optCloudClassPrefix = 'tag-size-';


function titleClickHandler() {

  event.preventDefault();
  console.log('Title was clicked');
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
    
  for (let activeLink of activeLinks) {                             /* remove class 'active' from all article links */
    activeLink.classList.remove('active');
  }

  console.log('Clicked element:', clickedElement);
  clickedElement.classList.add('active');                           /* add class 'active' to the clicked link */
                   
  const activeArticles = document.querySelectorAll('.posts .active');
  
  for (let activeArticle of activeArticles) {                       /* remove class 'active' from all articles */
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');       /* get 'href' attribute from the clicked link */
  console.log('article:', articleSelector);
  const targetArticle = document.querySelector(articleSelector);     /* find the correct article using the selector (value of 'href' attribute) */

  targetArticle.classList.add('active');                             /* add class 'active' to the correct article */

}

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);    /* remove contents of titleList */
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html='';

  for (let article of articles) {                                     /* for each article */
    const articleId = article.getAttribute('id');                      /* get the article id */
    console.log('id: ', articleId);
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; /* find the title element */    /* get the title from the title element */
    console.log('art:', articleTitle);
    const linkHTML = '<li><a href="#' + articleId + '"><span> ' + articleTitle + ' <span></a></li>';       /* create HTML of the link */
    console.log('link', linkHTML);
    // titleList.innerHTML += linkHTML;   - 1 sposób                             /* insert link into titleList */
    // titleList.insertAdjacentHTML('beforeend', linkHTML);
    html += linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();
    
/********************************************************************************************** ZLICZANIE TAGÓW *********************************************************************************/

function calculateTagsClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);
  const number = optCloudClassPrefix + classNumber;
  return number;
}


function calculateTagsParams(tags) {
  const params = {max: 0, min: 99999999};
  for (let tag in tags) {
    if(tags[tag] > params.max) { 
      params.max = tags[tag];
    } else if (tags[tag] < params.min){
      params.min = tags[tag];
    }
    console.log(tag + 'is used' + tags[tag] + ' times');
  }
  return params;
}


/************************************************************************************************* TWORZENIE TAGÓW ***********************************************************************************/

function generateTags() {

  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    let html ='';
    const tagsAttribute = article.getAttribute('data-tags');
    const tags = tagsAttribute.split(' ');
    for (let tag of tags) {
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      html += linkHTML + ' ';

      if(!allTags.hasOwnProperty(tag)) {           // sprawdzamy czy alltags NIE ma w sobie taga
        allTags[tag] = 1;                          // jeśli nie to ustawiamy go na 1
      } else {                                     // w przeciwnym wypadku
        allTags[tag]++;                            // zwiększamy owy tag o 1
      }
    }
    tagsWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  let allTagsHTML = '';
  for (let tag in allTags) {
    allTagsHTML += '<li><a class="' + calculateTagsClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ') ' + '</span></a></li>';
  }
  tagList.innerHTML = allTagsHTML;
}
generateTags();


function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  console.log('tags:', tag);
  const tagActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for (let tag of tagActiveLinks) {
    tag.classList.remove('active');
  }
  
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tag of tagLinks) {
    tag.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  const links = document.querySelectorAll('a[href^="#tag-"]');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags();


/*************************************************************************************************** TWORZENIE AUTORÓW **************************************************************************/

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const author = article.getAttribute('data-author');
    console.log('author: ', author);
    const linkHTML = '<li><a href="#author-' + author + '">' + author + '</a></li>';
    authorWrapper.innerHTML = linkHTML;
  }
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const authorActiveLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let author of authorActiveLinks) {
    author.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let author of authorLinks) {
    author.classList.add('active');
  }
  generateTitleLinks('[data-author~="' + author + '"]');
}

function addClickListenersToAuthors() {
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (let link of links) { 
    link.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();
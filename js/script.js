'use strict';

const templates = {
  // eslint-disable-next-line no-undef
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

const opts = { titleListSelector: '.titles',
  articleSelector: '.post',
  titleSelector:'.post-title',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags',
  authorsListSelector: '.authors',
  cloudClassCountTags: '10',
  cloudClassCountAuthors: '6',
  cloudClassPrefix: 'tag-size-'};


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
  const titleList = document.querySelector(opts.titleListSelector);    /* remove contents of titleList */
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html='';

  for (let article of articles) {                                     /* for each article */
    const articleId = article.getAttribute('id');                      /* get the article id */
    console.log('id: ', articleId);
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML; /* find the title element */    /* get the title from the title element */
    console.log('art:', articleTitle);
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);       /* create HTML of the link */
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
  const classNumber = Math.floor( percentage * (opts.cloudClassCountTags - 1) + 1);
  const number = opts.cloudClassPrefix + classNumber;
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
  const articles = document.querySelectorAll(opts.articleSelector);

  for (let article of articles) {
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    let html ='';
    const tagsAttribute = article.getAttribute('data-tags');
    const tags = tagsAttribute.split(' ');
    for (let tag of tags) {
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      html += linkHTML + ' ';

      // eslint-disable-next-line no-prototype-builtins
      if(!allTags.hasOwnProperty(tag)) {           // sprawdzamy czy alltags NIE ma w sobie taga
        allTags[tag] = 1;                          // jeśli nie to ustawiamy go na 1
      } else {                                     // w przeciwnym wypadku
        allTags[tag]++;                            // zwiększamy owy tag o 1
      }
    }
    tagsWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(opts.tagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  // let allTagsHTML = '';
  const allTagsData = {tags: []};
  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagsClass(allTags[tag], tagsParams)
    });
    console.log('count', allTagsData);
    // allTagsHTML += '<li><a class="' + calculateTagsClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ') ' + '</span></a></li>';
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
  let allAuthors = {};
  const articles = document.querySelectorAll(opts.articleSelector);

  for (let article of articles) {
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    const author = article.getAttribute('data-author');
    console.log('author: ', author);
    const linkHTMLData = {id: author, title: author};
    const linkHTML = templates.authorLink(linkHTMLData);
    // eslint-disable-next-line no-prototype-builtins
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    authorWrapper.innerHTML = linkHTML;
  }
  const authorList = document.querySelector(opts.authorsListSelector);

  const authorParams = calculateAuthorsParams(allAuthors);

  // let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};
  for (let author in allAuthors) {
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateAuthorsClass(allAuthors[author], authorParams)
    });
    // allAuthorsHTML += '<li><a class="' + calculateAuthorsClass(allAuthors[author], authorParams) + '" href="#author-' + author + '"><span>' + author + ' (' + allAuthors[author] + ') ' + '</span></a></li>';
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const authorActiveLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log('activelinks:', authorActiveLinks);
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

/********************************************************************************************** ZLICZANIE AUTORÓW *********************************************************************************/

function calculateAuthorsClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCountAuthors - 1) + 1);
  const number = opts.cloudClassPrefix + classNumber;
  return number;
}


function calculateAuthorsParams(authors) {
  const params = {max: 0, min: 99999999};
  for (let author in authors) {
    if(authors[author] > params.max) { 
      params.max = authors[author];
    } else if (authors[author] < params.min){
      params.min = authors[author];
    }
    console.log(author + 'is used' + authors[author] + ' times');
  }
  return params;
}
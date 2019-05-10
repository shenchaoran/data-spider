import * as cheerio from 'cheerio'
import * as _ from 'lodash'

const $ = cheerio.load(`

<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]> <html class="no-js ie" lang="en"> <![endif]-->
<!--[if !IE]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
  <head>

    <link rel="stylesheet" type="text/css" href="/urs/style.css" media="all" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/qtip2/2.2.1/basic/jquery.qtip.min.css" media="all" />
    <!--
      DATA SETS BROWSE
    -->
    <title>Data Set Search &raquo; &nbsp;Governance &#124; SEDAC</title>

    <meta http-equiv="X-UA-Compatible" content="IE=9, IE=edge" />
    <link rel="stylesheet" type="text/css" href="/wro/global.css?cache_bust=1557140064942" media="all" />
	<script type="text/javascript" src="/js/modernizr.custom-2.6.2.js"></script>

    <script src="https://cdn.earthdata.nasa.gov/tophat2/tophat2.js" 
        id="earthdata-tophat-script" 
        data-show-fbm="false" 
        data-show-status="false"
        data-current-daac="SEDAC">

    </script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
    <script type="text/javascript" src="/SSI/ga360/ga360-script.js"></script>
    <script>
        (function() {
          var cx = '001498382559341266595:kocf6-yybdw';
          var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
          gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
              '//www.google.com/cse/cse.js?cx=' + cx;
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
        })();
    </script>
  </head>
  <body id="data" class="set browse" data-theme="" onload="setLoginStatus()">
    <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WNP7MLF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

    <div id="earthdata-tophat2"></div>   
    <div id="wrapper">
      <header id="masthead">
          <nav>
  <div id="nav-home">
      <div id="SEDACtitle"><a class="meatball" href="https://www.nasa.gov/"><img src="/imgs/nasa_meatball.png" alt="NASA Website" style="vertical-align:middle"></a> <a href="/"><span>Socioeconomic Data and Applications Center (<acronym title="Socioeconomic Data and Applications Center">sedac</acronym>)</span></a></div>
      <div id="EOSDIStitle">A Data Center in NASA's Earth Observing System Data and Information System (<a href="https://earthdata.nasa.gov/"><acronym title="Earth Observing System Data and Information Sysytem">EOSDIS</acronym></a>) &mdash; Hosted by <a href="http://www.ciesin.columbia.edu"><acronym title="Center for International Earth Science Information Network">CIESIN</acronym></a> at <a href="http://www.columbia.edu">Columbia University</a></div>
  </div>
  <div id="nav-search">
    <form id="global-search" method="get" action="/search/data">
      
      <label for="nav-search-field" class="accessible-hide">Search SEDAC</label>
      <div id="nav-search-bar">
        <input class="placeholder" data-placeholder="Search SEDAC..." id="nav-search-field" class="placeholder" name="contains" type="text" value="" />
        <div id="nav-search-select">
          <a href="#">
            <span>Data</span>
            <img src="/imgs/search-select-arrow.gif" />
          </a>
      <ul id="nav-search-select-opts">
            <li><a href="#" data-value="data" class='selected'>Data Sets</a></li>
            <li><a href="#" data-value="maps">Maps</a></li>
            <li><a href="#" data-value="web">Web Pages</a></li>
          </ul>
        </div>
      </div>
      <button id="nav-search-button" type="submit">
        <span class="accessible-hide">search</span>
      </button>
      
    </form>

    <!--User Management Button and Menu -->
    <button id="urs-manager" class="ursbutton"><i class="fa fa-user fa-lg" aria-hidden="true"></i> <i class="fa fa-caret-down"></i></button>
      <div id="urs-manager-dd" class="dropdown-content">

      </div>
      
  </div>

  <ul id="nav-main">
    <li class="home-icon">
      <a href="/">
        <img src="/imgs/home-icon.png" alt="home" title="Home"/></a>
    </li>
    <li class="active"><a href="#"><span>Data</span></a>
      <ul>
        <li><a href="/data/sets/browse">&middot; Data Sets</a></li>
        <li><a href="/data/collections/browse">&middot; Data Collections</a></li>
        <li><a href="/featured-uses">&middot; Featured Data Uses</a></li>
        <li><a href="/citations">&middot; Data Citations</a></li>
        <li><a href="/citations-db">&middot; Citations Database</a></li>        
        <li><a href="/data-submission">&middot; Data Submission</a></li>
      </ul>
    </li>
    <li><a href="#"><span>Maps</span></a>
      <ul>
        <li><a href="/maps/gallery/search">&middot; Map Gallery</a></li>
        <li><a href="/maps/client">&middot; Map Viewer</a></li>
        <li><a href="/maps/services">&middot; Map Services</a></li>
        <li><a href="/maps/tools">&middot; Mapping Tools</a></li>
      </ul>
    </li>
    <li><a href="#"><span>Themes</span></a>
      <ul>
        <li><a href="/theme/agriculture">&middot; Agriculture</a></li>
        <li><a href="/theme/climate">&middot; Climate</a></li>
        <li><a href="/theme/conservation">&middot; Conservation</a></li>
        <li><a href="/theme/governance">&middot; Governance</a></li>
        <li><a href="/theme/hazards">&middot; Hazards</a></li>
        <li><a href="/theme/health">&middot; Health</a></li>
        <li><a href="/theme/infrastructure">&middot; Infrastructure</a></li>
        <li><a href="/theme/land-use">&middot; Land Use</a></li>
        <li><a href="/theme/marine-and-coastal">&middot; Marine and Coastal</a></li>
        <li><a href="/theme/population">&middot; Population</a></li>
        <li><a href="/theme/poverty">&middot; Poverty</a></li>
        <li><a href="/theme/remote-sensing">&middot; Remote Sensing</a></li>
        <li><a href="/theme/sustainability">&middot; Sustainability</a></li>
        <li><a href="/theme/urban">&middot; Urban</a></li>
        <li><a href="/theme/water">&middot; Water</a></li>
        </ul>
    </li>
    <li><a href="#"><span>Resources</span></a>
      <ul>
        <li><a href="/guides">&middot; Guides</a></li>
        <li><a href="/multimedia">&middot; Multimedia</a></li>
        <li><a href="/networks">&middot; Networks</a></li>
        <li><a href="/news/browse">&middot; News</a></li>
        <li><a href="/publications">&middot; Publications</a></li>  
        <li><a href="/related-sites">&middot; Related Sites</a></li>
        <li><a href="/remote-sensing">&middot; Remote Sensing</a></li>       
        <li><a href="/tools">&middot; Tools</a></li>    
      </ul>
    </li>
<!--The link below was changed from Communities to Social Media. Social Media has no landing page so  class="active" is not needed here-->
    <li><a href="#"><span>Social Media</span></a>
      <ul>
        <li><a href="https://twitter.com/hashtag/NASAsedac">&middot; Twitter</a></li>
        <li><a href="https://www.facebook.com/socioeconomicdataandappsctr?ref=ts&fref=ts">&middot; FaceBook</a></li>
        <li><a href="https://www.youtube.com/channel/UCjUjAvV7M04SxxpM5wq4fMw?view_as=public">&middot; YouTube</a></li>
        <li><a href="https://www.flickr.com/photos/54545503@N04">&middot; Flickr</a></li>
        <li><a href="/blogs">&middot; Blog Posts</a></li>  
        <li><a href="/communities">&middot; Communities</a></li>   
      </ul>
    </li>
    <li><a href="#"><span>About</span></a>
      <ul>
        <li><a href="/about">&middot; About SEDAC</a></li>
        <li><a href="/user-working-group">&middot; User Working Group</a></li>
        <li><a href="/privacy">&middot; Privacy</a></li>
        <li><a href="/user-registration">&middot; User Registration</a></li>
      </ul>
    </li>
    <li id="nav-help"><a href="/help"><span>Help</span></a></li>
  </ul>
</nav>
<div id="byline">&nbsp;</div></header>
      <section id="main-content">
          <header id="page-header">
  <h1>Data Sets<span class="item-count"> (17)</span></h1>
  <span id="share-widget">
  Follow Us: <a href="https://twitter.com/hashtag/NASAsedac" class="share-tw">Twitter</a>
  <a href="https://www.facebook.com/socioeconomicdataandappsctr?ref=ts&amp;fref=ts" class="share-fb">Follow Us on Facebook</a> 
  <a href="https://www.youtube.com/channel/UCjUjAvV7M04SxxpM5wq4fMw?view_as=public" class="share-yt">YouTube</a>
  <a href="https://www.flickr.com/photos/54545503@N04/" class="share-fl">Flickr</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Share:
  <a href="https://twitter.com/share?url=https%3A%2F%2Fsedac.ciesin.columbia.edu%2Fdata%2Fsets%2Fbrowse%3Ffacets%3Dtheme%3Agovernance&amp;text=Socioeconomic%20Data%20and%20Applications%20Center" class="share-tw">Twitter</a>
  <a href="https://www.facebook.com/sharer.php?u=https%3A%2F%2Fsedac.ciesin.columbia.edu%2Fdata%2Fsets%2Fbrowse%3Ffacets%3Dtheme%3Agovernance&amp;t=Socioeconomic%20Data%20and%20Applications%20Center" class="share-fb">Facebook</a>
</span></header><div id="page-layout" class="layout-2-col facets">
  <div id="page-col-1">
    <form id="faceted-search" action="/data/sets/browse" method="get">
  <input type="hidden" name="facets" value="theme:governance" />
      <dl class="facets">
    <!-- fielded searches -->
    <dt>Search</dt>
    <dd>
      <div id="search-fields">
        <div>
          <label for="search-contains">All Fields:</label>
          <input class="placeholder" data-placeholder="Search All Fields..." type="text" name="contains" class="search-contains" id="search-contains" value="" />
        </div>
        <div class="">
            <label for="search-title">Title:</label>
            <input class="placeholder" data-placeholder="Search Title..." type="text" name="title" class="search-title" id="search-title" value="" />
          </div>
          <div class="">
            <label for="search-author">Author:</label>
            <input class="placeholder" data-placeholder="Search Author..." type="text" name="author" id="search-author" value="" />
          </div>
          <div class="">
            <label for="search-abstract">Abstract:</label>
            <input class="placeholder" data-placeholder="Search Abstract..." type="text" name="abstract" id="search-abstract" value="" />
          </div>
        </div>
      <div id="submit-more-container">
      <button type="submit">search</button>
      </div>
    </dd>
    <dt>Year Published</dt>
        <!-- displayed as drop-downs -->
            <select name="facets" class="js-submit submit-loading"><option value="" > Select a Year...</option>
              <option value="data-date-published-year:1997">1997&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2000">2000&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2001">2001&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2002">2002&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-published-year:2005">2005&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2006">2006&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-published-year:2007">2007&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2008">2008&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2010">2010&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2012">2012&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-published-year:2014">2014&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2016">2016&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-published-year:2018">2018&nbsp;<span class="item-count">(2)</span></option>
              </select>
            <button class="accessible-hide" type="submit">go</button>
          <dt>Year of Data</dt>
        <!-- displayed as drop-downs -->
            <select name="facets" class="js-submit submit-loading"><option value="" > Select a Year...</option>
              <option value="data-date-year:1940">1940&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1941">1941&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1942">1942&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1943">1943&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1944">1944&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1945">1945&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1946">1946&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1947">1947&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1948">1948&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1949">1949&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:1950">1950&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1951">1951&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1952">1952&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1953">1953&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1954">1954&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1955">1955&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1956">1956&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1957">1957&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1958">1958&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1959">1959&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1960">1960&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1961">1961&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1962">1962&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1963">1963&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1964">1964&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1965">1965&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1966">1966&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1967">1967&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1968">1968&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1969">1969&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1970">1970&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1971">1971&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1972">1972&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:1973">1973&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:1974">1974&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:1975">1975&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:1976">1976&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:1977">1977&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:1978">1978&nbsp;<span class="item-count">(6)</span></option>
              <option value="data-date-year:1979">1979&nbsp;<span class="item-count">(6)</span></option>
              <option value="data-date-year:1980">1980&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1981">1981&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1982">1982&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1983">1983&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1984">1984&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1985">1985&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1986">1986&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1987">1987&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1988">1988&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1989">1989&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1990">1990&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1991">1991&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1992">1992&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:1993">1993&nbsp;<span class="item-count">(10)</span></option>
              <option value="data-date-year:1994">1994&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:1995">1995&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:1996">1996&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:1997">1997&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:1998">1998&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:1999">1999&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:2000">2000&nbsp;<span class="item-count">(12)</span></option>
              <option value="data-date-year:2001">2001&nbsp;<span class="item-count">(8)</span></option>
              <option value="data-date-year:2002">2002&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:2003">2003&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:2004">2004&nbsp;<span class="item-count">(9)</span></option>
              <option value="data-date-year:2005">2005&nbsp;<span class="item-count">(10)</span></option>
              <option value="data-date-year:2006">2006&nbsp;<span class="item-count">(8)</span></option>
              <option value="data-date-year:2007">2007&nbsp;<span class="item-count">(7)</span></option>
              <option value="data-date-year:2008">2008&nbsp;<span class="item-count">(7)</span></option>
              <option value="data-date-year:2009">2009&nbsp;<span class="item-count">(7)</span></option>
              <option value="data-date-year:2010">2010&nbsp;<span class="item-count">(6)</span></option>
              <option value="data-date-year:2011">2011&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:2012">2012&nbsp;<span class="item-count">(5)</span></option>
              <option value="data-date-year:2013">2013&nbsp;<span class="item-count">(4)</span></option>
              <option value="data-date-year:2014">2014&nbsp;<span class="item-count">(3)</span></option>
              <option value="data-date-year:2015">2015&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:2016">2016&nbsp;<span class="item-count">(2)</span></option>
              <option value="data-date-year:2017">2017&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-year:2018">2018&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-year:2050">2050&nbsp;<span class="item-count">(1)</span></option>
              <option value="data-date-year:2100">2100&nbsp;<span class="item-count">(1)</span></option>
              </select>
            <button class="accessible-hide" type="submit">go</button>
          <dt>Format</dt>
        <!-- displayed as links -->
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:document">document</a> <span class="item-count">(14)</span></dd>
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:map">map</a> <span class="item-count">(9)</span></dd>
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:map service">map service</a> <span class="item-count">(6)</span></dd>
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:raster">raster</a> <span class="item-count">(1)</span></dd>
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:tabular">tabular</a> <span class="item-count">(12)</span></dd>
            <dd><a class="submit-loading" href="/data/sets/browse?facets=theme:governance&amp;facets=data-type:vector">vector</a> <span class="item-count">(1)</span></dd>
            </dl>
</form></div>
  <div id="page-col-2">
    <div class="facets-selected">

      <a class="submit-loading" href="/data/sets/browse">Data Sets</a>
      
        &raquo; <span class="facet-remove">Theme: Governance<a class="action-remove submit-loading" title="Remove Facet" href="/data/sets/browse">Remove Facet</a></span>
      <!-- REPLACE THIS WITH THE VALUES COMING IN FOR ADVANCED SEARCH -->
        </div>
  <table class="search-sort-pagination" id="search-sort-pagination-top">
    <tr>
      <td class="pagination-container">
        1 of 1<div>
          <span class="page-prev disabled">Prev</span>
          |
          <span class="page-next disabled">Next</span></div>
      </td>
      <td class="sort-container">
        <form action="/data/sets/browse" method="get">
                <input type="hidden" name="facets" value="theme:governance" /><label for="sort-top">Sort By:</label>
                <select name="sort" id="sort-top" class="js-submit submit-loading">
                  <option value="theme-rank-governance:asc" >Theme Relevance</option>
                  <option value="data-date-published-year:asc" >Earliest Published</option>
                  <option value="data-date-published-year:desc" selected="selected">Latest Published</option>
                  <option value="data-date-year:asc" >Earliest Data</option>
                  <option value="data-date-year:desc" >Latest Data</option>
                  <option value="dataset-title:asc" >Dataset A&ndash;Z</option>
                  <option value="dataset-title:desc" >Dataset Z&ndash;A</option>
                  <option value="collection-title:asc" >Collection A&ndash;Z</option>
                  <option value="collection-title:desc" >Collection Z&ndash;A</option>
                </select>
                <button type="submit" class="accessible-hide">sort</button>
              </form>
            </td>
    </tr>
  </table><table id="data-sets-grid" class="results-grid results-data">
      <tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-2018">Environmental Performance Index, 2018 Release (<span><nobr>1950&#8202;&ndash;&#8202;2018</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-2018">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2018/data-download">Download</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2018/docs">Documents</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2018/maps">Maps</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2018/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-environmental-performance-index-2018/maps"><img src="/downloads/maps/epi/epi-environmental-performance-index-2018/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/wacvm-point-gridded-fatalities-2008-2013">Point and Gridded Locations of Fatalities, v1 (<span><nobr>2008&#8202;&ndash;&#8202;2013</nobr></span>)</a></h1>
  <h2>West Africa Coastal Vulnerability Mapping</h2>
  <ul class="dataset-links">
    <li><a href="/data/set/wacvm-point-gridded-fatalities-2008-2013">Overview</a></li>
    <li><a href="/data/set/wacvm-point-gridded-fatalities-2008-2013/data-download">Download</a></li>
    <li><a href="/data/set/wacvm-point-gridded-fatalities-2008-2013/docs">Documents</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To measure human security and sensitivity of populations to climate stressors in the coastal zone of West Africa.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-2016">Environmental Performance Index, 2016 Release (<span><nobr>1950&#8202;&ndash;&#8202;2016</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-2016">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2016/data-download">Download</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2016/docs">Documents</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2016/maps">Maps</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2016/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-environmental-performance-index-2016/maps"><img src="/downloads/maps/epi/epi-environmental-performance-index-2016/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-2014">Environmental Performance Index, 2014 Release (<span><nobr>2002&#8202;&ndash;&#8202;2014</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-2014">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2014/data-download">Download</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2014/docs">Documents</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2014/maps">Maps</a></li>
    <li><span class="item-count">(13)</span> <a href="/data/set/epi-environmental-performance-index-2014/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-environmental-performance-index-2014/maps"><img src="/downloads/maps/epi/epi-environmental-performance-index-2014/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/entri-treaty-status-2012">Environmental Treaty Status Data Set, 2012 Release (<span><nobr>1940&#8202;&ndash;&#8202;2012</nobr></span>)</a></h1>
  <h2>Environmental Treaties and Resource Indicators <span>(<abbr title="Environmental Treaties and Resource Indicators">ENTRI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/entri-treaty-status-2012">Overview</a></li>
    <li><a href="/data/set/entri-treaty-status-2012/data-download">Download</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To provide information on the status of country participation in international environmental agreements.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-pilot-trend-2012">Environmental Performance Index and Pilot Trend Environmental Performance Index, 2012 Release (<span><nobr>2000&#8202;&ndash;&#8202;2010</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-pilot-trend-2012">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-pilot-trend-2012/data-download">Download</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-pilot-trend-2012/docs">Documents</a></li>
    <li><span class="item-count">(6)</span> <a href="/data/set/epi-environmental-performance-index-pilot-trend-2012/maps">Maps</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-environmental-performance-index-pilot-trend-2012/maps"><img src="/downloads/maps/epi/epi-environmental-performance-index-pilot-trend-2012/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-2010">Environmental Performance Index, 2010 Release (<span><nobr>1994&#8202;&ndash;&#8202;2009</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-2010">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2010/data-download">Download</a></li>
    <li><span class="item-count">(11)</span> <a href="/data/set/epi-environmental-performance-index-2010/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-environmental-performance-index-2008">Environmental Performance Index, 2008 Release (<span><nobr>1994&#8202;&ndash;&#8202;2007</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-environmental-performance-index-2008">Overview</a></li>
    <li><a href="/data/set/epi-environmental-performance-index-2008/data-download">Download</a></li>
    <li><span class="item-count">(14)</span> <a href="/data/set/epi-environmental-performance-index-2008/maps">Maps</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-environmental-performance-index-2008/maps"><img src="/downloads/maps/epi/epi-environmental-performance-index-2008/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/cesic-complete-collection-v1-1">Complete Collection, v1.01 (<span><nobr>1973&#8202;&ndash;&#8202;2005</nobr></span>)</a></h1>
  <h2>Compendium of Environmental Sustainability Indicators</h2>
  <ul class="dataset-links">
    <li><a href="/data/set/cesic-complete-collection-v1-1">Overview</a></li>
    <li><a href="/data/set/cesic-complete-collection-v1-1/data-download">Download</a></li>
    <li><a href="/data/set/cesic-complete-collection-v1-1/docs">Documents</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To make the acquisition, comparison and analysis of sustainability indicators easier by compiling them in a single database, incorporating multiple country codes, and condensing the indicator descriptions into short methodological summaries in an accompanying data dictionary.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/epi-pilot-environmental-performance-index-2006">Pilot Environmental Performance Index, 2006 Release (<span><nobr>1994&#8202;&ndash;&#8202;2006</nobr></span>)</a></h1>
  <h2>Environmental Performance Index <span>(<abbr title="Environmental Performance Index">EPI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/epi-pilot-environmental-performance-index-2006">Overview</a></li>
    <li><a href="/data/set/epi-pilot-environmental-performance-index-2006/data-download">Download</a></li>
    <li><span class="item-count">(16)</span> <a href="/data/set/epi-pilot-environmental-performance-index-2006/maps">Maps</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/epi-pilot-environmental-performance-index-2006/maps"><img src="/downloads/maps/epi/epi-pilot-environmental-performance-index-2006/set-thumbnail-small.jpg" /></a>
    <p>To provide quantitative metrics for evaluating a country&#039;s environmental performance in different policy categories relative to clearly defined targets.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100">Synthetic Assessment of Global Distribution of Vulnerability to Climate Change, v1 (<span>2005, 2050, 2100</span>)</a></h1>
  <h2>Intergovernmental Panel on Climate Change</h2>
  <ul class="dataset-links">
    <li><a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100">Overview</a></li>
    <li><a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100/data-download">Download</a></li>
    <li><span class="item-count">(46)</span> <a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100/maps">Maps</a></li>
    <li><span class="item-count">(1)</span> <a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/ipcc-synthetic-vulnerability-climate-2005-2050-2100/maps"><img src="/downloads/maps/ipcc/ipcc-synthetic-vulnerability-climate-2005-2050-2100/set-thumbnail-small.jpg" /></a>
    <p>To provide geographical portraits of vulnerability designed to incorporate both exposure to climate change and national capacities to adapt.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/esi-environmental-sustainability-index-2005">Environmental Sustainability Index, 2005 Release (<span><nobr>1980&#8202;&ndash;&#8202;2000</nobr></span>)</a></h1>
  <h2>Environmental Sustainability Index <span>(<abbr title="Environmental Sustainability Index">ESI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/esi-environmental-sustainability-index-2005">Overview</a></li>
    <li><a href="/data/set/esi-environmental-sustainability-index-2005/data-download">Download</a></li>
    <li><span class="item-count">(1)</span> <a href="/data/set/esi-environmental-sustainability-index-2005/maps">Maps</a></li>
    <li><span class="item-count">(22)</span> <a href="/data/set/esi-environmental-sustainability-index-2005/maps/services">WMS</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/esi-environmental-sustainability-index-2005/maps"><img src="/downloads/maps/esi/esi-environmental-sustainability-index-2005/set-thumbnail-small.jpg" /></a>
    <p>To create a comparative index of national-level environmental sustainability and to provide a mechanism for making environmental management more quantitative, empirically grounded and systematic.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/entri-treaty-texts-collection">Treaty Texts, v1 (<span><nobr>1940&#8202;&ndash;&#8202;2000</nobr></span>)</a></h1>
  <h2>Environmental Treaties and Resource Indicators <span>(<abbr title="Environmental Treaties and Resource Indicators">ENTRI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/entri-treaty-texts-collection">Overview</a></li>
    <li><a href="/data/set/entri-treaty-texts-collection/data-download">Download</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To provide search and retrieval of texts of multilateral environmental agreements (MEAs)</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/esi-environmental-sustainability-index-2002">Environmental Sustainability Index, 2002 Release (<span><nobr>1980&#8202;&ndash;&#8202;2000</nobr></span>)</a></h1>
  <h2>Environmental Sustainability Index <span>(<abbr title="Environmental Sustainability Index">ESI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/esi-environmental-sustainability-index-2002">Overview</a></li>
    <li><a href="/data/set/esi-environmental-sustainability-index-2002/data-download">Download</a></li>
    <li><span class="item-count">(1)</span> <a href="/data/set/esi-environmental-sustainability-index-2002/maps">Maps</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <a href="/data/set/esi-environmental-sustainability-index-2002/maps"><img src="/downloads/maps/esi/esi-environmental-sustainability-index-2002/set-thumbnail-small.jpg" /></a>
    <p>To provide a comparative index of national-level environmental sustainability covering a number of sustainability dimensions.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/esi-environmental-sustainability-index-2001">Environmental Sustainability Index, 2001 Release (<span><nobr>1980&#8202;&ndash;&#8202;2000</nobr></span>)</a></h1>
  <h2>Environmental Sustainability Index <span>(<abbr title="Environmental Sustainability Index">ESI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/esi-environmental-sustainability-index-2001">Overview</a></li>
    <li><a href="/data/set/esi-environmental-sustainability-index-2001/data-download">Download</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To provide  a comparative index of national-level environmental sustainability based on lessons learned from the year 2000 pilot effort.</p>
  </div>
</div></td>
        <td class="gutter"></td><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/esi-pilot-environmental-sustainability-index-2000">Pilot Environmental Sustainability Index, 2000 Release (<span><nobr>1978&#8202;&ndash;&#8202;1999</nobr></span>)</a></h1>
  <h2>Environmental Sustainability Index <span>(<abbr title="Environmental Sustainability Index">ESI</abbr>)</span></h2>
  <ul class="dataset-links">
    <li><a href="/data/set/esi-pilot-environmental-sustainability-index-2000">Overview</a></li>
    <li><a href="/data/set/esi-pilot-environmental-sustainability-index-2000/data-download">Download</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To test the feasibility of creating a comparative index of national-level environmental sustainability.</p>
  </div>
</div></td>
        </tr><tr><td>
          <div class="html5-section set-result">
  <h1><a href="/data/set/cddc-china-priority-program-of-agenda-21">Priority Programme for China's Agenda 21, v1 (<span>1993</span>)</a></h1>
  <h2>China Dimensions</h2>
  <ul class="dataset-links">
    <li><a href="/data/set/cddc-china-priority-program-of-agenda-21">Overview</a></li>
    <li><a href="/data/set/cddc-china-priority-program-of-agenda-21/data-download">Download</a></li>
    </ul>
  <div class="dataset-img-purpose">
    <p>To provide information on the medium and long term plans for China&#039;s national economic and social development.</p>
  </div>
</div></td>
        <td class="gutter"></td></table>
    <div class="facets-selected">

      <a class="submit-loading" href="/data/sets/browse">Data Sets</a>
      
        &raquo; <span class="facet-remove">Theme: Governance<a class="action-remove submit-loading" title="Remove Facet" href="/data/sets/browse">Remove Facet</a></span>
      <!-- REPLACE THIS WITH THE VALUES COMING IN FOR ADVANCED SEARCH -->
        </div>
  <table class="search-sort-pagination" id="search-sort-pagination-bottom">
    <tr>
      <td class="pagination-container">
        1 of 1<div>
          <span class="page-prev disabled">Prev</span>
          |
          <span class="page-next disabled">Next</span></div>
      </td>
      <td class="sort-container">
        <form action="/data/sets/browse" method="get">
                <input type="hidden" name="facets" value="theme:governance" /><label for="sort-bottom">Sort By:</label>
                <select name="sort" id="sort-bottom" class="js-submit submit-loading">
                  <option value="theme-rank-governance:asc" >Theme Relevance</option>
                  <option value="data-date-published-year:asc" >Earliest Published</option>
                  <option value="data-date-published-year:desc" selected="selected">Latest Published</option>
                  <option value="data-date-year:asc" >Earliest Data</option>
                  <option value="data-date-year:desc" >Latest Data</option>
                  <option value="dataset-title:asc" >Dataset A&ndash;Z</option>
                  <option value="dataset-title:desc" >Dataset Z&ndash;A</option>
                  <option value="collection-title:asc" >Collection A&ndash;Z</option>
                  <option value="collection-title:desc" >Collection Z&ndash;A</option>
                </select>
                <button type="submit" class="accessible-hide">sort</button>
              </form>
            </td>
    </tr>
  </table></div>
</div></section>
      <div class="push"></div>
      </div>
      <footer id="footer-wrapper">
          <div id="footer">
    <div class="warn-box">
      <a href="http://www.ciesin.columbia.edu/"><img src="/imgs/logo-ciesin.png" border="0" style="max-width:100%;"/></a>
        </div>
    <div id="footer-nav">
      <p><a href="/">Home</a> | <a href="/data/sets/browse">Data</a> | <a href="/featured-uses">Data Uses</a> | <a href="/citations">Data Citations</a> | <a href="/maps/gallery/search">Maps</a> | <a href="/maps/services">Map Services</a></p> 
      <p><a href="/news/browse">News</a> | <a href="/tools">Tools</a> | <a href="/guides">Guides</a> | <a href="/publications">Publications</a> | <a href="/blogs">Blog Posts</a></p>
      <p><a href="/about">About</a> | <a href="/help">Help</a> | <a href="/privacy">Privacy</a> | <a href="/user-registration">User Registration</a></p> 
      <p><span>Copyright &copy; 1997&ndash;2019. The Trustees of Columbia University in the City of New York.</span></p>
    </div>
    <div id="icsu"><a href="http://www.icsu-wds.org/"><img src="/imgs/icsu-wds-logo.png" border="0" alt="WDS ICSU" title="WDS ICSU"/></a></div>
  <div style="clear:both;"></div>

  </div>
</footer>
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

    <script type="text/javascript" src="/wro/global.js?cache_bust=1557140064942"></script>
	<script src="/gInc/scripts/ciesin.utils.js" type="text/javascript"></script>
    <script src="/urs/check-login.js" type="text/javascript"></script>
  </body>
</html>
`)


const list = $('.html5-section.set-result')
_.map(list, item => {
    $(item).find('h1').text()
    const url = 'https://sedac.ciesin.columbia.edu' + $(item).find('h1 a').attr('href')
    console.log(url)
})
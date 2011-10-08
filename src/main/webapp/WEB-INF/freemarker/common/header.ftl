
<#macro header title page>
		<title><@spring.message code="${title}"/></title>
		<meta charset="utf-8"/>
		<meta name="description" content="<@spring.message code="page.description"/>"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<link rel="shortcut icon" href="/favicon.ico"/>

	<#if settings??>

		<#if settings.useLocalLibraries>

		<script src="/js/libs/modernizr-2.0.6/modernizr.js"></script>
		<script src="/js/libs/prototype-1.7.0.0/prototype.js"></script>
		<script src="/js/libs/scriptaculous-1.9/scriptaculous.js"></script>
		<script src="/js/libs/swfobject-2.2/swfobject.js"></script>

		<#else>

		<script src="http://www.modernizr.com/downloads/modernizr-latest.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>

		</#if>

		<!--[if IE]>
			<script src="/js/libs/base64-1.0/base64.js"></script>
		<![endif]-->

		<script src="/js/libs/crypto-1.0/crypto.js"></script>

		<#if settings.generateSources>

		<#-- Magic rel type triggers LESS compiler -->
		<link rel="stylesheet/less" type="text/css" href="/css/static/${page}.less"/>
		<link rel="stylesheet/less" type="text/css" href="/css/generated/${page}.less"/>

		<#-- Include LESS css compiler -->
		<script src="/js/libs/less-1.1.3/less.js"></script>

		<#-- /js/generated gets intercepted by a servlet-->
		<script src="/js/generated/${page}.js"></script>

		<#else>

		<#-- Serve minified versions of css and scripts -->
		<link rel="stylesheet" type="text/css" href="/css/${page}.min.css"/>
		<script src="/js/${page}.min.js"></script>

		</#if>
	</#if>
</#macro>

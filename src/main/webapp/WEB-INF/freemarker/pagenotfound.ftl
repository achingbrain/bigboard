<#import "spring.ftl" as spring />
<!DOCTYPE html>
<html>
	<head>
		<#include "common/header.ftl">
		<@header title="pagenotfound.title" page="PageNotFound" />
	</head>
	<body class="PageNotFound <#if settings?? && settings.debugMode>debug</#if>" onload="init('bigboard.page.PageNotFound')">
		<h1>BigBoard 404 page</h1>
		<p>You appear to be lost.</p>
		<#include "common/footer.ftl">
	</body>
</html>

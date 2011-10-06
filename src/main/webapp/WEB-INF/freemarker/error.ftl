<#import "spring.ftl" as spring />
<!DOCTYPE html>
<html>
	<head>
		<#include "common/header.ftl">
		<@header title="error.title" page="Error" />
	</head>
	<body class="Error <#if settings.debugMode>debug</#if>" onload="init('bigboard.page.Error')">
		<h1>BigBoard error page!</h1>
		<#include "common/footer.ftl">
	</body>
</html>
